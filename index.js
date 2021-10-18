const { VK } = require('vk-io');
const  { HearManager } = require('@vk-io/hear');
const fs = require("fs");
const vk = new VK({ token: '0f181d9eefc80b8695f008aef4a5cde8fac5e29667d051cfcec62e0c5fb21d2c04cc1ea01ab91c38cecc5'});
const bot = new HearManager(); 
vk.updates.on('message', bot.middleware);

function file (Id) {return ("dictionary" + Id +".txt");}
function fileChance(Id) {return ("chance" + Id + ".txt");}

function StatFile (Id) {
    fs.stat(file(Id), function(err) { if (err) { fs.writeFileSync(file(Id), "Привет");}});
        fs.stat(fileChance(Id), function(err) { if (err) { fs.writeFileSync(fileChance(Id), "50");}});
}

function answer (Id) { 
    let array = fs.readFileSync(file(Id), "utf8");
    return array.split('|'); 
}; //чтение txt файла

function getRandom (max) {return Math.floor(Math.random() * max)};

function chance (Id) {return fs.readFileSync(fileChance(Id), "utf8");}

function Upperone (text) {return text.charAt(0).toUpperCase() + text.slice(1)}; //Изменение регистра первой буквы^

bot.hear (/^minfo$/, msg => {
    msg.send ('Шанс сообщения: ' + chance(msg.chatId) + '%\n'
    + 'Строк: ' + answer(msg.chatId).length + '/' + 'Бесконечно?');
});

bot.hear (/^mc....|mc...$/, msg => {
    fs.writeFileSync(fileChance(msg.chatId), msg.text.slice(3));
    msg.send ('Процент изменен.');
}); //изменение процента

bot.hear (/./, msg => {  //msg.text сообщение пользователя Searchfile(msg.chatId)
    let Id = msg.chatId;
    
    StatFile(Id);
    if (chance(Id) > getRandom(100)) {msg.send(answer(Id)[getRandom(answer(Id).length)])};
    if (answer(Id).indexOf(Upperone(msg.text)) < 0) { fs.appendFileSync(file(Id), '|' + Upperone(msg.text)); } //запись сообщения в txt файл
    });


console.log('Бот запущен!');
vk.updates.start().catch(console.error);
