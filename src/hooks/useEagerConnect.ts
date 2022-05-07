import {useWeb3React} from '@web3-react/core';
import {InjectedConnector} from '@web3-react/injected-connector';
import {useCallback, useEffect, useMemo} from 'react';
import {ALL_SUPPORTED_CHAIN_IDS} from '../contracts/chains';
import {useWeb3ConnectionState} from '../state/Web3ConnectionStateContextProvider';

// Taken and adapted from uniswap-interface
// Automatically connect if Wallet is already unlocked
export function useEagerConnect() {
  const {activate, active} = useWeb3React();
  const connector = useMemo(
    () =>
      new InjectedConnector({
        supportedChainIds: ALL_SUPPORTED_CHAIN_IDS
      }),
    []
  );
  const {setTried, tried} = useWeb3ConnectionState();

  const eagerConnect = useCallback(async () => {
    try {
      if (!active) {
        const authorized = await connector.isAuthorized();
        if (authorized) {
          await activate(connector, undefined, true);
        }
        setTried(true);
      } else {
        setTried(true);
      }
    } catch (e) {
      setTried(true);
    }
  }, [activate, active, connector, setTried]);

  useEffect(() => {
    eagerConnect();
  }, [eagerConnect]);

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active, setTried]);

  return tried;
}
