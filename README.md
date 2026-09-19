# Tool calls, from the inside

Companion code for the series. Node 18+ already has `fetch`; the only
dependency is `zod`, from `03-validation` on (`npm install` inside the folder).

Each folder is self-contained on purpose: the agent loop is duplicated rather
than shared, so the diff between two folders is exactly what changed between
two articles.

Requires [Ollama](https://ollama.com) running locally with a model that
supports tool calls:

    ollama pull gpt-oss:20b

Override the model with `MODEL=... node index.js`.

## 01-now

From [*LLMs Never Call Tools*](https://drpicox.medium.com/llms-never-call-tools-5904ac72d686).
One tool, no state, one question.

    cd 01-now
    node index.js "how long until midnight?"

## 02-hangman

From [*An LLM Can't Keep a Secret*](https://drpicox.medium.com/an-llm-cant-keep-a-secret-a87216dcc461).
Adds a tool that has to keep a secret from the model. The word lives in a
module variable — the only place that isn't the context.

    cd 02-hangman
    node index.js

## 03-validation

From [*Validation Fixed Half of My Tool Call Errors*](https://drpicox.medium.com/validation-fixed-half-of-my-tool-call-errors-e0af7ce10d2d).
A `tool()` helper builds
each tool from a zod schema, validates the input and answers with an error
object when it is wrong. Hangman is split into three tools that do one thing
each: `hangman_new`, `hangman_guess` and `hangman_board`.

    cd 03-validation
    npm install
    node index.js

## 04-normalize

From [*Normalize, Don't Reject: Tool Calls the Human Way*](https://drpicox.medium.com/normalize-dont-reject-tool-calls-the-human-way-4e597b18479d).
Same three tools, but `hangman_guess` no longer rejects ` A ` for not being `a`: the schema only
asks for a string, the tool trims and lowercases it, and each check that the
validator used to do now answers with its own error and a hint on how to fix
it. Diff `hangman.js` against `03-validation` to see the whole change.

    cd 04-normalize
    npm install
    node index.js
