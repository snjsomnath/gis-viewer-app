import React from 'react';
import { Box, Typography, Switch, Slider } from '@mui/material';

const LightingTab: React.FC = () => {
    const [sunlight, setSunlight] = React.useState(true);
    const [sunColor, setSunColor] = React.useState(50);
    const [diffuseColor, setDiffuseColor] = React.useState(50);
    const [shadowColor, setShadowColor] = React.useState(50);

    const handleSunlightToggle = () => {
        setSunlight(!sunlight);
    };

    const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (
        _: Event,
        newValue: number | number[]
    ) => {
        setter(newValue as number);
    };

    return (
        <Box className="tab-container" component="div">
            <Typography variant="h5" gutterBottom className="typography-header">
                Lighting Setup
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}component="div">
                <Typography variant="body1" gutterBottom sx={{ flexGrow: 1 }}>
                    Sunlight
                </Typography>
                <Switch checked={sunlight} onChange={handleSunlightToggle} />
            </Box>
            <Typography variant="body1" gutterBottom>
                Sun Color
            </Typography>
            <Slider value={sunColor} onChange={handleSliderChange(setSunColor)} />
            <Typography variant="body1" gutterBottom>
                Diffuse Color
            </Typography>
            <Slider value={diffuseColor} onChange={handleSliderChange(setDiffuseColor)} />
            <Typography variant="body1" gutterBottom>
                Shadow Color
            </Typography>
            <Slider value={shadowColor} onChange={handleSliderChange(setShadowColor)} />
        </Box>
    );
};

export default LightingTab;
