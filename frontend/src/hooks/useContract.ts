import {AddressZero} from '@ethersproject/constants';
import {JsonRpcSigner, Web3Provider} from '@ethersproject/providers';
import {useWeb3React} from '@web3-react/core';
import {Contract} from 'ethers';
import {isAddress} from 'ethers/lib/utils';
import {useMemo} from 'react';

// taken from Uniswap Interface
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | {[chainId: number]: string} | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const {library, account, chainId} = useWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    library,
    chainId,
    withSignerIfPossible,
    account
  ]) as T;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

// account is not optional
function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}
