import React from 'react';
import {GameMonitorModalProps} from "./GameMonitorModal";
import GameMonitorChart from "./GameMonitorChart";

const GameMonitorChartLayout: React.FC<GameMonitorModalProps> = (props) => {
    return (
        <React.Fragment>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <GameMonitorChart
                    profile={props.row.cpuUsage}
                    title="CPU 使用率"
                    label="CPU"
                    borderColor={"rgb(201,79,3)"}
                    backgroundColor={"rgba(201,79,3,0.5)"}
                />

                <GameMonitorChart
                    profile={props.row.memoryUsage}
                    title="記憶體 使用率(MB)"
                    label="記憶體"
                    borderColor={"rgb(201,3,79)"}
                    backgroundColor={"rgba(201,3,79,0.5)"}
                />


            </div>

            <div style={{display: "flex", justifyContent: "space-between"}}>
                <GameMonitorChart
                    profile={props.row.gameMonitor!.stats.ping}
                    title="PING"
                    label="PING"
                    borderColor={"rgb(14,217,72)"}
                    backgroundColor={"rgba(14,217,72,0.5)"}
                />

                <GameMonitorChart
                    profile={props.row.gameMonitor!.stats.fps}
                    title="FPS"
                    label="FPS"
                    borderColor={"rgb(53,162,235)"}
                    backgroundColor={"rgba(53,162,235,0.5)"}
                />
            </div>

            <div style={{display: "flex", justifyContent: "space-between"}}>
                <GameMonitorChart
                    profile={props.row.gameMonitor!.stats.frame}
                    title="Frame"
                    label="Frame"
                    borderColor={"rgb(203,217,14)"}
                    backgroundColor={"rgba(203,217,14,0.5)"}
                />

                <GameMonitorChart
                    profile={props.row.gameMonitor!.stats.logic}
                    title="Game Logic (ms)"
                    label="Game Logic (ms)"
                    borderColor={"rgb(203,14,217)"}
                    backgroundColor={"rgba(203,14,217,0.5)"}
                />
            </div>

            <div style={{display: "flex", justifyContent: "space-between"}}>
                <GameMonitorChart
                    profile={props.row.gameMonitor!.stats.render}
                    title="Renderer (ms)"
                    label="Renderer (ms)"
                    borderColor={"rgb(14,217,217)"}
                    backgroundColor={"rgba(14,217,217,0.5)"}
                />

                <GameMonitorChart
                    profile={props.row.gameMonitor!.stats.physics}
                    title="Physics (ms)"
                    label="Physics (ms)"
                    borderColor={"rgb(118,231,176)"}
                    backgroundColor={"rgba(118,231,176,0.5)"}
                />
            </div>
        </React.Fragment>
    );
};

export default GameMonitorChartLayout;