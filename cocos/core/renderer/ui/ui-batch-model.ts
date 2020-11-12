/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
*/
/**
 * @packageDocumentation
 * @hidden
 */

import { Model, ModelType } from '../scene/model';
import { SubModel } from '../scene/submodel';
import { UIDrawBatch } from './ui-draw-batch';
import { Pass } from '../core/pass';
import { SubModelPool, InputAssemblerHandle, DescriptorSetHandle, SubModelView, IAPool, DSPool, NULL_HANDLE,
    SubModelArrayPool, ModelView, ModelPool } from '../core/memory-pools';
import { RenderPriority, UBOLocal } from '../../pipeline/define';
import { Mat4 } from '../../math';

const m4_1 = new Mat4();

export class UIBatchModel extends Model {
    constructor () {
        super();
        this.type = ModelType.UI_BATCH;
    }

    public initialize () {
        super.initialize();

        const subModel = new UISubModel();
        subModel.initialize();
        this._subModels[0] = subModel;
        const hSubModelArray = ModelPool.get(this._handle, ModelView.SUB_MODEL_ARRAY);
        SubModelArrayPool.assign(hSubModelArray, 0, subModel.handle);
    }

    public updateTransform () {
        if (!this.transform) return;
        const node = this.transform;
        // @ts-expect-error TS2445
        if (node.hasChangedFlags || node._dirtyFlags) {
            node.updateWorldTransform();
            this._transformUpdated = true;
        }
    }

    public updateUBOs (stamp: number) {
        // Should updatePass when updateUBOs
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].update();
        }
        this._updateStamp = stamp;

        if (!this._transformUpdated) { return; }

        if (this.transform) {
            // @ts-expect-error using private members here for efficiency
           const worldMatrix = this.transform._mat;
           Mat4.toArray(this._localData, worldMatrix, UBOLocal.MAT_WORLD_OFFSET);
           this._localBuffer!.update(this._localData);
        }

        this._transformUpdated = false;
    }

    public directInitialize (batch: UIDrawBatch) {
        const subModel = this._subModels[0] as UISubModel;
        subModel.directInitialize(batch.material!.passes, batch.hInputAssembler, batch.hDescriptorSet!);
        if (batch.useLocalData) this.node = this.transform = batch.useLocalData;
        this._updateAttributesAndBinding(0);
    }
}

class UISubModel extends SubModel {

    public initialize () {
        this._handle = SubModelPool.alloc();
        SubModelPool.set(this._handle, SubModelView.PRIORITY, RenderPriority.DEFAULT);
    }

    public directInitialize (passes: Pass[], iaHandle: InputAssemblerHandle, dsHandle: DescriptorSetHandle) {
        this._passes = passes;
        this._flushPassInfo();

        SubModelPool.set(this._handle, SubModelView.INPUT_ASSEMBLER, iaHandle);
        SubModelPool.set(this._handle, SubModelView.DESCRIPTOR_SET, dsHandle);

        this._inputAssembler = IAPool.get(iaHandle);
        this._descriptorSet = DSPool.get(dsHandle);
    }

    public destroy () {
        SubModelPool.free(this._handle);

        this._descriptorSet = null;
        this._inputAssembler = null;
        this._priority = RenderPriority.DEFAULT;
        this._handle = NULL_HANDLE;

        this._patches = null;
        this._subMesh = null;
        this._passes = null;
    }
}
