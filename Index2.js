const { VK, MessageContext } = require('vk-io');
const  { HearManager } = require('@vk-io/hear');
const Az = require('az');
const fs = require("fs");
const { pathToFileURL } = require('url');
const vk = new VK({ token: '0f181d9eefc80b8695f008aef4a5cde8fac5e29667d051cfcec62e0c5fb21d2c04cc1ea01ab91c38cecc5'});
const bot = new HearManager(); 
vk.updates.on('message', bot.middleware);

function fileDict(Id, part = "") {return ("dictionary" + part + Id +".txt");}
function fileChance(Id) {return ("chance" + Id + ".txt");}

function StatusFiles (Id) {
  fs.stat(fileDict(Id), function(err) { if (err) { 
        fs.writeFileSync(fileDict(Id), ""); //общая
        fs.writeFileSync(fileDict(Id, "NOUN"), ""); //существительные
        fs.writeFileSync(fileDict(Id, "VERB"), ""); //глаголы
        fs.writeFileSync(fileDict(Id, "ADJF"), ""); //прилагательные (полные)
        fs.writeFileSync(fileDict(Id, "ADJS"), ""); //прилагательные
        fs.writeFileSync(fileDict(Id, "PREP"), ""); //предлог
        fs.writeFileSync(fileDict(Id, "INTJ"), ""); //междометия
        fs.writeFileSync(fileDict(Id, "PRCL"), ""); //частицы
        fs.writeFileSync(fileDict(Id, "INFN"), ""); //инфинитив
        fs.writeFileSync(fileDict(Id, "LATN"), ""); //английский
        fs.writeFileSync(fileDict(Id, "PRTF"), ""); //причастие (полное)
        fs.writeFileSync(fileDict(Id, "PRTS"), ""); //причастие (краткое)
        fs.writeFileSync(fileDict(Id, "ADVB"), ""); //наречие
        fs.writeFileSync(fileDict(Id, "GRND"), ""); //деепричастие
        fs.writeFileSync(fileDict(Id, "NUMB"), ""); //числа
        fs.writeFileSync(fileDict(Id, "CONJ"), ""); //союз
        fs.writeFileSync(fileDict(Id, "LATN"), ""); //английский
    }});
    fs.stat(fileChance(Id), function(err) { if (err) { fs.writeFileSync(fileChance(Id), "50");}});}

function split (message) {return message.split(' ');} //деление

function Upperone (text) {return text.charAt(0).toUpperCase() + text.slice(1)}; //Изменение регистра первой буквы^

function getRandom (max) {return Math.floor(Math.random() * max)}; //случайное число

function chance (Id) {return fs.readFileSync(fileChance(Id), "utf8");}

bot.hear (/^mhelp$/, msg => {msg.send ("minfo - вывод информации беседы\n" + "mc - изменения процента сообщений");});

bot.hear (/^minfo$/, msg => {
    msg.send ('Процент сообщений: ' + chance(msg.chatId) + '%\n'
    + 'Строк: ' + answer(msg.chatId).length + '/' + 'Бесконечно?');
});

bot.hear (/^mclear$/, msg => {
    fs.writeFileSync(file(msg.chatId), "Привет");
    msg.send ("Словарь очищен"); });

bot.hear (/^mc....|mc...$/, msg => {
    fs.writeFileSync(fileChance(msg.chatId), msg.text.slice(3));
    msg.send ('Процент изменен.');
}); //изменение процента

bot.hear (/./, context => {  //msg.text сообщение пользователя Searchfile(msg.chatId)
    let Id = context.chatId;
    
    StatusFiles(Id);

    let message = split(context.text);

    for (let word of message) {

        Az.Morph.init(function() {let part = Az.Morph(word)[0].tag;
            part.POST;
            part.GNdr;
        
        
        });
        


    }







    if (chance(Id) > getRandom(100)) {

    }


})


console.log('Бот запущен!');
vk.updates.start().catch(console.error);