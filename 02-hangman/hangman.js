const WORDS = ['candle', 'rocket', 'planet', 'silver', 'garden'];
const MAX_WRONG = 6;

let game = null;                    // the only place that isn't the context

export const definition = {
  type: 'function',
  function: {
    name: 'hangman',
    description: 'Hangman. Send a lowercase letter to guess it, or nothing to see the board.',
    parameters: {
      type: 'object',
      properties: {
        letter: { type: 'string', description: 'A single lowercase letter' }
      }
    }
  }
};

export function run({ letter } = {}) {
  game ??= { word: pick(), tried: [] };

  if (letter && !game.tried.includes(letter)) game.tried.push(letter);

  const result = board(game);
  if (result.status !== 'playing') game = null;
  return result;
}

function board(state) {
  const wrong = wrongCount(state);
  return {
    mask: mask(state),
    tried: state.tried,
    wrong,
    left: MAX_WRONG - wrong,
    status: statusOf(state)
  };
}

function statusOf(state) {
  if (isSolved(state)) return 'won';
  if (wrongCount(state) >= MAX_WRONG) return 'lost';
  return 'playing';
}

function mask({ word, tried }) {
  return [...word].map((c) => (tried.includes(c) ? c : '_')).join(' ');
}

function wrongCount({ word, tried }) {
  return tried.filter((c) => !word.includes(c)).length;
}

function isSolved({ word, tried }) {
  return [...word].every((c) => tried.includes(c));
}

function pick() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}
