import React, { useEffect, useRef, useMemo } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);

interface FunctionChartProps {
  data: { [key: string]: number };
}

const FunctionChart: React.FC<FunctionChartProps> = ({ data }) => {
  const chartInstance = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(memoizedData),
        datasets: [
          {
            label: 'Function Distribution',
            data: Object.values(memoizedData),
            backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0'],
          },
        ],
      },
      options: {
        scales: {
          x: { 
            stacked: true 
          },
          y: { 
            stacked: true 
          }
        }
      }
      
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [memoizedData]);

  return <canvas ref={canvasRef}></canvas>;
};

export default React.memo(FunctionChart);
