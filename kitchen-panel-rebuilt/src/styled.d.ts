import 'styled-components';
import { KdsThemeType } from './core/theme/kdsStylesTheme';

declare module 'styled-components' {
  export interface DefaultTheme extends KdsThemeType {}
}
