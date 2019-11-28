'use strict';

const {app, BrowserWindow} = require('electron');
let win;

app.on('ready', function () {
  win = new BrowserWindow({
    center: true,
    width: 800,
    height: 600,
    webPreferences: {
      blinkFeatures: 'PreciseMemoryInfo'
    }
  });
  win.loadURL(`file://${__dirname}/index.html`);
});
