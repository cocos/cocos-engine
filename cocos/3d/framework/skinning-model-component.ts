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

import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { Mat4 } from '../../core/value-types';
import { mat4 } from '../../core/vmath';
import { GFXDevice } from '../../gfx/device';
import { JointStorageKind, selectStorageKind, SkinningModel } from '../../renderer/models/skinning-model';
import { Node } from '../../scene-graph/node';
import { Mesh } from '../assets';
import { Material } from '../assets/material';
import Skeleton from '../assets/skeleton';
import { aabb } from '../geom-utils';
import { calculateBoneSpaceBounds } from '../misc/utils';
import { ModelComponent } from './model-component';

const _m4_tmp = new Mat4();
const _m4_tmp2 = new Mat4();

type SkinningTarget = Map<string, Node>;

/**
 * !#en The Skinning Model Component
 * !#ch 皮肤模型组件
 */
@ccclass('cc.SkinningModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/SkinningModelComponent')
export class SkinningModelComponent extends ModelComponent {

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
        const old = this._skeleton;
        this._skeleton = val;
        this._onSkeletonChanged(old);
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

    private _boneSpaceBounds: null | Array<aabb | null> = null;

    constructor () {
        super();
    }

    public onLoad () {
        super.onLoad();
        this._materials.forEach((material, index) => {
            if (material) {
                this._onMaterialModified(index, material);
            }
        });
        this._resetSkinningTarget();
        if (this.mesh && this._skeleton) {
            this._boneSpaceBounds = boneSpaceBoundsManager.use(this.mesh, this._skeleton);
        }
    }

    public update (dt) {
        this._tryUpdateMatrices();
    }

    public onDestroy () {
    }

    public calculateSkinnedBounds (out?: aabb): boolean {
        if (!this._skeleton ||
            !this._boneSpaceBounds ||
            !this._skinningTarget) {
            return false;
        }
        out = out || new aabb();
        let outInitialized = false;
        const tmpAABB = new aabb();
        for (let iJoint = 0; iJoint < this._skeleton.joints.length; ++iJoint) {
            const bounds = this._boneSpaceBounds[iJoint];
            if (!bounds) {
                continue;
            }
            const joint = this._skeleton.joints[iJoint];
            const targetNode = this._skinningTarget.get(joint);
            if (!targetNode) {
                continue;
            }
            const jointWorldTransform = _m4_tmp;
            const transformedBoneBounds = tmpAABB;
            targetNode.getWorldMatrix(jointWorldTransform);
            aabb.transform(transformedBoneBounds, bounds, jointWorldTransform);
            if (outInitialized) {
                aabb.merge(out, out, transformedBoneBounds);
            } else {
                outInitialized = true;
                aabb.copy(out, transformedBoneBounds);
            }
        }
        return outInitialized;
    }

    public _tryUpdateMatrices () {
        if (!this._skeleton || !this._skinningTarget || !this._model) {
            return;
        }

        const skinningModel = this._model as SkinningModel;
        const skeleton = this._skeleton;
        const skinningTarget = this._skinningTarget;

        const cancelThisNodeTransform = this.node.getWorldMatrix(_m4_tmp2);
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
            mat4.multiply(jointMatrix, cancelThisNodeTransform, targetNode.worldMatrix);
            mat4.multiply(jointMatrix, jointMatrix, bindpose);
            skinningModel.updateJointMatrix(index, jointMatrix);
        });

        skinningModel.commitJointMatrices();
    }

    public _updateModelParams () {
        // Should bind skeleton before super create pso
        this._bindSkeleton();
        super._updateModelParams();
    }

    protected _onMeshChanged (old: Mesh | null) {
        super._onMeshChanged(old);
        if (this._skeleton) {
            if (old) {
                boneSpaceBoundsManager.unuse(old, this._skeleton);
            }
            if (this.mesh) {
                this._boneSpaceBounds = boneSpaceBoundsManager.use(this.mesh, this._skeleton);
            }
        }
    }

    protected _onSkeletonChanged (old: Skeleton | null) {
        if (this.mesh) {
            if (old) {
                boneSpaceBoundsManager.unuse(this.mesh, old);
            }
            if (this._skeleton) {
                this._boneSpaceBounds = boneSpaceBoundsManager.use(this.mesh, this._skeleton);
            }
        }
    }

    protected _getModelConstructor () {
        return SkinningModel;
    }

    protected _onMaterialModified (index: number, material: Material) {
        const device = _getGlobalDevice()!;
        const kind = selectStorageKind(device);
        const mat = this.getMaterial(index, CC_EDITOR);
        if (mat) {
            mat.recompileShaders({
                CC_USE_SKINNING: true,
                CC_USE_JOINTS_TEXTURE: kind === JointStorageKind.textureRGBA32F || kind === JointStorageKind.textureRGBA8,
                CC_USE_JOINTS_TEXTURE_RGBA8888: kind === JointStorageKind.textureRGBA8,
            });
        }
        super._onMaterialModified(index, mat);
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
    if (cc.director && cc.director.root) {
        return cc.director.root.device;
    } else {
        return null;
    }
}

interface ICachedBoneSpaceBounds {
    bounds: Array<aabb | null>;
    referenceCount: number;
}

class BoneSpaceBoundsManager {
    private _cached = new Map<Mesh, Map<Skeleton, ICachedBoneSpaceBounds>>();

    public use (mesh: Mesh, skeleton: Skeleton) {
        let bucket = this._cached.get(mesh);
        if (!bucket) {
            bucket = new Map();
            this._cached.set(mesh, bucket);
        }

        let cached = bucket.get(skeleton);
        if (!cached) {
            cached = {
                bounds: calculateBoneSpaceBounds(mesh, skeleton),
                referenceCount: 0,
            };
            bucket.set(skeleton, cached);
        }
        ++cached.referenceCount;
        return cached.bounds;
    }

    public unuse (mesh: Mesh, skeleton: Skeleton) {
        const bucket = this._cached.get(mesh);
        if (bucket) {
            const cached = bucket.get(skeleton);
            if (cached) {
                --cached.referenceCount;
                if (cached.referenceCount === 0) {
                    bucket.delete(skeleton);
                }
            }
            if (bucket.size === 0) {
                this._cached.delete(mesh);
            }
        }
    }
}

const boneSpaceBoundsManager = new BoneSpaceBoundsManager();
