import {ethers} from 'ethers';
import {MerkleTree} from 'merkletreejs';

export const merkletreeUtils = {
  keccak: (input: string) => {
    return Buffer.from(ethers.utils.keccak256(input).slice('0x'.length), 'hex');
  },

  buildMerkleTree: (leaves: string[]) => {
    const merkleLeaves = leaves.map(data =>
      merkletreeUtils.keccak(ethers.utils.solidityPack(['address'], [data]))
    );
    return new MerkleTree(merkleLeaves, merkletreeUtils.keccak, {
      sortPairs: true
    });
  },

  getMerkleRoot: (tree: MerkleTree) => '0x' + tree.getRoot().toString('hex'),

  getMerkleProofForLeaf: (leaf: string, tree: MerkleTree) => {
    return tree
      .getProof(
        merkletreeUtils.keccak(
          ethers.utils.solidityPack(['address'], [leaf])
        )
      )
      .map(p => '0x' + p.data.toString('hex'));
  }
};
