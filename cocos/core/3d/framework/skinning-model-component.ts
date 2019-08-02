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

import { SkeletalAnimationClip } from '../../animation/skeletal-animation-clip';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { INode } from '../../core/utils/interfaces';
import { GFXDevice } from '../../gfx/device';
import { selectJointsMediumType } from '../../renderer/models/joints-texture-utils';
import { SkinningModel } from '../../renderer/models/skinning-model';
import { Node } from '../../scene-graph/node';
import { Material } from '../assets/material';
import { Skeleton } from '../assets/skeleton';
import { builtinResMgr } from '../builtin';
import { ModelComponent } from './model-component';

/**
 * @en The Skinning Model Component
 * @zh 蒙皮模型组件。
 */
@ccclass('cc.SkinningModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/SkinningModelComponent')
export class SkinningModelComponent extends ModelComponent {

    @property(Skeleton)
    protected _skeleton: Skeleton | null = null;

    @property(Node)
    protected _skinningRoot: INode | null = null;

    /**
     * @en The bone nodes
     * @zh 骨骼节点。
     */
    @property({ type: Skeleton })
    get skeleton () {
        return this._skeleton;
    }

    set skeleton (val) {
        this._skeleton = val;
        this._update();
    }

    /**
     * 骨骼根节点的引用。
     */
    @property({ type: Node })
    get skinningRoot (): INode | null {
        return this._skinningRoot;
    }

    set skinningRoot (value) {
        this._skinningRoot = value;
        this._update();
    }

    get model () {
        return (this._model as SkinningModel);
    }

    public uploadAnimation (clip: SkeletalAnimationClip | null) {
        if (this._model) { (this._model as SkinningModel).uploadAnimation(clip); }
    }

    public _updateModelParams () {
        // should bind skeleton before super create pso
        this._update();
        super._updateModelParams();
    }

    protected _onMaterialModified (index: number, material: Material | null) {
        const device: GFXDevice = cc.director.root && cc.director.root.device;
        const type = selectJointsMediumType(device);
        const mat = this.getMaterial(index) || this._getBuiltinMaterial();
        mat.recompileShaders({ CC_USE_SKINNING: type });
        super._onMaterialModified(index, mat);
    }

    protected _getModelConstructor () {
        return SkinningModel;
    }

    protected _getBuiltinMaterial () {
        // classic ugly pink indicating missing material
        return builtinResMgr.get<Material>('missing-skinning-material');
    }

    private _update () {
        if (this._model) { (this._model as SkinningModel).bindSkeleton(this._skeleton, this._skinningRoot); }
        this._materials.forEach((material, index) => material && this._onMaterialModified(index, material));
    }
}
