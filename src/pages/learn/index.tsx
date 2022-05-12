import {collection, CollectionReference, getDocs} from '@firebase/firestore';
import {useWeb3React} from '@web3-react/core';
import {
  LARGE_DEVICES_BREAK_POINT,
  SMALL_DEVICES_BREAK_POINT,
  Spacer
} from 'axelra-styled-bootstrap-grid';
import {GetServerSideProps} from 'next';
import React, {ReactElement} from 'react';
import styled from 'styled-components';
import QuizCard from '../../components/QuizCard';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold} from '../../components/ui/Typography';
import Web3Layout from '../../layouts/web3.layout';
import {db} from '../../lib/firebase';
import {SPACING, __COLORS} from '../../theme/theme';
import {Quiz} from '../../types/firestore-types';

export const QuizesGrid = styled.div<{blur: boolean}>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${SPACING}px;
  @media only screen and (min-width: ${SMALL_DEVICES_BREAK_POINT}px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (min-width: ${LARGE_DEVICES_BREAK_POINT}px) {
    grid-template-columns: repeat(4, 1fr);
  }
  filter: ${p => (p.blur ? 'blur(5px)' : 'none')};
  pointer-events: ${p => (p.blur ? 'none' : 'default')};
  transition: all ease-in-out 0.5s;
`;
type Props = {
  quizes: Quiz[];
};

const Index = ({quizes}: Props) => {
  const {account} = useWeb3React();

  return (
    <PageContainer>
      <Bold size={'xxxl'} gradient block>
        Learn
      </Bold>
      {!account && (
        <Bold size={'l'} color={__COLORS.CTA}>
          Use the connect Button in the Header to see all quizes
        </Bold>
      )}
      <Spacer x2 />
      <QuizesGrid blur={!account}>
        {quizes.map(q => (
          <QuizCard key={q.quizId} quiz={q} />
        ))}
      </QuizesGrid>
    </PageContainer>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export const getServerSideProps: GetServerSideProps<any, any, any> = async ({
  params
}) => {
  const quizes = await getDocs<Quiz>(
    collection(db, 'quiz') as CollectionReference<Quiz>
  );

  console.log('quizes reesponse', quizes, quizes.docs);
  const quizesData = quizes.docs.map(w => w.data());

  console.log('quizesData', quizesData);

  return {
    props: {
      quizes: quizesData
    }
  };
};

export default Index;
