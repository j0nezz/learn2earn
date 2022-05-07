import {useWeb3React} from '@web3-react/core';
import React, {ReactElement} from 'react';
import {PageContainer} from '../components/ui/PageContainer';
import {Bold, Medium} from '../components/ui/Typography';
import Web3Layout from '../layouts/web3.layout';

type Props = {};

const Learn = (props: Props) => {
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
    </PageContainer>
  );
};

Learn.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export default Learn;
