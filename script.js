// 배포한 Google Apps Script 웹앱 URL을 붙여넣으세요
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdHsMS_nf_-Mxo30cvWTrzhoCQfhBnkv0XXPUgJfZSB1it19g2qQSOQtOHqGkuMNFyFw/exec';

document.addEventListener('DOMContentLoaded', () => {
  const timeSelect = document.getElementById('timeSlot');
  // 12:00 ~ 22:00 까지 20분 단위
  const startMin = 12 * 60;  // 720
  const endMin = 22 * 60;    // 1320
  for (let m = startMin; m <= endMin; m += 20) {
    const h = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    const option = document.createElement('option');
    option.value = `${h}:${mm}`;
    option.textContent = `${h}:${mm}`;
    timeSelect.appendChild(option);
  }

  const form = document.getElementById('reservationForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      teamName: form.teamName.value.trim(),
      difficulty: form.difficulty.value,
      timeSlot: form.timeSlot.value,
      peopleCount: form.peopleCount.value,
      room: form.room.value
    };
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '전송 중...';

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        alert('예약이 완료되었습니다!');
        resultDiv.textContent = '예약이 완료되었습니다!';
        form.reset();
      } else {
        alert('예약 실패: ' + result.message);
        resultDiv.textContent = `실패: ${result.message}`;
      }
    } catch (err) {
      console.error(err);
      alert('오류 발생: ' + err.message);
      resultDiv.textContent = '오류 발생. 다시 시도해 주세요.';
    }
  });
});
