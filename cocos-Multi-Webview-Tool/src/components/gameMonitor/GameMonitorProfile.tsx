import React, {CSSProperties} from 'react';
import {GameMonitorModalProps} from "./GameMonitorModal";
import {Paper, Typography} from "@mui/material";

const GameMonitorProfile: React.FC<GameMonitorModalProps> = (props) => {
    let avgStyle: CSSProperties = {
        marginLeft: "10px",
        color: "peru"
    };

    return (
        <Paper sx={{mb: 2, p: 1}}>
            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                CPU使用率 : {props.row.percentCPUUsage}%
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                記憶體 : {props.row.percentMemoryUsage} MB
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                裝置 : {props.row.gameMonitor?.stats.renderer}
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span> PING : {props.row.gameMonitor?.stats.ping.value.toFixed(2)} </span>
                <span style={avgStyle}>AVG PING : {props.row.gameMonitor?.stats.ping.avg.toFixed(2)} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>FPS : {props.row.gameMonitor?.stats.fps.value} </span>
                <span style={avgStyle}>AVG FPS : {props.row.gameMonitor?.stats.fps.avg.toFixed(2)} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>Draw Call : {props.row.gameMonitor?.stats.draws} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>Frame time (ms) : {props.row.gameMonitor?.stats.frame.value.toFixed(2)} </span>
                <span style={avgStyle}>AVG Frame time (ms) : {props.row.gameMonitor?.stats.frame.avg.toFixed(2)} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>Instance Count : {props.row.gameMonitor?.stats.instances} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>Triangle: {props.row.gameMonitor?.stats.triCount} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>Game Logic (ms) : {props.row.gameMonitor?.stats.logic.value.toFixed(2)} </span>
                <span style={avgStyle}>AVG Game Logic (ms) : {props.row.gameMonitor?.stats.logic.avg.toFixed(2)} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>Physics (ms) : {props.row.gameMonitor?.stats.physics.value.toFixed(2)} </span>
                <span style={avgStyle}>AVG Physics (ms) : {props.row.gameMonitor?.stats.physics.avg.toFixed(2)} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>Renderer (ms) : {props.row.gameMonitor?.stats.render.value.toFixed(2)} </span>
                <span style={avgStyle}>AVG Renderer (ms) : {props.row.gameMonitor?.stats.render.avg.toFixed(2)} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>GFX Texture Mem(M) : {props.row.gameMonitor?.stats.textureMemory.toFixed(2)} </span>
            </Typography>

            <Typography
                variant="subtitle2"
                color="mediumspringgreen"
            >
                <span>GFX Buffer Mem(M) : {props.row.gameMonitor?.stats.bufferMemory.toFixed(2)} </span>
            </Typography>

        </Paper>
    );
};

export default GameMonitorProfile;