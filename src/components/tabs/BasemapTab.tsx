import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
    },
    title: {
        color: '#1E1E2D',
        marginBottom: theme.spacing(2),
    },
    select: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        '& .MuiSelect-root': {
            padding: theme.spacing(1),
        },
    },
    menuPaper: {
        maxHeight: 200, // Fix dropdown height
        overflowY: 'auto',
    },
}));

interface BasemapTabProps {
    onBasemapChange: (basemapStyle: string) => void;
}

const BasemapTab: React.FC<BasemapTabProps> = ({ onBasemapChange }) => {
    const classes = useStyles();
    const [selectedBasemap, setSelectedBasemap] = useState('mapbox://styles/mapbox/light-v10');

    const basemaps = [
        { id: 'mapbox://styles/mapbox/light-v10', name: 'Light' },
        { id: 'mapbox://styles/mapbox/satellite-v9', name: 'Satellite' },
        { id: 'mapbox://styles/mapbox/outdoors-v11', name: 'Terrain' },
        { id: 'mapbox://styles/mapbox/streets-v11', name: 'Streets' },
        { id: 'mapbox://styles/mapbox/dark-v10', name: 'Dark' },
    ];

    const handleBasemapChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newBasemap = event.target.value as string;
        setSelectedBasemap(newBasemap);
        onBasemapChange(newBasemap);
    };

    return (
        <Box className={classes.container}>
            <Typography variant="h5" className={classes.title}>
                Basemap Selection
            </Typography>
            <Select
                fullWidth
                value={selectedBasemap}
                onChange={handleBasemapChange}
                variant="outlined"
                className={classes.select}
                MenuProps={{
                    PaperProps: { className: classes.menuPaper },
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
