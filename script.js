const SCRIPT_URL = 'https://script.google.com/macros/s/WEB_APP_ID/exec';

document.addEventListener('DOMContentLoaded', () => {
  const timeSelect = document.getElementById('timeSlot');
  const start = 12 * 60, end = 22 * 60;
  for (let t = start; t <= end; t += 20) {
    const h = String(Math.floor(t/60)).padStart(2,'0');
    const m = String(t%60).padStart(2,'0');
    timeSelect.innerHTML += `<option value="${h}:${m}">${h}:${m}</option>`;
  }
  document.getElementById('reservationForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      teamName: e.target.teamName.value,
      difficulty: e.target.difficulty.value,
      timeSlot: e.target.timeSlot.value,
      peopleCount: e.target.peopleCount.value,
      room: e.target.room.value
    };
    const resDiv = document.getElementById('result');
    resDiv.textContent = '전송 중...';
    try {
      const resp = await fetch(SCRIPT_URL, { method:'POST', mode:'cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
      const result = await resp.json();
      resDiv.textContent = result.success ? '예약이 완료되었습니다!' : `실패: ${result.message}`;
      if(result.success) e.target.reset();
    } catch(err) {
      console.error(err);
      resDiv.textContent = '오류 발생. 다시 시도해 주세요.';
    }
  });
});
