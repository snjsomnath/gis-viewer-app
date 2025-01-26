import React, { useState, useEffect, useRef } from 'react';
import DeckGL, { DeckGLRef } from '@deck.gl/react';
import { MapView, ViewStateChangeParameters } from '@deck.gl/core';
import EnergyDataDrawer from './EnergyDataDrawer';
import MapComponent from './MapComponent';
import SunlightSlider from './SunlightSlider';
import { loadGisData, loadTreeData } from '../utils/gisDataLoader';
import mapboxgl from 'mapbox-gl';
import { MapboxAccessToken } from '../config/mapbox';
import RightDrawer from './RightDrawer';

// Initialising an interface for the view state so we can use it later
interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
    maxZoom?: number;
    minZoom?: number;
    maxPitch?: number;
    minPitch?: number;
}

// Initial view state for the map
const INITIAL_VIEW_STATE: ViewState = {
    longitude: 11.964164014667688,
    latitude: 57.707441012101015,
    zoom: 16,
    pitch: 45,
    bearing: 0,
    maxZoom: 20,
    minZoom: 0,
    maxPitch: 60,
    minPitch: 0
};

// Main component for the map viewer
const MapViewer: React.FC = () => {
    const [gisData, setGisData] = useState<any>(null);
    const [tokenValid, setTokenValid] = useState(false);
    const [sunlightTime, setSunlightTime] = useState(Date.UTC(2019, 2, 1, 14));
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
    const deckRef = useRef<DeckGLRef>(null);
    const [basemapStyle, setBasemapStyle] = useState('mapbox://styles/mapbox/light-v10');
    const [treeData, setTreeData] = useState<any>(null); // For scenegraph tree data
    const [treePointsData, setTreePointsData] = useState<any>(null); // Add state for tree points data
    const [layerVisibility, setLayerVisibility] = useState<{ [key: string]: boolean }>({
        buildings: true,
        'land-cover': true,
        'tree-layer': true,
        'tree-points-layer': true // Add tree-points-layer
    });
    const [showBasemap, setShowBasemap] = useState(true); // Add showBasemap state

    // A useeffect is used to load the GIS data when the component is mounted
    // By using async/await we can wait for the data to be loaded before setting the state
    useEffect(() => {
        const fetchData = async () => {
            const data = await loadGisData();
            setGisData(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchTreeData = async () => {
            const data = await loadTreeData();
            setTreeData(data);
            setTreePointsData(data); // Set tree points data
        };
        fetchTreeData();
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


    // Function to handle the slider change for the sunlight time
    const handleSliderChange = (newValue: number) => {
        setSunlightTime(newValue);
    };

    // Function to reset the view state
    const resetView = () => {
        setViewState({ ...INITIAL_VIEW_STATE });
        if (deckRef.current && deckRef.current.deck) {
            deckRef.current.deck.setProps({ viewState: INITIAL_VIEW_STATE });
        }
    };

    const onViewStateChange = (params: ViewStateChangeParameters) => {
        if (params.viewState) {
            setViewState(params.viewState);
        }
    };

    const handleBasemapChange = (style: string) => {
        setBasemapStyle(style);
    };

    const handleVisibilityToggle = (layerId: string) => {
        setLayerVisibility(prevState => ({
            ...prevState,
            [layerId]: !prevState[layerId]
        }));
    };

    const toggleBasemap = () => {
        setShowBasemap(prevState => !prevState);
    };


    // Finally, the main return statement for the component
    // This will render the EnergyDataDrawer, DeckGL component, SunlightSlider, and a button to toggle the basemap
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <EnergyDataDrawer 
                resetView={resetView} 
                onBasemapChange={handleBasemapChange} 
                layers={[]} 
                onVisibilityToggle={handleVisibilityToggle} 
            />
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <DeckGL
                    ref={deckRef}
                    views={new MapView({ 
                        id: 'main',
                        controller: true 
                    })}
                    viewState={viewState}
                    onViewStateChange={onViewStateChange}
                    style={{ backgroundColor: 'transparent', height: '100%', width: '100%' }}
                >
                    <MapComponent 
                        initialViewState={viewState}
                        mapboxAccessToken={mapboxgl.accessToken || ''}
                        sunlightTime={sunlightTime}
                        basemapStyle={basemapStyle}
                        gisData={gisData}
                        treeData={treeData}
                        layerVisibility={layerVisibility} // Pass layer visibility
                        showBasemap={showBasemap} // Pass showBasemap prop
                        treePointsData={treeData} // Pass tree points data
                    />
                </DeckGL>
                <SunlightSlider
                    sunlightTime={sunlightTime}
                    onSliderChange={handleSliderChange}
                />
                <button onClick={toggleBasemap} style={{ position: 'absolute', top: 10, right: 10 }}>
                    Toggle Basemap
                </button>
            </div>
            {gisData && <RightDrawer geojsonData={gisData} />}
        </div>
    );
};

export default MapViewer;
