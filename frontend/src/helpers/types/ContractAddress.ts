import {SupportedChainId} from '../../contracts/chains';

export type ContractAddress = {
  [s in SupportedChainId]: string;
};
