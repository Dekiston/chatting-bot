const path = require ("path");
const fs = require ("fs");
const {generate} = require ("../src/generator.js");
const {getRandom, fileDict, fileProcent} = require ("../src/tools.js");
const {VK} = require("vk-io");
const {HearManager} = require("@vk-io/hear");
const Az = require("az");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const tokenLongPollAPI = fs.readFileSync("./token.txt"); //экспорт токена беседы
const vk = new VK({
  token: tokenLongPollAPI,
});
const bot = new HearManager();
vk.updates.on("message", bot.middleware);

const source = fs.readFileSync("cli/example.txt");

const StatusFiles = async (Id) => {
  fs.stat(fileProcent(Id), (err) => {
    if (err) { fs.writeFileSync(fileProcent(Id), "procent: 100\nwords: 0"); } //процент
  });

  fs.stat(fileDict(Id), (err) => {
    if (err) { fs.writeFileSync(fileDict(Id), ""); } //слова
  }); 
}; //создание файлов беседы


bot.hear(/./, async (context) => {
  console.log('сообщение');
context.send (generate({
  wordsCount: getRandom (1, 30),
  sampleSize: getRandom (5, 8),
  source,
}));

});

vk.updates.start().catch(console.error);