// src/components/Auth/GlobalStyles.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --background: #ffffff;
    --foreground: #171717;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --background: #0a0a0a;
      --foreground: #ededed;
    }
  }

  body {
    color: var(--foreground);
    background: var(--background);
    font-family: Arial, Helvetica, sans-serif;
  }

  /* Ejemplo de estilos para el SVG animado */
  svg .svg-elem-1 {
    fill: transparent;
    transition: fill 0.7s cubic-bezier(0.6, -0.28, 0.735, 0.045) 0.8s;
  }
  svg.active .svg-elem-1 {
    fill: rgb(0, 0, 0);
  }
  /* ... continúa con los demás estilos SVG */
`;

export default GlobalStyles;
