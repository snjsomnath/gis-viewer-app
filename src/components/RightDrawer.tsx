import React, { useState, useEffect } from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloseIcon from '@material-ui/icons/Close';
import Chart from 'chart.js';
import './RightDrawer.css'; // Import the CSS file

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

  useEffect(() => {
    const areaCtx = document.getElementById('areaChart') as HTMLCanvasElement;
    const heightCtx = document.getElementById('heightChart') as HTMLCanvasElement;
    const functionCtx = document.getElementById('functionChart') as HTMLCanvasElement;

    if (areaCtx) {
      new Chart(areaCtx, {
        type: 'bar',
        data: {
          labels: summaryStats.areaDistribution.map((_: number, index: number) => `Building ${index + 1}`),
          datasets: [
            {
              label: 'Area (m²)',
              data: summaryStats.areaDistribution,
              backgroundColor: '#ff9800',
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    }

    if (heightCtx) {
      new Chart(heightCtx, {
        type: 'bar',
        data: {
          labels: summaryStats.heightDistribution.map((_: number, index: number) => `Building ${index + 1}`),
          datasets: [
            {
              label: 'Height (m)',
              data: summaryStats.heightDistribution,
              backgroundColor: '#2196f3',
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    }

    if (functionCtx) {
      new Chart(functionCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(summaryStats.functionDistribution),
          datasets: [
            {
              label: 'Function Distribution',
              data: Object.values(summaryStats.functionDistribution) as number[], // Ensure data is an array of numbers
              backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0'],
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }],
          },
        },
      });
    }
  }, [summaryStats]);

  return (
    <div>
      <IconButton
        className={`chevron ${open ? 'chevron-open' : ''}`}
        onClick={toggleDrawer}
      >
        {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        classes={{ paper: 'drawer-paper' }}
        variant="persistent"
      >
        <div className="drawer-header">
          <Typography variant="h6">Summary Statistics</Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <Box className="content">
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
                <canvas id="areaChart"></canvas>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Height of Buildings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="chart-container">
                <canvas id="heightChart"></canvas>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Function Distribution</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="chart-container">
                <canvas id="functionChart"></canvas>
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
    </div>
  );
};

export default RightDrawer;
