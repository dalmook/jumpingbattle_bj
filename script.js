// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby42nMpue8e72bnj2wPhld96uJqKHAkJP6ATJqQIEyeGasQFoJQoqf06HmZcHnbxg7d1w/exec';

document.addEventListener('DOMContentLoaded', () => {
  const walkInInput = document.getElementById('walkInTime');
  const difficultyInput = document.getElementById('difficulty');
  const roomInput = document.getElementById('roomSize');

  const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
  const roomButtons = document.querySelectorAll('.room-buttons button');

  // 난이도 선택
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      difficultyInput.value = btn.dataset.value;
    });
  });

  // 방 크기 선택
  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roomButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      roomInput.value = btn.dataset.value;
    });
  });

  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async e => {
    console.log('Form submit handler start');
    e.preventDefault();

    // 방 크기 필수 체크
    if (!roomInput.value) {
      alert('방 크기를 선택해주세요.');
      return;
    }

    // 난이도 필수 체크
    if (!difficultyInput.value) {
      alert('난이도를 선택해주세요.');
      return;
    }

    if (!confirm('입력한 정보가 맞습니까?')) return;

    // 인원 수 계산 및 유효성
    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    const total = adult + youth;
    if (total <= 0) {
      alert('인원 수를 입력해주세요.');
      return;
    }

    // 워크인 시간 계산
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const slots = [0, 20, 40];
    let chosen;
    for (let slot of slots) {
      if (m <= slot + 3) {
        chosen = slot;
        break;
      }
    }
    if (chosen === undefined) {
      h = (h + 1) % 24;
      chosen = 0;
    }
    walkInInput.value = `${String(h).padStart(2, '0')}:${String(chosen).padStart(2, '0')}`;

    resultDiv.textContent = '요청 전송 중...';

    const payload = {
      walkInTime: walkInInput.value,
      roomSize: roomInput.value,
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
    difficultyButtons.forEach(b => b.classList.remove('selected'));
    roomButtons.forEach(b => b.classList.remove('selected'));
  });
});
