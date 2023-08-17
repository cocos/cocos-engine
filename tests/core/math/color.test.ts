import { Vec4 } from '../../../cocos/core';
import { Color, linearToSrgb8Bit, srgb8BitToLinear, srgbToLinear } from '../../../cocos/core/math/color';

// test Color
describe('Test Color', () => {

    test('clone', () => {
        const color = new Color(128, 234, 0, 255);
        const color2 = color.clone();
        expect(color2._val).toBe(color._val);
    });
    test('copy', () => {
        const color = new Color(128, 234, 0, 255);
        const color2 = new Color();
        Color.copy(color2, color);
        expect(color2._val).toBe(color._val);
    });
    test('set', () => {
        const color = new Color(128, 234, 0, 255);
        const color2 = new Color();
        Color.set(color2, color.r, color.g, color.b, color.a);
        expect(color2._val).toBe(color._val);
    });
    test('fromHex', () => {
        const hexColor = ['#ff000000', '#00ff0000', '#0000ff00', '#ffffff00', '#00000000', '#ff00ff00', '#00ffff00', '#ffff0000'];
        const colors = [[255, 0, 0, 0], [0, 255, 0, 0], [0, 0, 255, 0], [255, 255, 255, 0], [0, 0, 0, 0], [255, 0, 255, 0], [0, 255, 255, 0], [255, 255, 0, 0]];

        const color = new Color();
        for (let i = 0; i < hexColor.length; i++) {
            Color.fromHEX(color, hexColor[i]);
            expect(color.r).toBe(colors[i][0]);
            expect(color.g).toBe(colors[i][1]);
            expect(color.b).toBe(colors[i][2]);
            expect(color.a).toBe(colors[i][3]);
        }
    });
    test('toHEX', () => {
        const hexColor = ['ff000000', '00ff0000', '0000ff00', 'ffffff00', '00000000', 'ff00ff00', '00ffff00', 'ffff0000'];
        const colors = [[255, 0, 0, 0], [0, 255, 0, 0], [0, 0, 255, 0], [255, 255, 255, 0], [0, 0, 0, 0], [255, 0, 255, 0], [0, 255, 255, 0], [255, 255, 0, 0]];

        const color = new Color();
        for (let i = 0; i < hexColor.length; i++) {
            Color.set(color, colors[i][0], colors[i][1], colors[i][2], colors[i][3]);
            expect(color.toHEX('#rrggbbaa')).toBe(hexColor[i]);
        }
    });
    test('add', () => {
        const color = new Color(128, 234, 10, 255);
        const color2 = new Color(128, 234, 20, 255);
        const color3 = new Color();
        Color.add(color3, color, color2);
        expect(color3.r).toBe(255);
        expect(color3.g).toBe(255);
        expect(color3.b).toBe(30);
        expect(color3.a).toBe(255);
    });
    test('subtract', () => {
        const color = new Color(0, 234, 10, 255);
        const color2 = new Color(0, 100, 20, 255);
        const color3 = new Color();
        Color.subtract(color3, color, color2);
        expect(color3.r).toBe(0);
        expect(color3.g).toBe(134);
        expect(color3.b).toBe(0);
        expect(color3.a).toBe(0);
    });
    test('multiply', () => {
        const color = new Color(128, 234, 10, 255);
        const color2 = new Color(128, 234, 20, 255);
        const color3 = new Color();
        Color.multiply(color3, color, color2);
        expect(color3.r).toBe(255);
        expect(color3.g).toBe(255);
        expect(color3.b).toBe(200);
        expect(color3.a).toBe(255);
    });
    test('divide', () => {
        const color = new Color(128, 234, 10, 255);
        const color2 = new Color(128, 234, 20, 255);
        const color3 = new Color();
        Color.divide(color3, color, color2);
        expect(color3.r).toBe(1);
        expect(color3.g).toBe(1);
        expect(color3.b).toBe(0);
        expect(color3.a).toBe(1);
    });
    test('scale', () => {
        const color = new Color(0, 234, 10, 255);
        const color2 = new Color();
        Color.scale(color2, color, 2);
        expect(color2.r).toBe(0);
        expect(color2.g).toBe(255);
        expect(color2.b).toBe(20);
        expect(color2.a).toBe(255);
    });
    test('lerp', () => {
        const color = new Color(1, 235, 15, 255);
        const color2 = new Color(255, 255, 255, 255);
        const color3 = new Color();
        Color.lerp(color3, color, color2, 0.5);
        expect(color3.r).toBe(128);
        expect(color3.g).toBe(245);
        expect(color3.b).toBe(135);
        expect(color3.a).toBe(255);
    });
    test('toArray', () => {
        const color = new Color(1, 235, 15, 255);
        const array = Color.toArray([11,0,0,0,0], color, 1);
        expect(array[0]).toBe(11);
        expect(array[1]).toBeCloseTo(0.003921568859368563, 6);
        expect(array[2]).toBeCloseTo(0.9215686321258545, 6);
        expect(array[3]).toBeCloseTo(0.05882352963089943, 6);
        expect(array[4]).toBeCloseTo(1, 6);
    });
    test('fromArray', () => {
        const color = new Color();
        Color.fromArray([0.003921568859368563, 0.9215686321258545, 0.05882352963089943, 1.0], color);
        expect(color.r).toBe(1);
        expect(color.g).toBe(235);
        expect(color.b).toBe(15);
        expect(color.a).toBe(255);
    });
    test('strictEquals', () => {
        const color = new Color(1, 235, 15, 255);
        const color2 = new Color(1, 235, 15, 255);
        const color3 = new Color(1, 235, 15, 0);
        expect(Color.strictEquals(color, color2)).toBeTruthy();
        expect(Color.strictEquals(color, color3)).toBeFalsy();
    });
    test('equals', () => {
        const color = new Color(1, 235, 15, 255);
        const color2 = new Color(1, 235, 15, 255);
        const color3 = new Color(1, 235, 15, 0);
        expect(Color.equals(color, color2)).toBeTruthy();
        expect(Color.equals(color, color3)).toBeFalsy();
    });
    test('toString', () => {
        const color = new Color(1, 235, 15, 255);
        expect(color.toString()).toBe('rgba(1, 235, 15, 255)');
    });
    test('toCSS', () => {
        const color = new Color(1, 235, 15, 255);
        expect(color.toCSS('rgba')).toBe('rgba(1,235,15,1.00)');
        expect(color.toCSS('rgb')).toBe('rgb(1,235,15)');
        expect(color.toCSS('#rrggbb')).toBe('#01eb0f');
    });
    test('toRGBValue', () => {
        const color = new Color(1, 235, 15, 255);
        expect(color.toRGBValue()).toBe(0x0FEB01);
    });

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
        expect(Color.toVec4(new Color(255, 188, 0, 255))).toEqual(new Vec4(1, 0.7372549019607844, 0, 1));
        expect(Color.fromVec4(new Vec4 (1, 0.5, 0, 1))).toEqual(new Color(255, 127, 0, 255));
    });

    test('fromUint32', () => {
        const color = new Color();
        for (let i = 0; i != 100; i++) {
            const val = (Math.random() * 0xFFFFFFFF) | 0;
            Color.fromUint32(color, val);
            expect(color.r).toBe(val & 0xFF);
            expect(color.g).toBe(val >> 8 & 0xFF);
            expect(color.b).toBe(val >> 16 & 0xFF);
            expect(color.a).toBe(val >> 24 & 0xFF);
            expect(color._val).toBe(val);
        }
    });

    test('toUint32', () => {
        const color = new Color();
        for (let i = 0; i != 100; i++) {
            const val = (Math.random() * 0xFFFFFFFF) | 0;
            Color.fromUint32(color, val);
            expect(Color.toUint32(color)).toBe(val);
        }
    });
});
