'use babel';

import AtomMonkeyView from './atom-monkey-view';
import { CompositeDisposable } from 'atom';

export default {

  atomMonkeyView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomMonkeyView = new AtomMonkeyView(state.atomMonkeyViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomMonkeyView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-monkey:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomMonkeyView.destroy();
  },

  serialize() {
    return {
      atomMonkeyViewState: this.atomMonkeyView.serialize()
    };
  },

  toggle() {
    console.log('AtomMonkey was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
