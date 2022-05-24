import {useWeb3React} from '@web3-react/core';
import {Spacer} from 'axelra-styled-bootstrap-grid';
import {BigNumber, ethers} from 'ethers';
import Link from 'next/link';
import React, {useMemo} from 'react';
import styled from 'styled-components';
import {alpha} from '../theme/alpha';
import {__ALERTS, __COLORS, __GRAY_SCALE} from '../theme/theme';
import {Quiz} from '../types/firestore-types';
import {Icon, IconTypes} from './ui/Icon';
import {Bold, Regular} from './ui/Typography';
import {useErc20Decimals} from "../hooks/useErc20Decimals";

const Wrapper = styled.div<{background?: string}>`
  background: ${p => p.background ?? __COLORS.WHITE};
  padding: 2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 18px 5px rgba(0, 0, 0, 0.1);
  }
  transition: all ease-in-out 0.3s;
  position: relative;
`;

const TRIANGLE_SIZE = 60;
const ICON_SIZE = 25;

const Triangle = styled.div<{
  triangleColor: __COLORS | __ALERTS | __GRAY_SCALE | string;
}>`
  position: absolute;
  border-left: ${TRIANGLE_SIZE}px solid transparent;
  border-right: ${TRIANGLE_SIZE}px solid ${p => p.triangleColor};
  border-bottom: ${TRIANGLE_SIZE}px solid transparent;
  height: 0;
  width: 0;
  z-index: 2;
  right: 0;
  top: 0;
`;

const IconContainer = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 3;
`;

type Props = {
  quiz: Quiz;
  answered: boolean;
  correct: boolean;
  claimable: boolean;
  claimed: boolean;
};
const QuizCard: React.FC<Props> = ({
  quiz,
  answered,
  correct,
  claimable,
  claimed
}) => {
  const {account} = useWeb3React();
  const decimals = useErc20Decimals(quiz.token)

  const reward = useMemo(() => {
    if (!decimals) return '...'
    return ethers.utils.formatUnits(quiz.reward, decimals)
  }, [decimals, quiz.reward])

  return (
    <Link
      href={
        (account === quiz.ownerAddress ? `/${account}/` : '/learn/') +
        quiz.quizId
      }
    >
      <a>
        <Wrapper background={__COLORS.WHITE}>
          <Triangle
            triangleColor={
              answered
                ? correct
                  ? claimable || claimed
                    ? __ALERTS.SUCCESS
                    : alpha(0.5, __ALERTS.SUCCESS)
                  : __ALERTS.ERROR
                : account === quiz.ownerAddress
                ? __GRAY_SCALE._300
                : 'transparent'
            }
          />
          <IconContainer>
            <Icon
              name={
                answered
                  ? correct
                    ? claimed
                      ? IconTypes.CORRECT
                      : claimable
                      ? IconTypes.COIN
                      : IconTypes.CLOCK
                    : IconTypes.WRONG
                  : account === quiz.ownerAddress
                  ? IconTypes.SETTINGS
                  : IconTypes.NONE
              }
              color={__COLORS.BLACK}
              size={ICON_SIZE}
            />
          </IconContainer>
          {answered && correct && claimable && (
            <Bold center block>
              Claim Reward now!
            </Bold>
          )}
          <Bold block size={'xl'} center>
            {quiz.tokenName}
          </Bold>
          <Spacer x2 />
          <Regular block center>
            Reward: {reward} {quiz.tokenName}
          </Regular>
        </Wrapper>
      </a>
    </Link>
  );
};

export default QuizCard;
