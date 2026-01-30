import { solvePow } from './pow.js';

const nonce = 'deadbeef';
const difficulty = 16;

solvePow({ nonce, difficulty, maxIters: 500000 })
  .then(({ solution, iters }) => {
    console.log('ok', { solution, iters });
    process.exit(0);
  })
  .catch((e) => {
    console.error('fail', e);
    process.exit(1);
  });
