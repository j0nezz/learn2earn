import styled from 'styled-components';
import {DEFAULT_GRADIENT} from '../../theme/theme';

export const Button = styled.button`
  border: none;
  ${DEFAULT_GRADIENT};
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;
