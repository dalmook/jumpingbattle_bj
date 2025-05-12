// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxsxPLjQ-bCKE2PbBPBRBcm4kfR8ZB7nIa5zKG_GcPanPAiueGhKg2-3P6JZ9Y58cJuRQ/exec';

document.addEventListener('DOMContentLoaded', () => {
  const walkInInput = document.getElementById('walkInTime');
  const roomInput = document.getElementById('roomSize');
  const difficultyInput = document.getElementById('difficulty');
  const roomButtons = document.querySelectorAll('.room-buttons button');
  const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  // 방 크기 단일 선택
  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roomButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      roomInput.value = btn.dataset.value;
    });
  });

  // 난이도 단일 선택
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      difficultyInput.value = btn.dataset.value;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 최종 확인 팝업
    if (!confirm('입력한 정보가 맞습니까?')) return;

    // 필수 입력 확인
    if (!roomInput.value) { alert('방 크기를 선택해주세요.'); return; }
    if (!difficultyInput.value) { alert('난이도를 선택해주세요.'); return; }
    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    const total = adult + youth;
    if (total <= 0) { alert('인원 수를 입력해주세요.'); return; }

    // 슬롯 계산 (00,20,40 기준, 3분 초과 시 다음 슬롯)
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const slots = [0, 20, 40];
    let chosen = slots.find(s => m <= s + 3);
    if (chosen === undefined) { h = (h + 1) % 24; chosen = 0; }
    const slotStr = `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;
    walkInInput.value = slotStr;

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
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    alert('예약 요청이 전송되었습니다!');
    resultDiv.textContent = '예약 요청이 전송되었습니다!';
    form.reset();
    roomButtons.forEach(b => b.classList.remove('selected'));
    difficultyButtons.forEach(b => b.classList.remove('selected'));
  });
});
