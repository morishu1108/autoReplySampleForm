function deleteRocords() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('フォームの回答 1');
  let range = sheet.getDataRange();
  let lastRow = range.getLastRow();
  Logger.log("最終行："+lastRow);
  if(1<lastRow){
    sheet.deleteRows(2,lastRow-1);
  }
  // 受付用シートの受付チェックもクリアする
  sheet = spreadsheet.getSheetByName('受付用シート');
  range = sheet.getDataRange();
  let data = sheet.getDataRange().getValues();
  for(let ii=1; ii<data.length; ii++){
    if(true===data[ii][0]){
      sheet.getRange(ii+1,1).setValue(false);
      Logger.log("フラグクリア："+(ii+1));
    }
  }
}
