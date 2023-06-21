import { BufferAsset } from "../../exports/base";
import { captureWarns } from '../utils/log-capture';

test(`Deprecation warning`, () => {
    const bufferAsset = new BufferAsset();

    bufferAsset.bytes = new Uint8Array([3, 1, 8, 8]);
    
    const warns = captureWarns();

    // Deprecation message should be given at first invocation.
    const bytesFirstInvocationResult = bufferAsset.buffer();
    expect(warns.captured).toStrictEqual([
        [`'%s' is deprecated, please use '%s' instead. `, `BufferAsset.buffer`, `BufferAsset.bytes`],
    ]);
    warns.clear();

    // The first invocation returns a copy of `.bytes`.
    expect(bytesFirstInvocationResult).not.toBe(bufferAsset.bytes.buffer);
    expect(new Uint8Array(bytesFirstInvocationResult)).toStrictEqual(bufferAsset.bytes);

    // Repeatedly invocations on `buffer()` should return the same result.
    const check = () => { expect(bufferAsset.buffer()).toBe(bytesFirstInvocationResult); };

    check();

    // The copy won't change event the `.bytes` has changed.
    ++bufferAsset.bytes[0];
    check();
    bufferAsset.bytes = new Uint8Array([7, 4, 5, 6]);
    check();
    // Verse vice.
    {
        const v = bufferAsset.bytes[0];
        new Uint8Array(bufferAsset.buffer())[0] = v + 1;
        expect(bufferAsset.bytes[0]).toBe(v);
    }
});