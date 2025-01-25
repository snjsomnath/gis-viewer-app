import React, { useState, useEffect, useRef } from 'react';
import DeckGL, { DeckGLRef } from '@deck.gl/react';
import { MapView, ViewStateChangeParameters, Layer as DeckLayer } from '@deck.gl/core'; // Import Layer as DeckLayer
import EnergyDataDrawer from './EnergyDataDrawer';
import MapComponent from './MapComponent';
import SunlightSlider from './SunlightSlider'; // Import SunlightSlider
import { loadGisData, loadTreeData } from '../utils/gisDataLoader'; // Import loadTreeData
import { createLayers, createTreeLayer } from '../utils/layersConfig'; // Import createTreeLayer
import mapboxgl from 'mapbox-gl';  // Import mapbox-gl
import { MapboxAccessToken } from '../config/mapbox'; // Assuming this is correctly set
import RightDrawer from './RightDrawer'; // Import RightDrawer component

// Define view state type based on MapView requirements
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
    const [sunlightTime, setSunlightTime] = useState(Date.UTC(2019, 2, 1, 14)); // Set default start time to March 14:00
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
    const deckRef = useRef<DeckGLRef>(null);
    const [basemapStyle, setBasemapStyle] = useState('mapbox://styles/mapbox/light-v10'); // Add basemapStyle state
    const [treeData, setTreeData] = useState<any>(null);
    const [layerVisibility, setLayerVisibility] = useState<{ [key: string]: boolean }>({
        buildings: true,
        'land-cover': true,
        'tree-layer': true
    });

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

    const handleSliderChange = (newValue: number) => {
        setSunlightTime(newValue);
    };

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
        setBasemapStyle(style); // Update basemapStyle state
    };

    const handleVisibilityToggle = (layerId: string) => {
        setLayerVisibility(prevState => ({
            ...prevState,
            [layerId]: !prevState[layerId]
        }));
        const layer = layers.find(layer => layer.id === layerId);
        if (layer) {
            layer.props.visible = !layer.props.visible;
        }
    };

    const layers: DeckLayer[] = gisData ? [
        ...createLayers(gisData, () => {}, sunlightTime).filter(layer => layer && layerVisibility[layer.id]) as DeckLayer[],
        ...(treeData ? [createTreeLayer(treeData, 'tree-layer') as DeckLayer] : [])
    ] : [];

    console.log('Layers:', layers); // Add this line

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <EnergyDataDrawer 
                resetView={resetView} 
                onBasemapChange={handleBasemapChange} 
                layers={layers} 
                onVisibilityToggle={handleVisibilityToggle} 
            /> {/* Pass handleBasemapChange */}
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <DeckGL
                    ref={deckRef}
                    views={new MapView({ 
                        id: 'main',
                        controller: true 
                    })}
                    viewState={viewState}
                    onViewStateChange={onViewStateChange}
                    layers={layers}
                    style={{ backgroundColor: 'transparent', height: '100%', width: '100%' }}
                >
                    <MapComponent 
                        initialViewState={viewState} // Pass the updated viewState
                        mapboxAccessToken={mapboxgl.accessToken || ''}
                        sunlightTime={sunlightTime}
                        basemapStyle={basemapStyle} // Pass basemapStyle prop
                    />
                </DeckGL>
                <SunlightSlider
                    sunlightTime={sunlightTime}
                    onSliderChange={handleSliderChange}
                />
            </div>
            {gisData && <RightDrawer geojsonData={gisData} />} {/* Render RightDrawer only if gisData is not null */}
        </div>
    );
};

export default MapViewer;
