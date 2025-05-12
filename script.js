const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSTHnxW2hVB_E48CBD_PRziTK-kwgy8Qaz-Enkl8fpI6yT9F8YMkwT-eIquMDIphDK4Q/exec'

document.addEventListener('DOMContentLoaded', () => {
  // 난이도 버튼 설정
  const difficultyInput = document.getElementById('difficulty');
  const buttons = document.querySelectorAll('.difficulty-buttons button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      difficultyInput.value = btn.dataset.value;
    });
  });

  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 최종 확인 팝업
    if (!confirm('입력한 정보가 맞습니까?')) return;

    // 난이도 확인
    if (!difficultyInput.value) {
      alert('난이도를 선택해주세요.');
      return;
    }

    // 인원 수 계산 및 유효성 검사
    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    const total = adult + youth;
    if (total <= 0) {
      alert('인원 수를 입력해주세요.');
      return;
    }

    resultDiv.textContent = '요청 전송 중...';

    const payload = {
      teamName: form.teamName.value.trim(),
      difficulty: difficultyInput.value,
      totalCount: total,
      youthCount: youth,
      vehicle: form.vehicle.value.trim() || ''
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      alert('예약 요청이 전송되었습니다!');
      resultDiv.textContent = '예약 요청이 전송되었습니다!';
      form.reset();
      buttons.forEach(b => b.classList.remove('selected'));
    } catch (err) {
      console.error('전송 오류:', err);
      alert('전송 중 오류가 발생했습니다.');
      resultDiv.textContent = '전송 중 오류가 발생했습니다.';
    }
  });
});
