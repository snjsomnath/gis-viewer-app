import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface BasemapTabProps {
    onBasemapChange: (basemapStyle: string) => void;
}

const BasemapTab: React.FC<BasemapTabProps> = ({ onBasemapChange }) => {
    const [selectedBasemap, setSelectedBasemap] = useState('mapbox://styles/mapbox/light-v10');

    const basemaps = [
        { id: 'mapbox://styles/mapbox/light-v10', name: 'Light' },
        { id: 'mapbox://styles/mapbox/satellite-v9', name: 'Satellite' },
        { id: 'mapbox://styles/mapbox/outdoors-v11', name: 'Terrain' },
        { id: 'mapbox://styles/mapbox/streets-v11', name: 'Streets' },
        { id: 'mapbox://styles/mapbox/dark-v10', name: 'Dark' },
    ];

    const handleBasemapChange = (event: SelectChangeEvent<string>) => {
        const newBasemap = event.target.value;
        setSelectedBasemap(newBasemap);
        onBasemapChange(newBasemap);
    };

    return (
        <Box sx={{ p: 2, width: '100%', backgroundColor: '#E0E0E0' }}>
            <Typography variant="h5" gutterBottom>
                Basemap Selection
            </Typography>
            <Select
                fullWidth
                value={selectedBasemap}
                onChange={handleBasemapChange}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 200, // Adjust height
                            overflow: 'auto',
                        },
                    },
                }}
                sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#1E1E2D',
                    '.MuiMenuItem-root': {
                        display: 'block', // Ensure block display for items
                    },
                }}
            >
                {basemaps.map((basemap) => (
                    <MenuItem key={basemap.id} value={basemap.id}>
                        {basemap.name}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default BasemapTab;
