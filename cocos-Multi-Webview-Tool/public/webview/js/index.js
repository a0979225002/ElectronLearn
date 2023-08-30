window.onload = function () {
    window.electron.on("refresh-webview-list", (event, webviewList) => {
        refreshWebviewList(webviewList);
    });

    window.electron.on("change-webview-url", (event, url, webContentId, webviewId) => {
        changeWebviewUrl(url, webContentId, webviewId);
    });

    window.electron.on("open-webview-dev-tools", (event, webviewId) => {
        openWebviewDevTools(webviewId);
    });

    window.electron.on("clean-game-monitor", (event, webviewId, type) => {
        cleanGameMonitorByWebview(webviewId, type);
    });

    window.electron.on("send-message-to-webview", (event, webviewId, channel, args) => {
        sendMessageToWebview(webviewId, channel, args);
    });

    refreshWebviewList(window.electron.ipc.sendSync("get-webview-list"));
}

function sendMessageToWebview(webviewId, channel, args) {
    let element = document.getElementById(getElementId(webviewId));
    if (element) {
        element.send(channel, ...args);
    }
}

function cleanGameMonitorByWebview(webviewId, type) {
    let element = document.getElementById(getElementId(webviewId));
    if (element) {
        element.send("clean-game-monitor", webviewId, type);
    }
}

function openWebviewDevTools(webviewId) {
    let element = document.getElementById(getElementId(webviewId));
    if (element) {
        element.openDevTools({mode: "detach"});
    }
}

function refreshWebviewList(webviewList) {
    for (let i = 0; i < webviewList.length; i++) {
        let item = webviewList[i];
        let element = document.getElementById(getElementId(item.id));
        if (!element) {
            createWebview(item.url, item.id);
        }
    }
}

function changeWebviewUrl(url, webContentId, webviewId) {
    let webview;

    if (webContentId) {
        let webviewList = document.querySelectorAll("webview");
        for (let i = 0; i < webviewList.length; i++) {
            let element = webviewList[i];
            if (element.getWebContentsId() === webContentId) {
                webview = element;
                break;
            }
        }
    } else if (webviewId) {
        webview = document.getElementById(getElementId(webviewId));
    }

    if (webview) {
        webview.src = url;
    }
}

function getElementId(id) {
    return `wv-${id}`;
}

function createWebview(url, id) {
    let elementId = getElementId(id);

    let webviewContainer = document.getElementById("webview-container");
    let div = document.createElement("div");
    div.id = `out-site-${id}`;
    div.className = "col m-0 p-0";
    div.style.height = "50vh";
    div.style.position = "relative";
    div.style.backgroundColor = "white";

    let webview = document.createElement("webview");
    webview.id = elementId;
    webview.title = elementId;
    webview.style.height = "100%";
    webview.style.width = "100%";
    webview.src = url;
    webview.partition = `persist:webview-${id}`;
    webview.nodeintegration = true;
    webview.disablewebsecurity = true;
    webview.allowpopups = true;
    webview.preload = window.electron.ipc.sendSync("get-webview-preload-path");

    div.appendChild(webview);

    let noFabDiv = document.createElement("div");
    noFabDiv.id = `fab-${id}`;
    noFabDiv.className = "fab-container";
    noFabDiv.innerHTML = `
    <span>No: ${id}</span>
    `;
    div.appendChild(noFabDiv);

    webview.addEventListener('did-finish-load', async (_) => {
        webview.title = `No: ${id}`;

        await webview.executeJavaScript(`
            //攔截WebSocket封包
            const OriginalWebsocketByWebViewTool = window.WebSocket;
            
            class ProxyWebsocketByWebViewTool extends OriginalWebsocketByWebViewTool {

                constructor() {
                    super(...arguments);
                    this.addEventListener("message", (event) => {
                         window.electron.websocketHook.beforeMessage(pako.ungzip(event.data, {to: 'string'}));
                    });
                    this.addEventListener('close', (event) => {
                        window.electron.websocketHook.close();
                    });
                    this.startGameProfile();
                }
            
                send(data) {      
                    window.electron.websocketHook.beforeSend(pako.ungzip(data, {to: 'string'}));
                    super.send(data);
                }
                
                startGameProfile() {
                   try {
                      ${gameProfileJS()} 
                    }catch (e) {
                        
                    }
                }
            }
            
            window.WebSocket = ProxyWebsocketByWebViewTool;
             
            window.electron.registerWebviewIDInfo(${id}, ${webview.getWebContentsId()}); 
                 
        `);
    });



    webviewContainer.append(div);
}

function gameProfileJS() {
    return `
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
            window.electron.gameListen.beforeUpdate();
        });
        
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, () => {
            window.electron.gameListen.afterUpdate(cc.director.isPaused());
        });
        
        cc.director.on(cc.Director.EVENT_BEFORE_PHYSICS, () => {
            window.electron.gameListen.beforePhysics();
        });
        
        cc.director.on(cc.Director.EVENT_AFTER_PHYSICS, () => {
            window.electron.gameListen.afterPhysics();
        });
        
        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, () => {
            window.electron.gameListen.beforeDraw();
        });
        
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, () => {
            const draws = cc.director.root.device.numDrawCalls;
            const instances = cc.director.root.device.numInstances;
            const bufferMemory = cc.director.root.device.memoryStatus.bufferSize / (1024 * 1024);
            const textureMemory = cc.director.root.device.memoryStatus.textureSize / (1024 * 1024);
            const triCount = cc.director.root.device.numTris;
            
            window.electron.gameListen.afterDraw(draws, instances, bufferMemory, textureMemory, triCount, cc.director.root.device.renderer);
        });
    `
}