// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEbUE5JItCqxMPR_w_cTA2WHvi6IQyngev325RcJYiRQ6WUMGy-bBFzQ4eUx_l58476Q/exec';

document.addEventListener('DOMContentLoaded', () => {
  const difficultyInput = document.getElementById('difficulty');
  const buttons = document.querySelectorAll('.difficulty-buttons button');

  // 난이도 버튼 선택
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
    if (!confirm('입력한 정보가 맞습니까?')) return;

    if (!difficultyInput.value) {
      alert('난이도를 선택해주세요.');
      return;
    }

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
  });
});
