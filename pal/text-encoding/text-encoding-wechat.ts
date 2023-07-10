import { checkPalIntegrity, withImpl } from '../integrity-check';

declare global {
    namespace wx {
        // https://developers.weixin.qq.com/minigame/dev/api/util/wx.encode.html
        export function encode(_: { data: string, format: 'utf8' }): ArrayBuffer;

        // https://developers.weixin.qq.com/minigame/dev/api/util/wx.decode.html
        export function decode(_: { data: ArrayBuffer | Uint8Array, format: 'utf8' }): string;
    }
}

export function encodeUtf8 (text: string): Uint8Array {
    return new Uint8Array(wx.encode({ data: text, format: 'utf8' }));
}

export function decodeUtf8 (octets: Uint8Array): string {
    return wx.decode({ data: octets, format: 'utf8' });
}

checkPalIntegrity<typeof import('pal/text-encoding')>(
    withImpl<typeof import('./text-encoding-wechat')>());
