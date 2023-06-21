import { BufferAsset } from "../../exports/base";
import { captureWarns } from '../utils/log-capture';

test(`Deprecation warning`, () => {
    const bufferAsset = new BufferAsset();

    bufferAsset.view = new Uint8Array([3, 1, 8, 8]);
    
    const warns = captureWarns();

    // Deprecation message should be given at first invocation.
    const bytesFirstInvocationResult = bufferAsset.buffer();
    expect(warns.captured).toStrictEqual([
        [`'%s' is deprecated, please use '%s' instead. `, `BufferAsset.buffer`, `BufferAsset.view`],
    ]);
    warns.clear();

    // The first invocation returns a copy of `.view`.
    expect(bytesFirstInvocationResult).not.toBe(bufferAsset.view.buffer);
    expect(new Uint8Array(bytesFirstInvocationResult)).toStrictEqual(bufferAsset.view);

    // Repeatedly invocations on `buffer()` should return the same result.
    const check = () => { expect(bufferAsset.buffer()).toBe(bytesFirstInvocationResult); };

    check();

    // The copy won't change event the `.view` has changed.
    ++bufferAsset.view[0];
    check();
    bufferAsset.view = new Uint8Array([7, 4, 5, 6]);
    check();
    // Verse vice.
    {
        const v = bufferAsset.view[0];
        new Uint8Array(bufferAsset.buffer())[0] = v + 1;
        expect(bufferAsset.view[0]).toBe(v);
    }
});