const {checkFiles} = require ('../check/checkFiles');
const {checkWords} = require ('../check/checkWords');
const fs = require ("fs");
const {vk} = require("./token.js");
const {generate} = require ("./generator.js");
const {getRandom, sourcePath, procentPath, upperone, valueParser} = require ("./tools");

const jsonParse = (Id) => {
  let file = fs.readFileSync (procentPath(Id), 'utf8'); //получене файлf с информацией о беседе
  return JSON.parse(file); //преобразуем json файл в обьект
}

const help = (context) => {context.send("INFO - вывод информации беседы\nCENT - изменить процент ответов\nSIZE - изменить размер связей\nLINK - изменить длину сообщения\nCLEAR - сброс данных беседы");} //легенда)

const variables = (context, value) => {
  let json = jsonParse (context.chatId);
  let newValue = Number(valueParser (context.text));

  switch (value) { //выбор действий в зависимости от команды
    case 0:
      context.send ('Процент ответов: ' + json.procent + '\nМаксимум слов: ' + json.verbs + '\nДлина связи: ' + json.link);
    break;

    case 1:
      json.procent = newValue;
      context.send ('Процент изменен');
    break;

    case 2:
      json.verbs = newValue;
      context.send ('Количество слов изменено');
    break;

    case 3:
      json.link = newValue;
      context.send ('Длина связи изменена');
    break;
  }

  fs.writeFile(procentPath(context.chatId), JSON.stringify (json), (err) => {}); //обратная запись
}

const clear = (context) => {
    fs.unlink (sourcePath(context.chatId), (err) => {
        if(err) throw err;});

    fs.unlink (procentPath(context.chatId), (err) => {
        if(err) throw err;});
}

const anything = (context) => {
    let Id = context.chatId; //Id чата
    let procent = jsonParse(context.chatId).procent;

    checkFiles (Id); //должно проверять наличие файлов беседы и создавать их

    checkWords (Id, context.text.split(" ")); //должно добавлять слова

    let answer = generate({
        wordsCount: getRandom (2, 30),
        sampleSize: 3,
        source: fs.readFileSync(sourcePath(Id)),
    });
    
    if (getRandom(1,99) < procent) {
      context.send (upperone(String (answer)));
    }
}

const personal = async (context) => {
    let [userData] = await vk.api.users.get({user_id: context.senderId}); //получение информации со странички получателя
  let response = {
    peer_id: context.senderId, //id получателя (отправка в личные сообщения)
    message: 'Привет ' + userData.first_name} //отправка одного из ключей
  try {await context.send (response);}
  catch {}
}

const emptiness = (context) => {
    switch (getRandom(0,5)) {
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
}

exports.anything = anything;
exports.help = help;
exports.variables = variables;
exports.clear = clear;
exports.personal = personal;
exports.emptiness = emptiness;