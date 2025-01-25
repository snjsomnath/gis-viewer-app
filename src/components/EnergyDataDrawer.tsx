import React, { useState } from 'react';
import {
    Drawer,
    Box,
    Tooltip,
    Divider,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
} from '@mui/material';
import {
    Home as HomeIcon,
    CloudUpload as CloudUploadIcon,
    Edit as EditIcon,
    Description as DescriptionIcon,
    Build as BuildIcon,
} from '@mui/icons-material';
import HomeTab from './tabs/HomeTab';
import ImportDataTab from './tabs/ImportDataTab';
import LayerManagementTab from './tabs/LayerManagementTab';
import BasemapTab from './tabs/BasemapTab';
import LightingTab from './tabs/LightingTab';
import { Layer as DeckLayer } from '@deck.gl/core'; // Import Layer from deck.gl/core

interface EnergyDataDrawerProps {
    resetView: () => void;
    onBasemapChange: (style: string) => void;
    layers: DeckLayer[]; // Use DeckLayer directly
    onVisibilityToggle: (id: string) => void;
}

const EnergyDataDrawer: React.FC<EnergyDataDrawerProps> = ({ resetView, onBasemapChange, layers, onVisibilityToggle }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [basemapStyle, setBasemapStyle] = useState('mapbox://styles/mapbox/light-v10');

    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handleBasemapChange = (style: string) => {
        setBasemapStyle(style);
        onBasemapChange(style);
    };

    const tabs = [
        { component: <HomeTab resetView={resetView} />, icon: <HomeIcon fontSize="large" />, tooltip: "Home" },
        { component: <ImportDataTab />, icon: <CloudUploadIcon fontSize="large" />, tooltip: "Import Data" },
        { component: <LayerManagementTab layers={layers} onVisibilityToggle={onVisibilityToggle} />, icon: <EditIcon fontSize="large" />, tooltip: "Layer Management" },
        { component: <BasemapTab onBasemapChange={handleBasemapChange} />, icon: <DescriptionIcon fontSize="large" />, tooltip: "Basemap" },
        { component: <LightingTab />, icon: <BuildIcon fontSize="large" />, tooltip: "Lighting" },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: 70,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 70,
                        boxSizing: 'border-box',
                        backgroundColor: '#1E1E2D',
                        color: '#FFFFFF',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                    <Typography variant="h6" noWrap sx={{ color: '#FFFFFF', ml: 1 }}>CSD</Typography>
                </Box>

                <Divider sx={{ backgroundColor: '#444' }} />

                <List>
                    {tabs.map((tab, index) => (
                        <Tooltip key={index} title={tab.tooltip} placement="right">
                            <ListItemButton
                                selected={selectedIndex === index}
                                onClick={() => handleListItemClick(index)}
                                disableGutters
                                sx={{ justifyContent: 'center' }}
                            >
                                <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 'auto' }}>
                                    {tab.icon}
                                </ListItemIcon>
                            </ListItemButton>
                        </Tooltip>
                    ))}
                </List>

                <Divider sx={{ backgroundColor: '#444' }} />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#E0E0E0' }}>
                {tabs[selectedIndex].component}
            </Box>
        </Box>
    );
};

export default EnergyDataDrawer;