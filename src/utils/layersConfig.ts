// filepath: /d:/GitHub/CSD_viewer/gis-viewer-app/src/utils/layersConfig.ts
import { GeoJsonLayer } from '@deck.gl/layers';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { DateTime } from 'luxon';
import { Feature, Polygon } from 'geojson';
import { getColorFromValue, getColormapForVariable } from './colormapHelpers';
import {GLTFLoader} from '@loaders.gl/gltf';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { registerLoaders } from '@loaders.gl/core';
import { CubeGeometry } from '@luma.gl/engine';


// Register the GLTF loader
registerLoaders([GLTFLoader]);

const generateBoundingBox = (data: any): Feature<Polygon> => {
  const coordinates = data.features.flatMap((feature: any) => feature.geometry.coordinates.flat());
  const lats = coordinates.map((coord: any) => coord[1]);
  const lngs = coordinates.map((coord: any) => coord[0]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [minLng, minLat],
          [maxLng, minLat],
          [maxLng, maxLat],
          [minLng, maxLat],
          [minLng, minLat]
        ]
      ]
    },
    properties: {
      isFloor: true,
      footprint_extrusion: 0
    }
  };
};

const createTreeLayer = (data: any, id: string = 'tree-layer') => {
    console.log('Creating Tree Layer with data:', data);
    const layer = new ScenegraphLayer({
        id,
        data,
        scenegraph: '/tree.glb',
        getPosition: (d: any) => {
            console.log('Tree position:', d.geometry.coordinates);
            return d.geometry.coordinates;
        },
        getOrientation: (d: any) => [0, Math.random() * 180, 90],
        sizeScale: 5, // Scale multiplier
        pickable: true,
        _lighting: 'flat',
        onError: (error) => {
            console.error('Error loading ScenegraphLayer:', error);
        }
    });
    return layer;
};

// const createTreeLayer = (data: any, id: string = 'tree-layer') => {
//   const layer = new ScenegraphLayer({
//     id,
//     data,
//     getPosition: (d: any) => d.geometry.coordinates,
//     getOrientation: (d: any) => [0, Math.random() * 180, 90],
//     scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
//     sizeScale: 500,
//     _animations: {
//       '*': {speed: 5}
//     },
//     _lighting: 'pbr',
//     pickable: true
//   });
// return layer;
// };

const createTreePointsLayer = (data: any, id: string = 'tree-points-layer') => {
    return new GeoJsonLayer({
        id,
        data,
        pointRadiusMinPixels: 2,
        getPointRadius: 4,
        getFillColor: [0, 200, 0],
        pickable: false,
        getLineWidth: 1,

    });
};



const createBuildingLayer = (
  gisData: any,
  handleLayerClick: (info: any) => void,
  timeOfDay: string,
  colorBy: string
) => {
  // Compute min and max for numerical attributes
  const min = Math.min(...gisData.features.map((f: any) => f.properties[colorBy] || 0));
  const max = Math.max(...gisData.features.map((f: any) => f.properties[colorBy] || 0));

  return new GeoJsonLayer({
    id: "buildings",
    data: gisData,
    extruded: true,
    wireframe: true,
    opacity: 1,
    getElevation: (f: any) => f.properties.height || 0,
    getFillColor: (d: any) => {
      if (d.properties.isFloor) return [0, 0, 0, 0];
      const value = d.properties[colorBy];
      if (value == null) return [200, 200, 200, 100]; // Default color for missing values

      const isCategorical = typeof value === "string";
      return getColorFromValue(value, colorBy, isCategorical, min, max);
    },
    material: {
      ambient: 0.2,
      diffuse: 0.4,
      shininess: 20,
      specularColor: [180, 180, 180]
    },
    _shadows: true,
    pickable: true,
    onClick: handleLayerClick
  });
};


const createLandCoverLayer = (gisData: any) => {
  const landCover = generateBoundingBox(gisData);
  return new GeoJsonLayer({
    id: "land-cover",
    data: landCover,
    getFillColor: [0, 0, 0, 0],
    getLineColor: [0, 0, 0, 0],
    pickable: false
  });
};


export const createLayers = (gisData: any,treeData: any, handleLayerClick: (info: any) => void, sunlightTime: number, colorBy: string) => {
  const date = DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm');
  const sunrise = date.startOf('day').plus({ hours: 6 });
  const sunset = date.startOf('day').plus({ hours: 18 });
  const timeOfDay = date > sunrise && date < sunset ? "day" : "night";


  return [
    createBuildingLayer(gisData, handleLayerClick, timeOfDay, colorBy),
    createLandCoverLayer(gisData),
    createTreePointsLayer(treeData),
    createTreeLayer(treeData),
  ];
};

export { createTreeLayer, createTreePointsLayer };

