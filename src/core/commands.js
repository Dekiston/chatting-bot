const { checkFiles } = require("../check/checkFiles");
const { checkWords } = require("../check/checkWords");
const fs = require("fs");
const { vk } = require("./token.js");

const { generate } = require("./generator.js");
const {
  getRandom,
  sourcePath,
  procentPath,
  upperone,
  valueParser,
} = require("./tools");

const jsonParse = (Id) => {
  let file = fs.readFileSync(procentPath(Id), "utf8"); //получене файлf с информацией о беседе
  return JSON.parse(file); //преобразуем json файл в обьект
};

const help = (context) => {
  context.send(
    "INFO - вывод информации беседы\nCENT - изменить процент ответов\nSIZE - изменить размер связей\nLINK - изменить длину сообщения\nCLEAR - сброс данных беседы"
  );
}; //легенда)

const variables = (context, value) => {
  //одна функция на все изменения настроек беседы, вызывается несколькими командами
  let json = jsonParse(context.chatId); //получение данных из json файла беседы
  let newValue = Number(valueParser(context.text)); //получение нового значения из команды

  switch (
    value //выбор действий в зависимости от команды
  ) {
    case 0:
      context.send(
        "Процент ответов: " + //функция работает с помощью ключа который передается с вызовом команды в index.js
          json.procent + //при выделении числа из команды идет сравнение с кейсом switch
          "\nМаксимум слов: " +
          json.verbs +
          "\nДлина связи: " +
          json.link
      );
      break;

    case 1:
      json.procent = newValue;
      context.send("Процент изменен");
      break;

    case 2:
      json.verbs = newValue;
      context.send("Количество слов изменено");
      break;

    case 3:
      json.link = newValue;
      context.send("Длина связи изменена");
      break;
  }

  fs.writeFile(procentPath(context.chatId), JSON.stringify(json), (err) => {}); //обратная запись
};

  const clear = async (context) =>  {
  fs.unlink(sourcePath(context.chatId), (err) => {
    //удаление файла со словами
    if (err) throw err;
  });

  fs.unlink(procentPath(context.chatId), (err) => {
    //удаление файла с настройками беседы
    if (err) throw err;
  });
};

  const anything = (context) =>  {
  let Id = context.chatId; //Id чата

  checkFiles(Id); //должно проверять наличие файлов беседы и создавать их
  checkWords(Id, context.text.split(" ")); //должно добавлять слова

  let procent = jsonParse(context.chatId).procent;
  let verbs = jsonParse(context.chatId).verbs; //получаем значения по которым будем строить предложение
  let link = jsonParse(context.chatId).link; //учитывая настройки каждой бееды в json файле

  let answer =  generate({
    //создание ответа с учетом настроек каждой беседы
    wordsCount: getRandom(2, verbs),
    sampleSize: link,
    source: fs.readFileSync(sourcePath(Id)),
  });

  console.log (answer);

  if (getRandom(1, 99) < procent) {
    //отправка ответа происходит только если процент ответов больше рандомного числа
    context.send(upperone(answer)); //ненастоящие проценты, но работает достаточно точно
  }
};

const personal = async (context) => {
  //отправка сообщения в личные сообщения
  let [userData] = await vk.api.users.get({ user_id: context.senderId }); //получение информации со странички получателя
  let response = {
    peer_id: context.senderId, //id получателя
    message: "Привет " + userData.first_name, //содержание сообщения
  }; //отправка одного из ключей
  try {
    await context.send(response);
  } catch {} //если вдруг отправка сообщений запрещена
};

const emptiness = (context) => {
  //отправка сообщения если пользователь прислал не текст (фото видео аудио)
  switch (getRandom(0, 5)) {
    case 0:
      context.send("АХАХАХАХА");
      break;

    case 1:
      vk.api.messages.send({
        //вызов стикера вк
        peer_id: context.peerId,
        sticker_id: 163, //id стикера можно найти в документации вк
        random_id: 0,
      });
      break;
  }
};

exports.anything = anything;
exports.help = help;
exports.variables = variables;
exports.clear = clear;
exports.personal = personal;
exports.emptiness = emptiness;
