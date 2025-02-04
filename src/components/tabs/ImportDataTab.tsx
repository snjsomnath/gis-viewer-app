import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ImportDataTab: React.FC = () => {
    // @ts-ignore
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // Handle file upload logic here
        }
    };

    return (
        <Box className="tab-container" component="div">
            <Typography variant="h5" gutterBottom className="typography-header">
                Import Data
            </Typography>
            <Typography variant="body1" gutterBottom>
                Upload your geoJSON files here.
            </Typography>
            <Button variant="contained" color="primary">
                Upload
            </Button>
        </Box>
    );
};

export default ImportDataTab;
