import {contextBridge, ipcRenderer, IpcRendererEvent} from "electron";
import {GameMonitorType, ProfileInfoType} from "./type";

enum CleanGameMonitorEnum {
    over100PingList,
    lowFpsList,
    messageList
}

const InitGameMonitor: GameMonitorType = {
    stats: {
        fps: {start: 0, count: 0, value: 0, avg: 0, list: [], lowFpsList: []},
        frame: {start: 0, end: 0, value: 0, avg: 0, list: []},
        logic: {start: 0, end: 0, value: 0, avg: 0, list: []},
        physics: {start: 0, end: 0, value: 0, avg: 0, list: []},
        render: {start: 0, end: 0, value: 0, avg: 0, list: []},
        ping: {start: 0, end: 0, value: 0, avg: 0, list: [], over100PingList: []},
        draws: 0,
        instances: 0,
        triCount: 0,
        textureMemory: 0,
        bufferMemory: 0,
        renderer: ""
    },
    messageList: []
}

let gameMonitor: GameMonitorType = InitGameMonitor;

const maxListLength: number = 40;

const websocketHook = {
    beforeSend(data: string) {
        if (data.includes('CommandID\\":1007')) {
            gameMonitor.stats!.ping.start = performance.now();
        }
    },
    beforeMessage(data: string) {
        if (data.includes('CommandID\\":1507')) {
            let ping = performance.now() - gameMonitor.stats.ping.start;

            if (gameMonitor.stats.ping.list.length >= maxListLength) {
                gameMonitor.stats.ping.list.shift();
            }

            gameMonitor.stats.ping.list.push({
                value: ping,
                time: formatterTime(new Date())
            });

            if (ping >= 100) {
                gameMonitor.stats.ping.over100PingList.push({
                    value: Number(ping.toFixed(2)),
                    time: new Date().toLocaleString()
                });
            }

            calculateProfileAvg(gameMonitor.stats.ping);

            gameMonitor.stats.ping.value = ping;
        }
    },
    close() {
        gameMonitor.messageList.push("ProxyWebsocket close " + new Date().toLocaleString());
        console.error("ProxyWebsocket close", new Date().toLocaleString());
    }
}

const gameListen = {
    beforeUpdate() {
        let now = performance.now();
        gameMonitor.stats.frame.start = now;
        gameMonitor.stats.logic.start = now;
    },
    afterUpdate(isGamePaused: boolean) {
        let now = performance.now();
        if (isGamePaused) {
            gameMonitor.stats.frame.start = now;
        } else {
            calculateProfile(gameMonitor.stats.logic, now);
        }
    },
    beforePhysics() {
        gameMonitor.stats.physics.start = performance.now();
    },
    afterPhysics() {
        calculateProfile(gameMonitor.stats.physics, performance.now());
    },
    beforeDraw() {
        gameMonitor.stats.render.start = performance.now();
    },
    afterDraw(draws: number, instances: number, bufferMemory: number, textureMemory: number, triCount: number, renderer: string) {
        let now = performance.now();
        calculateProfile(gameMonitor.stats.frame, now);
        calculateProfileFps(now);
        calculateProfile(gameMonitor.stats.render, now);
        gameMonitor.stats.draws = draws;
        gameMonitor.stats.instances = instances;
        gameMonitor.stats.bufferMemory = bufferMemory;
        gameMonitor.stats.textureMemory = textureMemory;
        gameMonitor.stats.triCount = triCount;
        gameMonitor.stats.renderer = renderer;
    }
}

function calculateProfile(profile: ProfileInfoType, end: number) {
    profile.end = end;
    let value = profile.end - profile.start;

    if (profile.list.length >= maxListLength) {
        profile.list.shift();
    }

    profile.list.push({
        value: value,
        time: formatterTime(new Date())
    });

    calculateProfileAvg(profile);

    profile.value = value;
}

function formatterTime(date: Date) {
    let minutes = (date.getMinutes() + "").padStart(2, "0");
    let seconds = (date.getSeconds() + "").padStart(2, "0");
    return `${date.getHours()}:${minutes}:${seconds}`
}

function calculateProfileAvg(profile: ProfileInfoType) {
    let total = profile.list.map(item => item.value).reduce((a, b) => a + b);
    profile.avg = total / profile.list.length;
}

function calculateProfileFps(now: number) {
    if (gameMonitor.stats.fps.start == 0) {
        gameMonitor.stats.fps.start = now;
        return;
    }

    gameMonitor.stats.fps.count++;

    let time = now - gameMonitor.stats.fps.start;
    if (time < 1000) {
        return;
    }

    const ratio = 1000 / time;
    const fps = Math.round((ratio * gameMonitor.stats.fps.count));
    gameMonitor.stats.fps.count = 0;
    gameMonitor.stats.fps.start = now;

    if (gameMonitor.stats.fps.list.length >= maxListLength) {
        gameMonitor.stats.fps.list.shift();
    }

    gameMonitor.stats.fps.list.push({
        value: fps,
        time: formatterTime(new Date())
    });

    if (fps < 20) {
        gameMonitor.stats.fps.lowFpsList.push({
            value: Number(fps.toFixed(0)),
            time: new Date().toLocaleString()
        });
    }

    calculateProfileAvg(gameMonitor.stats.fps);

    gameMonitor.stats.fps.value = fps;
}

contextBridge.exposeInMainWorld("electron", {
    on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
        ipcRenderer.on(channel, listener)
    },
    ipc: ipcRenderer,
    registerWebviewIDInfo(id: number, webContentsId: number) {
        ipcRenderer.send("update-webview-info", id, webContentsId, gameMonitor);
    },
    gameListen: gameListen,
    websocketHook: websocketHook
});

window.addEventListener("DOMContentLoaded", () => {
    let loadJS = function (url: string, implementationCode: any, location: HTMLElement) {
        let scriptTag = document.createElement('script');
        scriptTag.src = url;

        scriptTag.onload = implementationCode;

        location.appendChild(scriptTag);
    };

    loadJS('//cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js',
        () => {
        }, document.body);

    //1秒傳送30次gameMonitor 資訊
    setInterval(() => {
        ipcRenderer.send("game-monitor", gameMonitor);
    }, 1000 / 30);

    ipcRenderer.on("clean-game-monitor",
        (_: IpcRendererEvent, type: CleanGameMonitorEnum) => {
            switch (type) {
                case CleanGameMonitorEnum.lowFpsList:
                    gameMonitor.stats.fps.lowFpsList = [];
                    break;
                case CleanGameMonitorEnum.over100PingList:
                    gameMonitor.stats.ping.over100PingList = [];
                    break;
                case CleanGameMonitorEnum.messageList:
                    gameMonitor.messageList = [];
                    break;
            }
        });

});
