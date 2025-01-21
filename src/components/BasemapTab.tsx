import React from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const BasemapTab: React.FC = () => {
    const basemaps = [
        { id: 'streets', name: 'Streets' },
        { id: 'satellite', name: 'Satellite' },
        { id: 'terrain', name: 'Terrain' },
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' },
    ];

    const handleBasemapChange = (event: SelectChangeEvent<string>) => {
        const selectedBasemap = event.target.value;
        // Handle basemap change logic here
    };

    return (
        <Box sx={{ p: 2, width: '100%', backgroundColor: '#E0E0E0' }}>
            <Typography variant="h5" gutterBottom>Basemap Selection</Typography>
            <Select
                fullWidth
                onChange={handleBasemapChange}
                defaultValue={basemaps[0].id}
                sx={{ backgroundColor: '#FFFFFF', color: '#1E1E2D' }}
            >
                {basemaps.map(basemap => (
                    <MenuItem key={basemap.id} value={basemap.id}>
                        {basemap.name}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default BasemapTab;

export {};
