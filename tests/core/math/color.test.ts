import { Vec4 } from '../../../cocos/core';
import { Color, linearToSrgb8Bit, srgb8BitToLinear, srgbToLinear } from '../../../cocos/core/math/color';

// test Color
describe('Test Color', () => {
    test('fromHex', () => {
        // fromHex and prototype.fromHex
        const startColor = new Color(0, 0, 0, 0);
        const endColor = new Color(255, 255, 255, 255);
        [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].forEach((ratio) => {
            const testColor = new Color();
            Color.lerp(testColor, startColor, endColor, ratio);
            const testHexRGBA = testColor.toHEX('#rrggbbaa');
            const color1 = new Color();
            color1.fromHEX(testHexRGBA);
            expect(color1._val).toBe(testColor._val);

            const color2 = new Color();
            Color.fromHEX(color2, testHexRGBA);
            expect(color2._val).toBe(testColor._val);

            const testHexRGB = testColor.toHEX('#rrggbb');
            const color3 = new Color();
            color3.fromHEX(testHexRGB);
            expect(color3.a).toBe(255);

            const color4 = new Color();
            Color.fromHEX(color4, testHexRGB);
            expect(color4._val).toBe(color3._val);
        });
    });

    test('linearToSrgb', () => {
        expect(linearToSrgb8Bit(1.1)).toBe(255);
        expect(linearToSrgb8Bit(-1)).toBe(0);
        expect(linearToSrgb8Bit(0.5)).toBe(188);
        expect(srgb8BitToLinear(188)).toBe(0.5028864580325687);
        for (let i = 0; i != 256; i++) {
            expect(linearToSrgb8Bit(srgb8BitToLinear(i))).toBe(i);
            expect(srgb8BitToLinear(i)).toBe(srgbToLinear(i / 255.0));
        }
        expect(Color.toVec4(new Color(255, 188, 0, 255))).toEqual(new Vec4(1, 0.5028864580325687, 0, 1));
        expect(Color.fromVec4(new Vec4 (1, 0.5, 0, 1))).toEqual(new Color(255, 188, 0, 255));
    });
});
