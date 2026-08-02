# axi-todo-cli

A minimal todo CLI in Node.js. No dependencies, plain JSON storage in `~/.axi-todo/todos.json`.

## Usage

```sh
node todo.mjs add "write readme" # defaults to medium priority
node todo.mjs add -p high "fix production issue"
node todo.mjs list
node todo.mjs done 1
node todo.mjs rm 1
```

`add -p` accepts `low`, `medium`, or `high`; tasks without `-p` use `medium`.
`list` shows each task's priority in brackets. Existing tasks saved before
priorities were introduced are shown as `medium`.

## Why

Sandbox repo to test the AXI toolchain: `gh-axi` (GitHub ops), `lavish-axi` (HTML artifact review), `no-mistakes` (quality-gated pushes).
