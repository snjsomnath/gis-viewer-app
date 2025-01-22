import React from 'react';
import { Box, Typography, Switch, Slider } from '@mui/material';
import { tabContainerStyle } from './TabStyles';

const LightingTab: React.FC = () => {
    const [sunlight, setSunlight] = React.useState(true);
    const [sunColor, setSunColor] = React.useState(50);
    const [diffuseColor, setDiffuseColor] = React.useState(50);
    const [shadowColor, setShadowColor] = React.useState(50);

    const handleSunlightToggle = () => {
        setSunlight(!sunlight);
    };

    const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (
        event: Event,
        newValue: number | number[]
    ) => {
        setter(newValue as number);
    };

    return (
        <Box sx={tabContainerStyle}>
            <Typography variant="h5" gutterBottom sx={{ color: '#1E1E2D' }}>
                Lighting Setup
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" gutterBottom sx={{ flexGrow: 1, color: '#1E1E2D' }}>
                    Sunlight
                </Typography>
                <Switch checked={sunlight} onChange={handleSunlightToggle} sx={{ color: '#FFFFFF' }} />
            </Box>
            <Typography variant="body1" gutterBottom sx={{ color: '#1E1E2D' }}>
                Sun Color
            </Typography>
            <Slider value={sunColor} onChange={handleSliderChange(setSunColor)} sx={{ color: '#FFFFFF' }} />
            <Typography variant="body1" gutterBottom sx={{ color: '#1E1E2D' }}>
                Diffuse Color
            </Typography>
            <Slider value={diffuseColor} onChange={handleSliderChange(setDiffuseColor)} sx={{ color: '#FFFFFF' }} />
            <Typography variant="body1" gutterBottom sx={{ color: '#1E1E2D' }}>
                Shadow Color
            </Typography>
            <Slider value={shadowColor} onChange={handleSliderChange(setShadowColor)} sx={{ color: '#FFFFFF' }} />
            {/* Add live preview of lighting changes here */}
        </Box>
    );
};

export default LightingTab;
