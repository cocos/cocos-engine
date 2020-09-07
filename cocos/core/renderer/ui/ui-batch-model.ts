/*
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @hidden
 */

import { Model, ModelType } from '../scene/model';
import { SubModel } from '../scene/submodel';
import { UIDrawBatch } from './ui-draw-batch';
import { Pass } from '../core/pass';
import { SubModelPool, InputAssemblerHandle, DescriptorSetHandle, SubModelView, IAPool, DSPool, NULL_HANDLE, SubModelArrayPool } from '../core/memory-pools';
import { RenderPriority } from '../../pipeline/define';

export class UIBatchModel extends Model {

    private _subModel!: UISubModel;

    constructor () {
        super();
        this.type = ModelType.UI_BATCH;
    }

    public initialize () {
        super.initialize();

        this._subModel = new UISubModel();
        this._subModels[0] = this._subModel;
    }

    public updateTransform () {}

    public updateUBOs (stamp: number) {
        // Should updatePass when updateUBOs
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].update();
        }
        this._updateStamp = stamp;

        if (!this._transformUpdated) { return; }
        this._transformUpdated = false;
    }

    public directInitialize (batch: UIDrawBatch) {
        this._subModel.directInitialize(batch.material!.passes, batch.hInputAssembler, batch.hDescriptorSet!);
        SubModelArrayPool.assign(this._subModelArrayHandle, 0, this._subModel.handle);
    }

    public destroy () {
        this._subModel.destroy();
        super.destroy();
    }
}

class UISubModel extends SubModel {

    public directInitialize (passes: Pass[], iaHandle: InputAssemblerHandle, dsHandle: DescriptorSetHandle) {
        this._passes = passes;
        this._handle = SubModelPool.alloc();
        this._flushPassInfo();

        SubModelPool.set(this._handle, SubModelView.PRIORITY, RenderPriority.DEFAULT);
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
