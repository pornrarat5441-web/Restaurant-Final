const { app, BrowserWindow } = require('electron');
const path = require('path');

let kitchenWindow;

function createWindows() {
  kitchenWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Kitchen Dashboard",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the Kitchen page from your Render server
  kitchenWindow.loadURL('https://restaurant-final-gzms.onrender.com/kitchen.html');
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
