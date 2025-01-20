import { scaleSequential, scaleOrdinal } from 'd3-scale';
import { interpolateViridis, interpolatePlasma, interpolateInferno, schemeCategory10 } from 'd3-scale-chromatic';

const colormaps: { [key: string]: (t: number) => string } = {
    viridis: interpolateViridis,
    plasma: interpolatePlasma,
    inferno: interpolateInferno,
};

const categoricalColormaps: { [key: string]: string[] } = {
    category10: schemeCategory10,
};

export const getColormap = (colormapName: string) => {
    return colormaps[colormapName] || colormaps['viridis'];
};

export const getCategoricalColormap = (colormapName: string) => {
    return categoricalColormaps[colormapName] || categoricalColormaps['category10'];
};

export const applyColormap = (value: number, colormapName: string) => {
    const colormap = getColormap(colormapName);
    const color = colormap(value);
    const [r, g, b] = color.match(/\d+/g)!.map(Number);
    return [r, g, b, 200] as [number, number, number, number];
};

export const applyCategoricalColormap = (value: any, colormapName: string) => {
    const colormap = getCategoricalColormap(colormapName);
    const stringValue = String(value);
    const color = colormap[stringValue.charCodeAt(0) % colormap.length];
    const [r, g, b] = color.match(/\d+/g)!.map(Number);
    return [r, g, b, 200] as [number, number, number, number];
};
