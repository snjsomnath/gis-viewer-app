import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Scene, Group, Mesh, MeshBasicMaterial, DoubleSide, ShapeGeometry } from 'three';
import { boundaryToFaceGeometry } from '../HoneybeeHelpers/room'; // Ensure correct path to room file
import { Face, Room, Model } from '../HoneybeeModel'; // Ensure correct path to HoneybeeModel

/**
 * Creates a Three.js scene from JSON data.
 * @param jsonData - The JSON data representing the model.
 * @returns A Three.js Scene.
 */
function createSceneFromJson(jsonData: Model): Scene {
    const scene = new Scene();

    // Ensure jsonData.rooms is defined
    const rooms = jsonData.rooms || [];

    // Iterate through rooms in the JSON data
    rooms.forEach((room: Room) => {
        const roomGroup = new Group();

        // Iterate through faces in each room
        room.faces.forEach((face: Face) => {
            const shape = boundaryToFaceGeometry(face.geometry.boundary);
            const shapeGeometry = new ShapeGeometry(shape);
            const material = new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide });
            const faceMesh = new Mesh(shapeGeometry, material);
            roomGroup.add(faceMesh);
        });

        scene.add(roomGroup);
    });

    return scene;
}

export default createSceneFromJson;

/**
 * Asynchronously exports a Three.js scene to a GLB format.
 * @param scene - The Three.js scene.
 * @returns A Promise resolving to a GLB ArrayBuffer.
 */
function exportSceneToGLB(scene: Scene): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const callback = () => {
            const exporter = new GLTFExporter();
            exporter.parse(
                scene,
                (gltf) => {
                    if (gltf instanceof ArrayBuffer) {
                        resolve(gltf);
                    } else {
                        reject(new Error('GLB export failed: Unexpected format'));
                    }
                },
                (error) => reject(new Error('GLB export failed: ' + error.message)),
                { binary: true }
            );
        };

        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(callback);
        } else {
            setTimeout(callback, 0);
        }
    });
}

// hbjsonToGLB function
async function hbjsonToGLB(hbjson: Model): Promise<ArrayBuffer> {
    const scene = createSceneFromJson(hbjson);
    return exportSceneToGLB(scene);
}

export { exportSceneToGLB, hbjsonToGLB };