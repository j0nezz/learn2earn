import {
  Flex,
  LARGE_DEVICES_BREAK_POINT,
  Spacer
} from 'axelra-styled-bootstrap-grid';
import React from 'react';
import styled from 'styled-components';
import {alpha} from '../theme/alpha';
import {SPACING, __COLORS} from '../theme/theme';
import AccountBadge from './AccountBadge';

const Sticky = styled.div<{sticky: boolean; black?: boolean}>`
  position: ${p => (p.sticky ? 'fixed' : 'block')};
  width: 100%;
  background-color: ${alpha(0.5, __COLORS.WHITE)};
  transition: background-color ease 0.3s;
  z-index: 100;
`;

const Wrapper = styled(Flex)`
  padding: ${SPACING * 2}px ${SPACING * 2}px;
  @media only screen and (min-width: ${LARGE_DEVICES_BREAK_POINT}px) {
    padding: 10px 50px;
    height: 75px;
  }
  max-width: 1440px;
  margin: auto;
`;

type Props = {
  sticky?: boolean;
  web3?: boolean;
  black?: boolean;
};
const Header: React.FC<Props> = ({sticky, web3, black}) => {
  return (
    <Sticky sticky={Boolean(sticky)} black={black}>
      <Wrapper row justify={'space-between'} align={'center'}>
        <div />
        <Flex row align={'center'}>
          {web3 && (
            <>
              <AccountBadge />
              <Spacer x2 />
            </>
          )}
        </Flex>
      </Wrapper>
    </Sticky>
  );
};

export default Header;
