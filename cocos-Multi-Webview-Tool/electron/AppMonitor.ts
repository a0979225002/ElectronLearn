import {app, BrowserWindow} from "electron";
import WebviewWindow, {WebviewType} from "./WebviewWindow";
import {GameMonitorType, ProfileInfoType} from "./type";

type AppMetricsType = {
    pid: number
    name: string
    percentCPUUsage: string
    percentMemoryUsage: string
    webviewId?: number
    gameMonitor?: GameMonitorType
    cpuUsage?: ProfileInfoType
    memoryUsage?: ProfileInfoType
}

export default class AppMonitor {

    constructor() {
        setInterval(() => {
            this.updateAppMonitor();
        }, 1000);
    }

    private updateAppMonitor() {
        const appMetrics = app.getAppMetrics();
        let list: AppMetricsType[] = [];

        for (let appMetric of appMetrics) {
            let webview = WebviewWindow.webviewList.find(webview => webview.pid === appMetric.pid);

            let item: AppMetricsType = {
                pid: appMetric.pid,
                name: appMetric.name || appMetric.serviceName || "",
                percentCPUUsage: Number(appMetric.cpu.percentCPUUsage).toFixed(2),
                percentMemoryUsage: Number(appMetric.memory.workingSetSize / 1024).toFixed(2)
            }

            if (webview) {
                this.getWebviewMonitor(item, webview);
            } else if (item.pid === WebviewWindow.pid) {
                item.name = "Cocos 多開";
            } else {
                // @ts-ignore
                if (item.pid === global.mainWindowPid) {
                    item.name = `Cocos 多開工具 ${app.getVersion()}`;
                }
            }

            list.push(item);
        }

        BrowserWindow.getAllWindows().forEach(window => {
            window.webContents.send("update-app-monitor", list);
        });
    }

    private getWebviewMonitor(item: AppMetricsType, webview: WebviewType) {
        if (webview.cpuUsage.list.length >= 60) {
            webview.cpuUsage.list.shift();
        }

        if (webview.memoryUsage.list.length >= 60) {
            webview.memoryUsage.list.shift();
        }

        let date = new Date();

        let minutes = (date.getMinutes() + "").padStart(2, "0");
        let seconds = (date.getSeconds() + "").padStart(2, "0");

        webview.cpuUsage.list.push({
            value: Number(item.percentCPUUsage),
            time: `${date.getHours()}:${minutes}:${seconds}`
        });

        webview.memoryUsage.list.push({
            value: Number(item.percentMemoryUsage),
            time: `${date.getHours()}:${minutes}:${seconds}`
        });

        item.name = `NO: ${webview.id}`;
        item.webviewId = webview.id;
        item.gameMonitor = webview.gameMonitor;
        item.cpuUsage = webview.cpuUsage;
        item.memoryUsage = webview.memoryUsage;

        return item;
    }

    // private getAppMetrics(): AppMetricsType[] {
    //     const appMetrics = app.getAppMetrics();
    //     return appMetrics.map(item => {
    //         return {
    //             pid: item.pid,
    //             name: item.name || item.serviceName || "",
    //             percentCPUUsage: Number(item.cpu.percentCPUUsage).toFixed(2)
    //         }
    //     });
    // }
}