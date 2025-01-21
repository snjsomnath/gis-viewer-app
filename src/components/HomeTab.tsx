import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface HomeTabProps {
    resetView: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ resetView }) => {
    return (
        <Box sx={{ p: 2, width: '100%', backgroundColor: '#E0E0E0' }}>
            <Typography variant="h5" gutterBottom>Welcome to CSD Viewer</Typography>
            <Typography variant="body1" gutterBottom>
                Use the Import Data tab to upload geoJSON files.
            </Typography>
            <Typography variant="body1" gutterBottom>
                Navigate through Layers to reorder, rename, or style your data.
            </Typography>
            <Typography variant="body1" gutterBottom>
                Adjust lighting in the Lighting tab.
            </Typography>
            <Button variant="contained" color="primary" onClick={resetView}>Reset View</Button>
        </Box>
    );
};

export default HomeTab;

export {};
