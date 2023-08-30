const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;

function createWindow() {
    const mainWindow = new BrowserWindow(
        {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true //頁面內集成Node.js
            }
        }
    );
    mainWindow.loadFile('./electronDemo01/index.html');
}

app.on('ready', () => createWindow());
app.on('window-all-closed', () => app.quit());
