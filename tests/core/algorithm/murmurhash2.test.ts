import { murmurhash2_32_gc } from '../../../cocos/core/algorithm/murmurhash2_gc'

const SEED = 3339675911;

// The test case refers to https://github.com/jtpio/murmurhash2/blob/main/test/murmur2_spec.ts
describe('murmurhash2_32_gc', () => {
    test('should encode ASCII strings', () => {
        const str = 'abcde';
        const h = murmurhash2_32_gc(str, SEED);
        expect(h).toEqual(730143326);
    });
})
