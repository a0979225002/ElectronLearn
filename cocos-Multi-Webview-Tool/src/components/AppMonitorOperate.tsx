import React from 'react';
import {AppMonitorProps} from "./AppMonitorTable";
import {Button} from "@mui/material";
import GameMonitorModal from "./gameMonitor/GameMonitorModal";
import ChangeWebviewUrlDialog from "./ChangeWebviewURLDialog";

const AppMonitorOperate: React.FC<AppMonitorProps> = (props) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [urlDialogOpen, setUrlDialogOpen] = React.useState(false);

    const handleUrlDialogOpen = () => {
        setUrlDialogOpen(true);
    }

    const handleUrlDialogClose = () => {
        setUrlDialogOpen(false);
    }

    const handleUrlDialogOk = (url: string) => {
        setUrlDialogOpen(false);
        window.electron.ipc.send("change-webview-url", url, null, props.webviewId);
    }

    const handleGameMonitorModalOpen = () => {
        setModalOpen(true);
    };

    const handleGameMonitorModalClose = () => {
        setModalOpen(false);
    };

    const onOpenDevTools = () => {
        window.electron.ipc.send("open-webview-dev-tools", props.webviewId);
    }

    if (!props.webviewId) {
        return (<React.Fragment></React.Fragment>)
    }

    return (
        <React.Fragment>
            <Button
                variant="outlined"
                onClick={onOpenDevTools}
            >
                開發者工具
            </Button>

            <Button
                sx={{ml: 1}}
                variant="outlined"
                color="success"
                onClick={handleGameMonitorModalOpen}
            >
                監測視窗
            </Button>

            <Button
                sx={{ml: 1}}
                variant="outlined"
                color="warning"
                onClick={handleUrlDialogOpen}
            >
                更換URL
            </Button>

            <GameMonitorModal
                row={props}
                open={modalOpen}
                onClose={handleGameMonitorModalClose}
            />

            <ChangeWebviewUrlDialog
                open={urlDialogOpen}
                onClose={handleUrlDialogClose}
                onOk={handleUrlDialogOk}
            />
        </React.Fragment>
    );
};

export default AppMonitorOperate;