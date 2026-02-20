const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

// Configure auto-updater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.allowPrerelease = false;
autoUpdater.allowDowngrade = false;

// Configure update feed URL
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'JuusoJuusto',
  repo: 'Collabrix'
});

// Check immediately on startup
app.on('ready', () => {
  setTimeout(() => {
    checkForUpdates();
  }, 1000);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      partition: 'persist:collabrix',
      allowRunningInsecureContent: false,
      enableRemoteModule: false,
      nativeWindowOpen: true
    },
    backgroundColor: '#0f172a',
    show: false, // Don't show until ready
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    title: 'Collabrix - Connect, Chat, Collaborate'
  });

  // Maximize window on startup
  mainWindow.maximize();
  
  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the custom titlebar with embedded web app
  mainWindow.loadFile(path.join(__dirname, 'titlebar.html'));

  // Handle load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
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
    // Allow Google OAuth popups
    if (url.includes('accounts.google.com') || url.includes('firebase') || url.includes('googleapis.com')) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 500,
          height: 600,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
          }
        }
      };
    }
    
    // Open other external links in default browser
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

// Auto-updater functions
function checkForUpdates() {
  autoUpdater.checkForUpdates()
    .then(result => {
      // Update check completed
    })
    .catch(err => {
      // Update check error
    });
}

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  if (mainWindow) {
    mainWindow.webContents.send('update-checking');
  }
});

autoUpdater.on('update-available', (info) => {
  if (mainWindow) {
    mainWindow.webContents.send('update-available', {
      version: info.version,
      releaseDate: info.releaseDate
    });
  }
});

autoUpdater.on('update-not-available', (info) => {
  if (mainWindow) {
    mainWindow.webContents.send('update-not-available');
  }
});

autoUpdater.on('download-progress', (progress) => {
  if (mainWindow) {
    mainWindow.webContents.send('update-download-progress', {
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  if (mainWindow) {
    mainWindow.webContents.send('update-downloaded', {
      version: info.version
    });
  }
  
  // Auto-restart after 2 seconds
  setTimeout(() => {
    autoUpdater.quitAndInstall(false, true);
  }, 2000);
});

autoUpdater.on('error', (err) => {
  // Update error occurred
});

// IPC handlers for updates
ipcMain.handle('download-update', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall(false, true);
});

ipcMain.handle('check-for-updates', () => {
  checkForUpdates();
});

// Auto-updater (optional - requires setup)
// const { autoUpdater } = require('electron-updater');
// autoUpdater.checkForUpdatesAndNotify();
