const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
  sendForm: (firstname) => ipcRenderer.send('form-submission', firstname)
});