// 배포한 Google Apps Script 웹앱 URL을 붙여넣으세요
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVaoCPN1nKx65iN2F2Nx5FDS28OtMPD4fgC25FAaVSVVz0fyqQscOUWOGyu07gbXYGxg/exec';

document.addEventListener('DOMContentLoaded', () => {
  // 12:00 ~ 22:00, 20분 단위
  const timeSelect = document.getElementById('timeSlot');
  const startMin = 12 * 60;
  const endMin = 22 * 60;
  for (let m = startMin; m <= endMin; m += 20) {
    const h = String(Math.floor(m / 60)).padStart(2, '0');
    const min = String(m % 60).padStart(2, '0');
    timeSelect.innerHTML += `<option value="${h}:${min}">${h}:${min}</option>`;
  }

  const form = document.getElementById('reservationForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      teamName: form.teamName.value,
      difficulty: form.difficulty.value,
      timeSlot: form.timeSlot.value,
      peopleCount: form.peopleCount.value,
      room: form.room.value
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
        alert('예약이 완료되었습니다!');
        resDiv.textContent = '예약이 완료되었습니다!';
        form.reset();
      } else {
        alert('예약 실패: ' + result.message);
        resDiv.textContent = `실패: ${result.message}`;
      }
    } catch (err) {
      console.error(err);
      alert('오류 발생: ' + err.message);
      resDiv.textContent = '오류 발생. 다시 시도해 주세요.';
    }
  });
});
