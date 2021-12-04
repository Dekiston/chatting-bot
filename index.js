const { VK } = require("vk-io");
const { HearManager } = require("@vk-io/hear");
const Az = require("az");
const fs = require("fs");
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const yaspeller = require("yandex-speller");
const vk = new VK({
  token:
    "937a07a228fdf17ec8049f4943b5ffa0168147655c4dbc9fefc13d0c55527a71e82c6b71c33d52c251195",
});
const bot = new HearManager();
vk.updates.on("message", bot.middleware);

function fileDict(Id) {
  return "dictionary" + Id + ".JSON";
} //название файла
function fileProcent(Id) {
  return "info" + Id + ".txt";
} //название файла

async function StatusFiles(Id) {
  //создание файлов беседы
  fs.stat(fileProcent(Id), function (err) {
    if (err) {
      fs.writeFileSync(fileProcent(Id), "procent: 100\nwords: 0");
    }
  });
  fs.stat(fileDict(Id), function (err) {
    if (err) {
      fs.writeFileSync(fileDict(Id), '{ "words": [] }');
    }
  }); //слова
} //процент

function Upperone(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
} //Изменение регистра первой буквы^

function getRandom(max) {
  return Math.floor(Math.random() * max);
} //случайное число

function fileChoice(Id, Gender, Number) {
  let object = fs.readFileSync(fileDict(Id), "utf8");
  object = JSON.parse(object).words;
  let index = object.length - 1;
  let num = 0;
  let OneWord = object[getRandom(index)];
  while ((OneWord.GNdr != Gender || OneWord.NMbr != Number) && num < 10) {
    OneWord = object[getRandom(index)];
    num = num + 1;
  }
  console.log(OneWord);
  return OneWord.word;
} //чтение коллекции

function procent(Id) {
  let procent = [];
  procent.push(fs.readFileSync(fileProcent(Id), "utf8"));
  return procent[0].slice(8, 12);
} //чтение процента из файла



bot.hear(/^mhelp$/i, (context) => {
  context.send(
    "minfo - вывод информации беседы\n" + "mp - изменения процента сообщений\n"
  );
}); //легенда

bot.hear(/^minfo$/i, (context) => {
  //информация по беседе
  context.send(fs.readFileSync(fileProcent(context.chatId), "utf8"));
});

bot.hear(/^mclear$/i, (context) => {
  //очистка файлов
  context.send("Не очищено.");
});

bot.hear(/^mp....|mp...$/i, (context) => {
  //изменение процента ответов
  let procent = fs.readFileSync(fileProcent(context.chatId), "utf8");
  let lastProcent = procent.slice(9, 12);
  procent = procent.replace(lastProcent, context.text.slice(3));
  fs.writeFileSync(fileProcent(context.chatId), procent);
  context.send("Процент изменен.");
}); //изменение процента

bot.hear(/./, async (context) => {
  //любое сообщение
  let Id = context.chatId; //Id чата

  let message = context.text.split(" "); //деление сообщения на слова

  for (let word of message) {
    if (/[,.!?;:()]/.test(word[word.length - 1])) {
      word = word.slice(0, -1);
    } //проверка на знаки препинания в конце слова
    if (/[,.!?;:()]/.test(word)) {
      continue;
    } //пропуск одиночных знаков препинания
    word = Upperone(word.toLowerCase());
    console.log (word);
    
 
    console.log (word);

    Az.Morph.init(async function () {
      try {
        let part = Az.Morph(word)[0].tag; //морфологический разбор слова
        await StatusFiles(Id); //проверка на существование файлов беседы

        let object = fs.readFileSync(fileDict(Id));
        object = JSON.parse(object); //обьект  - 1 -

        const existingWord = object.words.filter((obj) => obj.word === word); //проверка одинаковых слов
        if (existingWord.length > 0) {
          return;
        }
        let property = {
          POST: part.POST,
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
    const Genders = ["masc", "femn", "neut"];
    const Numbers = ["plur", "sing"];

    let message;

    switch (getRandom(1)) {
      case 0:
        console.log(0);
        message = fileChoice(Id, Genders[getRandom(3)], Numbers[getRandom(2)]);
        for (let i = 0; i < getRandom(4) + 1; i++) {
          message = message + " " + fileChoice(Id, Genders[getRandom(3)]);
        }
        message = Upperone(message.toLowerCase());
        context.send(message);
        break;
    }
  }
});

bot.onFallback((context) => {
  switch (getRandom(5)) {
    case 0:
      console.log("2.0");
      context.send("АХАХАХАХА");
      break;

    case 1:
      console.log("2.1");
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

//NOUN	имя существительное	хомяк
//ADJF	имя прилагательное (полное)	хороший
//ADJS	имя прилагательное (краткое)	хорош
//COMP	компаратив	лучше, получше, выше
//VERB	глагол (личная форма)	говорю, говорит, говорил
//INFN	глагол (инфинитив)	говорить, сказать
//PRTF	причастие (полное)	прочитавший, прочитанная
//PRTS	причастие (краткое)	прочитана
//GRND	деепричастие	прочитав, рассказывая
//NUMR	числительное	три, пятьдесят
//ADVB	наречие	круто
//NPRO	местоимение-существительное	он
//PRED	предикатив	некогда
//PREP	предлог	в
//CONJ	союз	и
//PRCL	частица	бы, же, лишь
//INTJ  число
