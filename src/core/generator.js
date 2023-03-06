const { tokenize, accuracy } = require("./parser.js");
const { range, pickRandom, upperone, getRandom } = require("./tools.js");
const fs = require("fs");
const translate = require('translate-google');
const escapeString = (token) => `_+${token}`;
const fromTokens = (tokens) => escapeString(tokens.join(""));

function sliceCorpus(corpus, sampleSize) {
  return corpus
    .map((_, index) => corpus.slice(index, index + sampleSize))
    .filter((group) => group.length === sampleSize);
}

function collectTransitions(samples) {
  return samples.reduce((transitions, sample) => {
    const lastIndex = sample.length - 1;
    const lastToken = sample[lastIndex];
    const restTokens = sample.slice(0, lastIndex);

    const state = fromTokens(restTokens);
    const next = lastToken;

    transitions[state] = transitions[state] ?? [];
    transitions[state].push(next);
    return transitions;
  }, {});
}

function createChain(startText, transitions) {
  const head = startText ?? pickRandom(Object.keys(transitions));
  return tokenize(head);
}

function predictNext(chain, transitions, sampleSize) {
  const lastState = fromTokens(chain.slice(-(sampleSize - 1)));
  const nextWords = transitions[lastState] ?? [];
  return pickRandom(nextWords);
}

function* generateChain(startText, transitions, sampleSize) {
  const chain = createChain(startText, transitions);

  while (true) {
    const state = predictNext(chain, transitions, sampleSize);
    yield state;

    if (state) chain.push(state);
    else chain.pop();
  }
}

 async function generate({ source, start = null, wordsCount, sampleSize } = {}) {
  if (sampleSize < 2) throw new Error("Размер должен быть не менее 2");

  const corpus = tokenize(String(source));
  const samples = sliceCorpus(corpus, sampleSize);
  const transitions = collectTransitions(samples);

  const generator = generateChain(start, transitions, sampleSize);
  const chain = range(wordsCount).map((_) => generator.next().value);

  let answer = upperone(accuracy(chain).trimEnd());

  console.log("3: " + answer);

  if (answer.length - answer.lastIndexOf(" ") - 1 < 4) {
    let endWord;
    do {
      endWord = corpus[getRandom(0, corpus.length - 1)];
    } while (endWord.length < 4);
    answer = answer + " " + endWord;
  }

  console.log("final: " + answer + "\n");

  let reverse;

  await translate(answer, {to: 'en'}).then( resEn => { reverse = resEn });
  await translate(reverse, {to: 'ru'}).then( resRu => { reverse = resRu });
  console.log ("reverse: " + reverse);

   answer = reverse.trimEnd() + ".";

  return await answer;
}

exports.generate = generate;
