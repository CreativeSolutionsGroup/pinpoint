import { createTheme, ThemeOptions } from "@mui/material/styles";

/*
Potential Color Choices:
Earth Yellow:   #D19E4D
Sea Green:      #558B62 **
  - Dark Sea Green: #3E6044
Taupe:          #423C38 **
Midnight Green: #084A5E
*/

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#3e6044',
    },
    secondary: {
      main: '#d19e4d',
    },
  },
  typography: { },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#084A5E", // Midnight Green
          fontSize: "1rem",
          fontWeight: 500,
        },
      },
    },
  },
};

export const muiTheme = createTheme(themeOptions);
