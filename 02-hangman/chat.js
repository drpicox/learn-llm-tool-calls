const model = process.env.MODEL ?? 'gpt-oss:20b';

export async function ask(messages, { tools }) {
  const res = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    body: JSON.stringify({ model, messages, tools, stream: false })
  });

  const { message } = await res.json();
  return message;
}

export async function chat(messages, { tools, handlers }) {
  let message = await ask(messages, { tools });
  messages = [...messages, message];

  // The Agent Loop
  while (message.tool_calls) {
    messages = [...messages, ...message.tool_calls.map((call) => {
      const { name, arguments: args } = call.function;
      const result = handlers[name](args);
      trace(name, args, result);
      return { role: 'tool', tool_name: name, content: JSON.stringify(result) };
    })];
    message = await ask(messages, { tools });
    messages = [...messages, message];
  }

  return messages;
}

function trace(name, args, result) {
  console.error(`  ↳ ${name}(${JSON.stringify(args)}) -> ${JSON.stringify(result)}`);
}
