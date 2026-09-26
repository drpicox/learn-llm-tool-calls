import { z } from 'zod';

export function tool({ name, description, schema = z.object({}).strict(), run }) {
  return {
    name,
    definition: {
      type: 'function',
      function: { name, description, parameters: z.toJSONSchema(schema) }
    },
    run(args = {}) {
      const parsed = schema.safeParse(args);
      if (!parsed.success) {
        return { result: { error: 'invalid_input', message: parsed.error.issues[0].message } };
      }
      return run(parsed.data);
    }
  };
}
