<script>
// ==============================
// script.js (개선본)
// ==============================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrQYWsGtcivWnD2ydP7PeNuWhEkeomZ7G1FpSnflUAjs00w6zT8bsjyPnugGmwyplS/exec';

// 가격 상수 (필요 시 여기만 수정)
const PRICE_ADULT = 7000;
const PRICE_YOUTH = 5000;

// 간단 토스트
function toast(msg, ms = 2500){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 200);
  }, ms);
}

// 팀명 자동생성 풀
const teamNamePool = [
  '순대','떡볶이','트랄랄레로 트랄랄라','봄바르디로 크로코딜로','퉁퉁퉁퉁퉁퉁퉁퉁퉁 사후르',
  '리릴리 라릴라','보네카 암발라부','브르르 브르르 파타핌','침판지니 바나니니','봄봄비니 구지니',
  '카푸치노 아사시노','트리피 트로피','프리고 카멜로','발레리나 카푸치나','오 딘딘딘딘 둔 마 딘딘딘 둔',
  '대박','뽀로로','미래소년코난','피구왕통키','독수리슛','번개슛','도깨비슛',
  '왼발의달인 하석주','날쌘돌이 서정원','호나우딩요','곱창','대창','막창','잡채와 떡갈비',
  '홍어','코딱지','은하철도999','순돌이','제로콜라','불고기와퍼','김치찜','도르마무',
  '아이언맨','헐크','심슨','도라에몽','톰과제리','나는 자연인이다','무한도전','런닝맨',
  '우솝','쵸파','조로','갈비탕','순대국','돼지국밥','달마','시네마천국','우르사',
  '깔라만씨','고길동','둘리','호의가 계속되면 둘리','순살치킨','신라면','진라면',
  '불닭볶음면','돼지엄마','누워서 먹으면 소된다','방귀가 잦으면 똥이 나온다',
  '언 발에 오줌누기','번개불에 콩볶아 먹겠다','참을 인 세번이면 호구','너 서울대',
  '너 하버드','너 연세대','너 고려대','블랙홀','쿠쿠다스','칼국수와 보쌈',
  '에겐남','에겐녀','테토남','테토녀','아따아따','방가방가 햄토리','요술공주 밍키',
  '호빵맨','검정고무신','요리왕비룡','배추도사 무도사','돈테크만','보거스','괴짜가족',
  '보노보노','구린내','구데기','파리지옥'
];

// 작은 유틸
const fmtKRW = (n) => n.toLocaleString('ko-KR') + '원';
const clamp = (v, min, max) => Math.max(min, Math.min(max, v|0));
const onlyDigits = (s) => (s || '').replace(/\D+/g, '');

document.addEventListener('DOMContentLoaded', () => {
  // 요소 캐시
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');
  const submitBtn = document.getElementById('submitBtn');

  const roomButtons = document.querySelectorAll('.room-buttons button');
  const diffButtons = document.querySelectorAll('.difficulty-buttons button');

  const roomInput = document.getElementById('roomSize');
  const diffInput = document.getElementById('difficulty');
  const walkInInput = document.getElementById('walkInTime');

  const adultEl = document.getElementById('adultCount');
  const youthEl = document.getElementById('youthCount');
  const teamEl  = document.getElementById('teamName');
  const vehicleEl = document.getElementById('vehicle');
  const genBtn = document.getElementById('generateTeamNameBtn');

  // 1) 방 선택
  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roomButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      roomInput.value = btn.dataset.value;
    });
  });

  // 2) 난이도 선택
  diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      diffButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      diffInput.value = btn.dataset.value;
    });
  });

  // 3) 인원 입력 가드 (음수/소수 방지)
  ['input','change','blur'].forEach(ev => {
    adultEl.addEventListener(ev, () => adultEl.value = clamp(+adultEl.value || 0, 0, 99));
    youthEl.addEventListener(ev, () => youthEl.value = clamp(+youthEl.value || 0, 0, 99));
  });

  // 4) 차량번호: 뒤 4자리 숫자만
  vehicleEl.addEventListener('input', () => {
    const d = onlyDigits(vehicleEl.value).slice(-4);
    vehicleEl.value = d;
  });

  // 5) 팀명 자동 생성 (간단 셔플 + 중복 방지)
  let usedNames = new Set();
  genBtn.addEventListener('click', () => {
    if(usedNames.size >= teamNamePool.length) usedNames.clear();
    let candidate = '';
    for (let i=0; i<5; i++){
      const c = teamNamePool[(Math.random()*teamNamePool.length)|0];
      if(!usedNames.has(c)){ candidate = c; break; }
    }
    if(!candidate) candidate = teamNamePool[(Math.random()*teamNamePool.length)|0];
    usedNames.add(candidate);
    teamEl.value = candidate;
  });

  // 6) 슬롯 계산 (현재 시각 근처 0/20/40분, +3분 그레이스)
  function getNextSlot(d = new Date()){
    let h = d.getHours();
    const m = d.getMinutes();
    const slots = [0,20,40];
    let chosen = slots.find(s => m <= s + 3);
    if (chosen === undefined){ h = (h + 1) % 24; chosen = 0; }
    return `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;
  }

  // 7) 폼 제출
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 검증 --------------------------
    const room = roomInput.value;
    const diff = diffInput.value;

    const adult = +adultEl.value || 0;
    const youth = +youthEl.value || 0;
    const total = adult + youth;

    const team = (teamEl.value || '').trim();
    const vehicle = onlyDigits(vehicleEl.value).slice(-4); // '' 또는 4자리

    if(!room){ toast('방을 선택해주세요.'); return; }
    if(!diff){ toast('난이도를 선택해주세요.'); return; }
    if(total <= 0){ toast('인원 수를 입력해주세요.'); return; }
    if(team.length < 1){ toast('팀명을 입력해주세요.'); return; }
    if(vehicle && vehicle.length !== 4){ toast('차량번호는 뒤 4자리만 입력하세요.'); return; }

    // 입장 슬롯 ----------------------
    const slotStr = getNextSlot(new Date());
    walkInInput.value = slotStr;

    // 전송 페이로드 -----------------
    const payload = {
      walkInTime: slotStr,
      roomSize:   room,
      teamName:   team,
      difficulty: diff,
      totalCount: total,
      youthCount: youth,
      vehicle:    vehicle
    };

    // 결제 계산 ---------------------
    const adultAmt = adult * PRICE_ADULT;
    const youthAmt = youth * PRICE_YOUTH;
    const totalAmt = adultAmt + youthAmt;

    // UI 잠금 & 안내 ---------------
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    resultDiv.innerHTML = '전송 중…';

    // Apps Script 호출 -------------
    // 권장: Web App이 JSON을 반환(CORS 허용)하면 아래 try 블록(표준 fetch)로 작동.
    // 아직 설정 전이면 자동으로 no-cors 폴백합니다.
    let sent = false;
    try{
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      });
      // CORS 미설정이면 여기서 throw 가능
      if(!res.ok) throw new Error('HTTP '+res.status);
      // JSON 응답이 있는 경우(예: {ok:true})
      sent = true;
    }catch(_){
      // 폴백: no-cors (응답 읽기 불가하지만 송신은 시도)
      try{
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload),
        });
        sent = true; // 성공 가정
      }catch(err){
        console.error(err);
        sent = false;
      }
    }

    // 결과 표시 ---------------------
    if(sent){
      resultDiv.innerHTML = `
        <div class="pay-box">
          <div class="pay-title">🚀 전송 완료!</div>
          <div class="pay-line"><b>예정 입장</b> · ${slotStr}</div>
          <div class="pay-line"><b>총 금액</b> · ${fmtKRW(totalAmt)}</div>
          <div class="pay-detail">
            성인 ${adult}명 × ${fmtKRW(PRICE_ADULT)} = ${fmtKRW(adultAmt)}<br>
            청소년 ${youth}명 × ${fmtKRW(PRICE_YOUTH)} = ${fmtKRW(youthAmt)}
          </div>
        </div>
      `;
      toast('전송이 완료되었습니다.');

      // 2.5초 후 리셋
      setTimeout(() => {
        form.reset();
        roomButtons.forEach(b => b.classList.remove('selected'));
        diffButtons.forEach(b => b.classList.remove('selected'));
        resultDiv.innerHTML = '';
      }, 2500);
    }else{
      resultDiv.textContent = '전송 실패. 네트워크 또는 서버 설정을 확인해주세요.';
      toast('전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    // UI 해제
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  });
});
</script>
