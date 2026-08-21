import * as now from './now.js';
import { chat } from './chat.js';

const tools = [now.definition];
const handlers = { now: now.run };

const system = 'You are a brief assistant. You have tools available: use them when they are needed.';
const question = process.argv.slice(2).join(' ') || 'What time is it?';

const history = await chat([
  { role: 'system', content: system },
  { role: 'user', content: question }
], { tools, handlers });

console.log(history.at(-1).content);
