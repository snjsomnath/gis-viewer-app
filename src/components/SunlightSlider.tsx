import React, { useState, useRef } from 'react';
import { Slider, Tooltip, IconButton, Collapse, Button, Paper } from '@mui/material';
import { ExpandMore, ExpandLess, WbSunny, Stop, AccessTime } from '@mui/icons-material';
import { DateTime } from 'luxon';

interface SunlightSliderProps {
    sunlightTime: number;
    onSliderChange: (newValue: number) => void;
}

const SunlightSlider: React.FC<SunlightSliderProps> = ({ sunlightTime, onSliderChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [animating, setAnimating] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDateChange = (event: any, newValue: number | number[]) => {
        const currentTime = DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm').diff(DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm').startOf('day')).toMillis();
        const newDate = DateTime.fromMillis(newValue as number).setZone('Europe/Stockholm').startOf('day').toMillis();
        const combinedDateTime = newDate + currentTime;
        onSliderChange(combinedDateTime);
    };

    const handleTimeChange = (event: any, newValue: number | number[]) => {
        const time = DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm').startOf('day').plus({ milliseconds: newValue as number }).toMillis();
        onSliderChange(time);
    };

    const animateSun = () => {
        setAnimating(true);
        let startTime = DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm').startOf('day').toMillis();
        const endTime = startTime + 24 * 3600000; // 24 hours in milliseconds
        const step = (endTime - startTime) / 60; // 6 seconds animation

        intervalRef.current = setInterval(() => {
            startTime += step;
            if (startTime >= endTime) {
                clearInterval(intervalRef.current!);
                setAnimating(false);
            }
            onSliderChange(startTime);
        }, 100);
    };

    const stopAnimation = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            setAnimating(false);
        }
    };

    const setToCurrentTime = () => {
        const now = DateTime.local().setZone('Europe/Stockholm').toMillis();
        onSliderChange(now);
    };

    return (
        <div style={{ position: 'absolute', bottom: 20, right: 20, width: 300, zIndex: 1 }}>
            <Paper style={{ padding: 8, backgroundColor: '#f5f5f5' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Sunlight settings">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <WbSunny />
                            <span style={{ marginLeft: 8 }}>Sunlight Settings</span>
                        </div>
                    </Tooltip>
                    <Tooltip title="Adjust sunlight time">
                        <IconButton onClick={handleExpandClick} style={{ marginLeft: 'auto' }}>
                            {expanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Tooltip>
                </div>
            </Paper>
            <Collapse in={expanded}>
                <Paper style={{ padding: 16, marginTop: 8, backgroundColor: '#e0e0e0' }}>
                    <Tooltip title="Select Date" arrow>
                        <Slider
                            value={DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm').startOf('day').toMillis()}
                            onChange={handleDateChange}
                            min={DateTime.local().setZone('Europe/Stockholm').startOf('year').toMillis()}
                            max={DateTime.local().setZone('Europe/Stockholm').endOf('year').toMillis()}
                            step={24 * 3600000} // 1 day in milliseconds
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => DateTime.fromMillis(value).toLocaleString(DateTime.DATE_MED)}
                        />
                    </Tooltip>
                    <Tooltip title="Select Time" arrow>
                        <Slider
                            value={DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm').diff(DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm').startOf('day')).toMillis()}
                            onChange={handleTimeChange}
                            min={0}
                            max={24 * 3600000} // 24 hours in milliseconds
                            step={3600000} // 1 hour in milliseconds
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => DateTime.fromMillis(value).toLocaleString(DateTime.TIME_SIMPLE)}
                        />
                    </Tooltip>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<WbSunny />}
                        onClick={animateSun}
                        disabled={animating}
                        style={{ marginTop: 8 }}
                    >
                        Animate Sun
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Stop />}
                        onClick={stopAnimation}
                        disabled={!animating}
                        style={{ marginTop: 8, marginLeft: 8 }}
                    >
                        Stop Animation
                    </Button>
                    <Button
                        variant="contained"
                        color="inherit"
                        startIcon={<AccessTime />}
                        onClick={setToCurrentTime}
                        style={{ marginTop: 8, marginLeft: 8 }}
                    >
                        Now
                    </Button>
                </Paper>
            </Collapse>
        </div>
    );
};

export default SunlightSlider;
