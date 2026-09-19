import { z } from 'zod';
import { tool } from './tool.js';

const WORDS = ['candle', 'rocket', 'planet', 'silver', 'garden'];
const MAX_WRONG = 6;

let game = null;                    // the only place that isn't the context

const NoArgs = z.object({}).strict();

export const newGame = tool({
  name: 'hangman_new',
  description: 'Start a new hangman game. Discards any game in progress.',
  schema: NoArgs,
  run() {
    game = { word: pick(), tried: [] };
    return board(game);
  }
});

export const guess = tool({
  name: 'hangman_guess',
  description: 'Guess a letter in the current hangman game.',
  schema: z.object({ letter: z.string() }).strict(),
  run({ letter: raw }) {
    // Normalize first: accept whatever the model prefers, then check the content
    const letter = normalize(raw);

    if (letter.length === 0) {
      return { error: 'empty_letter', message: 'No letter provided.' };
    }
    if (letter.length > 1) {
      return { error: 'not_single_letter', message: `Expected a single letter, got '${raw}'.` };
    }
    if (!/^[a-z]$/.test(letter)) {
      return { error: 'not_a_letter', message: `'${raw}' is not a letter a-z.` };
    }

    if (!game) {
      return { error: 'no_game', message: 'No game in progress. Call hangman_new to start one.' };
    }
    if (game.tried.includes(letter)) {
      return { error: 'already_tried', message: `'${letter}' was already guessed.`, ...board(game) };
    }
    game.tried.push(letter);
    return board(game);
  }
});

export const showBoard = tool({
  name: 'hangman_board',
  description: 'Show the current hangman board without guessing.',
  schema: NoArgs,
  run() {
    if (!game) {
      return { error: 'no_game', message: 'No game in progress. Call hangman_new to start one.' };
    }
    return board(game);
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

// Strip spaces and case. Outside English, also strip accents and local
// letters: .normalize('NFD').replace(/\p{M}/gu, '').replace(/ç/g, 'c')
function normalize(raw) {
  return raw.trim().toLowerCase();
}

function pick() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}
