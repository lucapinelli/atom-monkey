'use babel'
/* global describe, it, expect */

import { validateJson, formatJson } from '../lib/util/json'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('util/json', () => {
  describe('validateJson', () => {
    it('returns success = true if the json is valid', () => {
      expect(validateJson('{"ok": true}')).toEqual({ success: true })
    })

    it('returns success = false and an error message if the json is not valid', () => {
      const { success, error } = validateJson('{"ok", true}')
      expect(success).toBe(false)
      expect(error).toBeTruthy()
    })
  })

  describe('formatJson', () => {
    it('returns a success = true and the formatted json if the json is valid', () => {
      const { success, formatted } = formatJson('{"ok": true}')
      expect(success).toBe(true)
      expect(formatted).toEqual('{\n  "ok": true\n}')
    })

    it('returns success = false and an error message if the json is not valid', () => {
      const { success, error } = formatJson('{"ok", true}')
      expect(success).toBe(false)
      expect(error).toBeTruthy()
    })
  })
})
