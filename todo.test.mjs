import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

function makeFixture() {
  const home = mkdtempSync(join(tmpdir(), 'todo-test-'))
  const env = { ...process.env, HOME: home }
  return (command, ...args) =>
    execFileSync(process.execPath, [join(process.cwd(), 'todo.mjs'), command, ...args], {
      env,
      encoding: 'utf8',
    })
}

test('add and list roundtrip', () => {
  const run = makeFixture()
  run('add', 'first task')
  const out = run('list')
  assert.match(out, /#1 first task/)
  assert.match(out, /\[ \]/)
})

test('mark done', () => {
  const run = makeFixture()
  run('add', 'second task')
  run('done', '1')
  const out = run('list')
  assert.match(out, /\[x\] #1/)
})

test('remove', () => {
  const run = makeFixture()
  run('add', 'to remove')
  run('rm', '1')
  const out = run('list')
  assert.equal(out.trim(), 'no todos')
})

test('add requires text', () => {
  const run = makeFixture()
  assert.throws(() => run('add'), /usage: todo add <text>/)
})
