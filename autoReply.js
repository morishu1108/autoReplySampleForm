/**
 * フォームの登録イベント
 */
function submitForm(e){
  // フォームの入力値参照
  let registeredData = {};
  let itemResponses = e.response.getItemResponses();
  for (let ii = 0; ii < itemResponses.length; ii++) {
    let itemResponse = itemResponses[ii];
    let question = itemResponse.getItem().getTitle();
    let answer = itemResponse.getResponse();
    registeredData[question] = answer;
  }
  // 自動応答
  autoReply(registeredData);
}
/**
 * フォームで入力されたメールアドレスに
 * 受付番号を含む申し込み完了メールを送付する
 */
function autoReply(registeredData) {
  let name = registeredData['氏名'];
  let sendTo = registeredData['メールアドレス'];
  // 受付番号を取得
  var registeredNo = getRegisteredNo(name, sendTo);
  if(!registeredNo){
    Logger.log('受付番号取得失敗 氏名：'+name+' メールアドレス：'+sendTo);
    console.error('受付番号取得失敗 氏名：'+name+' メールアドレス：'+sendTo);
  }
  // メールタイトル
  var subject = '【自動応答】サンプル応募フォーム 登録完了のお知らせ'
  // メール本文を生成
  var body = getMailBody(name,registeredNo,registeredData);
  var htmlBody = getMailHtmlBody(name,registeredNo,registeredData);
  // メール送信
  sendHtmlMail(sendTo, subject, body, htmlBody);
}
/**
 * メール本文(テキスト取得)
 */
function getMailBody(name, registeredNo,registeredData){
  var mailBody = name + '　様\n'
            + '\n'
            +'サンプル応募フォームをお試しいただきありがとうございます。\n'
            +'当日は受付にて下記の受付番号をご提示ください。\n'
            + '\n'
            + '【'+ registeredNo +'】\n'
            + '\n'
            + '【氏名】　'+registeredData['氏名']+'\n'
            + '【備考】　'+registeredData['備考']+'\n'
            + '\n'
            + '入力いただいた内容に誤りがある場合は、再度申込フォームに入力をしてください。\n'
            + '当日の受付では、後に入力した方の受付番号をご提示ください。\n'
            + '\n'
            + '【お問い合わせ先】\n'
            + 'CFOURLサンプル応募フォーム担当\n'
            + 'Mail：cfourl.c4l@gmail.com';
  return mailBody;
}
/**
 * メール本文(HTML取得)
 */
function getMailHtmlBody(name, registeredNo,registeredData){
  // ★受付用APIデプロイ後にアクセス先のURLに変更が必要
  let receptionURL = 'https://script.google.com/macros/s/AKfycbxFs0qxGgEyMsBrCvDUWuCFOACwirRemBFwD_1OT3Z6F-QAF9FBsm5jtA/exec';
  var t = HtmlService.createTemplateFromFile('htmlMailTemplate');
  t.name = name;
  t.registeredNo = registeredNo;
  t.registeredData = registeredData;
  t.receptionURL = receptionURL;
  var res = t.evaluate();
  var mailHtmlBody = res.getContent();
  Logger.log(mailHtmlBody);
  return mailHtmlBody;
}
/**
 * 受付番号を取得
 */
function getRegisteredNo(name, emailAdress){
  // ★自身の受付表のスプレッドシートIDに変更が必要
  let spreadsheetID = '1_DEpBggeTsYLVDctWk48IQ0cSxM-EfOiDoP5t2LUWYk';
  // ★自身の受付表のスプレッドシートのシート名に変更が必要
  let spreadsheetName = '受付用シート';

  let spreadsheet = SpreadsheetApp.openById(spreadsheetID);
  let sheet = spreadsheet.getSheetByName(spreadsheetName);
  // 1秒処理をまってから最新の状態にするためスプレッドシートをリフレッシュさせておく
  Utilities.sleep(1000);
  SpreadsheetApp.flush();
  let data = sheet.getDataRange().getValues();
  for(let ii=data.length-1; ii>0; ii--){ // 同じ人が複数登録した時に最新の番号を返す
    if(name == data[ii][3] && emailAdress == data[ii][4]){
      Logger.log('受付番号：'+data[ii][1]+' 氏名：'+data[ii][3]+' メールアドレス：'+data[ii][4]);
      return data[ii][1];
    }
  }
  return null;
}

/**
 * メール送信（テキストメール+HTMLメール）
 */
function sendHtmlMail(sendTo, subject, body, htmlBody){
  // option
  // ★控えを送るメールアドレス(BCC) ※複数指定はカンマ区切り
  var optionBcc = 'cfourl.c4l+sampleform@gmail.com';
  // ★メールの差出人として見える名前
  var optionName = 'CFOURLサンプル応募フォーム担当';

  GmailApp.sendEmail(sendTo, subject, body,{
    'bcc':optionBcc,
    'name':optionName,
    'htmlBody':htmlBody
  });
  Logger.log('To:'+sendTo+' subject:'+subject);
  Logger.log('  body:'+body);
  Logger.log('  htmlBody:'+htmlBody);
}

/**
 * 手動でメール送信用のファンクション
 */
function manualSendMail(){
  // ここに受付用シートにある「氏名」をnameに、「メールアドレス」をsendToに入力して、
  // 上部のツールバーのプルダウンで『manualSendMail』を選択して実行すると個別に
  // 申込時の自動応答メールを送付できます。
  let name = 'テスト01';
  let sendTo = 'morishu1108@gmail.com';
  autoReply(name, sendTo);
}
