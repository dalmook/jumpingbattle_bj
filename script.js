const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzzu9QneZHjuSa7Wx8ZOpkxrfVq-cyocuA90F7y1RoNqgyiFozJ2Ud9A6qvJ8s1dnbv0A/exec';

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
      if (result.success) {
        alert('예약이 완료되었습니다!');
        resDiv.textContent = '예약이 완료되었습니다!';
        e.target.reset();
      } else {
        alert('예약 실패: ' + result.message);
        resDiv.textContent = `실패: ${result.message}`;
      }
    } catch(err) {
      console.error(err);
      alert('오류 발생: ' + err.message);
      resDiv.textContent = '오류 발생. 다시 시도해 주세요.';
    }
  });
});
