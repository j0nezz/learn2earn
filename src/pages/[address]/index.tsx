import {Web3Provider} from '@ethersproject/providers';
import {
  collection,
  CollectionReference,
  getDocs,
  query,
  where
} from '@firebase/firestore';
import {useWeb3React} from '@web3-react/core';
import {Flex, Spacer} from 'axelra-styled-bootstrap-grid';
import {GetServerSideProps} from 'next';
import React, {ReactElement, useCallback, useState} from 'react';
import QuizCard from '../../components/QuizCard';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold} from '../../components/ui/Typography';
import Web3Layout from '../../layouts/web3.layout';
import {db} from '../../lib/firebase';
import {Quiz} from '../../types/firestore-types';

type Props = {
  quizzes: Quiz[];
};

const Index = ({quizzes}: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const {account, library} = useWeb3React();

  const selectAnswer = useCallback(
    async (id: number) => {
      if (!library || !account) return;

      setSelected(id);
      const sign = await (library as Web3Provider)
        .getSigner(account)
        .signMessage(id.toString());

      console.log(sign);

      // TODO: callBackend({answer: id, quizId, signature})

      setConfirmed(id);
    },
    [account, library]
  );

  return (
    <PageContainer>
      <Bold size={'xxxl'} gradient block>
        Your Quizzes
      </Bold>
      <Spacer x2 />
      <Flex row>
        {quizzes.map(q => (
          <QuizCard key={q.quizId} quiz={q} />
        ))}
      </Flex>
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

  // TODO get Answer of user

  const data = quizzesSnap.docs.map(q => q.data());
  return {
    props: {
      quizzes: data
    }
  };
};

export default Index;
