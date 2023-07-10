const { fileDict, fileProcent } = require("../core/tools.js");
const fs = require("fs");

const checkFiles = (Id) => {
  fs.stat("cli/" + fileDict(Id), (err) => {
    if (err) {
      fs.writeFileSync(
        "cli/" + fileDict(Id),
        "Привет, меня зовут Малютка, я бот. "
      );
    } //слова
  });
  
  fs.stat("cli/" + fileProcent(Id), (err) => {
    if (err) {
      fs.writeFileSync(
        "cli/" + fileProcent(Id),
        '{"procent":100,"verbs":30,"link":4}'
      );
    } //процент
  });

  
}; //создание файлов беседы
exports.checkFiles = checkFiles;
