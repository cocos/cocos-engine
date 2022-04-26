import ps from 'path';
import { runTest } from './test-util';

test(`Test link`, async () => {
    await runTest(ps.join(__dirname, 'inputs', 'link'));
});
