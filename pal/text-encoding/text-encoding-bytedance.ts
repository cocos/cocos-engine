import { assertIsTrue } from '../../cocos/core/data/utils/asserts';
import { checkPalIntegrity, withImpl } from '../integrity-check';
import {
    encodeUtf8 as encodeUtf8_fallback,
    decodeUtf8 as decodeUtf8_fallback,
} from './fallback';

declare global {
    namespace tt {
        // https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/drawing/inflate/tt-create-buffer/
        //
        // Note: as TikTok Developer Tools V4.1.0,
        // the emulator does not support this API and `undefined` is returned.
        export function createBuffer(): BufferConstructor | undefined;

        interface BufferConstructor {
            from(text: string, encoding: 'utf8'): Buffer;
            toString(buffer: Buffer, encoding: 'utf8'): string;
        }

        type Buffer = Uint8Array;
    }
}

const Buffer = tt.createBuffer();

// TikTok didn't explicitly document the result type of `Buffer.from`.
// But as observed at 2023/7/10. It's `Uint8Array`.
// Let's make a little test for it.
if (true as boolean && Buffer) {
    assertIsTrue(Buffer.from('abc', 'utf8') instanceof Uint8Array);
    assertIsTrue(Buffer.toString(new Uint8Array([0x61, 0x62, 0x63]), 'utf8') === 'abc');
}

export const {
    encodeUtf8,
    decodeUtf8,
}: {
    encodeUtf8: (text: string) => Uint8Array;
    decodeUtf8: (octets: Uint8Array) => string;
} = (() => {
    if (Buffer) {
        return {
            encodeUtf8: (text: string): Uint8Array => {
                const buffer = Buffer.from(text, 'utf8');
                return buffer;
            },
            // eslint-disable-next-line arrow-body-style
            decodeUtf8: (octets: Uint8Array): string => {
                return Buffer.toString(octets, 'utf8');
            },
        };
    } else {
        return {
            encodeUtf8: encodeUtf8_fallback,
            decodeUtf8: decodeUtf8_fallback,
        };
    }
})();

checkPalIntegrity<typeof import('pal/text-encoding')>(
    withImpl<typeof import('./text-encoding-bytedance')>());
