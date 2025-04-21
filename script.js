const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzzu9QneZHjuSa7Wx8ZOpkxrfVq-cyocuA90F7y1RoNqgyiFozJ2Ud9A6qvJ8s1dnbv0A/exec';

// POST 요청 처리: ContentService.TextOutput은 setHeader를 지원하지 않습니다.
// CORS 오류가 계속된다면 JSONP 방식을 사용하거나, 요청을 같은 출처로 보내야 합니다.
function doPost(e) {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('예약');
  const { teamName, difficulty, timeSlot, peopleCount, room } = JSON.parse(e.postData.contents);

  // 중복 예약 체크
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const [ , , , t, , r ] = rows[i];
    if (r === room && t === timeSlot) {
      // 중복 시 에러 메시지 반환
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: '이미 예약된 시간입니다.' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // 예약 추가 후 성공 응답
  sheet.appendRow([new Date(), teamName, difficulty, timeSlot, peopleCount, room]);
  return ContentService.createTextOutput(
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
