import { LightingEffect, AmbientLight, _SunLight as SunLight } from '@deck.gl/core';

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 0.8 // Reduced intensity for a softer ambient light
});

const dirLight = new SunLight({
    timestamp: Date.UTC(2019, 2, 1, 14), // Set default timestamp to March 14:00
    color: [255, 223, 186], // Warm sunlight color
    intensity: 1.5, // Increased intensity for a brighter sunlight
    _shadow: true
});

const lightingEffect = new LightingEffect({ ambientLight, dirLight });
lightingEffect.shadowColor = [0, 0, 0, 0.5]; // Softer shadow color

export function generateLighting(date: Date) {
    const dirLight = new SunLight({
        timestamp: date.getTime(),
        color: [255, 255, 255],
        intensity: 2.0,
        _shadow: true
    });

    return new LightingEffect({
        ambientLight,
        dirLight
    });
}

export { lightingEffect, dirLight };
