import {Box, Button, TextField} from '@mui/material';
import React, {useRef} from 'react';
import AppMonitorTable from "./AppMonitorTable";


const OpenWebview = () => {
    const defaultURLValue = localStorage.getItem("cocos-url") || "https://storage.googleapis.com/ww-cocos/waywin_index.html";
    const cocosUrlInputRef = useRef<HTMLInputElement>();

    const onOpenWebview = () => {
        let url = cocosUrlInputRef.current;
        if (url) {
            localStorage.setItem("cocos-url", url.value.trim());
            window.electron.ipc.send("open-webview", url.value.trim());
        }
    }

    return (
        <Box>
            <TextField
                sx={{width: "40vw"}}
                inputRef={cocosUrlInputRef}
                required
                type="url"
                size={"small"}
                id="cocos-url-required"
                label="Cocos URL"
                defaultValue={defaultURLValue}
            />

            <Button
                sx={{ml: 2}}
                variant="outlined"
                onClick={onOpenWebview}
            >
                開啟視窗
            </Button>

            <Box sx={{mt: 1, height: "80vh"}}>
                <AppMonitorTable/>
            </Box>

        </Box>
    );
};

export default OpenWebview;