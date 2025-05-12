// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6mXkxHHiZqH9ik_ovVXFZwPR10naArlp8GI0G41pjWcdMucZ4zablSlbZlTK6W3qR8Q/exec';

document.addEventListener('DOMContentLoaded', () => {
  const walkInInput = document.getElementById('walkInTime');
  const roomInput = document.getElementById('roomSize');
  const difficultyInput = document.getElementById('difficulty');
  const roomButtons = document.querySelectorAll('.room-buttons button');
  const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  // 방 크기 선택
  roomButtons.forEach(btn => btn.addEventListener('click', () => {
    roomButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    roomInput.value = btn.dataset.value;
  }));

  // 난이도 선택
  difficultyButtons.forEach(btn => btn.addEventListener('click', () => {
    difficultyButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    difficultyInput.value = btn.dataset.value;
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // 최종 확인
    if (!confirm('입력한 정보가 맞습니까?')) {
      submitBtn.disabled = false;
      return;
    }

    // 필수 검사
    const teamName = form.teamName.value.trim();
    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    if (!teamName) {
      alert('팀명을 입력해주세요.');
      submitBtn.disabled = false;
      return;
    }
    if (adult + youth <= 0) {
      alert('인원 수를 입력해주세요.');
      submitBtn.disabled = false;
      return;
    }

    // 슬롯 계산 (00,20,40 기준, 3분 초과 시 다음 슬롯)
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const slots = [0, 20, 40];
    let chosen = slots.find(s => m <= s + 3);
    if (chosen === undefined) { h = (h + 1) % 24; chosen = 0; }
    const slotStr = String(h).padStart(2,'0') + ':' + String(chosen).padStart(2,'0');
    walkInInput.value = slotStr;

    // payload 준비
    const payload = {
      walkInTime: slotStr,
      roomSize: roomInput.value,
      teamName,
      difficulty: difficultyInput.value,
      totalCount: adult + youth,
      youthCount: youth,
      vehicle: form.vehicle.value.trim() || ''
    };

    // 전송 시작
    resultDiv.textContent = '전송 중...';
    const sendPromise = fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // 즉시 완료 안내 (alert 대신 inline)
    resultDiv.innerHTML =
      '완료되었습니다!<br>' +
      '1. 실내화로 갈아신고,<br>' +
      '2. 짐은 락커에 보관 후<br>' +
      '3. 발목 한번 푸시고<br>' +
      '4. 카운터로 오시면 안내해 드리겠습니다.^^';

    // 전송 완료 후 후속 처리
    sendPromise.then(() => {
      submitBtn.disabled = false;
      form.reset();
      roomButtons.forEach(b => b.classList.remove('selected'));
      difficultyButtons.forEach(b => b.classList.remove('selected'));
    });
  });
});
