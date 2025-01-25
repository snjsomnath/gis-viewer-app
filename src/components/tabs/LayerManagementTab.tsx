import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { tabContainerStyle } from './TabStyles';
import { Layer as DeckLayer } from '@deck.gl/core'; // Import Layer from deck.gl/core

interface LayerManagementTabProps {
    layers: DeckLayer[];
    onVisibilityToggle: (id: string) => void;
}

const LayerManagementTab: React.FC<LayerManagementTabProps> = ({ layers, onVisibilityToggle }) => {
    return (
        <Box sx={tabContainerStyle}>
            <Typography variant="h5" gutterBottom>Layer Management</Typography>
            <List>
                {layers.map(layer => (
                    <ListItem key={layer.id}>
                        <ListItemText primary={layer.id} />
                        <IconButton onClick={() => onVisibilityToggle(layer.id)} sx={{ color: '#FFFFFF' }}>
                            {layer.props.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            {/* Add drag-and-drop reordering and styling options here */}
        </Box>
    );
};

export default LayerManagementTab;
