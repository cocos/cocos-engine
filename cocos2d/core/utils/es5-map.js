/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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

 // SameValue algorithm
if (!Object.is) {
    Object.is = function(x, y) {
        if (x === y) {
            return x !== 0 || 1 / x === 1 / y;
        } else {
            return x !== x && y !== y;
        }
    };
}

/**
 * !#en
 * Helper class for ES5 Map.
 * !#zh
 * ES5 Map 辅助类。
 * @param {data[]}
 * @class MapUtils
 */
function MapUtils (data) {
    !data && (data = []);

    this.datas = [];
    
    let toString = Object.prototype.toString;

    if (toString.call(data) !== '[object Array]') {
        throw new TypeError('The constructor data must be object Array');
    }

    let that = this;

    data.forEach(function (item) {
        if (toString.call(item) !== '[object Array]') {
            throw new TypeError('The item data must be object Array');
        }

        if (!that.has(item[0])) {
            that.datas.push({
                key: item[0],
                value: item[1]
            });
        }
    });
};

MapUtils.prototype.size = function () {
    return this.datas.length;
};

MapUtils.prototype.set = function (key, value) {
    this.delete(key);
    this.datas.push({
        key: key,
        value: value
    });
};

MapUtils.prototype.get = function (key) {
    let value = undefined;
    let datas = this.datas;
    for (let i = 0, len = datas.length; i < len; i++) {
        if (Object.is(key, datas[i].key)) {
            value = datas[i].value;
            break;
        }
    }
    return value;
};

MapUtils.prototype.has = function (key) {
    let res = false;
    let datas = this.datas;
    for (let i = 0, len = datas.length; i < len; i++) {
        if (Object.is(key, datas[i].key)) {
            res = true;
            break;
        }
    }
    return res;
};

MapUtils.prototype.clear = function () {
    this.datas.length = 0;
};

MapUtils.prototype.delete = function (key) {
    let res = false;
    let datas = this.datas;
    for (let i = 0, len = datas.length; i < len; i++) {
        if (Object.is(key, datas[i].key)) {
            datas.splice(i, 1);
            res = true;
            break;
        }
    }
    return res;
};

MapUtils.prototype.keys = function () {
    let datas = this.datas;
    let keys = [];
    for (let i = 0, len = datas.length; i < len; i++) {
        keys.push(datas[i].key);
    }

    return keys;
};

MapUtils.prototype.values = function () {
    let index = 0;
    let datas = this.datas;
    return {
        next: function () {
            if (datas.length === 0 || datas[index] === undefined) {
                return {
                    value: undefined,
                    done: true
                };
            }
            return {
                value: datas[index++].value,
                done: false
            };
        }
    };
};

module.exports = MapUtils;