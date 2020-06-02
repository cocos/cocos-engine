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

import { Material } from '../../assets/material';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { Model, ModelType } from '../scene/model';
import { SubModel, IPSOCreateInfo } from '../scene/submodel';
import { UIDrawBatch } from './ui-draw-batch';

export class UIBatchModel extends Model {

    private _subModel: UISubModel;

    constructor () {
        super();
        this.type = ModelType.UI_BATCH;
        this._subModel = new UISubModel();
    }

    public updateTransform () {
    }

    public updateUBOs () {
        return false;
    }

    public directInitialize (ia: GFXInputAssembler, batch: UIDrawBatch) {
        this._subModel.directInitialize(ia, batch.material!, batch.psoCreateInfo!);
        this._subModels[0] = this._subModel;
    }

    public destroy () {
        this._subModel.destroy();
    }
}

class UISubModel extends SubModel {
    public directInitialize (ia: GFXInputAssembler, mat: Material, psoCreateInfo: IPSOCreateInfo) {
        this._inputAssembler = ia;
        this._psoCreateInfos[0] = psoCreateInfo;
        // Should not use this.material = mat, or _psoCreateInfos[0] will be overrided.
        this._material = mat;
    }

    public destroy () {
        super.destroy();
    }
}
