import React, {useEffect, useState} from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import AppMonitorOperate from "./AppMonitorOperate";
import {ProfileRecord} from "../../electron/type";

export type GameMonitorType = {
    stats: StatsType
    messageList: string[]
}

export type ProfileInfoType = {
    start: number,
    end: number
    value: number
    avg: number
    list: ProfileRecord[]
}

export type StatsType = {
    fps: ProfileInfoType & { lowFpsList: ProfileRecord[] }
    frame: ProfileInfoType
    logic: ProfileInfoType
    physics: ProfileInfoType
    render: ProfileInfoType
    ping: ProfileInfoType & { over100PingList: ProfileRecord[] }
    draws: number
    instances: number
    triCount: number
    textureMemory: number
    bufferMemory: number
    renderer: string
}

export type AppMonitorProps = {
    name: string
    pid: number
    percentCPUUsage: string,
    percentMemoryUsage: string,
    webviewId?: number
    gameMonitor?: GameMonitorType,
    cpuUsage: ProfileInfoType
    memoryUsage: ProfileInfoType
}

const AppMonitorTable = () => {
    const [rows, setRows] = useState<AppMonitorProps[]>([]);

    useEffect(() => {
        window.electron.removeAllListeners("update-app-monitor");
        window.electron.on("update-app-monitor", (event, list: any[]) => {
            list.forEach((value, index) => value.id = index);
            setRows(list.slice(0));
        });

        return () => {
            window.electron.removeAllListeners("update-app-monitor");
        }
    }, []);

    return (
        <TableContainer
            sx={{maxHeight: "88vh"}}
            component={Paper}
        >
            <Table
                stickyHeader
                aria-label="simple table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>name</TableCell>
                        <TableCell align="right">pid</TableCell>
                        <TableCell align="right">CPU使用率</TableCell>
                        <TableCell align="right">記憶體使用率</TableCell>
                        <TableCell align="right">ping</TableCell>
                        <TableCell align="right">Avg ping</TableCell>
                        <TableCell align="right">FPS</TableCell>
                        <TableCell align="right">Avg FPS</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            hover
                            key={row.pid}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">{row.name}</TableCell>

                            <TableCell align="right">{row.pid}</TableCell>

                            <TableCell align="right">{row.percentCPUUsage}%</TableCell>

                            <TableCell align="right">{row.percentMemoryUsage} MB</TableCell>

                            <TableCell
                                align="right"
                            >
                                {row.gameMonitor ? row.gameMonitor.stats.ping.value.toFixed(2) : "0.00"}
                            </TableCell>

                            <TableCell
                                align="right"
                            >
                                {row.gameMonitor ? row.gameMonitor.stats.ping.avg.toFixed(2) : "0.00"}
                            </TableCell>

                            <TableCell
                                align="right"
                            >
                                {row.gameMonitor ? row.gameMonitor.stats.fps.value : 0}
                            </TableCell>

                            <TableCell
                                align="right"
                            >
                                {row.gameMonitor ? row.gameMonitor.stats.fps.avg.toFixed(2) : "0.00"}
                            </TableCell>

                            <TableCell>
                                <AppMonitorOperate {...row}/>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AppMonitorTable;