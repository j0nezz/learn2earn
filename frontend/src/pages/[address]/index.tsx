import {
  collection,
  CollectionReference,
  getDocs,
  query,
  where
} from '@firebase/firestore';
import {Spacer} from 'axelra-styled-bootstrap-grid';
import {GetServerSideProps} from 'next';
import React, {ReactElement} from 'react';
import QuizCard from '../../components/QuizCard';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold} from '../../components/ui/Typography';
import Web3Layout from '../../layouts/web3.layout';
import {db} from '../../lib/firebase';
import {Quiz} from '../../types/firestore-types';
import {QuizesGrid} from '../learn';

type Props = {
  quizzes: Quiz[];
};

const Index = ({quizzes}: Props) => {
  return (
    <PageContainer>
      <Bold size={'xxxl'} gradient block>
        Your Quizzes
      </Bold>
      <Spacer x2 />
      <QuizesGrid blur={false}>
        {quizzes.map(q => (
          <QuizCard
            key={q.quizId}
            quiz={q}
            correct={false}
            answered={false}
            claimable={false}
          />
        ))}
      </QuizesGrid>
    </PageContainer>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export const getServerSideProps: GetServerSideProps<
  any,
  {address: string},
  any
> = async ({params}) => {
  const address = params?.address;

  if (!address) {
    return {
      redirect: {
        destination: '/learn',
        permanent: false
      }
    };
  }

  const quizzesSnap = await getDocs<Quiz[]>(
    query(
      collection(db, 'quiz') as CollectionReference<Quiz[]>,
      where('ownerAddress', '==', address)
    )
  );

  const data = quizzesSnap.docs.map(q => q.data());
  return {
    props: {
      quizzes: data
    }
  };
};

export default Index;
