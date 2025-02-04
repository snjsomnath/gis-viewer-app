import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL from '@deck.gl/react';
import { createLayers } from '../utils/layersConfig';
import { lightingEffect, dirLight } from '../utils/lightingEffects';
import './PopupComponent.css';
import SunlightSlider from './SunlightSlider';
import Stats from 'stats.js';

interface MapComponentProps {
    initialViewState: {
        longitude: number;
        latitude: number;
        zoom: number;
        pitch: number;
        bearing: number;
    };
    mapboxAccessToken: string;
    sunlightTime: number;
    basemapStyle: string;
    gisData: any;
    treeData: any;
    layerVisibility: { [key: string]: boolean };
    showBasemap: boolean;
    colorBy: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
    initialViewState,
    mapboxAccessToken,
    sunlightTime,
    basemapStyle,
    gisData,
    treeData,
    layerVisibility,
    showBasemap,
    colorBy
}) => {
    const stats = useRef<Stats | null>(null);
    const [layers, setLayers] = useState<any[]>([]);

    // Memoize lighting effects to prevent re-renders
    const effects = useMemo(() => [lightingEffect], []);

    // Update light effect when sunlightTime changes
    useEffect(() => {
        dirLight.timestamp = sunlightTime;
    }, [sunlightTime]);

    // Set up FPS monitoring in development mode
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

    // Handle layer clicks
    const handleLayerClick = useCallback((info: { object?: any }) => {
        if (!info.object) return;
        console.log("Clicked on:", info.object);
    }, []);

    // Update layers when data or settings change
    useEffect(() => {
        if (!gisData || !treeData) return;

        const updateLayers = async () => {
            try {
                console.log('Updating layers with colorBy:', colorBy);
                const resolvedLayers = await createLayers(gisData, treeData, handleLayerClick, sunlightTime, colorBy);
                
                setLayers(resolvedLayers.filter(layer => layer && layerVisibility[(layer as any).id]));
                console.log('Resolved layers:', resolvedLayers);
            } catch (error) {
                console.error("Error updating layers:", error);
            }
        };

        updateLayers();
    }, [gisData, treeData, sunlightTime, layerVisibility, colorBy]);

    // Memoize tooltip function to prevent unnecessary re-renders
    const getTooltip = useCallback((info: { object?: any }) => {
        if (!info.object) return null;
        const properties = info.object.properties || {};
        return {
            text: [
                `Name: ${properties.name || 'N/A'}`,
                `Type: ${properties.type || 'N/A'}`,
                `Height: ${properties.height || 'N/A'} m`,
                `Function: ${properties.function || 'N/A'}`,
                `Floors: ${properties.floors || 'N/A'}`,
            ].join('\n')
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <DeckGL
                initialViewState={initialViewState}
                controller={true}
                layers={layers}
                effects={effects}
                getTooltip={getTooltip}
                useDevicePixels={true}
            >
                {showBasemap && (
                    <Map
                        initialViewState={initialViewState}
                        mapboxAccessToken={mapboxAccessToken}
                        mapStyle={basemapStyle}
                        reuseMaps
                    />
                )}
            </DeckGL>
            <SunlightSlider sunlightTime={sunlightTime} onSliderChange={() => {}} />
        </div>
    );
};

export default MapComponent;
