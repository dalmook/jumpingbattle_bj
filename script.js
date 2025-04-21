const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwM-p-NhwFB5cqR4Zi6i0ALzOKYNyK9oRQ0qu59k9ydDDeTR5qNns31y-eMyWqG5eTCNg/exec'

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
