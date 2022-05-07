import {useWeb3React} from '@web3-react/core';
import React from 'react';
import styled from 'styled-components';
import {formatAddress} from '../helpers/format-address';
import {useWeb3Connect} from '../hooks/useWeb3Connect';
import {alpha} from '../theme/alpha';
import {SPACING, __COLORS} from '../theme/theme';
import {Button} from './ui/Button';
import {Regular} from './ui/Typography';

const BadgeWrapper = styled.div`
  background: ${alpha(0.2, __COLORS.BLACK)};
  padding: ${SPACING / 2}px ${SPACING}px;
  border-radius: ${SPACING}px;
  display: inline-block;
`;
const AccountBadge = () => {
  const {account} = useWeb3React();
  const connect = useWeb3Connect();

  if (!account) return <Button onClick={connect}>Connect Web3</Button>;

  return (
    <BadgeWrapper>
      <Regular size={'xs'}>{formatAddress(account, 5)}</Regular>
    </BadgeWrapper>
  );
};

export default AccountBadge;
