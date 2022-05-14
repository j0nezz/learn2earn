import {SupportedChainId} from '../contracts/chains';

export const switchToMainnet = async () => {
  const provider = (window as any).ethereum;
  if (provider) {
    const chainId = SupportedChainId.ROPSTEN;
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Failed to switch network in Metamask:', error);
      return false;
    }
  } else {
    console.error(
      "Can't swtich Ethereum network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};
