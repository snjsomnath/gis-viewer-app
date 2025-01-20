// filepath: /d:/GitHub/CSD_viewer/gis-viewer-app/src/utils/layersConfig.ts
import { GeoJsonLayer } from '@deck.gl/layers';

export const createLayers = (gisData: any, onClick: (info: any) => void) => {
    return [
        new GeoJsonLayer({
            id: 'geojson-layer',
            data: gisData,
            visible: true,
            pickable: true,
            stroked: true,
            filled: true,
            extruded: true,
            lineWidthScale: 1,
            getFillColor: (d: any) => {
                switch (d.properties.EPC_class) {
                    case 'A': return [102, 153, 102, 255]; // Muted Green
                    case 'B': return [204, 255, 153, 255]; // Muted YellowGreen
                    case 'C': return [255, 255, 153, 255]; // Muted Yellow
                    case 'D': return [255, 204, 153, 255]; // Muted Orange
                    case 'E': return [255, 153, 102, 255]; // Muted RedOrange
                    case 'F': return [255, 102, 102, 255]; // Muted Red
                    case 'G': return [153, 51, 51, 255]; // Muted DarkRed
                    default: return [192, 192, 192, 255]; // Muted Default color
                }
            },
            getLineColor: [0, 0, 0, 255],
            getPointRadius: 100,
            getLineWidth: 1,
            getElevation: (d: any) => d.properties.height || 0,
            onClick: onClick,
        }),
    ];
};