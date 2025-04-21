const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJg9-YTEf-740Tx34wswFuLnAkoo339DV_Yey7htZzE_DItzV5VX0fKVLq2uLY4F0OBw/exec'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resultDiv.textContent = '요청 전송 중...';

    const payload = {
      teamName: form.teamName.value.trim(),
      difficulty: form.difficulty.value,
      contact: form.contact.value.trim() || '',
      vehicle: form.vehicle.value.trim() || ''
    };

    // CORS 제약으로 응답 내용은 확인하지 않고, 요청 성공 시 바로 완료 처리
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      alert('예약 요청이 전송되었습니다!');
      resultDiv.textContent = '예약 요청이 전송되었습니다!';
      form.reset();
    })
    .catch(err => {
      console.error('전송 오류:', err);
      alert('전송 중 오류가 발생했습니다.');
      resultDiv.textContent = '전송 중 오류가 발생했습니다.';
    });
  });
});
```javascript
// 배포한 Google Apps Script 웹앱 URL을 넣으세요
const SCRIPT_URL = 'https://script.google.com/macros/s/WEB_APP_ID/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultDiv.textContent = '전송 중...';

    const payload = {
      teamName: form.teamName.value.trim(),
      difficulty: form.difficulty.value,
      // 연락처는 옵션, 빈 문자열 허용
      contact: form.contact.value.trim() || '',
      vehicle: form.vehicle.value.trim() || ''
    };

    try {
      const resp = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const result = await resp.json();
      if (result.success) {
        alert('예약이 완료되었습니다!');
        resultDiv.textContent = '예약이 완료되었습니다!';
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('예약 오류:', err);
      alert('오류: CORS 설정을 확인해주세요.');
      resultDiv.textContent = '요청 중 오류가 발생했습니다.';
    }
  });
});
