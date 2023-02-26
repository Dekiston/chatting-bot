const { fileDict } = require("../core/tools.js");
const { paragraph } = require("../core/parser.js");
const fs = require("fs");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const checkWords = async (Id, message) => {
  let messageCorrect = [];
  let xhr, url, answer;

  for (let word of message) {
    //
    (xhr = new XMLHttpRequest()), //
      (url = new URL(
        "https://speller.yandex.net/services/spellservice.json/checkText?text=" +
          word
      )), //проверка
      xhr.open("GET", url, false), //орфографии
      xhr.send(), //Я.Спеллер API
      (answer = await JSON.parse(xhr.responseText)), //
      !answer[0]
        ? messageCorrect.push(word)
        : messageCorrect.push(answer[0].s[0]); //
  } // проверка слов на орфаграфию с помощью Я.Спеллер

  (messageCorrect = String(messageCorrect.join(" ") + " ").toLowerCase()),
    messageCorrect.replace(paragraph, " ");

  let object = "cli/" + fileDict(Id);

  fs.appendFile(object, messageCorrect, function (err) {
    if (err) throw err;
  });
};

exports.checkWords = checkWords;
