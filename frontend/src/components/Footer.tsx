import {transparentize} from 'polished';
import React from 'react';
import styled from 'styled-components';
import {SPACING, __COLORS} from '../theme/theme';
import {PageContainer} from './ui/PageContainer';

const Background = styled.div`
  flex-shrink: 0;
  background: linear-gradient(
    225deg,
    ${transparentize(0.75, __COLORS.SECONDARY)},
    ${transparentize(0.75, __COLORS.PRIMARY)}
  );
  width: 100%;
  min-height: 100px;
  padding: ${SPACING * 2}px 0;
`;

const Footer = () => {
  return (
    <Background>
      <PageContainer>
        <div>Blablabla</div>
      </PageContainer>
    </Background>
  );
};

export default Footer;
