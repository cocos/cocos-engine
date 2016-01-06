/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// enum

/**
 * Define an enum type. If a enum item has a value of -1, it will be given an Integer number according to it's order in the list. Otherwise it will use the value specified by user who writes the enum definition.
 * @method Enum
 * @param {object} obj - a JavaScript literal object containing enum names and values
 * @return {object} the defined enum type
 *
 * @example
 Texture.WrapMode = cc.Enum({
    Repeat: -1,
    Clamp: -1
});
 // Texture.WrapMode.Repeat == 0
 // Texture.WrapMode.Clamp == 1
 // Texture.WrapMode[0] == "Repeat"
 // Texture.WrapMode[1] == "Clamp"

 var FlagType = cc.Enum({
    Flag1: 1,
    Flag2: 2,
    Flag3: 4,
    Flag4: 8,
});
 var AtlasSizeList = cc.Enum({
    128: 128,
    256: 256,
    512: 512,
    1024: 1024,
});
 */

cc.Enum = function (obj) {
    var enumType = {};
    Object.defineProperty(enumType, '__enums__', {
        value: undefined,
        writable: true
    });

    var lastIndex = -1;
    for (var key in obj) {
        var val = obj[key];
        if (val === -1) {
            val = ++lastIndex;
        }
        else {
            lastIndex = val;
        }
        enumType[key] = val;

        var reverseKey = '' + val;
        if (key !== reverseKey) {
            Object.defineProperty(enumType, reverseKey, {
                value: key,
                enumerable: false
            });
        }
    }
    return enumType;
};

cc.Enum.isEnum = function (enumType) {
    return enumType && enumType.hasOwnProperty('__enums__');
};

/**
 * @method getList
 * @param {Object} enumDef - the enum type defined from cc.Enum
 * @return {Object[]}
 * @private
 */
cc.Enum.getList = function (enumDef) {
    if ( enumDef.__enums__ !== undefined )
        return enumDef.__enums__;

    var enums = [];
    for ( var entry in enumDef ) {
        if ( enumDef.hasOwnProperty(entry) ) {
            var value = enumDef[entry];
            var isInteger = typeof value === 'number' && (value | 0) === value; // polyfill Number.isInteger
            if ( isInteger ) {
                enums.push( { name: entry, value: value } );
            }
        }
    }
    enums.sort( function ( a, b ) { return a.value - b.value; } );

    enumDef.__enums__ = enums;
    return enums;
};

if (CC_DEV) {
    // check key order in object literal
    var _TestEnum = cc.Enum({
        ZERO: -1,
        ONE: -1,
        TWO: -1,
        THREE: -1
    });
    if (_TestEnum.ZERO !== 0 || _TestEnum.ONE !== 1 || _TestEnum.TWO !== 2 || _TestEnum.THREE !== 3) {
        cc.error('Sorry, "cc.Enum" not available on this platform, ' +
                 'please report this error here: https://github.com/fireball-x/fireball/issues/new');
    }
}

module.exports = cc.Enum;