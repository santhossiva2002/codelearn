import * as monaco from 'monaco-editor';

// Configure a basic editor without worker setup for now
window.MonacoEnvironment = {
  getWorkerUrl: function(_moduleId: any, _label: string) {
    return './editor.worker.js';
  }
};

export { monaco };