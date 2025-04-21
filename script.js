// 배포한 Google Apps Script 웹앱 URL을 붙여넣으세요
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqkL0yA8VqsYvMpWTnifwxBIs-njQznQfhirf6XhuERh8PjW00TJldoASoO00R0-nizA/exec';

document.addEventListener('DOMContentLoaded', () => {
  // 시간 슬롯 생성: 12:00 ~ 22:00, 20분 단위
  const timeSelect = document.getElementById('timeSlot');
  const startMin = 12 * 60;
  const endMin = 22 * 60;
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
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '전송 중...';

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: form.teamName.value.trim(),
          difficulty: form.difficulty.value,
          timeSlot: form.timeSlot.value,
          peopleCount: form.peopleCount.value,
          room: form.room.value
        })
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

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
      alert('서버 요청은 완료되었습니다. 시트를 확인해주세요.');
      resultDiv.textContent = '예약 요청은 완료되었습니다. 시트를 확인해주세요.';
    }
  });
});

