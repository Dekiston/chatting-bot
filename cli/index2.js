
const fs = require ("fs");
const {generate} = require ("../src/noun/generator.js");
const {getRandom} = require ("../src/noun/tools.js");
const {VK} = require("vk-io");
const {checkFiles} = require ('../src/check/checkFiles');
const {checkWords} = require ('../src/check/checkWords');
const {HearManager} = require("@vk-io/hear");
const tokenLongPollAPI = fs.readFileSync("cli/token.txt"); //экспорт токена беседы
const vk = new VK({
  token: tokenLongPollAPI,
});
const bot = new HearManager();
vk.updates.on("message", bot.middleware);



bot.hear(/./, async (context) => {
  console.log('сообщение ' + context.text);
  let Id = context.chatId; //Id чата

  checkFiles (Id); //должно проверять наличие файлов беседы и создавать их

  checkWords (Id, context.text.split(" ")); //должно добавлять слова

  let answer = generate({
  wordsCount: getRandom (1, 30),
  sampleSize: 4,});

  context.send (answer);
});

vk.updates.start().catch(console.error);