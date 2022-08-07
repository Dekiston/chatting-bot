
const newLinePlaceHolder = "§";

const firstSymbol = /[^\d\sА-Я]/gi //если вдруг предложение начинается со знака

const paragraph = "\n\n";

const punctuation = `[](){}!?.,:;'"\/*&^%$_+-–—=<>@|~`.split("").join("\\");

const ellipsis = "\\.{3}";

const words = "[a-zA-Zа-яА-ЯёЁ]+";

const compounds = `${words}-${words}`;

const newlinesRegex = /\n\s*/g;

const tokenizeRegex = new RegExp(
  `(${ellipsis}|${compounds}|${words}|[${punctuation}])`
);

function exists(entity) {
  return !!entity;
}

function tokenize(text) {
  return text
    .replace(newlinesRegex, newLinePlaceHolder)
    .split(tokenizeRegex)
    .filter(exists);
}

function accuracy(tokens) {
  return tokens
    .filter(exists)
    .join("")
    .replace(newLinePlaceHolder, paragraph)
    .replace(firstSymbol, "");
}

exports.tokenize = tokenize;
exports.accuracy = accuracy;
