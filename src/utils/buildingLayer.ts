import { GeoJsonLayer } from '@deck.gl/layers';
import { getColorFromValue } from './colormapHelpers';
import { Feature, Polygon, MultiPolygon } from 'geojson';
//import type { Position } from '@deck.gl/core';

interface BuildingFeature extends Feature<Polygon | MultiPolygon> {
    properties: {
        height?: number;
        isFloor?: boolean;
        [key: string]: any;
    };
}

type BuildingGeoJSON = {
    features: BuildingFeature[];
};

// Remove unused types
// type ElevationAccessor = (f: BuildingFeature) => number;
// type ColorAccessor = (f: BuildingFeature) => number[];

/**
 * Creates a building layer with dynamic coloring and elevation
 * @param gisData GeoJSON building data
 * @param handleLayerClick Click event handler
 * @param timeOfDay Current time period (day/night)
 * @param colorBy Property name for color mapping
 */
export const createBuildingLayer = (
    gisData: BuildingGeoJSON,
    handleLayerClick: (info: any) => void,
    _timeOfDay: string,
    colorBy: string
) => {
    console.log('Creating Building Layer with colorBy:', colorBy);

    const features = gisData.features;
    const min = Math.min(...features.map((f: BuildingFeature) => f.properties[colorBy] || 0));
    const max = Math.max(...features.map((f: BuildingFeature) => f.properties[colorBy] || 0));

    return new GeoJsonLayer({
        id: "buildings",
        data: gisData as any, // Fix type error
        extruded: true,
        wireframe: true,
        opacity: 1,
        getElevation: (f: any) => f.properties.height || 0,
        getFillColor: (d: any): [number, number, number, number] => {
            if (d.properties.isFloor) return [0, 0, 0, 0];
            
            const value = d.properties[colorBy];
            if (value == null || colorBy === '') return [255, 255, 255, 255];

            return getColorFromValue(value, colorBy, typeof value === "string", min, max);
        },
        material: {
            ambient: 0.3,
            diffuse: 0.2,
            shininess: 10,
            specularColor: [150, 180, 180]
        },
        _shadows: true,
        pickable: true,
        useScreenPixels: true,
        onClick: handleLayerClick,
        updateTriggers: {
            getFillColor: colorBy,
            getElevation: 'height'
        }
    });
};
