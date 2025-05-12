const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwHpobe7OUfcvQwzd6z1O1iWzllPaxXTza1OU80WzN0K8otvrwVKZ-_i5sXc6U3tDf0_w/exec';

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
