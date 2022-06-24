const path = require ("path");
const fs = require ("fs");
const {generate} = require ("../src/noun/generator.js");
const {getRandom, fileDict, fileProcent} = require ("../src/noun/tools.js");
const {VK} = require("vk-io");
const {HearManager} = require("@vk-io/hear");
const Az = require("az");
const { constants } = require("buffer");
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
    if (err) { fs.writeFileSync(fileProcent(Id), "procent: 100"); } //процент
  });

  fs.stat(fileDict(Id), (err) => {
    if (err) { fs.writeFileSync(fileDict(Id), ""); } //слова
  }); 
}; //создание файлов беседы


bot.hear(/./, async (context) => {
  console.log('сообщение ' + context.text);

  //checkPoint (context.Id); //должно проверять наличие файлов беседы и создавать их
  //saveWords (context.Id, context.text); //должно добавлять слова

  let answer = generate({
  wordsCount: getRandom (1, 30),
  sampleSize: 4,
  source });

  context.send (answer);
});

vk.updates.start().catch(console.error);