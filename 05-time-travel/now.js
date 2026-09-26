import { tool } from './tool.js';

export const now = tool({
  name: 'now',
  description: 'Current local time',
  run() {
    return { result: new Date().toLocaleTimeString() };
  }
});
