import { KeyCode } from '../../cocos/input/types/key-code';
import { code2KeyCode } from '../../pal/input/keycodes';

describe('KeyCode enum', () => {
    test('META_LEFT should be defined as 91', () => {
        expect(KeyCode.META_LEFT).toBe(91);
    });

    test('META_RIGHT should be defined as 93', () => {
        expect(KeyCode.META_RIGHT).toBe(93);
    });

    test('META_LEFT should match C++ EngineEvents.h value', () => {
        // C++ side: META_LEFT = 91 (EngineEvents.h:233)
        expect(KeyCode.META_LEFT).toBe(91);
    });

    test('META_RIGHT should match C++ EngineEvents.h value', () => {
        // C++ side: META_RIGHT = 93 (EngineEvents.h:236)
        expect(KeyCode.META_RIGHT).toBe(93);
    });

    test('META_LEFT and META_RIGHT should not conflict with adjacent enum values', () => {
        // KEY_Z = 90, META_LEFT = 91, META_RIGHT = 93, NUM_0 = 96
        expect(KeyCode.KEY_Z).toBe(90);
        expect(KeyCode.META_LEFT).toBe(91);
        expect(KeyCode.META_RIGHT).toBe(93);
        expect(KeyCode.NUM_0).toBe(96);
        // Verify no collision
        expect(KeyCode.META_LEFT).not.toBe(KeyCode.KEY_Z);
        expect(KeyCode.META_LEFT).not.toBe(KeyCode.META_RIGHT);
        expect(KeyCode.META_RIGHT).not.toBe(KeyCode.NUM_0);
    });
});

describe('code2KeyCode mapping', () => {
    test('MetaLeft should map to KeyCode.META_LEFT (91)', () => {
        expect(code2KeyCode.MetaLeft).toBe(KeyCode.META_LEFT);
        expect(code2KeyCode.MetaLeft).toBe(91);
    });

    test('MetaRight should map to KeyCode.META_RIGHT (93)', () => {
        expect(code2KeyCode.MetaRight).toBe(KeyCode.META_RIGHT);
        expect(code2KeyCode.MetaRight).toBe(93);
    });

    test('MetaLeft/MetaRight should follow the same pattern as other modifier keys', () => {
        // All modifier keys should have left/right variants mapped
        expect(code2KeyCode.ShiftLeft).toBe(KeyCode.SHIFT_LEFT);
        expect(code2KeyCode.ShiftRight).toBe(KeyCode.SHIFT_RIGHT);
        expect(code2KeyCode.ControlLeft).toBe(KeyCode.CTRL_LEFT);
        expect(code2KeyCode.ControlRight).toBe(KeyCode.CTRL_RIGHT);
        expect(code2KeyCode.AltLeft).toBe(KeyCode.ALT_LEFT);
        expect(code2KeyCode.AltRight).toBe(KeyCode.ALT_RIGHT);
        expect(code2KeyCode.MetaLeft).toBe(KeyCode.META_LEFT);
        expect(code2KeyCode.MetaRight).toBe(KeyCode.META_RIGHT);
    });

    test('MetaLeft/MetaRight should not be undefined', () => {
        // This was the original bug - these mappings were missing
        expect(code2KeyCode.MetaLeft).toBeDefined();
        expect(code2KeyCode.MetaRight).toBeDefined();
    });
});
