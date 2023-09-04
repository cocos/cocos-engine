import ps from 'path';
import { runTest } from './test-util';

test.skip(`Test link engine`, async () => {
    await runTest(ps.resolve(__dirname, '..', '..', '..'), 'typedoc-index.ts');
});
