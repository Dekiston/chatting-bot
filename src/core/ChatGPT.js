const fs = require("fs");
let source = fs.readFileSync("cli/dictionary1.txt", "utf-8").split(' ');
const data = ["Если ветер затихнет, мы высадим цветы.", "Когда я открыл окно, комната наполнилась ароматом сирени.", "Он хочет, чтобы товарищи помогли ему.", "Когда женщины замолчали, охотник рассказ о своём необычном приключении."];

// разбиваем данные на отдельные слова
const words = data.reduce((acc, str) => acc.concat(str.split(" ")), []);

// создаем объект, где ключами являются комбинации слов, а значениями - их количество
const combinations = {};
for (let i = 0; i < words.length - 1; i++) {
  const key = words[i] + " " + words[i + 1];
  if (combinations[key]) {
    combinations[key]++;
  } else {
    combinations[key] = 1;
  }
}

// находим наиболее часто встречающуюся комбинацию
let popularCombination = "";
let popularity = 0;
for (const key in combinations) {
  if (combinations[key] > popularity) {
    popularCombination = key;
    popularity = combinations[key];
  }
}
console.log (popularCombination);

// составляем предложение на основе наиболее популярной комбинации
const sentence = data.map(str => {
  if (str.indexOf(popularCombination) !== -1) {
    return str; // если строка уже содержит комбинацию, оставляем ее без изменений
  } else {
    const index = str.indexOf(words[0]); // иначе, ищем первое вхождение первого слова
    return str.substring(0, index + words[0].length) + " " + popularCombination + " " +
      str.substring(index + words[0].length);
  }
}).join(" ");

console.log(sentence); // "hello world is big data is the future"
