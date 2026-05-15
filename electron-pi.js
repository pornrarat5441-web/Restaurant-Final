const { app, BrowserWindow } = require('electron');
const path = require('path');

let piWindow;

function createWindows() {
  piWindow = new BrowserWindow({
    width: 460,
    height: 320,
    title: "Pi Server Dashboard",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the Pi page from your Render server
  piWindow.loadURL('https://restaurant-final-gzms.onrender.com/server_frontend/piChoose.html');
}

app.whenReady().then(() => {
  createWindows();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
