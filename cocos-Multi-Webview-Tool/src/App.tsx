import React from "react";
import {CssBaseline, GlobalStyles} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import HomePage from "./pages/HomePage";
import "./assets/main.css"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ChartDataLabels
);

const theme = createTheme({
    palette: {
        mode: 'dark',
    }
});

const globalStyles = {
    '*::-webkit-scrollbar': {
        width: '0.2em'
    },
    '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(31,31,31,0.5)',
        outline: '0.5px solid slategrey'
    },
}

const App: React.FC = () => {

    return (
        <ThemeProvider theme={theme}>
            <div style={{padding: "1rem"}}>
                <GlobalStyles styles={globalStyles}/>
                <CssBaseline/>
                <HomePage/>
            </div>
        </ThemeProvider>
    );
};

export default App;
