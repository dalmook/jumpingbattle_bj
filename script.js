const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwM-p-NhwFB5cqR4Zi6i0ALzOKYNyK9oRQ0qu59k9ydDDeTR5qNns31y-eMyWqG5eTCNg/exec'

document.addEventListener('DOMContentLoaded', () => {
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
    if (!confirm('입력한 정보가 맞습니까?')) {
      return;
    }

    if (!difficultyInput.value) {
      alert('난이도를 선택해주세요.');
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    resultDiv.textContent = '요청 전송 중...';

    const payload = {
      teamName: form.teamName.value.trim(),
      difficulty: difficultyInput.value,
      contact: form.contact.value.trim() || '',
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

