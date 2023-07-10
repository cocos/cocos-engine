import * as goal from 'pal/text-encoding';
import { checkPalIntegrity, withImpl } from '../integrity-check';

export const encodeUtf8 = ((): typeof goal.encodeUtf8 => {
    const encoder = new TextEncoder();
    return (text): Uint8Array => encoder.encode(text);
})();

export const decodeUtf8 = ((): typeof goal.decodeUtf8 => {
    const decoder = new TextDecoder();
    return (octets): string => decoder.decode(octets);
})();

checkPalIntegrity<typeof import('pal/text-encoding')>(
    withImpl<typeof import('./text-encoding-whatwg')>());
