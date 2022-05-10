import * as functions from 'firebase-functions';
import {merkletreeUtils} from './helpers/merkletree-utils';

type GetMerkleRootCallData = {
    quizId: number;
    address: string;
};

type Answer = {
    quizId: number;
    address: string;
    timestamp: number;
    answerId: number;
};

const DummiData: Answer[] = [
    {
        quizId: 2,
        address: '0x41C0049415C00E3115028853f2d09f2D43b3DDD9',
        timestamp: 100,
        answerId: 1
    },
    {
        quizId: 2,
        address: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
        timestamp: 100,
        answerId: 1
    },
    {
        quizId: 3,
        address: '0x41C0049415C00E3115028853f2d09f2D43b3DDD2',
        timestamp: 100,
        answerId: 1
    }
];

export const getMerkleProof = functions.https.onCall(
    (data: GetMerkleRootCallData, context) => {
        const leaves = DummiData.filter(d => d.quizId === data.quizId).map(
            d => d.address
        );

        const tree = merkletreeUtils.buildMerkleTree(leaves);
        return merkletreeUtils.getMerkleProofForLeaf(data.address, tree);
    }
);
