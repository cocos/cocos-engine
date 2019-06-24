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
    let unit = new this._unitClass(unitID, this);
    if (CC_JSB && CC_NATIVERENDERER) {
        this._nativeMemPool.updateCommonData(unitID, unit._data, unit._signData);
    }
    return unit;
};

proto._destroyUnit = function (unitID) {
    this._pool[unitID] = null;
    for (let idx = 0, n = this._findOrder.length; idx < n; idx++) {
        let unit = this._findOrder[idx];
        if (unit && unit.unitID == unitID) {
            this._findOrder.splice(idx, 1);
            break;
        }
    }
    if (CC_JSB && CC_NATIVERENDERER) {
        this._nativeMemPool.removeCommonData(unitID);
    }
};

proto._findUnitID = function () {
    let unitID = 0;
    let pool = this._pool;
    while (pool[unitID]) unitID++;
    return unitID;
};

proto.pop = function () {
    let findUnit = null;
    let idx = 0;
    let findOrder = this._findOrder;
    let pool = this._pool;
    for (let n = findOrder.length; idx < n; idx++) {
        let unit = findOrder[idx];
        if (unit && unit.hasSpace()) {
            findUnit = unit;
            break;
        }
    }

    if (!findUnit) {
        let unitID = this._findUnitID();
        findUnit = this._buildUnit(unitID);
        pool[unitID] = findUnit;
        findOrder.push(findUnit);
        idx = findOrder.length - 1;
    }

    // swap has space unit to first position, so next find will fast
    let firstUnit = findOrder[0];
    if (firstUnit !== findUnit) {
        findOrder[0] = findUnit;
        findOrder[idx] = firstUnit;
    }

    return findUnit.pop();
};

proto.push = function (info) {
    let unit = this._pool[info.unitID];
    unit.push(info.index);
    if (this._findOrder.length > 1 && unit.isAllFree()) {
        this._destroyUnit(info.unitID);
    }
    return unit;
};
module.exports = MemPool;