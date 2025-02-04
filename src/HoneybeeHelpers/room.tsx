import { useContext } from 'react';
import { Face } from '../HoneybeeModel';
import {
  Shape,
  Vector2,
  Vector3,
  Triangle,
  Path,
  Quaternion,
  DoubleSide,
  MeshBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute
} from 'three';

import * as THREE from 'three'; // ✅ Corrected Import
import { extend, ReactThreeFiber, Overwrite, NodeProps, ExtendedColors } from '@react-three/fiber';
import { ThemeContext } from './colors'; // Ensure the import path is correct

// ✅ Correct module augmentation with THREE namespace
declare module '@react-three/fiber' {
  interface ThreeElements {
    group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
    mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    line: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>;
    bufferGeometry: ExtendedColors<Overwrite<Partial<THREE.BufferGeometry>, NodeProps<THREE.BufferGeometry, typeof THREE.BufferGeometry>>>;
    lineBasicMaterial: ExtendedColors<Overwrite<Partial<THREE.LineBasicMaterial>, NodeProps<THREE.LineBasicMaterial, [THREE.LineBasicMaterialParameters]>>>;
  }
}

// ✅ Ensure proper mapping in `extend()`
extend({ 
  BufferGeometry: THREE.BufferGeometry, 
  LineBasicMaterial: THREE.LineBasicMaterial 
});

interface IFaceRenderProperties {
  face: Face;
}

export const boundaryToFaceGeometry = (boundary: number[][]) => {
  const vertices = boundary.map((b) => new Vector3().fromArray(b));

  const triangle = new Triangle(vertices[0], vertices[1], vertices[2]);
  const normal = triangle.getNormal(new Vector3());
  const baseNormal = new Vector3(0, 0, 1);
  const quaternion = new Quaternion().setFromUnitVectors(normal, baseNormal);

  const tempPoints = vertices.map((vertex) => vertex.clone().applyQuaternion(quaternion));

  return new Shape(tempPoints.map((v) => new Vector2(v.x, v.y)));
};

const FaceRender = (props: IFaceRenderProperties) => {
  const { face } = props;
  const theme = useContext(ThemeContext);
  const vertices = face.geometry.boundary.map((b) => new Vector3().fromArray(b));

  if (!face.apertures) {
    face.apertures = [];
  }

  const triangle = new Triangle(vertices[0], vertices[1], vertices[2]);
  const normal = triangle.getNormal(new Vector3());
  const baseNormal = new Vector3(0, 0, 1);
  const quaternion = new Quaternion().setFromUnitVectors(normal, baseNormal);

  const tempPoints = vertices.map((vertex) => vertex.clone().applyQuaternion(quaternion));

  const apertureMeshes = [] as any;

  let holeVertices = [] as Vector3[];

  const holes = face.apertures.map((aperture) => {
    const apertureVertices3 = aperture.geometry.boundary.map((b) => new Vector3().fromArray(b));

    holeVertices = holeVertices.concat(apertureVertices3);

    const tempApertureVertices3 = apertureVertices3.map((vertex) => vertex.clone().applyQuaternion(quaternion));
    const apertureVertices2 = tempApertureVertices3.map((v) => new Vector2(v.x, v.y));
    const hole = new Path(apertureVertices2);

    // Convert to buffer geometry
    const bufferGeometry = new BufferGeometry();
    const verticesArray = apertureVertices3.flatMap(v => [v.x, v.y, v.z]);
    bufferGeometry.setAttribute('position', new Float32BufferAttribute(verticesArray, 3));

    const holeColor = theme[aperture.type];
    const apertureMaterial = new MeshBasicMaterial({
      color: holeColor,
      opacity: 0.5,
      side: DoubleSide,
      transparent: true,
      wireframe: false
    });

    apertureMeshes.push(<mesh key={aperture.name} args={[bufferGeometry, apertureMaterial]} />);

    return { path: hole, vertices: apertureVertices3 };
  });

  const shape = new Shape(tempPoints.map((v) => new Vector2(v.x, v.y)));
  shape.holes = holes.map((h) => h.path);

  const bufferGeometry = new BufferGeometry();
  const allVertices = vertices.concat(holeVertices.reverse());
  const verticesArray = allVertices.flatMap(v => [v.x, v.y, v.z]);
  bufferGeometry.setAttribute('position', new Float32BufferAttribute(verticesArray, 3));

  const color = theme[face.face_type];

  const material = new MeshBasicMaterial({ 
    color, 
    opacity: 0.7, 
    side: DoubleSide, 
    transparent: true, 
    wireframe: false 
  });

  return (
    <group>
      <mesh args={[bufferGeometry, material]} />
      {apertureMeshes}
    </group>
  );
};

export default FaceRender;
