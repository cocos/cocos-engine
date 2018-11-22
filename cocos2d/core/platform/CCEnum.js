/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var js = require('./js');

// enum

/**
 * !#en
 * Define an enum type. <br/>
 * If a enum item has a value of -1, it will be given an Integer number according to it's order in the list.<br/>
 * Otherwise it will use the value specified by user who writes the enum definition.
 *
 * !#zh
 * 定义一个枚举类型。<br/>
 * 用户可以把枚举值设为任意的整数，如果设为 -1，系统将会分配为上一个枚举值 + 1。
 *
 * @method Enum
 * @param {object} obj - a JavaScript literal object containing enum names and values, or a TypeScript enum type
 * @return {object} the defined enum type
 * @example {@link cocos2d/core/platform/CCEnum/Enum.js}
 * @typescript Enum<T>(obj: T): T
 */
function Enum (obj) {
    if ('__enums__' in obj) {
        return obj;
    }
    js.value(obj, '__enums__', null, true);

    var lastIndex = -1;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = obj[key];

        if (val === -1) {
            val = ++lastIndex;
            obj[key] = val;
        }
        else {
            if (typeof val === 'number') {
                lastIndex = val;
            }
            else if (typeof val === 'string' && Number.isInteger(parseFloat(key))) {
                continue;
            }
        }
        var reverseKey = '' + val;
        if (key !== reverseKey) {
            if ((CC_EDITOR || CC_TEST) && reverseKey in obj && obj[reverseKey] !== key) {
                cc.errorID(7100, reverseKey);
                continue;
            }
            js.value(obj, reverseKey, key);
        }
    }
    return obj;
}

Enum.isEnum = function (enumType) {
    return enumType && enumType.hasOwnProperty('__enums__');
};

/**
 * @method getList
 * @param {Object} enumDef - the enum type defined from cc.Enum
 * @return {Object[]}
 * @private
 */
Enum.getList = function (enumDef) {
    if (enumDef.__enums__)
        return enumDef.__enums__;

    var enums = enumDef.__enums__ = [];
    for (var name in enumDef) {
        var value = enumDef[name];
        if (Number.isInteger(value)) {
            enums.push({ name, value });
        }
    }
    enums.sort( function ( a, b ) { return a.value - b.value; } );
    return enums;
};

if (CC_DEV) {
    // check key order in object literal
    var _TestEnum = Enum({
        ZERO: -1,
        ONE: -1,
        TWO: -1,
        THREE: -1
    });
    if (_TestEnum.ZERO !== 0 || _TestEnum.ONE !== 1 || _TestEnum.THREE !== 3) {
        cc.errorID(7101);
    }
}

module.exports = cc.Enum = Enum;
