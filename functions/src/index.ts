import * as functions from 'firebase-functions';
import { getMerkleProof } from './getMerkleProof';
import { getMerkleRoot } from './getMerkleRoot';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onCall((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  return 'hello';
});

export {getMerkleRoot, getMerkleProof}