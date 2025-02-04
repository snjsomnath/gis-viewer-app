// filepath: /d:/GitHub/CSD_viewer/gis-viewer-app/src/utils/layersConfig.ts
import { DateTime } from 'luxon';
import { createTreeLayer, createTreePointsLayer } from './treeLayer';
import { createBuildingLayer } from './buildingLayer';
import { createLandCoverLayer } from './landCoverLayer';
import { createHBJSONLayer } from './hbjsonLayer';

/**
 * Creates all visualization layers for the application
 * @param gisData Building and landscape GeoJSON data
 * @param treeData Tree location GeoJSON data
 * @param handleLayerClick Click event handler
 * @param sunlightTime Current time in milliseconds
 * @param colorBy Property name for building colors
 */
export const createLayers = async (
    gisData: any,
    treeData: any,
    handleLayerClick: (info: any) => void,
    sunlightTime: number,
    colorBy: string
) => {
    // Calculate time of day for lighting
    const date = DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm');
    const isDaytime = date.hour >= 6 && date.hour < 18;
    const timeOfDay = isDaytime ? "day" : "night";

    // Create and return all layers
    const hbjsonPosition: [number, number, number] = [11.9690435, 57.7068985, 0];
    const layers = [
        await createBuildingLayer(gisData, handleLayerClick, timeOfDay, colorBy),
        await createLandCoverLayer(gisData),
        await createTreePointsLayer(treeData),
        await createTreeLayer(treeData),
        await createHBJSONLayer(hbjsonPosition),
    ].filter(Boolean); // Remove null layers

    return layers;
};

// Export individual layer creators for specific use cases
export {
    createTreeLayer,
    createTreePointsLayer,
    createBuildingLayer,
    createLandCoverLayer,
    createHBJSONLayer
};

