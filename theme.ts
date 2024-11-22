import { createTheme, ThemeOptions } from "@mui/material/styles";

/*
Pinpoint Logo Colors:
https://color.adobe.com/pinpoint-logo-1-color-theme-0c5e751b-db0a-4747-b59f-ab0a65b2f47c/
- Light green:  #04D99D
- Light teal:   #04BFBF
- Sea blue:     #0487D9
- Red:          #F21D2F
*/

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#0487D9",
    },
    secondary: {
      main: "#04D99D",
    },
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
