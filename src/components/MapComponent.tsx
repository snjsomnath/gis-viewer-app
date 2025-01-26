import React, { useRef, useEffect, useState } from 'react';
import { Map, NavigationControl, GeolocateControl } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import DeckGL from '@deck.gl/react';
import { createLayers, createTreeLayer } from '../utils/layersConfig';
import { lightingEffect, dirLight } from '../utils/lightingEffects';
import './PopupComponent.css';
import SunlightSlider from './SunlightSlider';

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN as string;

const INITIAL_VIEW_STATE = {
    longitude: 11.964164014667688,
    latitude: 57.707441012101015,
    zoom: 16,
    pitch: 45,
    bearing: 0,
};

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
    showBasemap: boolean; // Add showBasemap prop
    treePointsData: any; // Add treePointsData prop
}

const MapComponent: React.FC<MapComponentProps> = ({ 
    initialViewState,
    mapboxAccessToken,
    sunlightTime,
    basemapStyle,
    gisData,
    treeData,
    layerVisibility,
    showBasemap, // Add showBasemap prop
    treePointsData // Add treePointsData prop
}) => {
    const mapRef = useRef<any>(null);
    const [effects] = useState(() => [lightingEffect]);

    useEffect(() => {
        if (mapRef.current && !mapRef.current.getMap().geocoderAdded) {
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxAccessToken,
                mapboxgl: mapRef.current.getMap(),
            });

            mapRef.current.getMap().addControl(geocoder, 'top-right');
            mapRef.current.getMap().geocoderAdded = true;
        }
    }, [mapboxAccessToken]);

    useEffect(() => {
        dirLight.timestamp = sunlightTime;
    }, [sunlightTime]);


    const handleLayerClick = (info: any) => {
        // Handle layer click if needed
    };

    const predefinedAttributes = [
        'name', 'type', 'status', 'height', 'function', 'floors', 'floor_height', 'roof_type', 'EPC_class', 'annual_energy', 'area'
    ];

    const getTooltip = (info: { object?: any }) => {
        const { object } = info;
        if (!object) return null;
        const properties = object.properties || {};
        const tooltipContent = predefinedAttributes.map(attr => {
            return `${attr}: ${properties[attr] !== undefined ? properties[attr] : 'Not available'}`;
        }).join('\n');
        return { text: tooltipContent };
    };

    // Set the colorBy layer to 'xx' for the buildings
    const colorBy = 'function';

    const layers = gisData ? createLayers(gisData, treeData, handleLayerClick, sunlightTime, colorBy).filter(layer => 
        layerVisibility[layer.id]
    ) : [];

    //console.log('Layers passed to DeckGL:', layers); // Add log

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
            <SunlightSlider
                sunlightTime={sunlightTime}
                onSliderChange={() => {}}
            />
        </div>
    );
};

export default MapComponent;
