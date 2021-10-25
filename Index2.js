const { VK, MessageContext } = require('vk-io');
const  { HearManager } = require('@vk-io/hear');
const Az = require('az');
const fs = require("fs");
const vk = new VK({ token: '0f181d9eefc80b8695f008aef4a5cde8fac5e29667d051cfcec62e0c5fb21d2c04cc1ea01ab91c38cecc5'});
const bot = new HearManager(); 
vk.updates.on('message', bot.middleware);

function fileDict(Id, part = "") {return ("dictionary" + part + Id + ".JSON");} //название файла
function fileProcent(Id) {return ("procent" + Id + ".txt");}  //название файла процента

async function StatusFiles (Id, part) { //создание файлов беседы
  fs.stat( fileDict(Id,part),  function(err) { if (err) { fs.writeFileSync(fileDict(Id, part), '{ "words": [] }');}}); //слова
    fs.stat(fileProcent(Id), function(err) { if (err) { fs.writeFile(fileProcent(Id), "50");}});} //процент

function Upperone (text) {return text.charAt(0).toUpperCase() + text.slice(1)}; //Изменение регистра первой буквы^

function getRandom (max) {return Math.floor(Math.random() * max)}; //случайное число

function procent (Id) {return fs.readFileSync(fileProcent(Id), "utf8");} //чтение процента из файла

bot.hear (/^mhelp$/, context => {context.send ("minfo - вывод информации беседы\n" + "mc - изменения процента сообщений\n" + "mclear - сброс данных");});   //легенда

bot.hear (/^minfo$/, context => { //информация по беседе
    context.send ('Процент сообщений: ' + procent(context.chatId) + '%\n'
    + 'Строк: ' + answer(context.chatId).length + '/' + 'Бесконечно?\n'
    + 'Версия Малютки 0.9');
});

bot.hear (/^mclear$/, context => { //очистка файлов
    fs.writeFileSync(file(context.chatId), " ");
    context.send ("Словарь очищен"); });

bot.hear (/^mc....|mc...$/, context => { //изменение процента ответов
    fs.writeFileSync(fileProcent(context.chatId), context.text.slice(3));
    context.send ('Процент изменен.');
}); //изменение процента

bot.hear (/./, context => {  //любое сообщение
    let Id = context.chatId; //Id чата
    
    

    let message = context.text.split(" "); //деление сообщения на слова

    for (let word of message) {

        if (/[,.!?;:()]/.test(word[word.length-1])) {word = word.slice(0,-1);} //проверка на знаки препинания в конце слова
        if (/[,.!?;:()]/.test(word)) {continue;} //пропуск одиночных знаков препинания

        Az.Morph.init(async function() {let part = Az.Morph(word)[0].tag; //морфологический разбор слова
            
            await StatusFiles(Id, part.POST);

            let object = fs.readFileSync(fileDict(Id, part.POST));
                object = JSON.parse(object); //обьект  - 1 -

                const existingWord = object.words.filter((obj) => obj.word === word); //проверка одинаковых слов
                if (existingWord.length > 0) { return; } 

            let property = {
                word: word, //слово
                GNdr: part.GNdr, //род
                NMbr: part.NMbr //ед. множ. число
            }
            
                object.words.push(property); //добавление данных - 2 -
            let json = JSON.stringify(object); //обратно в JSON
                fs.writeFileSync(fileDict(Id, part.POST), json); 
        });
    }

    if (procent(Id) > getRandom(100)) { context.send("1");}


})


console.log('Бот запущен!');
vk.updates.start().catch(console.error);