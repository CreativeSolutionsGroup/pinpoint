/*
Pinpoint Logo Colors:
https://color.adobe.com/pinpoint-logo-1-color-theme-0c5e751b-db0a-4747-b59f-ab0a65b2f47c/
- Light green:  #04D99D
- Light teal:   #04BFBF
- Sea blue:     #0487D9
- Red:          #F21D2F
*/

import { createTheme, ThemeOptions } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Palette {
    yellow: Palette["primary"];
    lightblue: Palette["primary"];
    white: Palette["primary"];
    navy: Palette["primary"];
    orange: Palette["primary"];
    purple: Palette["primary"];
  }
  interface PaletteOptions {
    yellow?: PaletteOptions['primary'];
    lightblue?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
    navy?: PaletteOptions['primary'];
    orange?: PaletteOptions['primary'];
    purple?: PaletteOptions['primary'];
  }
};

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#0487D9",
    },
    secondary: {
      main: "#04D99D",
    },
    yellow: {
      main: "#F2D600",
      light: "#fff7cc",
      dark: "#ccb100",
      contrastText: "#000000"
    },
    lightblue: {
      main: "#0487D9",
      light: "#7abaff",
      dark: "#005fa3",
      contrastText: "#ffffff"
    },
    white: {
      main: "#FFFFFF",
      light: "#FFFFFF",
      dark: "#CCCCCC",
      contrastText: "#000000"
    },
    navy: {
      main: "#001F3F",
      light: "#334f7f",
      dark: "#00001a",
      contrastText: "#ffffff"
    },
    orange: {
      main: "#FF851B",
      light: "#ffb14d",
      dark: "#c55e00",
      contrastText: "#000000"
    },
    purple: {
      main: "#B10DC9",
      light: "#e14dff",
      dark: "#7a0096",
      contrastText: "#ffffff"
    }
  },
  typography: {},
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#0487D9", // Sea blue
          fontSize: "1rem",
          fontWeight: 500,
        },
      },
    },
  },
};

export const muiTheme = createTheme(themeOptions);