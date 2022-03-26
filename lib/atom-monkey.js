'use babel'
/* global atom */

import { v4 as uuid } from 'uuid'
import { CompositeDisposable } from 'atom'

import { validateJson, formatJson } from './util/json'

export default {

  atomMonkeyView: null,
  modalPanel: null,
  subscriptions: null,

  activate (/* state */) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-monkey:toggle': () => this.toggle(),
      'atom-monkey:format_json': () => this.formatJson(),
      'atom-monkey:insert_date_iso': () => this.insertDateIso(),
      'atom-monkey:insert_uuid': () => this.insertUuid(),
      'atom-monkey:validate_json': () => this.validateJson()
    }))
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  formatJson () {
    const editor = atom.workspace.getActiveTextEditor()
    if (!editor) {
      atom.notifications.addWarning('atom-monkey:format_json :: no editor selected')
      return
    }
    const selection = editor.getSelectedText()
    const { success, formatted, error } = formatJson(selection || editor.getText())
    if (success) {
      if (selection) {
        editor.insertText(formatted)
      } else {
        editor.setText(formatted)
      }
    } else {
      atom.notifications.addError(`invalid JSON: ${error}`)
    }
  },

  insertDateIso () {
    const editor = atom.workspace.getActiveTextEditor()
    if (!editor) {
      atom.notifications.addWarning('atom-monkey:insert_date_iso :: no editor selected')
      return
    }
    editor.insertText(new Date().toISOString())
  },

  insertUuid () {
    const editor = atom.workspace.getActiveTextEditor()
    if (!editor) {
      atom.notifications.addWarning('atom-monkey:insert_uuid :: no editor selected')
      return
    }
    editor.insertText(uuid())
  },

  validateJson () {
    const editor = atom.workspace.getActiveTextEditor()
    if (!editor) {
      atom.notifications.addWarning('atom-monkey:validate_json :: no editor selected')
      return
    }
    const selection = editor.getSelectedText()
    const { success, error } = validateJson(selection || editor.getText())
    if (success) {
      atom.notifications.addSuccess('the JSON is well defined')
    } else {
      atom.notifications.addError(`invalid JSON: ${error}`)
    }
  }

}
