import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import { GLTFLoader } from '@loaders.gl/gltf';
import { registerLoaders } from '@loaders.gl/core';
import { Feature, Point } from 'geojson';

// Register GLTF loader for 3D tree models
registerLoaders([GLTFLoader]);

interface TreeFeature extends Feature<Point> {
    properties: {
        height?: number;
        species?: string;
        [key: string]: any;
    };
}

interface TreeGeoJSON {
    type: "FeatureCollection";
    features: TreeFeature[];
}

/**
 * Creates a 3D tree layer using glTF models
 * @param data GeoJSON data containing tree locations
 * @param id Layer identifier
 */
export const createTreeLayer = async (data: TreeGeoJSON, id: string = 'tree-layer') => {
    if (!data?.features?.length) {
        console.error('Invalid tree data provided');
        return null;
    }

    return new ScenegraphLayer({
        id,
        data: data.features,
        scenegraph: 'tree.glb',
        getPosition: (d: TreeFeature): [number, number, number] => {
            const coords = d.geometry.coordinates;
            return [coords[0], coords[1], coords[2] || 0];
        },
        getOrientation: () => [0, Math.random() * 10 - 5, 90],
        getScale: () => {
            const randomScale = 0.8 + Math.random() * 0.3;
            return [randomScale, randomScale, randomScale];
        },
        sizeScale: 1,
        pickable: false,
        _lighting: 'pbr',
        //onError: (error: Error) => console.error('Tree layer error:', error),
        
    });
};

/**
 * Creates a simple point-based tree layer for lightweight rendering
 * @param data GeoJSON data containing tree locations
 * @param id Layer identifier
 */
export const createTreePointsLayer = (data: TreeGeoJSON, id: string = 'tree-points-layer') => {
    return new GeoJsonLayer({
        id,
        data,
        pointRadiusMinPixels: 2,
        getPointRadius: 4,
        getFillColor: [0, 200, 0],
        pickable: false,
        getLineWidth: 1
    });
};
