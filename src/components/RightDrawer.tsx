import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import AreaChart from './charts/AreaChart';
import HeightChart from './charts/HeightChart';
import FunctionChart from './charts/FunctionChart';

interface RightDrawerProps {
  geojsonData: any;
}

const RightDrawer: React.FC<RightDrawerProps> = ({ geojsonData }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getSummaryStatistics = (data: any) => {
    if (!data || !data.features || !Array.isArray(data.features)) {
      console.warn('Invalid GeoJSON data');
      return { totalBuildings: 0, totalArea: 0, avgHeight: 0, functionDistribution: {}, areaDistribution: [], heightDistribution: [] };
    }

    const totalBuildings = data.features.length;
    const totalArea = data.features.reduce((sum: number, feature: any) => sum + (feature.properties.area || 0), 0);
    const avgHeight =
      data.features.reduce((sum: number, feature: any) => sum + (feature.properties.height || 0), 0) / totalBuildings;
    const functionDistribution = data.features.reduce((dist: any, feature: any) => {
      const func = feature.properties.function || 'Unknown';
      dist[func] = (dist[func] || 0) + 1;
      return dist;
    }, {});
    const areaDistribution = data.features.map((feature: any) => feature.properties.area || 0);
    const heightDistribution = data.features.map((feature: any) => feature.properties.height || 0);

    return { totalBuildings, totalArea, avgHeight, functionDistribution, areaDistribution, heightDistribution };
  };

  const summaryStats = getSummaryStatistics(geojsonData);

  //const boxStyle = { display: 'flex' } as const;

  return (
    <div>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          backgroundColor: 'var(--chevron-bg)',
          '&:hover': { backgroundColor: 'var(--chevron-hover-bg)' },
          position: 'fixed',
          top: '50%',
          right: open ? '350px' : '10px', // Ensure right property is set correctly
          transform: 'translateY(-50%)',
          zIndex: 1500,
        }}
      >
        {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: 350,
            boxSizing: 'border-box',
            backgroundColor: 'var(--drawer-bg)',
            color: 'var(--drawer-text)',
            padding: 2,
          },
        }}
      >
        <Box
          component="div"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}
        >
          <Typography variant="h6" sx={{ color: 'var(--drawer-text)' }}>
            Summary Statistics
          </Typography>
          <IconButton onClick={toggleDrawer} sx={{ color: 'var(--drawer-text)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: 'var(--drawer-text)' }} />
        <Box
          component="div"
          sx={{ display: 'flex', flexDirection: 'column' }} // Ensure contents stack vertically
          className="content"
        >
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Total Buildings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h5">{summaryStats.totalBuildings}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Area of Buildings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="chart-container">
                <AreaChart data={summaryStats.areaDistribution} />
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Height of Buildings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="chart-container">
                <HeightChart data={summaryStats.heightDistribution} />
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Function Distribution</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="chart-container">
                <FunctionChart data={summaryStats.functionDistribution} />
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
    </div>
  );
};

export default RightDrawer;