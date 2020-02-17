/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @category model
 */

import { AnimationClip } from '../../animation/animation-clip';
import { Material } from '../../assets/material';
import { Skeleton } from '../../assets/skeleton';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../data/class-decorator';
import { FlexibleSkinningModel } from '../../renderer/models/flexible-skinning-model';
import { SkinningModel } from '../../renderer/models/skinning-model';
import { Node } from '../../scene-graph/node';
import { builtinResMgr } from '../builtin';
import { ModelComponent } from './model-component';

/**
 * @en The Skinning Model Component.
 * @zh 蒙皮模型组件。
 */
@ccclass('cc.SkinningModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/SkinningModel')
export class SkinningModelComponent extends ModelComponent {

    @property(Skeleton)
    protected _skeleton: Skeleton | null = null;

    @property(Node)
    protected _skinningRoot: Node | null = null;

    protected _clip: AnimationClip | null = null;

    /**
     * @en The skeleton asset.
     * @zh 骨骼资源。
     */
    @property({
        type: Skeleton,
    })
    get skeleton () {
        return this._skeleton;
    }

    set skeleton (val) {
        if (val === this._skeleton) { return; }
        this._skeleton = val;
        this._update();
    }

    /**
     * @en The skinning root. (The node where the controlling AnimationComponent is located)
     * 骨骼根节点的引用，对应控制此模型的动画组件所在节点。
     */
    @property({
        type: Node,
        tooltip: 'i18n:model.skinning_root',
    })
    get skinningRoot () {
        return this._skinningRoot;
    }

    set skinningRoot (value) {
        if (value === this._skinningRoot) { return; }
        this._skinningRoot = value;
        this._update();
    }

    get model () {
        return this._model as SkinningModel | FlexibleSkinningModel;
    }

    constructor () {
        super();
        this._modelType = SkinningModel;
    }

    public uploadAnimation (clip: AnimationClip | null) {
        this._clip = clip;
        if (this._model instanceof SkinningModel) {
            this._model.uploadAnimation(clip);
        }
    }

    public get realTimePoseCalculation () {
        const mat = this._materialInstances[0] || this._materials[0];
        const pass = mat && mat.passes[0];
        const res = pass && pass.defines.REALTIME_POSE_CALCULATION || false;
        if (CC_EDITOR) {
            for (let i = 0; i < this._materials.length; i++) {
                const m = this._materialInstances[i] || this._materials[i];
                if (!m) { continue; }
                for (let j = 0; j < m.passes.length; j++) {
                    if (res !== (m.passes[j].defines.REALTIME_POSE_CALCULATION || false)) {
                        console.warn(`${this.node.name}: REALTIME_POSE_CALCULATION should be consistently declared among submodels and passes`);
                        m.passes[j].defines.REALTIME_POSE_CALCULATION = res; m.passes[j].tryCompile();
                    }
                }
            }
        }
        return res as boolean;
    }

    protected _updateModels () {
        let modelType = this._modelType;
        modelType = this.realTimePoseCalculation ? FlexibleSkinningModel : SkinningModel;
        if (this._model && modelType !== this._modelType) {
            cc.director.root.destroyModel(this._model);
            this._model = null;
            this._models.length = 0;
        }
        this._modelType = modelType;
        super._updateModels();
    }

    protected _onMaterialModified (idx: number, material: Material | null) {
        let modelType = this._modelType;
        modelType = this.realTimePoseCalculation ? FlexibleSkinningModel : SkinningModel;
        if (modelType !== this._modelType) {
            this._modelType = modelType;
            if (this._model) {
                cc.director.root.destroyModel(this._model);
                this._model = null;
                this._models.length = 0;
                super._updateModels();
                this._attachToScene();
            }
        } else {
            super._onMaterialModified(idx, material);
        }
    }

    protected _updateModelParams () {
        this._update(); // should bind skeleton before super create pso
        super._updateModelParams();
    }

    protected _getBuiltinMaterial () {
        // classic ugly pink indicating missing material
        return builtinResMgr.get<Material>(`missing-${this._modelType === SkinningModel ? '' : 'flexible-'}skinning-material`);
    }

    private _update () {
        if (this._model) {
            (this._model as SkinningModel | FlexibleSkinningModel).bindSkeleton(this._skeleton, this._skinningRoot, this._mesh);
            if (this._model instanceof SkinningModel) {
                this._model.uploadAnimation(this._clip);
            }
        }
    }
}
