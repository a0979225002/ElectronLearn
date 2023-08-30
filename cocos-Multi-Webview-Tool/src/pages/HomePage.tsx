import React from "react";
import Box from '@mui/material/Box';
import OpenWebview from "../components/OpenWebview";

const HomePage: React.FC = () => {
    return (
        <Box sx={{width: '100%', typography: 'body1'}}>
            <OpenWebview/>
        </Box>
    );
};

export default HomePage;
