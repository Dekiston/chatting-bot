const {checkFiles} = require ('../check/checkFiles');
const {checkWords} = require ('../check/checkWords');
const fs = require ("fs");
const {vk} = require("./token.js");
const {generate} = require ("./generator.js");
const {getRandom, sourcePath, procentPath, upperone} = require ("./tools");




const help = (context) => {context.send("INFO - вывод информации беседы\nCENT - изменить процент ответов\nSIZE - изменить размер связей\nCOUNT - изменить длину сообщения\nCLEAR - сброс данных беседы");} //легенда)

const info = (context) => { 
    let answer = fs.readFileSync(procentPath(context.chatId), 'utf8');
    context.send(answer);
}

const cent = (context) => {}

const size = (context) => {}

const count = (context) => {}

const clear = (context) => {
    fs.unlink (sourcePath(context.chatId), (err) => {
        if(err) throw err;});

    fs.unlink (procentPath(context.chatId), (err) => {
        if(err) throw err;});
}

const anything = (context) => {
    let Id = context.chatId; //Id чата

    checkFiles (Id); //должно проверять наличие файлов беседы и создавать их

    checkWords (Id, context.text.split(" ")); //должно добавлять слова

    let answer = generate({
        wordsCount: getRandom (1, 30),
        sampleSize: 4,
        source: fs.readFileSync(sourcePath(Id)),
    });
  
  context.send (upperone(String (answer)));
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
    switch (getRandom(0,2)) {
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
exports.info = info;
exports.cent = cent;
exports.size = size;
exports.count = count;
exports.clear = clear;
exports.personal = personal;
exports.emptiness = emptiness;