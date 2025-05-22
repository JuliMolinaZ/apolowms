// src/theme/themes.ts

import { createTheme } from "@mui/material/styles";

/**
 * Crea un tema base con colores y familia Geist Sans.
 */
function baseTheme(primary: string, secondary: string) {
  return createTheme({
    palette: {
      mode: "light",
      primary:   { main: primary },
      secondary: { main: secondary },
      background: {
        default: "#ffffff",
        paper:   "#ffffff",
      },
      text: {
        primary:   "#333333",
        secondary: "#555555",
      },
    },
    typography: {
      // Usamos Geist Sans en todos los componentes MUI
      fontFamily: "var(--font-sans)",
    },
  });
}

export const theme1 = baseTheme("#6adbef", "#5ce1e6");
export const theme2 = baseTheme("#4CAF50", "#8BC34A");
export const theme3 = baseTheme("#3F51B5", "#2196F3");

// Array con los tres temas para alternar
export const themes = [theme1, theme2, theme3];
