// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby99lG2QuNiJF5vhO3r5mdn6Nzhsn8pDggGOkoKclLSqCFBdT1q-2mFIAHIRGAPN40vLw/exec';

// 기존 예약 목록 가져오기 (중복 확인용, doGet 구현 필요)
async function fetchExistingBookings(slotStr) {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=list&time=${slotStr}`, { method: 'GET', mode: 'cors' });
    if (!res.ok) throw new Error(`GET 오류: ${res.status}`);
    const data = await res.json();
    return data.bookings || [];
  } catch (err) {
    console.error('예약 조회 오류:', err);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const walkInInput = document.getElementById('walkInTime');
  const roomInput = document.getElementById('roomSize');
  const difficultyInput = document.getElementById('difficulty');
  const roomButtons = document.querySelectorAll('.room-buttons button');
  const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  // 방 크기 선택 (단일)
  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roomButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      roomInput.value = btn.dataset.value;
    });
  });

  // 난이도 선택 (단일)
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      difficultyInput.value = btn.dataset.value;
    });
  });

  // 방 가용성 업데이트 : 중복 예약 비활성화
  async function updateRoomAvailability(slotStr) {
    if (!slotStr) return;
    const bookings = await fetchExistingBookings(slotStr);
    roomButtons.forEach(btn => {
      const disabled = bookings.some(b => b.walkInTime === slotStr && b.roomSize === btn.dataset.value);
      btn.disabled = disabled;
      btn.classList.toggle('disabled', disabled);
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // 게임 슬롯 계산
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const slots = [0, 20, 40];
    let chosen = slots.find(s => m <= s + 3);
    if (chosen === undefined) { h = (h + 1) % 24; chosen = 0; }
    const slotStr = String(h).padStart(2, '0') + ':' + String(chosen).padStart(2, '0');
    walkInInput.value = slotStr;

    // 방 가용성 비활성화 및 중복 체크
    await updateRoomAvailability(slotStr);
    if (!roomInput.value) { alert('방 크기를 선택해주세요.'); return; }
    if (document.querySelector('.room-buttons button.selected.disabled')) {
      alert('이미 예약된 방입니다. 다른 방을 선택해주세요.');
      return;
    }

    // 입력 검증
    if (!difficultyInput.value) { alert('난이도를 선택해주세요.'); return; }
    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    const total = adult + youth;
    if (total <= 0) { alert('인원 수를 입력해주세요.'); return; }
    if (!confirm('입력한 정보가 맞습니까?')) return;

    resultDiv.textContent = '전송 중...';

    const payload = {
      walkInTime: slotStr,
      roomSize: roomInput.value,
      teamName: form.teamName.value.trim(),
      difficulty: difficultyInput.value,
      totalCount: total,
      youthCount: youth,
      vehicle: form.vehicle.value.trim() || ''
    };

    console.log('Payload:', payload);
    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });

    alert('예약 요청이 전송되었습니다!');
    resultDiv.textContent = '예약 요청이 전송되었습니다!';
    form.reset();
    roomButtons.forEach(b => b.classList.remove('selected', 'disabled'));
    difficultyButtons.forEach(b => b.classList.remove('selected'));
  });

  // 입력 필드 focus 시 방 상태 갱신
  ['adultCount', 'youthCount'].forEach(id =>
    document.getElementById(id).addEventListener('focus', () => updateRoomAvailability(walkInInput.value))
  );
});
