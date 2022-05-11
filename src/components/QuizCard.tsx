import {useWeb3React} from '@web3-react/core';
import {Flex, Spacer} from 'axelra-styled-bootstrap-grid';
import {ethers} from 'ethers';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import {Quiz} from '../types/firestore-types';
import {Button} from './ui/Button';
import {Bold, Regular} from './ui/Typography';

const Wrapper = styled.div`
  background: white;
  padding: 2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
`;
type Props = {
  quiz: Quiz;
};
const QuizCard: React.FC<Props> = ({quiz}) => {
  const {account} = useWeb3React();

  return (
    <Link href={'/learn/' + quiz.quizId}>
      <a>
        <Wrapper>
          <Bold block size={'xl'} center>
            {quiz.tokenName}
          </Bold>
          <Spacer x2 />
          <Regular>
            Reward: {ethers.utils.formatUnits(quiz.reward)} {quiz.tokenName}
          </Regular>
          {account === quiz.ownerAddress && (
            <>
              <Spacer x2 />
              <Flex row justify={'center'}>
                <Link href={'/' + account + '/' + quiz.quizId}>
                  <a>
                    <Button>Edit</Button>
                  </a>
                </Link>
              </Flex>
            </>
          )}
        </Wrapper>
      </a>
    </Link>
  );
};

export default QuizCard;
