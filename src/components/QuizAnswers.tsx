import React from 'react';
import styled from 'styled-components';
import {__COLORS} from '../theme/theme';
import {QuizAnswer} from '../types/QuizAnswer';
import {Medium} from './ui/Typography';

const Answer = styled.div<{selected?: boolean}>`
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: ${p => (p.selected ? __COLORS.PRIMARY : __COLORS.WHITE)};
  &:hover {
    cursor: pointer;
    transform: translateY(-2px);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  transition: all ease 0.3s;
`;
type Props = {
  answers: QuizAnswer[];
  onSelect: (id: number) => void;
  selected: number | null;
  confirmed: number | null;
};
const QuizAnswers = ({answers, selected, confirmed, onSelect}: Props) => {
  return (
    <div>
      {answers.map(a => (
        <Answer
          key={a.id}
          selected={confirmed === a.id}
          onClick={() => onSelect(a.id)}
        >
          <Medium size={'l'}>{a.label}</Medium>
        </Answer>
      ))}
    </div>
  );
};

export default QuizAnswers;
