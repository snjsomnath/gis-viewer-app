import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ImportDataTab: React.FC = () => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // Handle file upload logic here
        }
    };

    return (
        <Box sx={{ p: 2, width: '100%', backgroundColor: '#E0E0E0' }}>
            <Typography variant="h5" gutterBottom>Import Data</Typography>
            <Box sx={{ border: '2px dashed #ccc', p: 2, textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>Drag and drop your geoJSON files here</Typography>
                <Button variant="contained" component="label" sx={{ backgroundColor: '#FFFFFF', color: '#1E1E2D' }}>
                    Click to Upload
                    <input type="file" hidden onChange={handleFileUpload} />
                </Button>
            </Box>
            {/* Add progress indicator and recent uploads list here */}
        </Box>
    );
};

export default ImportDataTab;
