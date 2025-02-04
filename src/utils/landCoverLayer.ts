import { GeoJsonLayer } from '@deck.gl/layers';
import { Feature, Polygon } from 'geojson';

interface GeoData {
    features: {
        geometry: {
            coordinates: number[][][];
        };
    }[];
}

/**
 * Generates a bounding box from GeoJSON features
 * @param data GeoJSON data containing features
 */
const generateBoundingBox = (data: GeoData): Feature<Polygon> => {
    const coordinates = data.features.flatMap(feature => 
        feature.geometry.coordinates.flat()
    );

    const lats = coordinates.map(coord => coord[1]);
    const lngs = coordinates.map(coord => coord[0]);

    const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
    const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];

    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [minLng, minLat],
                [maxLng, minLat],
                [maxLng, maxLat],
                [minLng, maxLat],
                [minLng, minLat]
            ]]
        },
        properties: {
            isFloor: true,
            footprint_extrusion: 0
        }
    };
};

/**
 * Creates a transparent ground plane layer
 * @param gisData GeoJSON data for determining bounds
 */
export const createLandCoverLayer = (gisData: GeoData) => {
    return new GeoJsonLayer({
        id: "land-cover",
        data: generateBoundingBox(gisData),
        getFillColor: [0, 0, 0, 0],
        getLineColor: [0, 0, 0, 0],
        pickable: false
    });
};
