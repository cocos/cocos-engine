/****************************************************************************
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
 ****************************************************************************/

// @ts-check
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { mat4 } from '../../core/vmath';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { SkinningModel, __FORCE_USE_UNIFORM_STORAGE__ } from '../../renderer/models/skinning-model';
import { Node } from '../../scene-graph/node';
import { Material } from '../assets/material';
import Skeleton from '../assets/skeleton';
import { ModelComponent } from './model-component';

const _m4_tmp = mat4.create();

type SkinningTarget = Map<string, Node>;

/**
 * !#en The Skinning Model Component
 * !#ch 皮肤模型组件
 */
@ccclass('cc.SkinningModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/SkinningModelComponent')
export default class SkinningModelComponent extends ModelComponent {

    /**
     * !#en The bone nodes
     *
     * !#ch 骨骼节点
     */
    @property({type: Skeleton})
    get skeleton () {
        return this._skeleton;
    }

    set skeleton (val) {
        this._skeleton = val;
        this._resetSkinningTarget();
        this._bindSkeleton();
    }

    @property({type: Node})
    get skinningRoot () {
        return this._skinningRoot;
    }

    set skinningRoot (value) {
        this._skinningRoot = value;
        this._resetSkinningTarget();
    }
    @property(Skeleton)
    private _skeleton: Skeleton | null = null;

    @property(Node)
    private _skinningRoot: Node | null = null;

    private _skinningTarget: SkinningTarget | null = null;

    constructor () {
        super();
    }

    public onLoad () {
        super.onLoad();
        this._resetSkinningTarget();
    }

    public update (dt) {
        this._tryUpdateMatrices();
    }

    public onDestroy () {
    }

    public _tryUpdateMatrices () {
        if (!this._skeleton || !this._skinningTarget || !this._model) {
            return;
        }

        const skinningModel = this._model as SkinningModel;
        const skeleton = this._skeleton;
        const skinningTarget = this._skinningTarget;

        const cancelThisNodeTransform = this.node.getWorldMatrix();
        mat4.invert(cancelThisNodeTransform, cancelThisNodeTransform);
        this._skeleton.joints.forEach((joint, index) => {
            // If target joint doesn't exists in scene graph, skip it.
            const targetNode = skinningTarget.get(joint);
            if (!targetNode) {
                return;
            }
            // 1. transform mesh to joint's local space
            // 2. transform from joint' local space to world space
            // 3. because it has been in world space, just cancel this mesh's original local-world transform
            const bindpose = skeleton.bindposes[index];
            const jointMatrix = _m4_tmp;
            mat4.multiply(jointMatrix, cancelThisNodeTransform, targetNode.getWorldMatrix());
            mat4.multiply(jointMatrix, jointMatrix, bindpose);
            skinningModel.updateJointMatrix(index, jointMatrix);
        });

        skinningModel.commitJointMatrices();
    }

    public _createModel () {
        return this._getRenderScene().createModel(SkinningModel, this.node);
    }

    public _updateModelParams () {
        // Should bind skeleton before super create pso
        this._bindSkeleton();
        super._updateModelParams();
    }

    protected _onMaterialModified (index: number, material: Material) {
        super._onMaterialModified(index, material);

        const device = _getGlobalDevice();
        const useJointTexture = !__FORCE_USE_UNIFORM_STORAGE__ && device !== null && device.hasFeature(GFXFeature.TEXTURE_FLOAT);
        this.getMaterial(0, CC_EDITOR)!.setDefines({
            CC_USE_SKINNING: true,
            CC_USE_JOINTS_TEXTURE: useJointTexture,
        });
    }

    private _bindSkeleton () {
        if (this._model && this._skeleton) {
            (this._model as SkinningModel).bindSkeleton(this._skeleton);
        }
    }

    private _resetSkinningTarget () {
        if (!this._skeleton || !this._skinningRoot) {
            return;
        }

        // Collect target to skin.
        this._skinningTarget = new Map();
        const rootNode = this._skinningRoot;
        this._skeleton.joints.forEach((joint) => {
            const targetNode = rootNode.getChildByPath(joint);
            if (!targetNode) {
                console.warn(`Skinning target ${joint} not found in scene graph.`);
                return;
            }
            this._skinningTarget!.set(joint, targetNode);
        });
    }
}

function _getGlobalDevice (): GFXDevice | null {
    // @ts-ignore
    return cc.director && cc.director.root && cc.director.device;
}
