// script.js
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrQYWsGtcivWnD2ydP7PeNuWhEkeomZ7G1FpSnflUAjs00w6zT8bsjyPnugGmwyplS/exec';

document.addEventListener('DOMContentLoaded', () => {
  // 1) 방 선택
  const roomButtons = document.querySelectorAll('.room-buttons button');
  const roomInput   = document.getElementById('roomSize');
  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roomButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      roomInput.value = btn.dataset.value;
    });
  });

  // 2) 난이도 선택
  const diffButtons = document.querySelectorAll('.difficulty-buttons button');
  const diffInput   = document.getElementById('difficulty');
  diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      diffButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      diffInput.value = btn.dataset.value;
    });
  });

  // 3) 팀명 자동 생성
  const teamNameList = [
    '순대', '떡볶이', '트랄랄레로 트랄랄라', '봄바르디로 크로코딜로', '퉁퉁퉁퉁퉁퉁퉁퉁퉁 사후르',
    '리릴리 라릴라', '보네카 암발라부', '브르르 브르르 파타핌', '침판지니 바나니니', '봄봄비니 구지니',
    '카푸치노 아사시노', '트리피 트로피', '프리고 카멜로', '발레리나 카푸치나', '오 딘딘딘딘 둔 마 딘딘딘 둔',
    '대박', '뽀로로', '미래소년코난', '피구왕통키', '독수리슛', '번개슛', '도깨비슛',
    '왼발의달인 하석주', '날쌘돌이 서정원', '호나우딩요', '곱창', '대창', '막창', '잡채와 떡갈비',
    '홍어', '코딱지', '은하철도999', '순돌이', '제로콜라', '불고기와퍼', '김치찜', '도르마무',
    '아이언맨', '헐크', '심슨', '도라에몽', '톰과제리', '나는 자연인이다', '무한도전', '런닝맨',
    '우솝', '쵸파', '조로', '갈비탕', '순대국', '돼지국밥', '달마', '시네마천국', '우르사',
    '깔라만씨', '고길동', '둘리', '호의가 계속되면 둘리', '순살치킨', '신라면', '진라면',
    '불닭볶음면', '돼지엄마', '누워서 먹으면 소된다', '방귀가 잦으면 똥이 나온다',
    '언 발에 오줌누기', '번개불에 콩볶아 먹겠다', '참을 인 세번이면 호구', '너 서울대',
    '너 하버드', '너 연세대', '너 고려대', '블랙홀', '쿠쿠다스', '칼국수와 보쌈',
    '에겐남', '에겐녀', '테토남', '테토녀', '아따아따', '방가방가 햄토리', '요술공주 밍키',
    '호빵맨', '검정고무신', '요리왕비룡', '배추도사 무도사', '돈테크만', '보거스', '괴짜가족',
    '보노보노', '구린내', '구데기', '파리지옥'
  ];
  const genBtn = document.getElementById('generateTeamNameBtn');
  const teamInput = document.getElementById('teamName');
  genBtn.addEventListener('click', () => {
    const rand = teamNameList[Math.floor(Math.random() * teamNameList.length)];
    teamInput.value = rand;
  });

  // 4) 폼 제출 및 결제 안내
  const form      = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', e => {
    e.preventDefault();

    // 필수값 체크
    const room   = form.roomSize.value;
    const adult  = Number(form.adultCount.value);
    const youth  = Number(form.youthCount.value);
    const team   = form.teamName.value.trim();
    const diff   = form.difficulty.value;
    if (!room)    { alert('방을 선택해주세요.'); return; }
    if (adult + youth <= 0) { alert('인원 수를 입력해주세요.'); return; }
    if (!team)    { alert('팀명을 입력해주세요.'); return; }
    if (!diff)    { alert('난이도를 선택해주세요.'); return; }

    // 슬롯 계산
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const slots = [0, 20, 40];
    let chosen = slots.find(s => m <= s + 3);
    if (chosen === undefined) { h = (h + 1) % 24; chosen = 0; }
    const slotStr = `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;
    document.getElementById('walkInTime').value = slotStr;

    // 페이로드 준비
    const payload = {
      walkInTime: slotStr,
      roomSize:   room,
      teamName:   team,
      difficulty: diff,
      totalCount: adult + youth,
      youthCount: youth,
      vehicle:    form.vehicle.value.trim() || ''
    };

    // 전송
    resultDiv.textContent = '전송 중...';
    fetch(SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    // 결제 안내
    const adultAmt = adult * 7000;
    const youthAmt = youth * 5000;
    const totalAmt = adultAmt + youthAmt;
    resultDiv.innerHTML =
      `🚀 전송 완료!<br>` +
      `<strong>총 금액: ${totalAmt.toLocaleString()}원</strong><br>` +
      `성인 ${adult}명 × 7,000원 = ${adultAmt.toLocaleString()}원<br>` +
      `청소년 ${youth}명 × 5,000원 = ${youthAmt.toLocaleString()}원`;

    // 초기화
    setTimeout(() => {
      form.reset();
      roomButtons.forEach(b => b.classList.remove('selected'));
      diffButtons.forEach(b => b.classList.remove('selected'));
      teamInput.value = '';
      resultDiv.textContent = '';
    }, 3000);
  });
});
