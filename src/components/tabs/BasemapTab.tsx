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
        <Box className="tab-container">
            <Typography variant="h5" gutterBottom className="typography-header">
                Basemap Selection
            </Typography>
            <Select
                fullWidth
                value={selectedBasemap}
                onChange={handleBasemapChange}
                className="select-box"
                MenuProps={{
                    PaperProps: {
                        className: 'select-menu',
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
