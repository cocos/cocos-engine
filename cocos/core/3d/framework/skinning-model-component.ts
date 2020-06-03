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
import { Material } from '../../assets';
import { Skeleton } from '../../assets/skeleton';
import { ccclass, executeInEditMode, executionOrder, help, menu, property } from '../../data/class-decorator';
import { BakedSkinningModel } from '../../renderer/models/baked-skinning-model';
import { SkinningModel } from '../../renderer/models/skinning-model';
import { Node } from '../../scene-graph/node';
import { ModelComponent } from './model-component';
import { SkeletalAnimationComponent } from '../../animation/skeletal-animation-component';
import { legacyCC } from '../../global-exports';

/**
 * @en The Skinning Model Component.
 * @zh 蒙皮模型组件。
 */
@ccclass('cc.SkinningModelComponent')
@help('i18n:cc.SkinningModelComponent')
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
        this._updateModelType();
        this._update();
    }

    get model () {
        return this._model as SkinningModel | BakedSkinningModel | null;
    }

    constructor () {
        super();
        this._modelType = BakedSkinningModel;
    }

    public __preload () {
        this._updateModelType();
    }

    public uploadAnimation (clip: AnimationClip | null) {
        this._clip = clip;
        if (this.model && this.model.uploadAnimation) {
            this.model.uploadAnimation(clip);
        }
    }

    public setUseBakedAnimation (val = true) {
        const modelType = val ? BakedSkinningModel : SkinningModel;
        if (this._modelType === modelType) { return; }
        this._modelType = modelType;
        const modelCreated = !!this._model;
        if (modelCreated) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
            this._models.length = 0;
        }
        const meshCount = this._mesh ? this._mesh.subMeshCount : 0;
        // have to instantiate materials with multiple submodel references
        if (this._modelType === SkinningModel) {
            let last: Material | null = null;
            for (let i = 0; i < meshCount; ++i) {
                const cur = this.getRenderMaterial(i);
                if (cur === last) {
                    this.getMaterialInstance(i);
                } else { last = cur; }
            }
        } else { // or assign the original material back if instancing is enabled
            for (let i = 0; i < meshCount; ++i) {
                const cur = this.getRenderMaterial(i);
                if (cur && cur.parent && cur.parent.passes[0].instancedBuffer) {
                    this._materialInstances[i]!.destroy();
                    this._materialInstances[i] = null;
                }
            }
        }
        if (modelCreated) {
            this._updateModels();
            this._updateCastShadow();
            if (this.enabledInHierarchy) {
                this._attachToScene();
            }
        }
    }

    public setMaterial (material: Material | null, index: number) {
        super.setMaterial(material, index);
        if (this._modelType === SkinningModel) {
            this.getMaterialInstance(index);
        }
    }

    protected _updateModelParams () {
        this._update(); // should bind skeleton before super create pso
        super._updateModelParams();
    }

    private _updateModelType () {
        if (!this._skinningRoot) { return; }
        const comp = this._skinningRoot.getComponent('cc.SkeletalAnimationComponent') as SkeletalAnimationComponent;
        if (comp) { this.setUseBakedAnimation(comp.useBakedAnimation); }
    }

    private _update () {
        if (this.model) {
            this.model.bindSkeleton(this._skeleton, this._skinningRoot, this._mesh);
            if (this.model.uploadAnimation) { this.model.uploadAnimation(this._clip); }
        }
    }
}
