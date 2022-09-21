import { Color } from '../../../cocos/core/math/color';

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
});
