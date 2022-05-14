import {useWeb3React} from '@web3-react/core';
import {
  Flex,
  LARGE_DEVICES_BREAK_POINT,
  Spacer
} from 'axelra-styled-bootstrap-grid';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import {alpha} from '../theme/alpha';
import {SPACING, __COLORS} from '../theme/theme';
import AccountBadge from './AccountBadge';
import {Medium} from './ui/Typography';

const Sticky = styled.div<{sticky: boolean; black?: boolean}>`
  position: ${p => (p.sticky ? 'fixed' : 'block')};
  width: 100%;
  transition: background-color ease 0.3s;
  z-index: 100;
  backdrop-filter: blur(4px);
  background: ${alpha(0.1, __COLORS.PRIMARY)};
`;

const Wrapper = styled(Flex)`
  padding: ${SPACING * 2}px ${SPACING * 2}px;
  @media only screen and (min-width: ${LARGE_DEVICES_BREAK_POINT}px) {
    padding: 10px 32px;
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
  const {account} = useWeb3React();

  return (
    <Sticky sticky={Boolean(sticky)} black={black}>
      <Wrapper row justify={'space-between'} align={'center'}>
        <Flex row>
          <Link href={'/learn'}>
            <a>
              <Flex>
                <Medium block size={'l'} center color={__COLORS.PRIMARY}>
                  Learn
                </Medium>
              </Flex>
            </a>
          </Link>
          {account && (
            <>
              <Spacer x4 />
              <Link href={'/' + account}>
                <a>
                  <Flex>
                    <Medium block size={'l'} center color={__COLORS.PRIMARY}>
                      My Quizzes
                    </Medium>
                  </Flex>
                </a>
              </Link>
            </>
          )}
          <Spacer x4 />
          <Link href={'/create'}>
            <a>
              <Flex>
                <Medium block size={'l'} center color={__COLORS.PRIMARY}>
                  Create Quiz
                </Medium>
              </Flex>
            </a>
          </Link>
        </Flex>
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
