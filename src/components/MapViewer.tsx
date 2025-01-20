import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import EnergyDataDrawer from './EnergyDataDrawer';
import MapComponent from './MapComponent';
import SunlightSlider from './SunlightSlider'; // Import SunlightSlider
import { loadGisData } from '../utils/gisDataLoader';
import { createLayers } from '../utils/layersConfig';
import mapboxgl from 'mapbox-gl';  // Import mapbox-gl
import { MapboxAccessToken } from '../config/mapbox'; // Assuming this is correctly set

const INITIAL_VIEW_STATE = {
    longitude: 11.964164014667688,
    latitude: 57.707441012101015,
    zoom: 16,
    pitch: 45,
    bearing: 0,
};

const MapViewer: React.FC = () => {
    const [gisData, setGisData] = useState<any>(null);
    const [tokenValid, setTokenValid] = useState(false);
    const [sunlightTime, setSunlightTime] = useState(Date.UTC(2019, 2, 1, 14)); // Set default start time to March 14:00

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadGisData();
            setGisData(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const token = MapboxAccessToken || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        if (!token) {
            console.error('Mapbox token not found in configuration or environment variables');
            return;
        }
        mapboxgl.accessToken = token;
        setTokenValid(true);
    }, []);

    if (!tokenValid) {
        return <div>Error: Invalid or missing Mapbox token</div>;
    }

    const handleSliderChange = (newValue: number) => {
        setSunlightTime(newValue);
    };

    const layers = gisData ? createLayers(gisData, () => {}) : [];

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <EnergyDataDrawer />
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <DeckGL
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                    layers={layers}
                    style={{ backgroundColor: 'transparent', height: '100%', width: '100%' }}
                >
                    <MapComponent 
                        initialViewState={INITIAL_VIEW_STATE}
                        mapboxAccessToken={mapboxgl.accessToken || ''}
                        sunlightTime={sunlightTime} // Pass sunlightTime to MapComponent
                    />
                </DeckGL>
                <SunlightSlider
                    sunlightTime={sunlightTime}
                    onSliderChange={handleSliderChange}
                />
            </div>
        </div>
    );
};

export default MapViewer;
