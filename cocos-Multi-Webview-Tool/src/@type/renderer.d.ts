import {IpcRendererEvent} from "electron";
import IpcRenderer = Electron.IpcRenderer;

export interface IElectronAPI {
    on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void)
    once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void)
    removeAllListeners(channel: string)
    ipc: IpcRenderer
}

declare global {
    interface Window {
        electron: IElectronAPI
    }
}