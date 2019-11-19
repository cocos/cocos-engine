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
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import { SubModel } from '../scene/submodel';
import { UIDrawBatch } from './ui-draw-batch';

export class UIBatchModel extends Model {

    private _subModel: UISubModel;

    constructor (scene: RenderScene) {
        super(scene, null!);
        this._subModel = new UISubModel();
    }

    public updateTransform () {
    }

    public updateUBOs () {
        return false;
    }

    public initialize (ia: GFXInputAssembler, batch: UIDrawBatch) {
        this._subModel.directInitialize(ia, batch.material!, batch.pipelineState!);
        this._subModels[0] = this._subModel;
    }

    public destroy () {
        this._subModel.destroy();
    }
}

class UISubModel extends SubModel {
    constructor () {
        super();
        this.psos = [];
    }

    public directInitialize (ia: GFXInputAssembler, mat: Material, pso: GFXPipelineState) {
        this._inputAssembler = ia;
        this.psos![0] = pso;
        this.material = mat;
    }

    public destroy () {
        if (this.commandBuffers.length > 0) {
            this.commandBuffers[0].destroy();
        }
    }
}
