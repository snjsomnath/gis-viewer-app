import React, { useState, useEffect, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { MapView, Layer, ViewStateChangeParameters } from '@deck.gl/core'; // Add ViewStateChangeParameters import
import LeftDrawer from './LeftDrawer';
import MapComponent from './MapComponent';
import SunlightSlider from './SunlightSlider';
import { loadGisData, loadTreeData } from '../utils/gisDataLoader';
import mapboxgl from 'mapbox-gl';
import { MapboxAccessToken } from '../config/mapbox';
import RightDrawer from './RightDrawer';
import { Map as MapIcon } from '@mui/icons-material'; // Add icon import

// Define ViewState interface
interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
    maxZoom?: number;
    minZoom?: number;
    maxPitch?: number;
    minPitch?: number;
}

interface LayerWithVisibility extends Layer<any> {
    isVisible: boolean;
    visible: boolean; // Add this to match LayerManagementTab's requirements
}

// Initial Map State
const INITIAL_VIEW_STATE: ViewState = {
    longitude: 11.9690435,
    latitude: 57.7068985,
    zoom: 17,
    pitch: 45,
    bearing: 0,
    maxZoom: 20,
    minZoom: 0,
    maxPitch: 60,
    minPitch: 0
};

const MapViewer: React.FC = () => {
    const [gisData, setGisData] = useState<any>(null);
    const [sunlightTime, setSunlightTime] = useState(Date.UTC(2019, 2, 1, 14));
    const [viewState, setViewState] = useState<{ [viewId: string]: ViewState }>({
        main: INITIAL_VIEW_STATE
    });

    // Memoize state values to avoid unnecessary renders
    const [basemapStyle, setBasemapStyle] = useState('mapbox://styles/mapbox/light-v10');
    const [treeData, setTreeData] = useState<any>(null);
    const [showBasemap, setShowBasemap] = useState(true);
    const [colorBy, setColorBy] = useState<string>(''); // Set default value to empty string

    const [layerVisibility, setLayerVisibility] = useState<{ [key: string]: boolean }>(() => ({
        buildings: true,
        'land-cover': true,
        'tree-layer': true,
        'tree-points-layer': true,
        'hbjson-glb-layer': true
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
    }, []);

    // Handlers: Memoized to prevent unnecessary re-renders
    const handleSliderChange = useCallback((newValue: number) => {
        setSunlightTime(newValue);
    }, []);

    const resetView = useCallback(() => {
        setViewState({ main: INITIAL_VIEW_STATE });
    }, []);

    const onViewStateChange = useCallback(<ViewStateT extends ViewState>({ viewId, viewState }: ViewStateChangeParameters<ViewStateT>) => {
        setViewState(prevState => ({
            ...prevState,
            [viewId]: viewState
        }));
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
            <LeftDrawer
                resetView={resetView}
                onBasemapChange={handleBasemapChange}
                layers={Object.keys(layerVisibility).map(id => ({
                    id,
                    isVisible: layerVisibility[id]
                } as LayerWithVisibility))}
                onVisibilityToggle={handleVisibilityToggle}
                onColorByChange={handleColorByChange}
            />
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <DeckGL
                    views={[new MapView({ id: 'main', controller: true })]}
                    viewState={viewState}
                    onViewStateChange={onViewStateChange}
                    style={{ backgroundColor: 'transparent', height: '100%', width: '100%' }}
                >
                    <MapComponent
                        initialViewState={{
                            ...viewState.main,
                            pitch: viewState.main.pitch ?? 0, // Provide default value for pitch
                            bearing: viewState.main.bearing ?? 0 // Provide default value for bearing
                        }}
                        mapboxAccessToken={mapboxgl.accessToken || ''}
                        sunlightTime={sunlightTime}
                        basemapStyle={basemapStyle}
                        gisData={gisData}
                        treeData={treeData}
                        layerVisibility={layerVisibility}
                        showBasemap={showBasemap}
                        colorBy={colorBy} // Pass colorBy to MapComponent
                    />
                </DeckGL>
                <SunlightSlider sunlightTime={sunlightTime} onSliderChange={handleSliderChange} />
                <button type="button" onClick={toggleBasemap} className="toggle-button basemap-toggle" style={{ position: 'fixed' }}>
                    <MapIcon />
                    Toggle Basemap
                </button>
            </div>
            {gisData && <RightDrawer geojsonData={gisData} />}
        </div>
    );
};

export default MapViewer;