// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby99lG2QuNiJF5vhO3r5mdn6Nzhsn8pDggGOkoKclLSqCFBdT1q-2mFIAHIRGAPN40vLw/exec';

async function fetchExistingBookings(walkInTime) {
  // GET existing bookings to check duplicates (assumes doGet implemented)
  try {
    const res = await fetch(`${SCRIPT_URL}?action=list`, { method: 'GET', mode: 'cors' });
    if (!res.ok) throw new Error(`GET 오류: ${res.status}`);
    const data = await res.json();
    return data.bookings || [];
  } catch (err) {
    console.error('예약 조회 오류:', err);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const walkInInput = document.getElementById('walkInTime');
  const roomInput = document.getElementById('roomSize');
  const difficultyInput = document.getElementById('difficulty');

  const roomButtons = document.querySelectorAll('.room-buttons button');
  const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');

  // 난이도 선택 (단일)
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      difficultyInput.value = btn.dataset.value;
    });
  });

  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // 워크인 시간 계산
    const now = new Date(); let h = now.getHours(); const m = now.getMinutes();
    const slots = [0,20,40]; let chosen;
    for (let s of slots) if (m <= s+3) { chosen = s; break; }
    if (chosen === undefined) { h = (h+1)%24; chosen = 0; }
    const slotStr = `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;
    walkInInput.value = slotStr;

    // 중복 검사: 같은 시간/방
    const bookings = await fetchExistingBookings(slotStr);
    const selectedRoom = roomInput.value;
    if (bookings.some(b => b.walkInTime === slotStr && b.roomSize === selectedRoom)) {
      alert('해당 시간에 이미 예약된 방입니다. 다른 방을 선택해주세요.');
      return;
    }

    // 필수 체크
    if (!roomInput.value) { alert('방 크기를 선택해주세요.'); return; }
    if (!difficultyInput.value) { alert('난이도를 선택해주세요.'); return; }
    if (!confirm('입력한 정보가 맞습니까?')) return;

    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    const total = adult + youth;
    if (total <= 0) { alert('인원 수를 입력해주세요.'); return; }

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
    difficultyButtons.forEach(b=>b.classList.remove('selected'));
    roomButtons.forEach(b=>b.classList.remove('selected'));
  });

  // 방 버튼 활성화: 현재 슬롯 기준 중복된 방 비활성화
  function updateRoomAvailability() {
    const slot = walkInInput.value;
    fetchExistingBookings(slot).then(bookings => {
      roomButtons.forEach(btn => {
        const code = btn.dataset.value;
        if (bookings.some(b => b.walkInTime === slot && b.roomSize === code)) {
          btn.disabled = true;
          btn.classList.add('disabled');
        } else {
          btn.disabled = false;
          btn.classList.remove('disabled');
        }
      });
    });
  }

  // 슬롯 결정 시마다 버튼 상태 갱신
  form.addEventListener('focusin', () => updateRoomAvailability());
});
```javascript
// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/WEB_APP_ID/exec';

document.addEventListener('DOMContentLoaded', () => {
  const walkInInput = document.getElementById('walkInTime');
  const roomInput = document.getElementById('roomSize');
  const difficultyInput = document.getElementById('difficulty');

  const roomButtons = document.querySelectorAll('.room-buttons button');
  const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');

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

  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async e => {
    console.log('Form submit start', {
      teamName: form.teamName.value,
      adult: form.adultCount.value,
      youth: form.youthCount.value,
      room: roomInput.value,
      difficulty: difficultyInput.value,
      vehicle: form.vehicle.value
    });

    e.preventDefault();
    if (!roomInput.value) { alert('방 크기를 선택해주세요.'); return; }
    if (!difficultyInput.value) { alert('난이도를 선택해주세요.'); return; }
    if (!confirm('입력한 정보가 맞습니까?')) return;

    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    const total = adult + youth;
    if (total <= 0) { alert('인원 수를 입력해주세요.'); return; }

    // 워크인 시간 계산
    const now = new Date(); let h = now.getHours(); const m = now.getMinutes();
    const slots = [0,20,40]; let chosen;
    for (let s of slots) if (m <= s+3) { chosen = s; break; }
    if (chosen === undefined) { h = (h+1)%24; chosen = 0; }
    walkInInput.value = `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;

    resultDiv.textContent = '전송 중...';

    const payload = {
      walkInTime: walkInInput.value,
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
    roomButtons.forEach(b=>b.classList.remove('selected'));
    difficultyButtons.forEach(b=>b.classList.remove('selected'));
  });
});
