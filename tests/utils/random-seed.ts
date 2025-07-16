import crypto from 'crypto';
import { VERSION } from '../../exports/base';

export const getMagicSeed = () => {
    const text = `${VERSION}: ${expect.getState().currentTestName ?? ''}`;
    const sha1 = textToSha1(text);
    const seed = sha1ToSeed(sha1);
    return seed;
};

function textToSha1(text: string) {
    return crypto.createHash('sha1').update(text).digest('hex');
}

function sha1ToSeed(sha1: string) {
    const bigInt = BigInt(`0x${sha1.slice(0, 7)}`);
    const signed64 = BigInt.asIntN(64, bigInt);
    return Number(signed64);
}