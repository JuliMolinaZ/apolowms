// styled.d.ts
import 'styled-components';
import { Theme as MuiTheme } from '@mui/material/styles';

declare module 'styled-components' {
  /**
   * Hacemos que DefaultTheme de styled-components
   * herede toda la forma (palette, typography, shape, components, etc.)
   * del Theme de MUI.
   */
  export interface DefaultTheme extends MuiTheme {}
}
