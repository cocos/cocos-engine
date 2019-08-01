module('color');

test('basic test', function() {
    var testColor = new cc.Color( 255, 255, 0, 127.5 );
    equal ( testColor.toHEX('#rrggbbaa'), "ffff007f", "The value must be ffff007f" );
    equal ( testColor.toHEX('#rrggbb'), "ffff00", "The value must be ffff00" );
    equal ( testColor.toHEX('#rgb'), "ff0", "The value must be ff0" );
    equal ( testColor.toCSS('#rrggbbaa'), "#ffff007f", "The value must be ffff007f" );
    equal ( testColor.toCSS('#rrggbb'), "#ffff00", "The value must be #ffff00" );
    equal ( testColor.toCSS('#rgb'), "#ff0", "The value must be #ff0" );

    testColor = new cc.Color( 0.3 * 255, 255, 0, 127.5 );
    equal ( testColor.toHEX('#rrggbbaa'), "4cff007f", "The value must be 4cff007f" );
    equal ( testColor.toHEX('#rrggbb'), "4cff00", "The value must be 4cff00" );
    equal ( testColor.toHEX('#rgb'), "4f0", "The value must be ff0" );
    equal ( testColor.toCSS('#rrggbbaa'), "#4cff007f", "The value must be #4cff007f" );
    equal ( testColor.toCSS('#rrggbb'), "#4cff00", "The value must be #4cff00" );
    equal ( testColor.toCSS('#rgb'), "#4f0", "The value must be #4f0" );

    testColor = new cc.Color( 255, 0, 0, 255 );
    deepEqual ( testColor.toHSV(), { h: 0, s: 1, v: 1 }, "The value must be { h:0, s:1, v:1 }" );
    deepEqual ( testColor.fromHSV(0,1,1).toCSS('#rrggbb'), '#ff0000', "The value must be #ff0000" );
    deepEqual ( testColor.fromHSV(1,1,1).toCSS('#rrggbb'), '#ff0000', "The value must be #ff0000" );
});
