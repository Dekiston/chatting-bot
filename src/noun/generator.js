const { tokenize, textify } = require ("../noun/parser.js");
const {range, pickRandom, getRandom, upperone, fileDict, fileProcent} = require ("../noun/tools.js");
const fs = require ("fs");

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

function generate({
  source,
  start = null,
  wordsCount,
  sampleSize,
} = {}) {
  if (!source) throw new Error("Исходный текст пустой");
  if (sampleSize < 2) throw new Error("Размер должен быть не менее 2");

  const corpus = tokenize(String(source));
  const samples = sliceCorpus(corpus, sampleSize);
  const transitions = collectTransitions(samples);

  const generator = generateChain(start, transitions, sampleSize);
  const chain = range(wordsCount).map((_) => generator.next().value);

  return textify(chain);
}

exports.generate = generate;