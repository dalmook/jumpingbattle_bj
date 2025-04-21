// 배포한 Google Apps Script 웹앱 URL을 붙여넣으세요
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqkL0yA8VqsYvMpWTnifwxBIs-njQznQfhirf6XhuERh8PjW00TJldoASoO00R0-nizA/exec';

document.addEventListener('DOMContentLoaded', () => {
  // 12:00 ~ 22:00, 20분 단위 시간 슬롯 생성
  const timeSelect = document.getElementById('timeSlot');
  const startMin = 12 * 60;  // 720분
  const endMin = 22 * 60;    // 1320분
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

    // 폼 데이터 수집
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

      // HTTP 상태 체크
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      // 원시 텍스트로 받아서 확인
      const text = await response.text();
      console.log('서버 응답 텍스트:', text);
      if (!text) {
        throw new Error('서버 응답이 비어 있습니다.');
      }

      // JSON 파싱
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        throw new Error('JSON 파싱 실패: ' + err.message);
      }

      // 결과 처리
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

