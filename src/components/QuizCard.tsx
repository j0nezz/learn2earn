import {Spacer} from 'axelra-styled-bootstrap-grid';
import {ethers} from 'ethers';
import React from 'react';
import styled from 'styled-components';
import {Quiz} from '../types/firestore-types';
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
  return (
    <Wrapper>
      <Bold block size={'xl'} center>
        {quiz.tokenName}
      </Bold>
      <Spacer x2 />
      <Regular>
        Reward: {ethers.utils.formatUnits(quiz.reward)} {quiz.tokenName}
      </Regular>
    </Wrapper>
  );
};

export default QuizCard;
