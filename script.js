// Google Apps Script 웹앱 URL을 입력하세요
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwzLDF7xQnuF6I980AL5vyDyITXYrnV9Lv6ELUFI5Ri7DZz85W4tGqlNf9PpcdcfgRO8A/exec';

document.addEventListener('DOMContentLoaded', () => {
  const walkInInput = document.getElementById('walkInTime');
  const difficultyInput = document.getElementById('difficulty');
  const buttons = document.querySelectorAll('.difficulty-buttons button');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      difficultyInput.value = btn.dataset.value;
    });
  });

  // 워크인 슬롯 계산
  function getWalkInSlot() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const slots = [0, 20, 40];
    let chosen;
    for (let slot of slots) {
      if (m <= slot + 3) { chosen = slot; break; }
    }
    if (chosen === undefined) { h = (h + 1) % 24; chosen = 0; }
    walkInInput.value = `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;
  }

  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async e => {
    console.log('Form submit handler start');
    console.log('Form values:', { teamName: form.teamName.value, adultCount: form.adultCount.value, youthCount: form.youthCount.value, difficulty: difficultyInput.value, vehicle: form.vehicle.value });
    e.preventDefault();
    if (!confirm('입력한 정보가 맞습니까?')) return;
    if (!difficultyInput.value) { alert('난이도를 선택해주세요.'); return; }
    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    const total = adult + youth;
    if (total <= 0) { alert('인원 수를 입력해주세요.'); return; }
    getWalkInSlot();
    resultDiv.textContent = '요청 전송 중...';
    const payload = {
      walkInTime: walkInInput.value,
      teamName: form.teamName.value.trim(),
      difficulty: difficultyInput.value,
      totalCount: total,
      youthCount: youth,
      vehicle: form.vehicle.value.trim() || ''
    };
    await fetch(SCRIPT_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    alert('예약 요청이 전송되었습니다!');
    resultDiv.textContent = '예약 요청이 전송되었습니다!';
    form.reset(); buttons.forEach(b=>b.classList.remove('selected'));
  });
});
