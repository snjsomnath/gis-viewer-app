// filepath: /d:/GitHub/CSD_viewer/gis-viewer-app/src/utils/layersConfig.ts
import { GeoJsonLayer } from '@deck.gl/layers';
import { DateTime } from 'luxon';
import { Feature, Polygon } from 'geojson';

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

export const createLayers = (gisData: any, handleLayerClick: (info: any) => void, sunlightTime: number) => {
    const date = DateTime.fromMillis(sunlightTime).setZone('Europe/Stockholm');
    const sunrise = date.startOf('day').plus({ hours: 6 }); // Example sunrise time
    const sunset = date.startOf('day').plus({ hours: 18 }); // Example sunset time
    const timeOfDay = date > sunrise && date < sunset ? "day" : "night";
  
    const landCover = generateBoundingBox(gisData);
  
    return [
      new GeoJsonLayer({
        id: "buildings",
        data: gisData,
        extruded: true,
        wireframe: false,
        opacity: 1,
        getElevation: (f: any) => f.properties.height || 0,
        getFillColor: (d: any) => {
          if (d.properties.isFloor) return [0, 0, 0, 0];
          switch (d.properties.EPC_class) {
            case 'A': return [173, 235, 185]; // Soft green
            case 'B': return [201, 232, 151]; // Muted lime
            case 'C': return [245, 245, 179]; // Light pastel yellow
            case 'D': return [255, 209, 143]; // Soft peach
            case 'E': return [255, 160, 122]; // Light coral
            case 'F': return [255, 120, 120]; // Muted red
            case 'G': return [200, 90, 90]; // Desaturated dark red
            default: return timeOfDay === "day" ? [240, 240, 240] : [120, 120, 130];
          }
        },
        material: {
          ambient: 0.1,
          diffuse: 0.6,
          shininess: 32,
          specularColor: [255, 255, 255]
        },
        _shadows: true, // Ensure shadows are enabled
        pickable: true,
        onClick: handleLayerClick
      }),
      new GeoJsonLayer({
        id: "land-cover",
        data: landCover,
        getFillColor: [0, 0, 0, 0],
        getLineColor: [0, 0, 0, 0],
        pickable: false
      })
    ];
  };
