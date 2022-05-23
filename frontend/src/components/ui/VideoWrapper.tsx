import {MEDIUM_DEVICES_BREAK_POINT} from 'axelra-styled-bootstrap-grid';
import styled from 'styled-components';

export const VideoWrapper = styled.div`
  @media only screen and (min-width: ${MEDIUM_DEVICES_BREAK_POINT}px) {
    max-width: min(70vw, 1000px);
  }
  margin: auto;
`;
