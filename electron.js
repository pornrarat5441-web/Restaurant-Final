const { app, BrowserWindow } = require('electron');
const path = require('path');

let kitchenWindow;
let piWindow;

function createWindows() {
  // 1. Create the Kitchen Window
  kitchenWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Kitchen Dashboard",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the Kitchen page from your local server
  kitchenWindow.loadURL('https://restaurant-final-gzms.onrender.com/kitchen.html');

  // 2. Create the Pi (Waiter) Window
  piWindow = new BrowserWindow({
    width: 320, // Change this to your preferred width
    height: 480, // Change this to your preferred height
    title: "Pi Server Dashboard",
    // resizable: false, // Optional: prevents user from resizing
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the Pi page from your local server
  piWindow.loadURL('https://restaurant-final-gzms.onrender.com/server_frontend/piChoose.html');

  // Optional: Open DevTools for debugging
  // kitchenWindow.webContents.openDevTools();
  // piWindow.webContents.openDevTools();
}

// Start Electron when the app is ready
app.whenReady().then(() => {
  createWindows();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
