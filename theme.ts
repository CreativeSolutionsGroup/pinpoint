import { createTheme, ThemeOptions } from "@mui/material/styles";

/*
Potential Color Choices:
Earth Yellow:   #D19E4D
Sea Grean:      #558B62
Taupe:          #423C38
Midnight Green: #084A5E
*/

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#558B62",
    },
    secondary: {
      main: "#423C38",
    },
  },
  typography: {},
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
