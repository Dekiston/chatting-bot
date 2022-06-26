
 const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min; //рандомное значение в указынных границах

 const upperone = (text) => text.charAt(0).toUpperCase() + text.slice(1); //Изменение регистра первой буквы^

 const pickRandom = (list) => list[getRandom(0, list.length - 1)]; //возращение случайного элемента массива

 const range = (count) => Array.from(Array(count).keys());

 const fileDict = (Id) => {return ("dictionary" + Id + ".txt");} //название файла

 const fileProcent = (Id) => {return ("info" + Id + ".txt");} //название файла

 const sourcePath = (Id) => {return "cli/" + "dictionary" + Id + ".txt";} //путь к словарю

 const procentPath = (Id) => {return "cli/" + "info" + Id + ".txt";} //путь к настройкам

 exports.getRandom = getRandom;
 exports.upperone = upperone;
 exports.pickRandom = pickRandom;
 exports.range = range;
 exports.fileDict = fileDict;
 exports.fileProcent = fileProcent;
 exports.sourcePath = sourcePath;
 exports.procentPath = procentPath;

