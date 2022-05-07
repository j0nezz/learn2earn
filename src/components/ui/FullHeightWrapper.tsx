import styled from 'styled-components';

// https://css-tricks.com/couple-takes-sticky-footer/
// Used to stick footer always to bottom

export const FullHeightWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: radial-gradient(
    circle,
    rgba(252, 7, 125, 0.1) 0%,
    rgba(255, 255, 255, 1) 100%
  );
`;
