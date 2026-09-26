import { z } from 'zod';
import { tool } from './tool.js';

const WORDS = ['candle', 'rocket', 'planet', 'silver', 'garden'];
const MAX_WRONG = 6;

let game = null;                    // the only place that isn't the context

const NoArgs = z.object({}).strict();
const NO_GAME = { error: 'no_game', message: 'No game in progress. Call hangman_new to start one.' };

// Every tool answers with an envelope: { result, rewrite? }. The result goes
// to the model; the rewrite, if any, is applied by the agent loop to the call
// that is already in the context.

export const newGame = tool({
  name: 'hangman_new',
  description: 'Start a new hangman game. Discards any game in progress.',
  schema: NoArgs,
  run() {
    game = { word: pick(), tried: [] };
    return { result: board(game) };
  }
});

export const guess = tool({
  name: 'hangman_guess',
  description: 'Guess a letter in the current hangman game.',
  schema: z.object({ letter: z.string() }).strict(),
  run({ letter: raw }) {
    const letter = normalize(raw);
    // If we had to fix it, rewrite history: the call will say what it should have said
    const rewrite = letter === raw ? undefined : { arguments: { letter } };

    if (!/^[a-z]$/.test(letter)) {
      return { result: { error: 'invalid_letter', message: `Expected a single letter a-z, got '${raw}'.` } };
    }

    if (!game) {
      return { result: NO_GAME };
    }
    const status = statusOf(game);
    if (status !== 'playing') {
      return {
        result: { error: 'game_over', message: `Game already ${status}. Call hangman_new to start another.`, ...board(game) }
      };
    }
    if (game.tried.includes(letter)) {
      return { result: { error: 'already_tried', message: `'${letter}' was already guessed.`, ...board(game) }, rewrite };
    }
    game.tried.push(letter);
    return { result: board(game), rewrite };
  }
});

export const showBoard = tool({
  name: 'hangman_board',
  description: 'Show the current hangman board without guessing.',
  schema: NoArgs,
  run() {
    if (!game) {
      return { result: NO_GAME };
    }
    return { result: board(game) };
  }
});

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

// Strip spaces, case and accents: ' É ' becomes 'e'
function normalize(raw) {
  return raw.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

function pick() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}
