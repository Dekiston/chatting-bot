const { VK } = require("vk-io");
const { HearManager } = require("@vk-io/hear");
const Az = require("az");
const fs = require("fs");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const tokenLongPollAPI = fs.readFileSync("token.txt"); //экспорт токена беседы
const vk = new VK({
  token: tokenLongPollAPI,
});
const bot = new HearManager();
vk.updates.on("message", bot.middleware);

const fileDict = (Id) => "dictionary" + Id + ".JSON"; //название файла

const fileProcent = (Id) => "info" + Id + ".txt"; //название файла

const Upperone = (text) => text.charAt(0).toUpperCase() + text.slice(1); //Изменение регистра первой буквы^

const getRandom = (max) => Math.floor(Math.random() * max); //случайное число

const parseJSON = (arg) => {
  let obj = fs.readFileSync(arg);
  obj = JSON.parse(obj);
  return obj;
}; //чтение json файлов с аргументом

const StatusFiles = async (Id) => {
  fs.stat(fileProcent(Id), (err) => {
    if (err) {
      fs.writeFileSync(fileProcent(Id), "procent: 100\nwords: 0");
    } //процент
  });

  fs.stat(fileDict(Id), (err) => {
    if (err) {
      fs.writeFileSync(fileDict(Id), '{ "words": [] }');
    }
  }); //слова
}; //создание файлов беседы

const fileChoice = (Id, Gender, Number) => {
  let object = fs.readFileSync(fileDict(Id), "utf8");
  object = JSON.parse(object).words;
  let index = object.length - 1;
  let num = 0;
  let OneWord = object[getRandom(index)];
  while ((OneWord.GNdr != Gender || OneWord.NMbr != Number) && num < 5) {
    OneWord = object[getRandom(index)];
    num = num + 1;
  }
  return OneWord.word;
}; //чтение коллекции

const procent = (Id) => {
  let procent = [];
  procent.push(fs.readFileSync(fileProcent(Id), "utf8"));
  return procent[0].slice(8, 12);
}; //чтение процента из файла

const speller = async (message, Id) => {
  let newmessage = [];
  let xhr, url, answer;
  for (let word of message) {
    let object = parseJSON(fileDict(Id)); //вызов обьекта со словами  - 1 -
    const existingWord = object.words.filter((obj) => obj.word === word); //и проверка одинаковых слов
    existingWord.length > 0
      ? newmessage.push(word) //чтобы не делать лишний запрос
      : ((xhr = new XMLHttpRequest()),
        (url = new URL("https://speller.yandex.net/services/spellservice.json/checkText?text=" + word)),
        xhr.open("GET", url, false),
        xhr.send(),
        (answer = await JSON.parse(xhr.responseText)),
        !answer[0] ? newmessage.push(word) : newmessage.push(answer[0].s[0]));
  }
  newmessage.join(" ");
  return newmessage;
}; //проверка орфографии Я.Спеллер API

bot.hear(/^mhelp$/i, (context) => {
  context.send("minfo - вывод информации беседы\nmp - изменения процента сообщений\nmclear - сброс данных беседы");
}); //легенда

bot.hear(/^minfo$/i, (context) => {
  context.send(fs.readFileSync(fileProcent(context.chatId), "utf8"));
}); //информация по беседе

bot.hear(/^mclear$/i, (context) => {
  fs.unlink(fileProcent(context.chatId), (err) => {
    if (err) {console.log("path/file.txt was deleted")}
  });
  fs.unlink(fileDict(context.chatId), (err) => {
    if (err) {console.log("path/file.txt was deleted")}
  });
  context.send("Очищено.");
}); //удаление файлов беседы

bot.hear(/^mp....|mp...$/i, (context) => {
  //изменение процента ответов
  let procent = fs.readFileSync(fileProcent(context.chatId), "utf8");
  let lastProcent = procent.slice(9, 12);
  procent = procent.replace(lastProcent, context.text.slice(3));
  fs.writeFileSync(fileProcent(context.chatId), procent);
  context.send("Процент изменен.");
}); //изменение процента

bot.hear (/^тест/i, async (context) => {
let [userData] = await vk.api.users.get({user_id: context.senderId}); //получение информации со странички получателя
let response = {
  peer_id: context.senderId, //id получателя (отправка в личные сообщения)
  message: 'Привет ' + userData.first_name} //отправка одного из ключей
try {await context.send (response);}
catch {}
  })

bot.hear(/./, async (context) => {
  //любое сообщение
  let time = performance.now();
  let Id = context.chatId; //Id чата
  await StatusFiles(Id); //проверка на существование файлов беседы
  let message = await speller(context.text.split(" "), Id); //авто-исправление слов через я.спеллер

  for (let word of message) {
    if (/[,.!?;:()]| \s /.test(word[word.length - 1])) {
      word = word.slice(0, -1);
    } //проверка на знаки препинания в конце слова

    if (/[,.!?;:()]/.test(word)) {continue} //пропуск одиночных знаков препинания

    word = Upperone(word.toLowerCase());
    Az.Morph.init(async function () {
      try {
        let part = Az.Morph(word)[0].tag; //морфологический разбор слова
      
        let object = parseJSON(fileDict(Id)); //обьект  - 1 -

        const existingWord = object.words.filter((obj) => obj.word === word); //проверка одинаковых слов
        if (existingWord.length > 0) {return}

        let property = {
          POST: part.POST, //часть речи
          word: word, //слово
          GNdr: part.GNdr, //род
          NMbr: part.NMbr, //ед. множ. число
          СAse: part.CAse, //падеж
        };

        object.words.push(property); //добавление данных - 2 -
        let json = JSON.stringify(object); //обратно в JSON
        fs.writeFileSync(fileDict(Id), json);
      } catch {}
    });
  }

  if (procent(Id) > getRandom(100)) {
    const genders = ["masc", "femn", "neut"];
    const numbers = ["plur", "sing"];

    let gender = genders[getRandom(3)];
    let message;
    let lengthMsg = getRandom(5) + 1; //количество слов в сообщении

    switch (getRandom(1)) {
      case 0:
        message = fileChoice(Id, gender, numbers[getRandom(2)]);
        for (let i = 0; i < lengthMsg; i++) {
          message = message + " " + fileChoice(Id);
        }
        message = Upperone(message.toLowerCase());
        context.send(message);
        break;
    }
  }
  time = performance.now() - time;
  console.log("Время выполнения: " + time.toFixed(3)); //сколько времени выполнялся запрос
});

bot.onFallback((context) => {
  switch (getRandom(3)) {
    case 0:
      context.send("АХАХАХАХА");
      break;

    case 1:
      vk.api.messages.send({
        peer_id: context.peerId,
        sticker_id: 163,
        random_id: 0,
      });
      break;
  }
}); // Обработчик, если команда не существует

console.log("Бот запущен!");
vk.updates.start().catch(console.error);
