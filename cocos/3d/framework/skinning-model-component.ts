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
import { Texture2D } from '../../assets/texture-2d';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { mat4 } from '../../core/vmath';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { SkinningModel } from '../../renderer/models/skinning-model';
import { Node } from '../../scene-graph/node';
import Skeleton from '../assets/skeleton';
import * as utils from '../misc/utils';
import { ModelComponent } from './model-component';

const _m4_tmp = mat4.create();

interface IJointTextureStorage {
    nativeData: Float32Array;
    texture: Texture2D;
}

interface IJointUniformsStorage {
    nativeData: Float32Array;
}

type JointStorage = IJointTextureStorage | IJointUniformsStorage;

interface ISkinningState {
    skinningTarget: Map<string, Node>;
    storage: JointStorage;
}

function isTextureStorage (storage: JointStorage): storage is IJointTextureStorage {
    return (storage as any).texture !== undefined;
}

/**
 * !#en The Skinning Model Component
 * !#ch 皮肤模型组件
 */
@ccclass('cc.SkinningModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/SkinningModelComponent')
export default class SkinningModelComponent extends ModelComponent {
    @property(Skeleton)
    private _skeleton: Skeleton | null = null;

    @property(Node)
    private _skinningRoot: Node | null = null;

    private _skinningState: ISkinningState | null = null;

    constructor () {
        super();
    }

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
        this._resetSkinningState();
    }

    @property({type: Node})
    get skinningRoot () {
        return this._skinningRoot;
    }

    set skinningRoot (value) {
        this._skinningRoot = value;
        this._resetSkinningState();
    }

    public onLoad () {
        this._resetSkinningState();
    }

    public update (dt) {
        this._tryUpdateMatrices();
    }

    public onDestroy () {
    }

    public _tryUpdateMatrices () {
        if (!this._skeleton || !this._skinningState) {
            return;
        }

        const skinningState = this._skinningState!;
        const skeleton = this._skeleton!;

        const cancelThisNodeTransform = this.node.getWorldMatrix();
        mat4.invert(cancelThisNodeTransform, cancelThisNodeTransform);

        this._skeleton.joints.forEach((joint, index) => {
            // If target joint doesn't exists in scene graph, skip it.
            const targetNode = skinningState.skinningTarget.get(joint);
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
            _setJointMatrix(skinningState.storage.nativeData, index, jointMatrix);
        });

        const storage = skinningState.storage;
        if (isTextureStorage(storage)) {
            storage.texture.directUpdate(storage.nativeData.buffer);
        }
    }

    public _createModel () {
        return this._getRenderScene().createModel(SkinningModel, this.node);
    }

    public _updateModelParams () {
        super._updateModelParams();
        // Upload joint matrices.
        if (this._skinningState !== null) {
            const skinningState = this._skinningState;
            const skinningModel = this._model as SkinningModel;
            if (isTextureStorage(skinningState.storage)) {
                const texture = skinningState.storage.texture;
                skinningModel.setJointTexture(texture);
            } else {
                skinningModel.setJointMatrices(skinningState.storage.nativeData);
            }
        }
    }

    private _resetSkinningState () {
        if (this._skinningState) {
            if (isTextureStorage(this._skinningState.storage)) {
                this._skinningState.storage.texture.destroy();
            }
            this._skinningState = null;
        }

        if (!this._skeleton || !this._skinningRoot) {
            return;
        }

        let storage: JointStorage;

        // Allocate joint matrices storage.
        const device = _getGlobalDevice();
        if (device && device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
            const jointsTexture = utils.createJointsTexture(this._skeleton);
            storage = {
                texture: jointsTexture,
                nativeData: new Float32Array(jointsTexture.width * jointsTexture.height * 4),
            } as IJointTextureStorage;
        } else {
            storage = {
                nativeData: new Float32Array(this._skeleton.joints.length * 16),
            } as IJointUniformsStorage;
        }

        const skinningState: ISkinningState = {
            skinningTarget: new Map(),
            storage,
        };

        // Collect target to skin.
        const rootNode = this._skinningRoot;
        this._skeleton.joints.forEach((joint) => {
            const targetNode = rootNode.getChildByPath(joint);
            if (!targetNode) {
                console.warn(`Skinning target ${joint} not found in scene graph.`);
                return;
            }
            skinningState.skinningTarget.set(joint, targetNode);
        });

        this._skinningState = skinningState;
    }
}

function _getGlobalDevice (): GFXDevice | null {
    // @ts-ignore
    return cc.director.root.device;
}

function _setJointMatrix (out: Float32Array, iMatrix: number, matrix: mat4) {
    out[16 * iMatrix + 0] = matrix.m00;
    out[16 * iMatrix + 1] = matrix.m01;
    out[16 * iMatrix + 2] = matrix.m02;
    out[16 * iMatrix + 3] = matrix.m03;
    out[16 * iMatrix + 4] = matrix.m04;
    out[16 * iMatrix + 5] = matrix.m05;
    out[16 * iMatrix + 6] = matrix.m06;
    out[16 * iMatrix + 7] = matrix.m07;
    out[16 * iMatrix + 8] = matrix.m08;
    out[16 * iMatrix + 9] = matrix.m09;
    out[16 * iMatrix + 10] = matrix.m10;
    out[16 * iMatrix + 11] = matrix.m11;
    out[16 * iMatrix + 12] = matrix.m12;
    out[16 * iMatrix + 13] = matrix.m13;
    out[16 * iMatrix + 14] = matrix.m14;
    out[16 * iMatrix + 15] = matrix.m15;
}
