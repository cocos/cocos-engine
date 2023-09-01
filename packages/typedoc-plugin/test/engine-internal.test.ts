import ps from 'path';
import { runTest } from './test-util';

test(`fix type arguments`, async () => {
    await runTest(ps.join(__dirname, './inputs/link/'), 'engine-internal.ts');
});
