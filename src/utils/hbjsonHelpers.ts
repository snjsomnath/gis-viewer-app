import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { 
    Scene, Mesh, MeshStandardMaterial, ShapeGeometry, Shape, Vector3, 
    BufferGeometry, BufferAttribute, ExtrudeGeometry, Vector2 
} from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import fs from 'fs';
import path from 'path';

/**
 * Converts an HBJSON model to a GLB object for use in DeckGL SceneGraphLayer.
 * Now correctly integrates holes (apertures like windows) into walls.
 * @param hbjson - The HBJSON model data.
 * @returns A Promise that resolves to the file path of the saved GLB object.
 */
export async function hbjsonToGLB(hbjson: any): Promise<string> {
    const scene = new Scene();
    
    let processedFaces = 0;
    for (const room of hbjson.rooms) {
        for (const face of room.faces) {
            if (!face.geometry || !face.geometry.boundary) continue;

            const mesh = createWallMeshWithHoles(face);
            if (mesh) {
                scene.add(mesh);
                processedFaces++;

                // Export intermediate GLB if too many faces (prevents memory crash)
                if (processedFaces % 500 === 0) {
                    console.log(`Exporting intermediate batch at ${processedFaces} faces`);
                    await exportSceneToGLB(scene);
                }
            }
        }
    }

    const glbBuffer = await exportSceneToGLB(scene);
    const filePath = path.join(__dirname, '../../public/demo.glb');
    fs.writeFileSync(filePath, new Buffer(glbBuffer));
    return filePath;
}

/**
 * Creates a Three.js mesh with window/door cutouts using ExtrudeGeometry for depth.
 * @param face - The HBJSON face object.
 * @returns A Three.js Mesh object.
 */
function createWallMeshWithHoles(face: any): Mesh | null {
    if (!face.geometry || !Array.isArray(face.geometry.boundary) || face.geometry.boundary.length < 3) {
        console.warn("Invalid face geometry, skipping:", face);
        return null;
    }

    const boundary = face.geometry.boundary.map((v: number[]) => new Vector3(v[0], v[1], v[2]));
    if (boundary.length < 3) {
        console.warn("Skipping face due to insufficient vertices:", face);
        return null;
    }

    const shape = new Shape(boundary.map((v: Vector3) => new Vector2(v.x, v.y)));

    if (face.apertures) {
        face.apertures.forEach((aperture: any) => {
            if (!aperture.geometry || !Array.isArray(aperture.geometry.boundary) || aperture.geometry.boundary.length < 3) {
                console.warn("Invalid aperture geometry, skipping:", aperture);
                return;
            }
            const holeBoundary = aperture.geometry.boundary.map((v: number[]) => new Vector3(v[0], v[1], v[2]));
            if (holeBoundary.length < 3) {
                console.warn("Skipping aperture due to insufficient vertices:", aperture);
                return;
            }
            const hole = new Shape(holeBoundary.map((v: Vector3) => new Vector2(v.x, v.y)));
            shape.holes.push(hole);
        });
    }

    const extrudeSettings = { depth: 0.2, bevelEnabled: false };
    let geometry = new ExtrudeGeometry(shape, extrudeSettings);
    geometry.computeVertexNormals();

    // Reduce vertex count
    geometry = mergeVertices(geometry) as ExtrudeGeometry;

    const material = getMaterialForFace(face);
    return new Mesh(geometry, material);
}

/**
 * Generates a material for a face with realistic lighting.
 * @param face - The HBJSON face object.
 * @returns A MeshStandardMaterial with appropriate properties.
 */
export function getMaterialForFace(face: any): MeshStandardMaterial {
    const colors: Record<string, number> = {
        walls: 0xffb400,
        windows: 0x4444ff,
        roofs: 0xaa4444,
        floors: 0x40b4ff,
        doors: 0xff0000,
        default: 0x808080,
    };

    const type = face.face_type.toLowerCase().replace(/ /g, '_');
    const color = colors[type] || colors.default;

    return new MeshStandardMaterial({
        color,
        transparent: type === 'windows',
        opacity: type === 'windows' ? 0.5 : 1.0,
        metalness: type === 'windows' ? 0.8 : 0.2,
        roughness: type === 'windows' ? 0.1 : 0.8,
    });
}

/**
 * Exports a Three.js scene to a GLB object.
 * @param scene - The Three.js scene containing the model.
 * @returns A Promise that resolves to a GLB ArrayBuffer.
 */
function exportSceneToGLB(scene: Scene): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const exporter = new GLTFExporter();
        exporter.parse(
            scene,
            (gltf) => {
                if (gltf instanceof ArrayBuffer) {
                    resolve(gltf);
                } else {
                    console.error('GLB export failed: Not an ArrayBuffer', gltf);
                    reject(new Error('GLB export failed: GLTFExporter returned an unexpected format'));
                }
            },
            (error) => {
                console.error('GLB export error:', error);
                reject(new Error('GLB export failed: ' + error.message));
            },
            { binary: true }
        );
    });
}
