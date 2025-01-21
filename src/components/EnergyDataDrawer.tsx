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
import HomeTab from './HomeTab';
import ImportDataTab from './ImportDataTab';
import LayerManagementTab from './LayerManagementTab';
import BasemapTab from './BasemapTab';
import LightingTab from './LightingTab';

interface EnergyDataDrawerProps {
    resetView: () => void;
}

const EnergyDataDrawer: React.FC<EnergyDataDrawerProps> = ({ resetView }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
    };

    const renderContent = () => {
        switch (selectedIndex) {
            case 0:
                return <HomeTab resetView={resetView} />;
            case 1:
                return <ImportDataTab />;
            case 2:
                return <LayerManagementTab />;
            case 3:
                return <BasemapTab />;
            case 4:
                return <LightingTab />;
            default:
                return <HomeTab resetView={resetView} />;
        }
    };

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
                <Box sx={{ display: 'flex', justifyContent: 'centre', alignItems: 'centre', p: 1 }}>
                    <Typography variant="h6" noWrap sx={{ color: '#FFFFFF', ml: 1 }}>CSD</Typography>
                </Box>

                <Divider sx={{ backgroundColor: '#444' }} />

                {/* Navigation */}
                <List>
                    <Tooltip title="Home" placement="right">
                        <ListItemButton
                            selected={selectedIndex === 0}
                            onClick={() => handleListItemClick(0)}
                            disableGutters
                            sx={{ justifyContent: 'center' }}
                        >
                            <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 'auto' }}>
                                <HomeIcon fontSize="large" />
                            </ListItemIcon>
                        </ListItemButton>
                    </Tooltip>

                    <Tooltip title="Import Data" placement="right">
                        <ListItemButton
                            selected={selectedIndex === 1}
                            onClick={() => handleListItemClick(1)}
                            disableGutters
                            sx={{ justifyContent: 'center' }}
                        >
                            <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 'auto' }}>
                                <CloudUploadIcon fontSize="large" />
                            </ListItemIcon>
                        </ListItemButton>
                    </Tooltip>

                    <Tooltip title="Layer Management" placement="right">
                        <ListItemButton
                            selected={selectedIndex === 2}
                            onClick={() => handleListItemClick(2)}
                            disableGutters
                            sx={{ justifyContent: 'center' }}
                        >
                            <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 'auto' }}>
                                <EditIcon fontSize="large" />
                            </ListItemIcon>
                        </ListItemButton>
                    </Tooltip>

                    <Tooltip title="Basemap" placement="right">
                        <ListItemButton
                            selected={selectedIndex === 3}
                            onClick={() => handleListItemClick(3)}
                            disableGutters
                            sx={{ justifyContent: 'center' }}
                        >
                            <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 'auto' }}>
                                <DescriptionIcon fontSize="large" />
                            </ListItemIcon>
                        </ListItemButton>
                    </Tooltip>

                    <Tooltip title="Lighting" placement="right">
                        <ListItemButton
                            selected={selectedIndex === 4}
                            onClick={() => handleListItemClick(4)}
                            disableGutters
                            sx={{ justifyContent: 'center' }}
                        >
                            <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 'auto' }}>
                                <BuildIcon fontSize="large" />
                            </ListItemIcon>
                        </ListItemButton>
                    </Tooltip>
                </List>

                <Divider sx={{ backgroundColor: '#444' }} />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#E0E0E0' }}>
                {renderContent()}
            </Box>
        </Box>
    );
};

export default EnergyDataDrawer;