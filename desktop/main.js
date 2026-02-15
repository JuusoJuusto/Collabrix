const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      partition: 'persist:collabrix'
    },
    backgroundColor: '#0f172a',
    show: true,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true
  });

  // Load the custom titlebar with embedded web app
  mainWindow.loadFile(path.join(__dirname, 'titlebar.html'));

  // Show loading message
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('Loading Collabrix...');
  });

  // Handle load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
    mainWindow.loadURL(`data:text/html,
      <html>
        <body style="background: #0f172a; color: white; font-family: Arial; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center;">
            <h1>⚠️ Connection Error</h1>
            <p>Could not connect to Collabrix</p>
            <p style="color: #888;">Error: ${errorDescription}</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #5865F2; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Retry
            </button>
          </div>
        </body>
      </html>
    `);
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const appUrl = 'https://collabrixs.vercel.app';
    if (!url.startsWith(appUrl)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) mainWindow.close();
});

// Auto-updater (optional - requires setup)
// const { autoUpdater } = require('electron-updater');
// autoUpdater.checkForUpdatesAndNotify();
