import {app, BrowserWindow, dialog, Tray} from 'electron';
import * as path from 'path';
import * as log from "electron-log";
import * as process from "process";
import WebviewWindow from "./WebviewWindow";
import AppMonitor from "./AppMonitor";

log.transports.console.level = app.isPackaged ? "error" : "info";

if (process.platform === 'win32') {
    const dataPath = path.join(__dirname, app.isPackaged ? "../../../data" : "../data");
    app.setPath('appData', dataPath + "/app");
    app.setPath('userData', dataPath + "/user");
    app.setPath('userCache', dataPath + "/cache");
    app.setAppLogsPath(dataPath + "/logs");
}

let mainWindow: BrowserWindow | undefined = undefined;

app.commandLine.appendSwitch('ignore-certificate-errors')

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            sandbox: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow = win;


    if (app.isPackaged) {
        win.loadURL(`file://${__dirname}/../index.html`);
    } else {
        win.loadURL('http://localhost:3000/index.html');

        win.webContents.openDevTools({mode: "detach"});

        // Hot Reloading on 'node_modules/.bin/electronPath'
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname,
                '..',
                '..',
                'node_modules',
                '.bin',
                'electron' + (process.platform === "win32" ? ".cmd" : "")),
            forceHardReset: true,
            hardResetMethod: 'exit'
        });
    }

    win.webContents.on("did-finish-load", () => {
        win.setTitle(`Cocos 多開工具 ${app.getVersion()}`);
        // @ts-ignore
        global.mainWindowPid = win.webContents.getOSProcessId();
    });

    win.on("close", (event) => {
        event.preventDefault();
        const dialogOpts = {
            type: "warning",
            buttons: ["是", "否"],
            title: win.getTitle(),
            message: "是否要關閉?",
        };

        dialog.showMessageBox(dialogOpts)
            .then((returnValue) => {
                if (returnValue.response === 0) {
                    win!.destroy();
                    mainWindow = undefined;
                }
            });
    });
}

function createTray() {
    let image;

    if (app.isPackaged) {
        image = path.join(__dirname, '../icon/logo.png')
    } else {
        image = path.join(__dirname, '../../public/icon/logo.png');
    }

    let tray = new Tray(image);
    tray.setTitle(app.getName());
    tray.setToolTip("Cocos 多視窗工具");
    if (process.platform === 'win32') {
        tray.on('click', () => {
            if (mainWindow) {
                mainWindow.show();
            } else {
                createWindow();
            }
        })
    }
}

app.whenReady().then(async () => {

    new WebviewWindow();

    new AppMonitor();

    createWindow();

    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // Prevent having error
    event.preventDefault()
    // and continue
    callback(true)
})
