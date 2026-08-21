# Tool calls, from the inside

Companion code for the series. No dependencies — Node 18+ already has `fetch`.

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
