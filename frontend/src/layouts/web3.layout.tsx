import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {ContentWrapper} from '../components/ui/ContentWrapper';
import {FullHeightWrapper} from '../components/ui/FullHeightWrapper';
import Web3ConnectionManager from '../components/Web3ConnectionManager';
import {Web3ConnectionStateContextProvider} from '../state/Web3ConnectionStateContextProvider';
import Web3ContextProvider from '../state/Web3ContextProvider';

const Web3Layout: React.FC = ({children}) => {
  return (
    <Web3ContextProvider>
      <Web3ConnectionStateContextProvider>
        <Web3ConnectionManager />
        <FullHeightWrapper>
          <Header web3 />
          <ContentWrapper>{children}</ContentWrapper>
          <Footer />
        </FullHeightWrapper>
      </Web3ConnectionStateContextProvider>
    </Web3ContextProvider>
  );
};

export default Web3Layout;
