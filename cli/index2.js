const {info, cent, size, count, clear, help, anything, personal, emptiness} = require ("../src/noun/commands");
const {vk} = require("../src/noun/token.js");
const {HearManager} = require("@vk-io/hear");
const bot = new HearManager();
vk.updates.on("message", bot.middleware);


bot.hear(/HELP$/i, (context) => { help(context) }); //список команд
bot.hear(/INFO$/i, (context) => { info(context) }); //настройки беседы
bot.hear(/CENT$/i, (context) => { cent(context) });
bot.hear(/SIZE$/i, (context) => { size(context) });
bot.hear(/COUNT$/i, (context) => { count(context) });
bot.hear(/CLEAR$/i, (context) => { clear(context) }); //удаление
bot.hear(/^Лс/i, (context) => { personal(context) }); //ответ в личные
bot.hear(/./, (context) => { anything(context) }); //ответ на любое сообщение
bot.onFallback((context) => { emptiness(context) }); //пустое сообщение

vk.updates.start().catch(console.error);