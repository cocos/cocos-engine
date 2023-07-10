import { checkPalIntegrity, withImpl } from '../integrity-check';

export * from './fallback';

checkPalIntegrity<typeof import('pal/text-encoding')>(
    withImpl<typeof import('./text-encoding-pure-js')>());
