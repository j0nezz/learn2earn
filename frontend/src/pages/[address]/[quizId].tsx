import {doc, DocumentReference, getDoc} from '@firebase/firestore';
import {httpsCallable} from '@firebase/functions';
import {useWeb3React} from '@web3-react/core';
import {
  Flex,
  MEDIUM_DEVICES_BREAK_POINT,
  Spacer
} from 'axelra-styled-bootstrap-grid';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {BigNumber, ethers} from 'ethers';
import {GetServerSideProps} from 'next';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {toast} from 'react-hot-toast';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import styled from 'styled-components';
import {Button} from '../../components/ui/Button';
import {Icon, IconTypes} from '../../components/ui/Icon';
import {Input} from '../../components/ui/Input';
import {PageContainer} from '../../components/ui/PageContainer';
import {
  Bold,
  Light,
  Medium,
  Regular,
  SemiBold
} from '../../components/ui/Typography';
import {VideoWrapper} from '../../components/ui/VideoWrapper';
import {
  DISTRIBUTOR_CONTRACT,
  useErc20,
  useQuizDistributor
} from '../../contracts/addresses';
import {SupportedChainId} from '../../contracts/chains';
import {waitAndEvaluateTx} from '../../helpers/waitAndEvaluateTx';
import {useErc20Decimals} from '../../hooks/useErc20Decimals';
import Web3Layout from '../../layouts/web3.layout';
import {db, functions} from '../../lib/firebase';
import {__ALERTS} from '../../theme/theme';
import {GetMerkleRootCallData} from '../../types/firebase-function-types';
import {Quiz} from '../../types/firestore-types';

type Props = {
  quiz: Quiz;
};

const ICON_SIZE = 30;

const getMerkleRoot = httpsCallable<GetMerkleRootCallData, string>(
  functions,
  'getMerkleRoot'
);

const Header = styled(Flex)`
  @media only screen and (max-width: ${MEDIUM_DEVICES_BREAK_POINT}px) {
    flex-direction: column;
  }
`;

const RewardBanner = styled(Flex)`
  @media only screen and (max-width: ${MEDIUM_DEVICES_BREAK_POINT}px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const Index = ({quiz}: Props) => {
  const distributor = useQuizDistributor();
  const [lastMerkleRoot, setLastMerkleRoot] = useState<null | Date>(null);
  const erc20 = useErc20({[SupportedChainId.ROPSTEN]: quiz.token});
  const decimals = useErc20Decimals(quiz.token);
  const reward = useMemo(() => {
    if (!decimals) return '...';
    return ethers.utils.formatUnits(quiz.reward, decimals);
  }, [decimals, quiz.reward]);
  const {account} = useWeb3React();
  const [allowance, setAllowance] = useState<BigNumber | null>(null);
  const [approve, setApprove] = useState('');

  const getAllowance = useCallback(async () => {
    if (!erc20 || !account) return;
    const a = await erc20.allowance(
      account,
      DISTRIBUTOR_CONTRACT[SupportedChainId.ROPSTEN]
    );
    setAllowance(a);
  }, [account, erc20]);

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  const getLastMerkleRoot = useCallback(async () => {
    if (!distributor) return;

    const timestamp = await distributor.getMerkleRootTimestamp(quiz.quizId);

    if (timestamp.eq(0)) return;

    setLastMerkleRoot(new Date(timestamp.toNumber()));
  }, [distributor, quiz.quizId]);

  useEffect(() => {
    getLastMerkleRoot();
  }, [getLastMerkleRoot]);

  const updateAllowance = useCallback(async () => {
    if (!erc20 || !account) return;
    const tx = await erc20.approve(
      DISTRIBUTOR_CONTRACT[SupportedChainId.ROPSTEN],
      BigNumber.from(approve)
    );
    const txConfirmation = waitAndEvaluateTx(tx);
    await toast.promise(txConfirmation, {
      loading: 'Waiting for confirmation',
      success: 'Allowance successfully updated',
      error: 'Error updating allowance'
    });
    setApprove('')
  }, [account, approve, erc20]);

  const setMerkleRoot = useCallback(async () => {
    if (!distributor) return;

    const newTimestamp = Date.now();

    const loading = toast.loading('Generating merkle root...');
    const res = await getMerkleRoot({
      quizId: quiz.quizId,
      timestamp: newTimestamp
    });
    toast.dismiss(loading);

    const id = BigNumber.from(quiz.quizId);
    if (res.data.length === 2) {
      toast.error(
        'You cannot update the merkle root since there is nobody to be rewarded.'
      );
      return;
    }
    const tx = await distributor.updateMerkleRoot(id, res.data, newTimestamp);
    const txConfirmation = waitAndEvaluateTx(tx);
    await toast.promise(txConfirmation, {
      loading: 'Waiting for confirmation',
      success: 'Merkleroot successfully updated',
      error: 'Error updating merkleroot'
    });
  }, [distributor, quiz.quizId]);

  return (
    <PageContainer>
      <Header row>
        <Bold size={'xxxl'} gradient block>
          Earn {quiz.tokenName}
        </Bold>
        <RewardBanner align={'center'} justify={'flex-end'} flex={1} row>
          <Flex row>
            <SemiBold size={'xl'} gradient block>
              Reward:
            </SemiBold>
            <Spacer />
            <Regular size={'xl'} gradient block>
              {reward} {quiz.tokenName}
            </Regular>
          </Flex>
        </RewardBanner>
      </Header>
      <Spacer x3 />
      <VideoWrapper>
        <LiteYouTubeEmbed
          id={quiz.youtubeId}
          title={'Earn ' + quiz.tokenName}
        />
      </VideoWrapper>
      <Spacer x2 />
      <Medium size={'xl'} block>
        {quiz.question}
      </Medium>
      {quiz.answers.map((a, i) => (
        <React.Fragment key={a.id}>
          <Spacer />
          <Flex row>
            {i === 0 ? (
              <Icon
                name={IconTypes.CORRECT}
                color={__ALERTS.SUCCESS}
                size={ICON_SIZE}
              />
            ) : (
              <Icon
                name={IconTypes.WRONG}
                color={__ALERTS.ERROR}
                size={ICON_SIZE}
              />
            )}
            <Spacer />
            <Medium size={'l'} block>
              {a.label}
            </Medium>
          </Flex>
        </React.Fragment>
      ))}
      <Spacer x2 />
      <Medium size={'xl'} block>
        Merkleroot
      </Medium>
      <Light size={'l'} block>
        {lastMerkleRoot
          ? `Last Update on Blockchain: ${formatDistanceToNow(
              lastMerkleRoot
            )} ago`
          : 'No Update on Blockchain found.'}
      </Light>
      <Spacer x2 />
      <Button onClick={setMerkleRoot}>Update Merkleroot</Button>
      <Spacer x2 />
      <Medium size={'xl'} block>
        Allowance
      </Medium>
      <Light size={'l'} block>
        Current allowance is {allowance ? ethers.utils.formatUnits(allowance, 0) : '...'}.
      </Light>
      <Spacer />
      <Flex row align={"center"}>
        <Input
          value={approve}
          placeholder={'Amount to approve'}
          name={'approve'}
          onTextChange={setApprove}
          noMarginBottom
        />
        <Spacer x2 />
        <Button onClick={updateAllowance}>Update Allowance</Button>
        <Flex flex={1} />
      </Flex>
    </PageContainer>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export const getServerSideProps: GetServerSideProps<
  any,
  {address: string; quizId: string},
  any
> = async ({params}) => {
  const quizId = params?.quizId;
  const address = params?.address;

  if (!quizId || !address) {
    return {
      redirect: {
        destination: '/learn',
        permanent: false
      }
    };
  }

  const ref = doc(db, 'quiz', quizId) as DocumentReference<Quiz>;
  const docSnap = await getDoc<Quiz>(ref);
  const data = docSnap.data();

  if (!data || data.ownerAddress !== address) {
    return {
      redirect: {
        destination: '/learn',
        permanent: false
      }
    };
  }

  return {
    props: {
      quiz: data
    }
  };
};

export default Index;
