// Google Apps Script 웹앱 URL을 붙여넣으세요
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqkL0yA8VqsYvMpWTnifwxBIs-njQznQfhirf6XhuERh8PjW00TJldoASoO00R0-nizA/exec';

// 예약된 목록을 가져오는 GET 호출
async function fetchBookings() {
  const res = await fetch(SCRIPT_URL, { method: 'GET', mode: 'no-cors' });
  if (!res.ok) throw new Error(`GET 오류: ${res.status}`);
  const data = await res.json();
  return data.bookings || [];
}

document.addEventListener('DOMContentLoaded', async () => {
  const roomSelect = document.getElementById('room');
  const timeSelect = document.getElementById('timeSlot');
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  // 방 리스트 하드코딩
  ['C1', 'C2', 'A1', 'B1'].forEach(r => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = r;
    roomSelect.appendChild(opt);
  });

  // 현재 유효 슬롯 계산 함수
  function generateSlots(bookings, selectedRoom) {
    timeSelect.innerHTML = '';
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const threshold = nowMin - 5; // 15분 게임, 5분 지나면 다음 슬롯
    const startMin = 12 * 60, endMin = 22 * 60;
    for (let m = startMin; m <= endMin; m += 20) {
      if (m < threshold) continue;
      const slot = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      // 이미 예약된 방/시간은 건너뜀
      if (bookings.some(b => b.room === selectedRoom && b.timeSlot === slot)) continue;
      const opt = document.createElement('option');
      opt.value = slot;
      opt.textContent = slot;
      timeSelect.appendChild(opt);
    }
  }

  // 기존 예약 목록 불러오기
  let bookings = [];
  try {
    bookings = await fetchBookings();
  } catch (err) {
    console.error('GET 오류:', err);
  }

  // 방 선택 시 슬롯 업데이트
  roomSelect.addEventListener('change', () => {
    generateSlots(bookings, roomSelect.value);
  });
  // 초기 방/슬롯 세팅
  roomSelect.value = roomSelect.options[0].value;
  generateSlots(bookings, roomSelect.value);

  // 예약 제출
  form.addEventListener('submit', async e => {
    e.preventDefault();
    resultDiv.textContent = '전송 중...';

    const payload = {
      teamName: form.teamName.value.trim(),
      difficulty: form.difficulty.value,
      timeSlot: form.timeSlot.value,
      peopleCount: form.peopleCount.value,
      room: form.room.value
    };

    try {
      const resp = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',  // cors 모드로 설정
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error(`POST 오류: ${resp.status}`);
      const result = await resp.json();
      if (result.success) {
        alert('예약 성공!');
        bookings.push(payload);
        generateSlots(bookings, form.room.value);
        resultDiv.textContent = '예약 성공!';
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('POST 오류:', err);
      alert(`오류: ${err.message}`);
      resultDiv.textContent = `오류: ${err.message}`;
    }
  });
});
