
const {fileDict, fileProcent} = require ("../noun/tools.js");
const fs = require ("fs");

const checkFiles = async (Id) => {
    fs.stat('cli/' + fileProcent(Id), (err) => {
      if (err) { fs.writeFileSync( 'cli/' + fileProcent(Id), 'Процент: 100\nСлов: 30\nСвязь: 4'); } //процент
    });
  
    fs.stat('cli/' + fileDict(Id), (err) => {
      if (err) { fs.writeFileSync( 'cli/' + fileDict(Id), 'Привет, меня зовут Малютка, я бот. '); } //слова
    });
  }; //создание файлов беседы
  exports.checkFiles = checkFiles;