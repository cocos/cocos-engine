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

let MemPool = function (unitClass) {
    this._unitClass = unitClass;
    this._pool = [];
    this._findOrder = [];

    if (CC_JSB && CC_NATIVERENDERER) {
        this._initNative();
    }
};

let proto = MemPool.prototype;
proto._initNative = function () {
    this._nativeMemPool = new renderer.MemPool();
};

proto._buildUnit = function (unitID) {
    return new this._unitClass(unitID, this);
};

proto.pop = function () {
    let findUnit = null;
    let idx = 0;
    for (let n = this._findOrder.length; idx < n; idx++) {
        let unit = this._findOrder[idx];
        if (unit && unit.hasSpace()) {
            findUnit = unit;
            break;
        }
    }

    if (!findUnit) {
        findUnit = this._buildUnit(this._pool.length);
        this._pool.push(findUnit);
        this._findOrder.push(findUnit);
        idx = this._findOrder.length - 1;
    }

    // swap has space unit to first position, so next find will fast
    let firstUnit = this._findOrder[0];
    if (firstUnit !== findUnit) {
        this._findOrder[0] = findUnit;
        this._findOrder[idx] = firstUnit;
    }

    return findUnit.pop();
};

proto.push = function (info) {
    let unit = this._pool[info.unitID];
    unit.push(info.index);
    return unit;
};
module.exports = MemPool;