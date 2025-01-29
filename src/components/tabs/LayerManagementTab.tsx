import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { tabContainerStyle } from './TabStyles';

interface LayerManagementTabProps {
    layers: { id: string, visible: boolean }[];
    onVisibilityToggle: (id: string) => void;
}

const LayerManagementTab: React.FC<LayerManagementTabProps> = ({ layers, onVisibilityToggle }) => {
    const predefinedLayers = [
        { id: 'buildings', name: 'Buildings' },
        { id: 'land-cover', name: 'Land Cover' },
        { id: 'tree-layer', name: 'Tree Layer' },
        { id: 'tree-points-layer', name: 'Tree Points Layer' }
    ];

    return (
        <Box sx={tabContainerStyle}>
            <Typography variant="h5" gutterBottom>Layer Management</Typography>
            <List>
                {predefinedLayers.map(layer => (
                    <ListItem key={layer.id}>
                        <ListItemText primary={layer.name} />
                        <IconButton onClick={() => onVisibilityToggle(layer.id)} sx={{ color: '#FFFFFF' }}>
                            {layers.find(l => l.id === layer.id)?.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            {/* Add drag-and-drop reordering and styling options here */}
        </Box>
    );
};

export default LayerManagementTab;
