export const definition = {
  type: 'function',
  function: {
    name: 'now',
    description: 'Current local time',
    parameters: { type: 'object', properties: {} }
  }
};

export function run() {
  return new Date().toLocaleTimeString();
}
