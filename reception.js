function doGet(e) {
  // ★自身の受付表のスプレッドシートIDに変更が必要
  let spreadsheetID = '1_DEpBggeTsYLVDctWk48IQ0cSxM-EfOiDoP5t2LUWYk';
  // ★自身の受付表のスプレッドシートのシート名に変更が必要
  let spreadsheetName = '受付用シート';

  let registeredNo = e.parameter.registeredNo;
  Logger.log('registeredNo:'+registeredNo);
  let resText = '';
  try {
    let name = '';
    let email = '';
    let remarks = '';
    let receptionResult = '';
    let spreadsheet = SpreadsheetApp.openById(spreadsheetID);
    let sheet = spreadsheet.getSheetByName(spreadsheetName);
    let data = sheet.getDataRange().getValues();
    for(let ii=1; ii<data.length; ii++){
      if(registeredNo != data[ii][1]){
        continue;
      }
      name = data[ii][3];
      email = data[ii][4];
      remarks = data[ii][5];
      Logger.log('name:'+name+' remarks:'+remarks);
      sheet.getRange(ii+1,1).setValue(true);
      // 1秒処理をまってから最新の状態にするためスプレッドシートをリフレッシュさせておく
      Utilities.sleep(1000);
      SpreadsheetApp.flush();
      receptionResult = sheet.getRange(ii+1,1).getValue();
      Logger.log('receptionResult:'+receptionResult);
      break;
    }
    resText = '【受付番号】\n'
              + registeredNo + '\n'
              + '【氏名】\n'
              + name + '\n'
              + '【メールアドレス】\n'
              + email + '\n'
              + '【備考】\n'
              + remarks + '\n\n';
    if(receptionResult){
      resText += '★受付が完了しました★';
    }else{
      resText += '受付処理に失敗しました\n再度確認してください';
    }
  }catch(e){
    Logger.log(e.message);
    resText = '受付処理が許可されていません'
  }
  return ContentService.createTextOutput(resText);
}