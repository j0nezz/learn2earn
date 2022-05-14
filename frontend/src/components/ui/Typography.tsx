import styled, {css} from 'styled-components';
import {__COLORS} from '../../theme/theme';
import {GradientTextCss} from './GradientText';

export type TextProps = {
  size?: TypographySize;
  center?: boolean;
  color?: string;
  block?: boolean;
  gradient?: boolean;
};

const XXXS_FONT_SIZE = 0.5;
const XXS_FONT_SIZE = 0.7;
export const XS_FONT_SIZE = 0.8;
export const S_FONT_SIZE = 0.9;
export const M_FONT_SIZE = 1; // default font size for text
const L_FONT_SIZE = 1.2;
export const XL_FONT_SIZE = 1.5;
const XXL_FONT_SIZE = 2;
const XXXL_FONT_SIZE = 3;

const DEFAULT_FONT_COLOR = __COLORS.BLACK;

export type TypographySize =
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 's'
  | 'm'
  | 'l'
  | 'xl'
  | 'xxl'
  | 'xxxl';

const mapSize = (s?: TypographySize): number => {
  switch (s) {
    case 'xxxs':
      return XXXS_FONT_SIZE;
    case 'xxs':
      return XXS_FONT_SIZE;
    case 'xs':
      return XS_FONT_SIZE;
    case 's':
      return S_FONT_SIZE;
    case 'm':
      return M_FONT_SIZE;
    case 'l':
      return L_FONT_SIZE;
    case 'xl':
      return XL_FONT_SIZE;
    case 'xxl':
      return XXL_FONT_SIZE;
    case 'xxxl':
      return XXXL_FONT_SIZE;
    default:
      return M_FONT_SIZE;
  }
};

const getSize = (s?: TypographySize) => css`
  font-size: max(${mapSize(s)}rem, 12px);
`;

const shared = (
  color?: string,
  center?: boolean,
  block?: boolean,
  gradient?: boolean
) => css`
  text-align: ${center ? 'center' : 'left'};
  color: ${color ?? DEFAULT_FONT_COLOR};
  display: ${block ? 'block' : 'inline'};
  ${gradient ? GradientTextCss : null};
`;

export const Light = styled.span<TextProps>`
  ${({size}) => getSize(size)};
  ${({color, center, block, gradient}) =>
    shared(color, center, block, gradient)};

  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
`;

export const Regular = styled.span<TextProps>`
  ${({size}) => getSize(size)};
  ${({color, center, block, gradient}) =>
    shared(color, center, block, gradient)};
  font-family: 'Montserrat', sans-serif;
  font-weight: normal;
`;

export const Medium = styled.span<TextProps>`
  ${({size}) => getSize(size)};
  ${({color, center, block, gradient}) =>
    shared(color, center, block, gradient)};
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
`;

export const SemiBold = styled.span<TextProps>`
  ${({size}) => getSize(size)};
  ${({color, center, block, gradient}) =>
    shared(color, center, block, gradient)};
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
`;

export const Bold = styled.span<TextProps>`
  ${({size}) => getSize(size)};
  ${({color, center, block, gradient}) =>
    shared(color, center, block, gradient)};
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
`;

export const ExtraBold = styled.span<TextProps>`
  ${({size}) => getSize(size)};
  ${({color, center, block, gradient}) =>
    shared(color, center, block, gradient)};
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
`;

export const Black = styled.span<TextProps>`
  ${({size}) => getSize(size)};
  ${({color, center, block, gradient}) =>
    shared(color, center, block, gradient)};
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
`;
