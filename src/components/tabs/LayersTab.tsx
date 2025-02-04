import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const LayersTab: React.FC = () => {
  return (
    <Box className="tab-container">
      <Typography variant="h5" gutterBottom className="typography-header">
        Layers
      </Typography>
      <Typography variant="body1" gutterBottom>
        Reorder, rename, or style your data layers here.
      </Typography>
      <Button variant="contained" color="primary">
        Manage Layers
      </Button>
    </Box>
  );
};

export default LayersTab;
