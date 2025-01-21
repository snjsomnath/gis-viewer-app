import React, { useRef, useEffect, useState } from 'react';
import { Map, NavigationControl, GeolocateControl } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import DeckGL from '@deck.gl/react'; // Correct import statement
import { createLayers } from '../utils/layersConfig';
import { loadGisData } from '../utils/gisDataLoader';
import './PopupComponent.css'; // Import the CSS file
import SunlightSlider from './SunlightSlider'; // Import the new SunlightSlider component
import { lightingEffect, dirLight } from '../utils/lightingEffects';

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
    sunlightTime: number; // Add sunlightTime prop
    basemapStyle: string; // Add basemapStyle prop
}

const MapComponent: React.FC<MapComponentProps> = ({ 
    initialViewState,
    mapboxAccessToken,
    sunlightTime,
    basemapStyle // Add basemapStyle prop
}) => {
    const mapRef = useRef<any>(null);
    const [gisData, setGisData] = useState(null);
    const [effects] = useState(() => [lightingEffect]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadGisData();
            setGisData(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (mapRef.current && !mapRef.current.getMap().geocoderAdded) {
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxAccessToken,
                mapboxgl: mapRef.current.getMap(),
            });

            // Add geocoder only once
            mapRef.current.getMap().addControl(geocoder, 'top-right');
            mapRef.current.getMap().geocoderAdded = true;
        }
    }, [mapboxAccessToken]);

    useEffect(() => {
        dirLight.timestamp = sunlightTime; // Update dirLight timestamp
    }, [sunlightTime]);

    const handleLayerClick = (info: any) => {
        // Handle layer click if needed
    };

    const predefinedAttributes = [
        'name',          // Building or feature name
        'type',          // Type of feature (e.g., building, landmark)
        'status',        // Status (e.g., active, under construction)
        'height',        // Height of the feature in meters
        'function',      // Building function (e.g., Residential, Office)
        'floors',        // Number of floors
        'floor_height',  // Average height of each floor in meters
        'roof_type',     // Type of roof (e.g., Flat, Gabled)
        'EPC_class',     // Energy Performance Certificate class
        'annual_energy', // Annual energy usage in kWh
        'area'           // Area of the feature in square meters
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

    const layers = gisData ? createLayers(gisData, handleLayerClick, sunlightTime) : [];

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <DeckGL
                initialViewState={initialViewState}
                controller={true}
                layers={layers}
                effects={effects} // Ensure lightingEffect is applied
                getTooltip={getTooltip}
            >
                <Map
                    initialViewState={initialViewState}
                    mapboxAccessToken={mapboxAccessToken}
                    mapStyle={basemapStyle} // Use basemapStyle prop
                    reuseMaps
                />
            </DeckGL>
            <SunlightSlider
                sunlightTime={sunlightTime}
                onSliderChange={() => {}}
            />
        </div>
    );
};

export default MapComponent;
