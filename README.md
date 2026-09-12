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

The loop from *A Tool Call Is Just Text and a Loop You Own*. One tool, no
state, one question.

    cd 01-now
    node index.js "how long until midnight?"

## 02-hangman

Adds a tool that has to keep a secret from the model. The word lives in a
module variable — the only place that isn't the context.

    cd 02-hangman
    node index.js

## 03-validation

From *Validation Fixed Half of My Tool Call Errors*. A `tool()` helper builds
each tool from a zod schema, validates the input and answers with an error
object when it is wrong. Hangman is split into three tools that do one thing
each: `hangman_new`, `hangman_guess` and `hangman_board`.

    cd 03-validation
    npm install
    node index.js
