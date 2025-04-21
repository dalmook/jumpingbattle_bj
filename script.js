const SCRIPT_URL = 'https://script.google.com/macros/s/WEB_APP_ID/exec';

document.addEventListener('DOMContentLoaded', () => {
  const timeSelect = document.getElementById('timeSlot');
  // 12:00 ~ 22:00, 20분 단위 옵션 생성
  const start = 12 * 60;
  const end = 22 * 60;
  for (let t = start; t <= end; t += 20) {
    const h = String(Math.floor(t / 60)).padStart(2, '0');
    const m = String(t % 60).padStart(2, '0');
    const opt = document.createElement('option');
    opt.value = `${h}:${m}`;
    opt.textContent = `${h}:${m}`;
    timeSelect.appendChild(opt);
  }

  const form = document.getElementById('reservationForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      teamName: document.getElementById('teamName').value,
      difficulty: document.getElementById('difficulty').value,
      timeSlot: document.getElementById('timeSlot').value,
      peopleCount: document.getElementById('peopleCount').value,
      room: document.getElementById('room').value
    };

    const resDiv = document.getElementById('result');
    resDiv.textContent = '전송 중...';

    try {
      const resp = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await resp.json();
      if (result.success) {
        resDiv.textContent = '예약이 완료되었습니다!';
        form.reset();
      } else {
        resDiv.textContent = `실패: ${result.message}`;
      }
    } catch (err) {
      console.error(err);
      resDiv.textContent = '오류 발생. 다시 시도해 주세요.';
    }
  });
});
