import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import DeckGL, { DeckGLRef } from '@deck.gl/react';
import { MapView, ViewStateChangeParameters } from '@deck.gl/core';
import EnergyDataDrawer from './EnergyDataDrawer';
import MapComponent from './MapComponent';
import SunlightSlider from './SunlightSlider';
import { loadGisData, loadTreeData } from '../utils/gisDataLoader';
import mapboxgl from 'mapbox-gl';
import { MapboxAccessToken } from '../config/mapbox';
import RightDrawer from './RightDrawer';
import Stats from 'stats.js';
import { Layer } from '@deck.gl/core';

// Define ViewState interface
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

interface LayerWithVisibility extends Layer {
    visible: boolean;
}

// Initial Map State
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

const MapViewer: React.FC = () => {
    const [gisData, setGisData] = useState<any>(null);
    const [tokenValid, setTokenValid] = useState(false);
    const [sunlightTime, setSunlightTime] = useState(Date.UTC(2019, 2, 1, 14));
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
    const deckRef = useRef<DeckGLRef>(null);
    const stats = useRef<Stats | null>(null);

    // Memoize state values to avoid unnecessary renders
    const [basemapStyle, setBasemapStyle] = useState('mapbox://styles/mapbox/light-v10');
    const [treeData, setTreeData] = useState<any>(null);
    const [treePointsData, setTreePointsData] = useState<any>(null);
    const [showBasemap, setShowBasemap] = useState(true);
    
    const [colorBy, setColorBy] = useState<string>(''); // Set default value to empty string

    const [layerVisibility, setLayerVisibility] = useState<{ [key: string]: boolean }>(() => ({
        buildings: true,
        'land-cover': true,
        'tree-layer': true,
        'tree-points-layer': true
    }));

    // Load GIS Data once
    useEffect(() => {
        const fetchData = async () => {
            if (!gisData) {
                const data = await loadGisData();
                setGisData(data);
            }
        };
        fetchData();
    }, [gisData]);

    // Load Tree Data once
    useEffect(() => {
        const fetchTreeData = async () => {
            if (!treeData) {
                const data = await loadTreeData();
                setTreeData(data);
                setTreePointsData(data);
            }
        };
        fetchTreeData();
    }, [treeData]);

    // Mapbox Token Validation
    useEffect(() => {
        const token = MapboxAccessToken || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        if (!token) {
            console.error('Mapbox token missing in configuration');
            return;
        }
        mapboxgl.accessToken = token;
        setTokenValid(true);
    }, []);

    // FPS Monitoring (Development Mode Only)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            stats.current = new Stats();
            stats.current.showPanel(0);
            Object.assign(stats.current.dom.style, {
                position: 'fixed',
                top: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '100000'
            });
            document.body.appendChild(stats.current.dom);

            const animate = () => {
                stats.current?.begin();
                stats.current?.end();
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }, []);

    // Handlers: Memoized to prevent unnecessary re-renders
    const handleSliderChange = useCallback((newValue: number) => {
        setSunlightTime(newValue);
    }, []);

    const resetView = useCallback(() => {
        setViewState(INITIAL_VIEW_STATE);
    }, []);

    const onViewStateChange = useCallback((params: ViewStateChangeParameters) => {
        if (params.viewState) {
            setViewState(params.viewState);
        }
    }, []);

    const handleBasemapChange = useCallback((style: string) => {
        setBasemapStyle(style);
    }, []);

    const handleVisibilityToggle = useCallback((layerId: string) => {
        setLayerVisibility(prevState => ({
            ...prevState,
            [layerId]: !prevState[layerId]
        }));
    }, []);

    const toggleBasemap = useCallback(() => {
        setShowBasemap(prevState => !prevState);
    }, []);

    const handleColorByChange = useCallback((colorBy: string) => {
        console.log('Color by changed to:', colorBy); // Add this line
        setColorBy(colorBy); // Update state when colorBy changes
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <EnergyDataDrawer 
                resetView={resetView} 
                onBasemapChange={handleBasemapChange} 
                layers={Object.keys(layerVisibility).map(id => ({ id, visible: layerVisibility[id] } as LayerWithVisibility))} 
                onVisibilityToggle={handleVisibilityToggle} 
                onColorByChange={handleColorByChange} // Add this line
            />
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <DeckGL
                    ref={deckRef}
                    views={new MapView({ id: 'main', controller: true })}
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
                        layerVisibility={layerVisibility}
                        showBasemap={showBasemap}
                        treePointsData={treeData}
                        colorBy={colorBy} // Pass colorBy to MapComponent
                    />
                </DeckGL>
                <SunlightSlider sunlightTime={sunlightTime} onSliderChange={handleSliderChange} />
                <button onClick={toggleBasemap} style={{ position: 'absolute', top: 10, right: 10 }}>
                    Toggle Basemap
                </button>
            </div>
            {gisData && <RightDrawer geojsonData={gisData} />}
        </div>
    );
};

export default MapViewer;
