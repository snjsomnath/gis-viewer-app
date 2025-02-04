import { ScenegraphLayer } from '@deck.gl/mesh-layers';
//import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import type { Position } from '@deck.gl/core';
//import { OBJLoader } from '@loaders.gl/obj';
import { hbjsonToGLB } from './hbjsonHelpers';


/**
 * Fetches and converts HBJSON to GLB format
 * @param url HBJSON file URL
 */
const fetchAndConvertHBJSON = async (url: string): Promise<ArrayBuffer | null> => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('HBJSON fetch failed');

        const hbjson = await response.json();
        return await hbjsonToGLB(hbjson);
    } catch (error) {
        console.error('HBJSON processing error:', error);
        return null;
    }
};

/**
 * Saves converted GLB file to server
 * @param glbBuffer GLB file data
 * @param url Server endpoint
 */
const saveGLBToServer = async (glbBuffer: ArrayBuffer, url: string): Promise<string | null> => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: glbBuffer
        });

        if (!response.ok) throw new Error('GLB save failed');
        const { filePath } = await response.json();
        return filePath;
    } catch (error) {
        console.error('GLB save error:', error);
        return null;
    }
};

const generateHBJSONScenegraphLayer = async (position: Position, filePath: string) => {
    return new ScenegraphLayer({
        id: 'hbjson-glb-layer',
        data: [{ position }],
        scenegraph: filePath,
        getPosition: d => d.position,
        getOrientation: () => [0, 0, 90],
        getScale: () => [1, 1, 1],
        sizeScale: 1,
        pickable: false,
        _lighting: 'pbr',
        //onError: (error: Error) => console.error('HBJSON layer error:', error)
    });
};

// const generateHBJSONMeshLayer = async (position: Position) => {
//     return new SimpleMeshLayer({
//         id: 'hbjson-glb-layer',
//         data: [{ position }],
//         mesh: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/humanoid_quad.obj',
//         getPosition: (d: { position: Position }) => d.position,
//         getOrientation: [0, 0, 90],
//         sizeScale: 1,
//         pickable: false,
//         loaders: [OBJLoader],
        
//         onError: (error: Error) => console.error('HBJSON layer error:', error) 
//     });
// };

/**
 * Creates an HBJSON-based layer with automatic file handling
 * @param position Model placement coordinates
 */
export const createHBJSONLayer = async (position: Position) => {
    const config = {
        existingFile: 'uploads/demo.glb',
        remoteHBJSON: 'https://raw.githubusercontent.com/ladybug-tools/honeybee-schema/refs/heads/master/samples/model_large/lab_building.hbjson',
        saveEndpoint: 'http://localhost:3001/api/save-glb'
    };

    try {
        const fileExists = await fetch(config.existingFile, { method: 'HEAD' })
            .then(res => res.ok)
            .catch(() => false);

        if (fileExists) {
            return generateHBJSONScenegraphLayer(position,config.existingFile);
        }

        const glbBuffer = await fetchAndConvertHBJSON(config.remoteHBJSON);
        if (!glbBuffer) throw new Error('HBJSON conversion failed');

        const savedPath = await saveGLBToServer(glbBuffer, config.saveEndpoint);
        if (!savedPath) throw new Error('GLB save failed');

        return generateHBJSONScenegraphLayer(position,savedPath);
    } catch (error) {
        console.error('HBJSON layer creation failed:', error);
        return null;
    }
};
