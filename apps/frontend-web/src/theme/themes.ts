// src/theme/themes.ts

import { createTheme, responsiveFontSizes, Components, Theme } from "@mui/material/styles";

/**
 * Paleta extendida para estados semánticos
 */
const extendedPalette = {
  error:   { main: "#E53935", contrastText: "#FFF" },
  warning: { main: "#FB8C00", contrastText: "#FFF" },
  info:    { main: "#1E88E5", contrastText: "#FFF" },
  success: { main: "#43A047", contrastText: "#FFF" },
};

/**
 * Overrides global de componentes para uniformidad UI/UX
 */
const componentOverrides: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      variant: "contained",
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: "none",
        padding: "8px 16px",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      colorPrimary: {
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "none",
      },
    },
  },
};

/**
 * Crea un tema base con tipografía, paleta y overrides comunes
 */
function baseTheme(primary: string, secondary: string) {
  let theme = createTheme({
    palette: {
      mode: "light",
      primary:   { main: primary },
      secondary: { main: secondary },
      background: {
        default: "#F4FBFF",
        paper:   "#FFFFFF",
      },
      text: {
        primary:   "#333333",
        secondary: "#555555",
      },
      ...extendedPalette,
    },
    typography: {
      fontFamily: "var(--font-sans)",
      h1: { fontSize: "2.125rem", fontWeight: 600 },
      h2: { fontSize: "1.75rem",  fontWeight: 600 },
      h3: { fontSize: "1.5rem",   fontWeight: 500 },
      body1: { fontSize: "1rem",  lineHeight: 1.6 },
      button: { textTransform: "none", fontWeight: 500 },
    },
    shape: { borderRadius: 8 },
    spacing: 4,
    components: componentOverrides,
    transitions: {
      duration: {
        shortest: 150,
        shorter:  200,
        short:    250,
        standard: 300,
      },
    },
  });

  // Hacemos tipografía responsiva
  theme = responsiveFontSizes(theme, {
    breakpoints: ["xs", "sm", "md", "lg", "xl"],
    factor: 2,
  });

  return theme;
}

// Temas personalizables para alternar
export const theme1 = baseTheme("#6ADBEF", "#5CE1E6");
export const theme2 = baseTheme("#4CAF50", "#8BC34A");
export const theme3 = baseTheme("#3F51B5", "#2196F3");

export const themes = [theme1, theme2, theme3];