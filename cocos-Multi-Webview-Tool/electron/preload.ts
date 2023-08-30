import {contextBridge, ipcRenderer, IpcRendererEvent} from "electron";

type Listener = (event: IpcRendererEvent, ...args: any[]) => void;
contextBridge.exposeInMainWorld("electron", {
    on(channel: string, listener: Listener) {
        ipcRenderer.on(channel, listener)
    },
    once(channel: string, listener: Listener) {
        ipcRenderer.once(channel, listener)
    },
    removeAllListeners(channel: string) {
        ipcRenderer.removeAllListeners(channel)
    },
    ipc: ipcRenderer
});