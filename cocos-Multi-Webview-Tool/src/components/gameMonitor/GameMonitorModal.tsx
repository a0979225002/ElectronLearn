import React, {MouseEventHandler} from "react";
import {Button, Modal, Paper, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system/styleFunctionSx";
import {AppMonitorProps} from "../AppMonitorTable";
import GameMonitorProfile from "./GameMonitorProfile";
import GameMonitorChartLayout from "./GameMonitorChartLayout";

export type GameMonitorModalProps = {
    row: AppMonitorProps
    open: boolean
    onClose: MouseEventHandler
}

const style: SxProps = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "85vw",
    bgcolor: "rgb(72,72,80)",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    maxHeight: "80vh",
    overflow: "auto"
};

const PaperSx: SxProps = {
    mt: 0,
    maxHeight: 200,
    overflow: "auto",
    p: 1
};

enum CleanGameMonitorEnum {
    over100PingList,
    lowFpsList,
    messageList
}

const GameMonitorModal: React.FC<GameMonitorModalProps> = (props) => {


    const onCleanGameMonitor = (type: CleanGameMonitorEnum) => {
        window.electron.ipc.send("clean-game-monitor", props.row.webviewId, type);
    }

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h6">{props.row.name} 每秒刷新</Typography>

                <GameMonitorProfile {...props}/>

                <GameMonitorChartLayout {...props}/>

                <Typography
                    sx={{mt: 1}}
                    variant="subtitle1"
                    color="white"
                >
                    低於FPS 20 :

                </Typography>

                <Button
                    sx={{mb: 1}}
                    variant="outlined"
                    size={"small"}
                    color="error"
                    onClick={() => onCleanGameMonitor(CleanGameMonitorEnum.lowFpsList)}
                >
                    清除
                </Button>

                <Paper sx={PaperSx} component={"pre"}>
                    {props.row.gameMonitor?.stats.fps.lowFpsList.map(fps => JSON.stringify(fps)).join("\n")}
                </Paper>

                <Typography
                    sx={{mt: 1}}
                    variant="subtitle1"
                    color="white"
                >
                    ping 超過100 :
                </Typography>

                <Button
                    sx={{mb: 1}}
                    variant="outlined"
                    size={"small"}
                    color="error"
                    onClick={() => onCleanGameMonitor(CleanGameMonitorEnum.over100PingList)}
                >
                    清除
                </Button>

                <Paper sx={PaperSx} component={"pre"}>
                    {props.row.gameMonitor?.stats.ping.over100PingList.map(ping => JSON.stringify(ping)).join("\n")}
                </Paper>

                <Typography
                    sx={{mt: 1}}
                    variant="subtitle1"
                    color="white"
                >
                    訊息 :
                </Typography>

                <Button
                    sx={{mb: 1}}
                    variant="outlined"
                    size={"small"}
                    color="error"
                    onClick={() => onCleanGameMonitor(CleanGameMonitorEnum.messageList)}
                >
                    清除
                </Button>

                <Paper sx={PaperSx} component={"pre"}>
                    {props.row.gameMonitor?.messageList.join("\n")}
                </Paper>

            </Box>
        </Modal>
    );
};

export default GameMonitorModal;