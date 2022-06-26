
const {getRandom, upperone, fileDict, fileProcent} = require ("../noun/tools.js");
const fs = require ("fs");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const checkWords = async (Id, message) => {
    let messageCorrect = [];
    let xhr, url, answer;

    for (let word of message) {                                                                         //
        xhr = new XMLHttpRequest(),                                                                     //
        url = new URL("https://speller.yandex.net/services/spellservice.json/checkText?text=" + word),  //проверка
        xhr.open("GET", url, false),                                                                    //орфографии 
        xhr.send(),                                                                                     //Я.Спеллер API
        answer = await JSON.parse(xhr.responseText),                                                    //
        !answer[0] ? messageCorrect.push(word) : messageCorrect.push(answer[0].s[0]);                   //
        }
    messageCorrect = String (messageCorrect.join(" "));
    
    if (/[,.!?;:()-+='"]$/.test(messageCorrect)) {messageCorrect += ' ';}
    else {messageCorrect += '. ';}

    let object = 'cli/' + fileDict(Id);

    fs.appendFile(object, messageCorrect, function (err) {
        if (err) throw err;
        console.log('Сохранено!');
      });
}

exports.checkWords = checkWords;