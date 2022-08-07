const {variables, clear, help, anything, personal, emptiness} = require ("../src/core/commands");
const {vk} = require("../src/core/token.js");
const {HearManager} = require("@vk-io/hear");
const bot = new HearManager();
vk.updates.on("message", bot.middleware);


bot.hear(/^HELP$/i, (context) => { help(context) }); //список команд
bot.hear(/^INFO$/i, (context) => { variables(context, 0) }); //настройки беседы
bot.hear(/^CENT.{2,4}$/i, (context) => { variables(context, 1) }); //изменение процента ответов
bot.hear(/^SIZE.{2,4}$/i, (context) => { variables(context, 2) }); //изменение размера 
bot.hear(/^LINK.{2,4}$/i, (context) => { variables(context, 3) }); //изменение свявзи между словами
bot.hear(/^CLEAR$/i, (context) => { clear(context) }); //удаление всех данных беседы
bot.hear(/^Лс/i, (context) => { personal(context) }); //ответ в личные сообщения
bot.hear(/./, (context) => { anything(context) }); //ответ на любое сообщение
bot.onFallback((context) => { emptiness(context) }); //пустое сообщение

vk.updates.start().catch(console.error);

//let time = performance.now();
//time = performance.now() - time;
//console.log("Время выполнения: " + time.toFixed(3)); //сколько времени выполнялся запрос