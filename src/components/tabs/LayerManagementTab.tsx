import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { tabContainerStyle } from './TabStyles';
const LayerManagementTab: React.FC = () => {
    const layers = [
        { id: 1, name: 'Layer 1', visible: true },
        { id: 2, name: 'Layer 2', visible: false },
        // Add more layers as needed
    ];

    const handleVisibilityToggle = (id: number) => {
        // Handle visibility toggle logic here
    };

    return (
        <Box sx={tabContainerStyle}>
            <Typography variant="h5" gutterBottom>Layer Management</Typography>
            <List>
                {layers.map(layer => (
                    <ListItem key={layer.id}>
                        <ListItemText primary={layer.name} />
                        <IconButton onClick={() => handleVisibilityToggle(layer.id)} sx={{ color: '#FFFFFF' }}>
                            {layer.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            {/* Add drag-and-drop reordering and styling options here */}
        </Box>
    );
};

export default LayerManagementTab;
