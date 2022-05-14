import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core';
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import {useCallback} from 'react';
import {toast} from 'react-hot-toast';
import {ALL_SUPPORTED_CHAIN_IDS} from '../contracts/chains';
import {switchToMainnet} from '../helpers/wallet';

// Taken and adapted from Pancakeswap
// Can be used as callback for a "Connect Web3" Button
export const useWeb3Connect = () => {
  const {activate} = useWeb3React();

  return useCallback(async () => {
    try {
      const connector = new InjectedConnector({
        supportedChainIds: ALL_SUPPORTED_CHAIN_IDS
      });
      await activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const isOnMainnet = await switchToMainnet();
          if (isOnMainnet) {
            await activate(connector, undefined, true);
          } else {
            toast.error('Unsupported Chain');
          }
        } else if (error instanceof NoEthereumProviderError) {
          toast.error('No Ethereum provider was found');
        } else if (error instanceof UserRejectedRequestError) {
          toast.error('Please authorize to access your account');
        } else {
          toast.error(error.message);
        }
      });
    } catch (e) {
      toast.error('Something went wrong. Please try again.');
      console.log('Error', e);
    }
  }, [activate]);
};
