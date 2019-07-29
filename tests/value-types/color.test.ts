import { Color } from '../../cocos/core/math';

const white = Number.parseInt('ffffffff', 16);

test('creation test', function () {
    let c0 = new Color(255, 255, 255, 255);
    expect(c0._val).toBe(white);
    c0.r = 0;
    c0.b = 127.5;
    let c1 = new Color(c0);
    expect(c1._val).toBe(Number.parseInt('ff7fff00', 16));
    let c2 = new Color('#ffff087f');
    expect(c2.r).toBe(255);
    expect(c2.g).toBe(255);
    expect(c2.b).toBe(8);
    expect(c2.a).toBe(127);
});

test('value test', function () {
    let c0 = new Color();
    expect(c0.r).toBe(0);
    expect(c0.g).toBe(0);
    expect(c0.b).toBe(0);
    expect(c0.a).toBe(255);
    c0.r = 255;
    expect(c0.r).toBe(255);
    c0.g = 300;
    expect(c0.g).toBe(255);
    expect(c0._val).toBe(Number.parseInt('ff00ffff', 16));
    c0.r = 16;
    c0.a = -1;
    expect(c0.a).toBe(0);
    expect(c0._val).toBe(Number.parseInt('0000ff10', 16));
    let c1 = new Color(16, 255, 0, 0);
    expect(c0).toEqual(c1);
});

test('method test', function () {
    let c0 = new Color(8, 16, 128, 255);
    let c1 = new Color(192, 128, 0, 0);
    let c2 = new Color();
    Color.lerp(c2, c0, c1, 0.2);
    expect(c2.r).toBe(Math.floor(c0.r + (c1.r - c0.r) * 0.2));
    expect(c2.g).toBe(Math.floor(c0.g + (c1.g - c0.g) * 0.2));
    expect(c2.b).toBe(Math.floor(c0.b + (c1.b - c0.b) * 0.2));
    expect(c2.a).toBe(Math.floor(c0.a + (c1.a - c0.a) * 0.2));
    Color.lerp(c2, c0, c1, 1);
    expect(c2).toEqual(c1);

    let c3 = c1.clone();
    expect(c3).toEqual(c1);
    expect(c3.equals(c1)).toBeTruthy();

    c2.set(c1);
    c2.lerp(c0, 0.95);
    expect(c2.r).toBe(Math.floor(c1.r + (c0.r - c1.r) * 0.95));
    expect(c2.g).toBe(Math.floor(c1.g + (c0.g - c1.g) * 0.95));
    expect(c2.b).toBe(Math.floor(c1.b + (c0.b - c1.b) * 0.95));
    expect(c2.a).toBe(Math.floor(c1.a + (c0.a - c1.a) * 0.95));
});

test('conversion test', function() {
    let testColor = new Color( 255, 255, 0, 127.5 );
    expect(testColor.toHEX('#rrggbbaa')).toBe("ffff007f");
    expect(testColor.toHEX('#rrggbb')).toBe("ffff00");
    expect(testColor.toCSS('#rrggbbaa')).toBe("#ffff007f");
    expect(testColor.toCSS('#rrggbb')).toBe("#ffff00");
    expect(testColor.toCSS('rgb')).toBe("rgb(255,255,0)");
    expect(testColor.toCSS('rgba')).toBe("rgba(255,255,0,0.50)");

    testColor = new Color( 0.3 * 255, 255, 0, 127.5 );
    expect(testColor.toHEX('#rrggbbaa')).toBe("4cff007f");
    expect(testColor.toHEX('#rrggbb')).toBe("4cff00");
    expect(testColor.toCSS('#rrggbbaa')).toBe("#4cff007f");
    expect(testColor.toCSS('#rrggbb')).toBe("#4cff00");
    expect(testColor.toCSS('rgb')).toBe("rgb(76,255,0)");

    testColor = new Color( 255, 0, 0, 255 );
    expect(testColor.toHSV()).toEqual({ h: 0, s: 1, v: 1 });
    expect(testColor.fromHSV(0,1,1).toCSS('#rrggbb')).toEqual('#ff0000');
    expect(testColor.fromHSV(1,1,1).toCSS('#rrggbb')).toEqual('#ff0000');
});
