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

// Unit has many segment, layout such as :
// Head Free Pointer + Using Segment Num + Segment 1 + Segment 2 + Segment 3 ...

// sign data format
// Space : [If Free Flag]                          [Size:1 Uint16]
// Space : [Next Free Index]                       [Size:1 Uint16]

// invalid pointer value
let POINTER_INVALID_FLAG = 0xffff;
let SPACE_FREE_FLAG = 0x0;
let SPACE_USE_FLAG = 0x1;
let POS_NEXT_FREE = 0;
let POS_FREE_FLAG = 1;

let UnitBase = function (unitID, memPool, contentNum) {
    contentNum = contentNum || 128;

    // set unit id
    this.unitID = unitID;
    this._memPool = memPool;

    this._data = new Uint16Array(2);
    // head of the free content index
    this._data[0] = 0;
    // using segment num
    this._data[1] = 0;

    this._contentNum = contentNum;
    this._signData = new Uint16Array(this._contentNum * 2);
    this._spacesData = [];

    for (let i = 0; i < contentNum; i++) {
        let signIndex = i * 2;
        // store content block index but not sign array index
        this._signData[signIndex + POS_NEXT_FREE] = i + 1;
        this._signData[signIndex + POS_FREE_FLAG] = SPACE_FREE_FLAG;

        this._spacesData[i] = {
            index: i,
            unitID: unitID,
        };
    }
    // last one has no next space;
    this._signData[(contentNum - 1) * 2] = POINTER_INVALID_FLAG;
};

let UnitBaseProto = UnitBase.prototype;
UnitBaseProto.hasSpace = function () {
    return this._data[0] !== POINTER_INVALID_FLAG;
};

UnitBaseProto.isAllFree = function () {
    return this._data[1] == 0;
};

// pop space from unit
UnitBaseProto.pop = function () {
    let headFreeIndex = this._data[0];
    if (headFreeIndex === POINTER_INVALID_FLAG) return null;

    let index = headFreeIndex;
    let signIndex = index * 2;
    let space = this._spacesData[index];

    // set use flag
    this._signData[signIndex + POS_FREE_FLAG] = SPACE_USE_FLAG;

    // store new next free space index
    this._data[0] = this._signData[signIndex + POS_NEXT_FREE];
    // add using segment num
    this._data[1]++;
    return space;
};

// push back to unit
UnitBaseProto.push = function (index) {
    let signIndex = index * 2;

    // set free flag
    this._signData[signIndex + POS_FREE_FLAG] = SPACE_FREE_FLAG;

    // store head free index to the space
    this._signData[signIndex + POS_NEXT_FREE] = this._data[0];
    // update head free index
    this._data[0] = index;
    // sub using segment num
    this._data[1]--;
};

// dump all space info
UnitBaseProto.dump = function () {
    let spaceNum = 0;
    let index = this._data[0];
    let freeStr = "";
    
    while (index != POINTER_INVALID_FLAG) {
        spaceNum ++;
        freeStr += index + "->";
        index = this._signData[index * 2 + POS_NEXT_FREE];
    }

    let usingNum = 0;
    let usingStr = "";
    let contentNum = this._contentNum;
    for (let i = 0; i < contentNum; i++) {
        let freeFlag = this._signData[i * 2 + POS_FREE_FLAG];
        if (freeFlag == SPACE_USE_FLAG) {
            usingNum ++;
            usingStr += i + "->";
        }
    }
    
    let totalNum = spaceNum + usingNum;
    console.log(
        "unitID:", this.unitID, 
        "spaceNum:", spaceNum, 
        "calc using num:", usingNum, 
        'store using num:', this._data[1], 
        'calc total num:', totalNum, 
        'actually total num:', this._contentNum
    );
    console.log("free info:", freeStr);
    console.log("using info:", usingStr);

    if (usingNum != this._data[1]) {
        cc.error(
            'using num error', 
            "calc using num:", usingNum, 
            'store using num:', this._data[1]
        );
    }

    if (spaceNum + usingNum != this._contentNum) {
        cc.error(
            'total num error', 
            'calc total num:', totalNum, 
            'actually total num:', this._contentNum
        );
    }
};

module.exports = UnitBase;