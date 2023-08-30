import React, {useEffect, useMemo, useRef} from 'react';
import {ProfileInfoType} from "../../../electron/type";
import {Line} from "react-chartjs-2";

export type GameMonitorChartProps = {
    profile: ProfileInfoType
    title: string
    label: string
    borderColor: string
    backgroundColor: string
}

const GameMonitorChart: React.FC<GameMonitorChartProps> = (props) => {
    const chartRef = useRef();

    const createOptions = (): any => {
        return {
            color: "white",
            backgroundColor: "white",
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: props.title,
                    padding: 25,
                    color: "rgb(186,218,255)",
                    font: {
                        size: 16
                    }
                },
                datalabels: {
                    display: true,
                    color: "rgba(255,255,255,1)",
                    formatter: function (value: number, context: any) {
                        return parseFloat(value.toFixed(2)) + "";
                    },
                    anchor: "end",
                    offset: -20,
                    align: "start"
                }
            },
            scales: {
                y: {
                    ticks: {color: 'white'}
                },
                x: {
                    ticks: {color: 'white'}
                }
            }
        }
    };

    const chartData = useMemo(() => {
        return {
            labels: props.profile.list.map(item => item.time),
            datasets: [
                {
                    fill: true,
                    label: props.label,
                    data: props.profile.list.map(item => item.value),
                    borderColor: props.borderColor,
                    backgroundColor: props.backgroundColor
                },
            ]
        }
    }, [props.profile, props.backgroundColor, props.borderColor, props.label]);

    useEffect(() => {
        function handleResize() {
            if (chartRef.current) {
                // @ts-ignore
                chartRef.current.resize()
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    });


    return (
        <div style={{width: "50%", flex: 1}}>
            <Line
                ref={chartRef}
                options={createOptions()}
                data={chartData}
            />
        </div>
    );
};

export default GameMonitorChart;