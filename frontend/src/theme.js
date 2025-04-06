// theme.js
import { createTheme } from "@mui/material/styles";

// Create a theme with your custom primary, secondary, and accent colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#754480", // Your custom primary color
    },
    secondary: {
      main: "#FFFFC5", // Your custom secondary color (example)
    },
    accent: {
      main: "#F4C4FF", // Custom accent color (example)
    },
    white: {
        main: "#FFFFFF"
    }
  },
});

export default theme;
