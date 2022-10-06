import test from 'ava'
import { replaceFields } from './replace'

test('replaceFields()', (t) => {
  const input = `
    pkgname=weresocool
    pkgver=v0.9.0
    pkgrel=1
  `
  const expected = `
    pkgname=weresocool
    pkgver=v0.11.1
    pkgrel=1
  `

  const replacements = new Map<string, string>()
  replacements.set('pkgver=', 'v0.11.1')

  t.is(replaceFields(input, replacements), expected)
})
