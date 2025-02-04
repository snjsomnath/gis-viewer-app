import React from 'react';

export interface ThemeContextType {
  AirWall: string;
  Aperture: string;
  Door: string;
  Floor: string;
  RoofCeiling: string;
  Shade: string;
  Wall: string;
  [key: string]: string;  // Add index signature for other possible types
}

export const ThemeContext = React.createContext<ThemeContextType>({
  AirWall: 'yellow',
  Aperture: 'blue',
  Door: 'blue',
  Floor: 'black',
  RoofCeiling: 'purple',
  Shade: 'grey',
  Wall: 'green'
});