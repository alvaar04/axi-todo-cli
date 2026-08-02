#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'

const FILE = join(homedir(), '.axi-todo', 'todos.json')

async function load() {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'))
  } catch {
    return []
  }
}

async function save(todos) {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(todos, null, 2))
}

function fail(msg) {
  console.error(msg)
  process.exit(1)
}

async function main() {
const [, , cmd, ...args] = process.argv

const todos = await load()

switch (cmd) {
  case 'add': {
    const text = args.join(' ')
    if (!text) fail('usage: todo add <text>')
    todos.push({ id: todos.length + 1, text, done: false })
    await save(todos)
    console.log(`added #${todos.length}: ${text}`)
    break
  }
  case 'list': {
    if (todos.length === 0) return console.log('no todos')
    for (const t of todos) {
      console.log(`${t.done ? '[x]' : '[ ]'} #${t.id} ${t.text}`)
    }
    break
  }
  case 'done': {
    const id = Number(args[0])
    const t = todos.find((x) => x.id === id)
    if (!t) fail(`no todo #${id}`)
    t.done = true
    await save(todos)
    console.log(`done #${id}`)
    break
  }
  case 'rm': {
    const id = Number(args[0])
    const i = todos.findIndex((x) => x.id === id)
    if (i === -1) fail(`no todo #${id}`)
    todos.splice(i, 1)
    await save(todos)
    console.log(`removed #${id}`)
    break
  }
  default:
    console.log(`usage: todo <add|list|done|rm> [args]`)
    console.log(`  todo add <text>   add a todo`)
    console.log(`  todo list         list todos`)
    console.log(`  todo done <id>    mark #id done`)
    console.log(`  todo rm <id>      remove #id`)
}
}

main()
