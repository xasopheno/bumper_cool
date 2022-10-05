import test from 'ava'
import { replaceFields } from './replace'

test('replaceFields()', (t) => {
  const input = `
    tag: 'v0.9.0',
    revision => "OLDREV"
`
  const expected = `
    tag: 'v0.11.1',
    revision => "NEWREV"
`

  const replacements = new Map<string, string>()
  replacements.set('url', 'https://github.com/cli/cli.git')
  replacements.set('tag', 'v0.11.1')
  replacements.set('revision', 'NEWREV')

  t.is(replaceFields(input, replacements), expected)
})
