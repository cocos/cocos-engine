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
import { ccclass, executeInEditMode, executionOrder, help, menu, tooltip, type } from 'cc.decorator';
import { models } from '../../renderer';
import { Node } from '../../scene-graph/node';
import { MeshRenderer } from './mesh-renderer';
import { SkeletalAnimation } from '../../animation/skeletal-animation';
import { legacyCC } from '../../global-exports';

/**
 * @en The skinned mesh renderer component.
 * @zh 蒙皮网格渲染器组件。
 */
@ccclass('cc.SkinnedMeshRenderer')
@help('i18n:cc.SkinnedMeshRenderer')
@executionOrder(100)
@executeInEditMode
@menu('Components/SkinnedMeshRenderer')
export class SkinnedMeshRenderer extends MeshRenderer {

    @type(Skeleton)
    protected _skeleton: Skeleton | null = null;

    @type(Node)
    protected _skinningRoot: Node | null = null;

    protected _clip: AnimationClip | null = null;

    /**
     * @en The skeleton asset.
     * @zh 骨骼资源。
     */
    @type(Skeleton)
    get skeleton () {
        return this._skeleton;
    }

    set skeleton (val) {
        if (val === this._skeleton) { return; }
        this._skeleton = val;
        this._update();
    }

    /**
     * @en The skinning root. (The node where the controlling Animation is located)
     * 骨骼根节点的引用，对应控制此模型的动画组件所在节点。
     */
    @type(Node)
    @tooltip('i18n:model.skinning_root')
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
        return this._model as models.SkinningModel | models.BakedSkinningModel | null;
    }

    constructor () {
        super();
        this._modelType = models.BakedSkinningModel;
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
        const modelType = val ? models.BakedSkinningModel : models.SkinningModel;
        if (this._modelType === modelType) { return; }
        this._modelType = modelType;
        if (this._model) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
            this._models.length = 0;
            this._updateModels();
            this._updateCastShadow();
            if (this.enabledInHierarchy) {
                this._attachToScene();
            }
        }
    }

    public setMaterial (material: Material | null, index: number) {
        super.setMaterial(material, index);
        if (this._modelType === models.SkinningModel) {
            this.getMaterialInstance(index);
        }
    }

    protected _updateModelParams () {
        this._update(); // should bind skeleton before super create pso
        super._updateModelParams();
    }

    private _updateModelType () {
        if (!this._skinningRoot) { return; }
        const comp = this._skinningRoot.getComponent('cc.SkeletalAnimation') as SkeletalAnimation;
        if (comp) { this.setUseBakedAnimation(comp.useBakedAnimation); }
    }

    private _update () {
        if (this.model) {
            this.model.bindSkeleton(this._skeleton, this._skinningRoot, this._mesh);
            if (this.model.uploadAnimation) { this.model.uploadAnimation(this._clip); }
        }
    }
}
