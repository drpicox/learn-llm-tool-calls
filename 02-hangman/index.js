import * as readline from 'node:readline/promises';
import * as now from './now.js';
import * as hangman from './hangman.js';
import { chat } from './chat.js';

const tools = [now.definition, hangman.definition];
const handlers = { now: now.run, hangman: hangman.run };

let context = [{
  role: 'system',
  content: 'You are a brief assistant. You have tools available: use them when they are needed.'
}];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("Try: let's play hangman, guess a letter for me. (empty line to quit)\n");

for (;;) {
  const line = await rl.question('> ');
  if (!line.trim()) break;

  context = await chat([...context, { role: 'user', content: line }], { tools, handlers });
  console.log(context.at(-1).content, '\n');
}

rl.close();
