import React, { useEffect, useState } from 'react';
import MapViewer from './components/MapViewer';
import RightDrawer from './components/RightDrawer';
import { WbSunny as WbSunnyIcon, Brightness2 as Brightness2Icon } from '@mui/icons-material';

const App: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [isNightMode, setIsNightMode] = useState(false);

  useEffect(() => {
    // Fetch the GeoJSON data
    fetch('/sample-date.geojson')
      .then(response => response.json())
      .then(data => setGeojsonData(data));
  }, []);

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
    document.body.classList.toggle('night-mode', !isNightMode);
  };

  return (
    <div id="app-container">
      <button 
        className="toggle-button nightmode-toggle" 
        onClick={toggleNightMode}
      >
        {isNightMode ? <WbSunnyIcon /> : <Brightness2Icon />}
      </button>
      <MapViewer />
      {geojsonData && <RightDrawer geojsonData={geojsonData} />}
    </div>
  );
};

export default App;