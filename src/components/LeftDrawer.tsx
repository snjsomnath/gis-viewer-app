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
    Dashboard as DashboardIcon,
    FileUpload as FileUploadIcon,
    Layers as LayersIcon,
    Map as MapIcon,
    WbSunny as WbSunnyIcon,
} from '@mui/icons-material';
import HomeTab from './tabs/HomeTab';
import ImportDataTab from './tabs/ImportDataTab';
import LayerManagementTab from './tabs/LayerManagementTab';
import BasemapTab from './tabs/BasemapTab';
import LightingTab from './tabs/LightingTab';
import { Layer } from '@deck.gl/core';

interface LayerWithVisibility extends Layer<{}> {
    isVisible: boolean;
    visible: boolean;  // Add this to match LayerManagementTab's requirements
    id: string;
}

interface LeftDrawerProps {
    resetView: () => void;
    onBasemapChange: (style: string) => void;
    layers: LayerWithVisibility[];
    onVisibilityToggle: (id: string) => void;
    onColorByChange: (colorBy: string) => void;
}

const LeftDrawer: React.FC<LeftDrawerProps> = ({ 
    resetView, 
    onBasemapChange, 
    layers, 
    onVisibilityToggle, 
    onColorByChange 
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handleListItemClick = (index: number) => setSelectedIndex(index);

    const handleBasemapChange = (style: string) => onBasemapChange(style);

    const tabs = [
        { 
            component: <HomeTab resetView={resetView} />, 
            icon: <DashboardIcon />, 
            tooltip: "Home" 
        },
        { 
            component: <ImportDataTab />, 
            icon: <FileUploadIcon />, 
            tooltip: "Import Data" 
        },
        { 
            component: <LayerManagementTab layers={layers} onVisibilityToggle={onVisibilityToggle} onColorByChange={onColorByChange} />, 
            icon: <LayersIcon />, 
            tooltip: "Layer Management" 
        },
        { 
            component: <BasemapTab onBasemapChange={handleBasemapChange} />, 
            icon: <MapIcon />, 
            tooltip: "Basemap" 
        },
        { 
            component: <LightingTab />, 
            icon: <WbSunnyIcon />, 
            tooltip: "Lighting" 
        },
    ];

    const boxStyle = { display: 'flex' } as const;  // Fix complex union type

    return (
        <Box sx={boxStyle} component="div">
            {/* Sidebar Drawer */}
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: 70,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 70,
                        boxSizing: 'border-box',
                        backgroundColor: 'var(--left-drawer-bg)', // updated from hardcoded
                        color: 'var(--left-drawer-text)',         // updated from hardcoded
                        overflowX: 'hidden',
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }} component="div">
                    <Typography variant="h6" noWrap sx={{ color: 'var(--left-drawer-text)' }}>
                        SBE
                    </Typography>
                </Box>

                <Divider sx={{ backgroundColor: 'var(--left-drawer-text)', mb: 1 }} />

                {/* Sidebar Icons */}
                <List sx={{ p: 0 }}>
                    {tabs.map((tab, index) => (
                        <Tooltip key={index} title={tab.tooltip} placement="right">
                            <ListItemButton
                                selected={selectedIndex === index}
                                onClick={() => handleListItemClick(index)}
                                disableGutters
                                sx={{ p: 0, justifyContent: 'center' }} // removed extra padding
                            >
                                <ListItemIcon className="left-drawer-icon">
                                    {tab.icon}
                                </ListItemIcon>
                            </ListItemButton>
                        </Tooltip>
                    ))}
                </List>

                <Divider className="left-drawer-divider" />
            </Drawer>

            {/* Main Content Area */}
            <Box 
              component="main" 
              sx={{ flexGrow: 1, p: 0, backgroundColor: 'var(--main-bg)' /* using variable */ }}
            >
                {tabs[selectedIndex]?.component ?? <Typography>Invalid Tab</Typography>}
            </Box>
        </Box>
    );
};

export default LeftDrawer;
