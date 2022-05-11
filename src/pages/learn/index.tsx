import {collection, CollectionReference, getDocs} from '@firebase/firestore';
import {useWeb3React} from '@web3-react/core';
import {Flex} from 'axelra-styled-bootstrap-grid';
import {GetServerSideProps} from 'next';
import React, {ReactElement} from 'react';
import QuizCard from '../../components/QuizCard';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold, Medium} from '../../components/ui/Typography';
import Web3Layout from '../../layouts/web3.layout';
import {db} from '../../lib/firebase';
import {Quiz} from '../../types/firestore-types';

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
      {account ? (
        <Medium>Hello {account}</Medium>
      ) : (
        <Medium>Use the connect Button in the Header</Medium>
      )}
      <Flex row>
        {quizes.map(q => (
          <QuizCard key={q.quizId} quiz={q} />
        ))}
      </Flex>
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
