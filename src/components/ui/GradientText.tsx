import {css} from 'styled-components';
import {DEFAULT_GRADIENT} from '../../theme/theme';

export const GradientTextCss = css`
  ${DEFAULT_GRADIENT};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
