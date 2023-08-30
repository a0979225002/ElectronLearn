import {app, BrowserWindow, ipcMain, IpcMainEvent} from "electron";
import * as path from "path";
import {GameMonitorType, ProfileInfoType} from "./type";

export type WebviewType = {
    url: string
    id: number
    pid?: number
    webContentID?: number
    frameID?: number
    gameMonitor?: GameMonitorType
    cpuUsage: ProfileInfoType
    memoryUsage: ProfileInfoType
}

export default class WebviewWindow {
    private webViewId: number = 0;

    private mainWindow: BrowserWindow | undefined;

    static pid: number = 0;

    static webviewList: WebviewType[] = [];

    constructor() {
        ipcMain.on("open-webview", this.openWebview.bind(this));
        ipcMain.on("get-webview-list", this.getWebviewList.bind(this));
        ipcMain.on("update-webview-info", this.updateWebviewInfo.bind(this));
        ipcMain.on("get-webview-preload-path", this.getWebviewPreloadPath.bind(this));
        ipcMain.on("open-webview-dev-tools", this.openWebviewDevTools.bind(this));
        ipcMain.on("game-monitor", this.gameMonitor.bind(this));
        ipcMain.on("get-game-monitor-by-webview", this.getGameMonitorByWebview.bind(this));
        ipcMain.on("clean-game-monitor", this.cleanGameMonitor.bind(this));
        ipcMain.on("change-webview-url", this.changeWebviewUrl.bind(this));
    }

    private createWindow() {
        const mainWindow = new BrowserWindow({
            height: 720,
            width: 1280,
            autoHideMenuBar: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                sandbox: true,
                nodeIntegration: true,
                webviewTag: true,
                partition: `persist:webview-windows`
            },
        });

        if (app.isPackaged) {
            mainWindow.loadURL(`file://${__dirname}/../webview/index.html`);
        } else {
            mainWindow.loadURL('http://localhost:3000/webview');

            mainWindow.webContents.openDevTools({mode: "detach"});
        }

        mainWindow.webContents.on("did-attach-webview", (_, contents) => {
            contents.setWindowOpenHandler((details) => {
                mainWindow.webContents.send('change-webview-url', details.url, contents.id);
                this.changeWebviewUrl(null, details.url, contents.id)
                return {action: 'deny'}
            })
        });

        mainWindow.on("close", (_) => {
            this.mainWindow = undefined;
            this.webViewId = 0;
            WebviewWindow.webviewList = [];
        });

        mainWindow.webContents.on("did-finish-load", () => {
            WebviewWindow.pid = mainWindow.webContents.getOSProcessId();
            console.log(mainWindow.webContents.getOSProcessId())
        });

        this.mainWindow = mainWindow;
    }

    private openWebview(_: IpcMainEvent, url: string) {
        this.webViewId++;

        WebviewWindow.webviewList.push({
            url: url,
            id: this.webViewId,
            cpuUsage: {start: 0, end: 0, value: 0, avg: 0, list: []},
            memoryUsage: {start: 0, end: 0, value: 0, avg: 0, list: []}
        });

        if (this.mainWindow) {
            this.mainWindow.webContents.send("refresh-webview-list", WebviewWindow.webviewList);
        } else {
            this.createWindow();
        }
    }

    private getWebviewList(event: IpcMainEvent) {
        event.returnValue = WebviewWindow.webviewList;
    }

    private updateWebviewInfo(event: IpcMainEvent, webviewId: number, webContentsId: number, gameMonitor: GameMonitorType) {
        let index = WebviewWindow.webviewList.findIndex(webview => webview.id === webviewId);
        if (index > -1) {
            WebviewWindow.webviewList[index].pid = event.sender.getOSProcessId();
            WebviewWindow.webviewList[index].frameID = event.frameId;
            WebviewWindow.webviewList[index].webContentID = webContentsId;
            WebviewWindow.webviewList[index].gameMonitor = gameMonitor;
        }
    }

    private getWebviewPreloadPath(event: IpcMainEvent) {
        event.returnValue = path.join(__dirname, "webViewPreload.js");
    }

    private gameMonitor(event: IpcMainEvent, gameMonitor: any) {
        let index = WebviewWindow.webviewList.findIndex(webview => webview.webContentID === event.sender.id);
        if (index > -1) {
            WebviewWindow.webviewList[index].gameMonitor = gameMonitor;
        }
    }

    private openWebviewDevTools(_: IpcMainEvent, webviewId: number) {
        this.mainWindow?.webContents.send("open-webview-dev-tools", webviewId)
    }

    private getGameMonitorByWebview(event: IpcMainEvent, webviewId: number) {
        let index = WebviewWindow.webviewList.findIndex(webview => webview.id === webviewId);
        if (index > -1) {
            event.returnValue.returnValue = WebviewWindow.webviewList[index];
        } else {
            event.returnValue = null;
        }
    }

    private cleanGameMonitor(_: IpcMainEvent, webviewId: number, type: number) {
        this.mainWindow?.webContents.send("send-message-to-webview", webviewId, "clean-game-monitor", [type])
    }

    private changeWebviewUrl(_: IpcMainEvent | null, url: string, webviewContentsId?: number, webviewId?: number) {
        this.mainWindow?.webContents.send('change-webview-url', url, webviewContentsId, webviewId);
    }
}