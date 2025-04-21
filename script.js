const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzqefl6_0ZDeBYgaQPcVD3TCKfTtRh6N3GVetRhoMbCnP53_VIrcJq2yBnDiHIMWwPnFQ/exec'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultDiv.textContent = '전송 중...';

    const payload = {
      teamName: form.teamName.value.trim(),
      difficulty: form.difficulty.value,
      contact: form.contact.value.trim(),
      vehicle: form.vehicle.value.trim()
    };

    try {
      // mode 옵션 제거: 기본 CORS 모드 사용
      const resp = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
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
      alert(`오류: ${err.message}`);
      resultDiv.textContent = `오류: ${err.message}`;
    }
  });
});
