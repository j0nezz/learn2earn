import {ContractReceipt, ContractTransaction} from 'ethers';

// Utility Wrapper which waits for a tx to be confirmed and throws
// if the tx fails.
export const waitAndEvaluateTx = (
  tx: ContractTransaction
): Promise<ContractReceipt> => {
  return new Promise((resolve, reject) => {
    tx.wait()
      .then(receipt => {
        if (receipt.status) {
          resolve(receipt);
        }
        reject();
      })
      .catch(reject);
  });
};
