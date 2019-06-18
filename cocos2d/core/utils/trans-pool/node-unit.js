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

const Float32_Bytes = 4;
const Uint32_Bytes = 4;
const Uint8_Bytes = 1;

// Space : [Dirty]                                  [Size:4 Uint32]
const Dirty_Type = Uint32Array;
const Dirty_Members = 1;
const Dirty_Stride = Dirty_Members * Uint32_Bytes;

// Space : [TRS]                                    [Size:4 * 10 Float32]
const TRS_Type = Float32Array;
const TRS_Members = 10;
const TRS_Stride = TRS_Members * Float32_Bytes;

// Space : [LocalMatrix]                            [Size:4 * 16 Float32]
const LocalMatrix_Type = Float32Array;
const LocalMatrix_Members = 16;
const LocalMatrix_Stride = LocalMatrix_Members * Float32_Bytes;

// Space : [WorldMatrix]                            [Size:4 * 16 Float32]
const WorldMatrix_Type = Float32Array;
const WorldMatrix_Members = 16;
const WorldMatrix_Stride = WorldMatrix_Members * Float32_Bytes;

// Space : [Parent Unit]                            [Size:4 Uint32]
// Space : [Parent Index]                           [Size:4 Uint32]
const Parent_Type = Uint32Array;
const Parent_Members = 2;
const Parent_Stride = Parent_Members * Uint32_Bytes;

// Space : [ZOrder]                                 [Size:4 Uint32]
const ZOrder_Type = Uint32Array;
const ZOrder_Members = 1;
const ZOrder_Stride = ZOrder_Members * Uint32_Bytes;

// Space : [CullingMask]                            [Size:4 Int32]
const CullingMask_Type = Int32Array;
const CullingMask_Members = 1;
const CullingMask_Stride = CullingMask_Members * Uint32_Bytes;

// Space : [Opacity]                                [Size:1 Uint8]
const Opacity_Type = Uint8Array;
const Opacity_Members = 1;
const Opacity_Stride = Opacity_Members * Uint8_Bytes;

// Space : [Is3D]                                   [Size:1 Uint8]
const Is3D_Type = Uint8Array;
const Is3D_Members = 1;
const Is3D_Stride = Is3D_Members * Uint8_Bytes;

// Space : [NodePtr]                                [Size:4 * 2 Uint32]
const Node_Type = Uint32Array;
const Node_Members = 2;

let UnitBase = require('./unit-base');
let NodeUnit = function (unitID, memPool) {
    UnitBase.call(this, unitID, memPool);

    let contentNum = this._contentNum;
    this.trsList = new TRS_Type(contentNum * TRS_Members);
    this.localMatList = new LocalMatrix_Type(contentNum * LocalMatrix_Members);
    this.worldMatList = new WorldMatrix_Type(contentNum * WorldMatrix_Members);

    if (CC_JSB && CC_NATIVERENDERER) {
        this.dirtyList = new Dirty_Type(contentNum * Dirty_Members);
        this.parentList = new Parent_Type(contentNum * Parent_Members);
        this.zOrderList = new ZOrder_Type(contentNum * ZOrder_Members);
        this.cullingMaskList = new CullingMask_Type(contentNum * CullingMask_Members);
        this.opacityList = new Opacity_Type(contentNum * Opacity_Members);
        this.is3DList = new Is3D_Type(contentNum * Is3D_Members);
        this.nodeList = new Node_Type(contentNum * Node_Members);

        this._memPool._nativeMemPool.updateNodeData(
            unitID,
            this.dirtyList,
            this.trsList,
            this.localMatList,
            this.worldMatList,
            this.parentList,
            this.zOrderList,
            this.cullingMaskList,
            this.opacityList,
            this.is3DList,
            this.nodeList
        );
    }

    for (let i = 0; i < contentNum; i ++) {
        let space = this._spacesData[i];

        space.trs = new TRS_Type(this.trsList.buffer, i * TRS_Stride, TRS_Members);
        space.localMat = new LocalMatrix_Type(this.localMatList.buffer, i * LocalMatrix_Stride, LocalMatrix_Members);
        space.worldMat = new WorldMatrix_Type(this.worldMatList.buffer, i * WorldMatrix_Stride, WorldMatrix_Members);

        if (CC_JSB && CC_NATIVERENDERER) {
            space.dirty = new Dirty_Type(this.dirtyList.buffer, i * Dirty_Stride, Dirty_Members);
            space.parent = new Parent_Type(this.parentList.buffer, i * Parent_Stride, Parent_Members);
            space.zOrder = new ZOrder_Type(this.zOrderList.buffer, i * ZOrder_Stride, ZOrder_Members);
            space.cullingMask = new CullingMask_Type(this.cullingMaskList.buffer, i * CullingMask_Stride, CullingMask_Members);
            space.opacity = new Opacity_Type(this.opacityList.buffer, i * Opacity_Stride, Opacity_Members);
            space.is3D = new Is3D_Type(this.is3DList.buffer, i * Is3D_Stride, Is3D_Members);
        }
    }
};

(function(){
    let Super = function(){};
    Super.prototype = UnitBase.prototype;
    NodeUnit.prototype = new Super();
})();

module.exports = NodeUnit;