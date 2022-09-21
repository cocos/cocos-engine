import ps from 'path';
import { runTest } from './test-util';

test(`Test`, async () => {
    await runTest(ps.join(__dirname, 'dummy-engine'));
});
