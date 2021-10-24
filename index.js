const Az = require('az');
const { VK, MessageContext } = require('vk-io');
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

function split (Id) {let array = fs.readFileSync(file(Id), "utf8");
array = array.split('|');
array = array.join(' ');
return array.split(' '); }

function answer (Id) { 
    let array = fs.readFileSync(file(Id), "utf8");
    return array.split('|'); 
}; //чтение txt файла

function getRandom (max) {return Math.floor(Math.random() * max)};

function chance (Id) {return fs.readFileSync(fileChance(Id), "utf8");}

function Upperone (text) {return text.charAt(0).toUpperCase() + text.slice(1)}; //Изменение регистра первой буквы^

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


bot.hear (/./, msg => {  //msg.text сообщение пользователя Searchfile(msg.chatId)
    let Id = msg.chatId;
    
    StatFile(Id);
  
    if (chance(Id) > getRandom(100)) {

        switch(getRandom(12)) {
          
            case 1:
            console.log (0);
            msg.send (answer(Id)[getRandom(answer(Id).length)]);
              break;
          
            case 2:
            case 3: console.log (1);
            let message = split(Id)[getRandom(answer(Id).length)];
            let index = getRandom(150);
            while (message.length < index) { message = message + "  " + answer(Id)[getRandom(answer(Id).length)];}
            msg.send (Upperone(message.toLowerCase()));
              break;

            case 4: console.log (2);
            let message2 = (answer(Id)[getRandom(answer(Id).length)] + ' ' + answer(Id)[getRandom(answer(Id).length)]);
            msg.send (Upperone(message2.toLowerCase()));
              break;
            
            case 5:
            case 6: console.log (3);
            let message3 = (answer(Id)[getRandom(answer(Id).length)] + ' ' + split(Id)[getRandom(answer(Id).length)] + " " + answer(Id)[getRandom(answer(Id).length)]);
            msg.send (Upperone(message3.toLowerCase()));
              break;

            case 7:
            case 8:
            case 9:
            case 10: console.log (4);
            let message4 = split(Id)[getRandom(answer(Id).length)];
            let index4 = getRandom(25);
            while (message4.length < index4) { message4 = message4 + " " + split(Id)[getRandom(answer(Id).length)];}
            msg.send (Upperone(message4.toLowerCase()));
             break;
            
            case 11: console.log (5);
            let message5 = split(Id)[getRandom(answer(Id).length)] + "?";
            msg.send (Upperone(message5.toLowerCase()));
            break;

            case 12: console.log (6);
            if (getRandom(10) < 8) {
            vk.api.messages.send({peer_id: msg.peerId, sticker_id: 163, random_id: 0})} else {
            vk.api.messages.send({peer_id: msg.peerId, sticker_id: getRandom(200), random_id: 0})};
            break;         
              }; } 

    

    if (answer(Id).indexOf(Upperone(msg.text)) < 0) { fs.appendFileSync(file(Id), '|' + Upperone(msg.text)); } //запись сообщения в txt файл
    })

    bot.onFallback((context) => {context.send ("Ты что высрал, пес?")})// Обработчик, если команда не существует


console.log('Бот запущен!');
vk.updates.start().catch(console.error);
