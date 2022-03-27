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
      {
        const json =
        `{
          "project": {
            "name": "atom-monkey",
            "description": "If the monkey can do it, you don't have to :P"
          }
          "ok": false
        }`
        const { success, error, rowPosition, focusBox } = formatJson(json)
        expect(success).toBe(false)
        expect(error).toEqual('Unexpected string in JSON at position 157')
        expect(rowPosition).toBeTruthy()
        expect(rowPosition.row).toEqual(6)
        expect(rowPosition.index).toEqual(10)
        expect(focusBox).toEqual([
          '            "description": "If the monkey can do i…',
          '          }                                        ',
          '          "ok": false                              ',
          '----------^----------------------------------------',
          '        }                                          '
        ].map(line => line.trimEnd()).join('\n'))
      }

      {
        const json = `
        {
          "project": {
            "name": "atom-monkey",
            "description": "If the monkey can do it, "you" don't have to :P",
          },
          "ok": false
        }`
        const { success, error, rowPosition, focusBox } = formatJson(json)
        expect(success).toBe(false)
        expect(error).toEqual('Unexpected token y in JSON at position 123')
        expect(rowPosition).toBeTruthy()
        expect(rowPosition.row).toEqual(5)
        expect(rowPosition.index).toEqual(54)
        expect(focusBox).toEqual([
          '…ect": {                                                       ',
          '…me": "atom-monkey",                                           ',
          '…scription": "If the monkey can do it, "you" don\'t have to :P",',
          '----------------------------------------^----------------------',
          '…                                                              ',
          '… false                                                        '
        ].map(line => line.trimEnd()).join('\n'))
      }

      {
        const json = `
        {
          "project": {
            "name": "atom-monkey",
            "description": "If the monkey can do it, you don't have to :P\\n\\nThe plugin will add the following functionalities ... bla bla bla ...",
            "tags": ["atom", "plugin", "uuid", "date", "iso" "json", "validate", "format"]
          },
          "ok": false
        }`
        const { success, error, rowPosition, focusBox } = formatJson(json)
        expect(success).toBe(false)
        expect(error).toEqual('Unexpected string in JSON at position 279')
        expect(rowPosition).toBeTruthy()
        expect(rowPosition.row).toEqual(6)
        expect(rowPosition.index).toEqual(61)
        expect(focusBox).toEqual([
          '…tom-monkey",                                                                    ',
          '…on": "If the monkey can do it, you don\'t have to :P\\n\\nThe plugin will add the …',
          '…atom", "plugin", "uuid", "date", "iso" "json", "validate", "format"]            ',
          '----------------------------------------^----------------------------------------',
          '…                                                                                ',
          '…                                                                                '
        ].map(line => line.trimEnd()).join('\n'))
      }

      {
        const json = `
        {
          "project": {
            "name": "atom-monkey",
            "description": "If the monkey can do it, you don't have to :P\n\nThe plugin will add the following functionalities ... bla bla bla ...",
            "tags": ["atom", "plugin", "uuid", "date", "iso", "json", "validate", "format"]
          },
          "ok": false
        }`
        console.log('json\n' + json)
        const { success, error, rowPosition, focusBox } = formatJson(json)
        expect(success).toBe(false)
        expect(error).toEqual('Unexpected token \n in JSON at position 142')
        expect(rowPosition).toBeTruthy()
        expect(rowPosition.row).toEqual(6)
        expect(rowPosition.index).toEqual(-1) // this is not so good but the error is in the empty line :(
        console.log('focusBox\n' + focusBox)

        expect(focusBox).toEqual([
          '            "name": "atom-monkey",',
          '            "description": "If the monk…',
          '',
          '^---------------------------------------',
          'The plugin will add the following funct…',
          '            "tags": ["atom", "plugin", …'
        ].join('\n'))
      }
    })
  })
})
