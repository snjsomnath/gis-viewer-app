// filepath: /d:/GitHub/CSD_viewer/gis-viewer-app/src/utils/layersConfig.ts
import { GeoJsonLayer } from '@deck.gl/layers';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { DateTime } from 'luxon';
import { Feature, Polygon } from 'geojson';
import { getColorFromValue, getColormapForVariable } from './colormapHelpers';
import { GLTFLoader, postProcessGLTF } from '@loaders.gl/gltf';
import { load } from '@loaders.gl/core';
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




const createTreeLayer = async (data: any, id: string = 'tree-layer') => {
  console.log('Creating Tree Layer with data:', data);

  if (!data || !Array.isArray(data.features)) {
      console.error('Tree layer data is missing or not an array:', data);
      return null; // Prevents layer creation if data is invalid
  }

  const scenegraph = 'tree.glb';

  const layer = new ScenegraphLayer({
      id,
      data: data.features, // Ensure it's passing an array of features
      scenegraph,

      // Set position using geo-coordinates
      getPosition: (d: any) => d.geometry?.coordinates || [0, 0, 0],

      // Fix tree angles by ensuring upright orientation
      getOrientation: (d: any) => {
          return [0, Math.random() * 10 - 5, 90]; // Slight rotation only on Y-axis
      },

      // Apply natural size variation
      getScale: (d: any) => {
          const randomScale = 0.8 + Math.random() * 0.3; // Scale between 0.9 and 1.2
          return [randomScale, randomScale, randomScale]; 
      },

      sizeScale: 1, // Base scale multiplier

      // Enable picking interactions
      pickable: false,
      getColor: [150, 200, 150, 255], // Default color

      // Use realistic PBR lighting
      _lighting: 'pbr',


      onError: (error: any) => {
          console.error('Error loading ScenegraphLayer:', error);
      }
  });

  console.log('Tree Layer created:', layer);
  return layer;
};

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

export const createLayers = (gisData: any, treeData: any, handleLayerClick: (info: any) => void, sunlightTime: number, colorBy: string) => {
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

