const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz48VxKPK8Eeon9urKrOeNS1HU6Ngoig6UiHCOtillGonaoaFIxoQJNGb1KvJL_eyjqSA/exec'

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
