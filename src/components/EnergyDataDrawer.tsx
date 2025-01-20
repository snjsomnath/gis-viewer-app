// filepath: /d:/GitHub/CSD_viewer/gis-viewer-app/src/components/EnergyDataDrawer.tsx
import React, { useState } from 'react';
import {
    Drawer,
    IconButton,
    Box,
    Tooltip,
    Divider,
    Avatar,
    Typography,
    Badge,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    BarChart as BarChartIcon,
    Description as DescriptionIcon,
    Payment as PaymentIcon,
    Settings as SettingsIcon,
    Apps as AppsIcon,
    InsertDriveFile as InsertDriveFileIcon,
    CloudUpload as CloudUploadIcon,
    Edit as EditIcon,
    Build as BuildIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';

const EnergyDataDrawer: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: open ? 280 : 70,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? 280 : 70,
                    boxSizing: 'border-box',
                    transition: 'width 0.3s',
                    backgroundColor: '#1E1E2D',
                    color: '#FFFFFF',
                    overflowX: 'hidden',
                },
            }}
        >
            {/* Toggle Button */}
            <Box sx={{ display: 'flex', justifyContent: open ? 'space-between' : 'center', alignItems: 'center', p: 1 }}>
            {open && <Typography variant="h6" noWrap sx={{ color: '#FFFFFF', ml: 1 }}>CSD Viewer</Typography>}
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#FFFFFF' }}>
                {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            </Box>

            <Divider sx={{ backgroundColor: '#444' }} />

            {/* Navigation */}
            <List>
            <Tooltip title="Home" placement="right" disableHoverListener={open}>
                <ListItemButton
                selected={selectedIndex === 0}
                onClick={() => handleListItemClick(0)}
                >
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                    <HomeIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Home" />}
                </ListItemButton>
            </Tooltip>

            <Tooltip title="People" placement="right" disableHoverListener={open}>
                <ListItemButton
                selected={selectedIndex === 1}
                onClick={() => handleListItemClick(1)}
                >
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                    <PeopleIcon />
                </ListItemIcon>
                {open && <ListItemText primary="People" />}
                </ListItemButton>
            </Tooltip>

            <Tooltip title="Analytics" placement="right" disableHoverListener={open}>
                <ListItemButton
                selected={selectedIndex === 2}
                onClick={() => handleListItemClick(2)}
                >
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                    <Badge badgeContent="New" color="secondary">
                    <BarChartIcon />
                    </Badge>
                </ListItemIcon>
                {open && <ListItemText primary="Analytics" />}
                </ListItemButton>
            </Tooltip>

            <Divider sx={{ backgroundColor: '#444', my: 1 }} />

            <Tooltip title="Documents" placement="right" disableHoverListener={open}>
                <ListItemButton
                selected={selectedIndex === 3}
                onClick={() => handleListItemClick(3)}
                >
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                    <DescriptionIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Documents" />}
                </ListItemButton>
            </Tooltip>

            <Tooltip title="Payments" placement="right" disableHoverListener={open}>
                <ListItemButton
                selected={selectedIndex === 4}
                onClick={() => handleListItemClick(4)}
                >
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                    <PaymentIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Payments" />}
                </ListItemButton>
            </Tooltip>

            <Divider sx={{ backgroundColor: '#444', my: 1 }} />

            <Tooltip title="Import Data" placement="right" disableHoverListener={open}>
                <ListItemButton>
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                    <CloudUploadIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Import Data" />}
                </ListItemButton>
            </Tooltip>

            <Tooltip title="Edit Data" placement="right" disableHoverListener={open}>
                <ListItemButton>
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                    <EditIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Edit Data" />}
                </ListItemButton>
            </Tooltip>

            <Tooltip title="Build Scenarios" placement="right" disableHoverListener={open}>
                <ListItemButton>
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                    <BuildIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Build Scenarios" />}
                </ListItemButton>
            </Tooltip>
            </List>

            <Divider sx={{ backgroundColor: '#444' }} />
        </Drawer>
    );
};

export default EnergyDataDrawer;

export {};