const channel = {
    GET_SVN_INFO: "GET_SVN_INFO",
    GET_SVN_INFO_TO_CLIENT: "GET_SVN_INFO_TO_CLIENT",
    GET_SVN_LOG: "GET_SVN_LOG",
    GET_SVN_LOG_TO_CLIENT: "GET_SVN_LOG_TO_CLIENT",
    GET_SVN_LOG_TO_CLIENT_FINISH: "GET_SVN_LOG_TO_CLIENT_FINISH",
    GET_DIRECTORY_AUTHOR: "GET_DIRECTORY_AUTHOR",
    GET_DIRECTORY_AUTHOR_TO_CLIENT: "GET_DIRECTORY_AUTHOR_TO_CLIENT",
    SAVE_SVN_DIRECTORY_AUTHOR: "SAVE_SVN_DIRECTORY_AUTHOR",
    SVN_UPDATE: "SVN_UPDATE",
    SVN_UPDATE_TO_CLIENT: "SVN_UPDATE_TO_CLIENT",
}

const getPath = (prefix: string) => {
    return localStorage.getItem(prefix + "_svn_path");
}

const getGameFullDirPath = (prefix: string) => {
    let path = getPath(prefix);
    let dirPath = ""
    if (prefix === "unity") {
        dirPath = path + "\\Assets\\EGames\\"
    } else {
        dirPath = path + "\\assets\\"
    }

    return dirPath;
}

const getGameDirPath = (prefix: string) => {
    let dirPath = "";
    if (prefix === "unity") {
        dirPath = "\\Assets\\EGames\\";
    } else {
        dirPath = "\\assets\\";
    }

    return dirPath;
}

export const SvnUtil = {
    channel: channel,
    getPath: getPath,
    getGameFullDirPath: getGameFullDirPath,
    getGameDirPath: getGameDirPath,
    getConfig: (prefix: string) => {
        return {
            svnConfig: {
                cwd: getPath(prefix),
                silent: true
            }
        }
    },
    savePath: (prefix: string, value: string) => {
        localStorage.setItem(prefix + "_svn_path", value);
    },
    removeAllIpcChannel: () => {
        for (let channelKey in channel) {
            window.electron.removeAllListeners(channelKey);
        }
    }
}