function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('運用');
  menu.addItem('受付フラグクリア', 'resetReceptFlag');
  menu.addToUi();
}
/**
 * 受付用シートの受付チェックをリセットする
 */
function resetReceptFlag() {
  if('yes'!=Browser.msgBox("確認",
                            "受付フラグをクリアします。よろしいですか？", 
                            Browser.Buttons.YES_NO))
                            {
                              return;
                            }
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('受付用シート');
  let range = sheet.getDataRange();
  let lastRow = range.getLastRow();
  // Logger.log("最終行："+lastRow);
  // 受付用シートの受付チェックもクリアする
  sheet = spreadsheet.getSheetByName('受付用シート');
  range = sheet.getDataRange();
  let data = sheet.getDataRange().getValues();
  for(let ii=6; ii<data.length; ii++){
    if(""==data[ii][2]){  // タイムスタンプが入っていなければここでブレイク
      break;
    }
    if(true===data[ii][0]){
      sheet.getRange(ii+1,1).setValue(false);
      Logger.log("フラグクリア 受付番号:"+data[ii][1]);
    }
  }
}