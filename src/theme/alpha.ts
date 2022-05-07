import {transparentize} from 'polished';

export const alpha = (al: number, color: string) => {
  return transparentize(1 - al, color);
};
