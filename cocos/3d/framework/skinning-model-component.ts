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
import { Mat4, Quat, Vec3 } from '../../core/value-types';
import { quat, vec3 } from '../../core/vmath';
import { GFXDevice } from '../../gfx/device';
import { JointUniformCapacity } from '../../pipeline/define';
import { selectJointsMediumType, SkinningModel } from '../../renderer/models/skinning-model';
import { Node } from '../../scene-graph/node';
import { Mesh } from '../assets';
import { Material } from '../assets/material';
import { Skeleton } from '../assets/skeleton';
import { aabb } from '../geom-utils';
import { calculateBoneSpaceBounds } from '../misc/utils';
import { ModelComponent } from './model-component';
import { builtinResMgr } from '../builtin';

const v3_1 = new Vec3();
const qt_1 = new Quat();
const v3_2 = new Vec3();
const m4_1 = new Mat4();
const ab_1 = new aabb();

class Joint {
    public node: Node;
    public position: Vec3 = new Vec3();
    public rotation: Quat = new Quat();
    public scale: Vec3 = new Vec3(1, 1, 1);
    public parent: Joint | null = null;
    protected _lastUpdate = -1;
    constructor (node: Node) { this.node = node; }
    public update () {
        // if (!this.node.hasChanged) { return; }
        const totalFrames = cc.director.totalFrames;
        if (this._lastUpdate >= totalFrames) { return; }
        this._lastUpdate = totalFrames;

        const parent = this.parent;
        if (parent) {
            parent.update();
            vec3.multiply(this.position, this.node.localPosition, parent.scale);
            vec3.transformQuat(this.position, this.position, parent.rotation);
            vec3.add(this.position, this.position, parent.position);
            quat.multiply(this.rotation, parent.rotation, this.node.localRotation);
            vec3.multiply(this.scale, parent.scale, this.node.localScale);
        }
    }
}

class JointManager {
    public static get (node: Node, root: Node) {
        let joint = JointManager._joints.get(node);
        if (joint) { return joint; }
        joint = new Joint(node);
        if (node !== root && node.parent) { joint.parent = JointManager.get(node.parent, root); }
        JointManager._joints.set(node, joint);
        return joint;
    }
    protected static _joints: Map<Node, Joint> = new Map();
}

// get the lowest common ancestor
const _path: Node[] = [];
export const LCA = (a: Node, b: Node) => {
    if (a === b) { return a; }
    let cur: Node | null = b;
    _path.length = 0;
    while (cur) { _path.push(cur); cur = cur.parent; }
    cur = a;
    while (cur) {
        if (_path.find((n) => n === cur)) { return cur; }
        cur = cur.parent;
    }
    return null;
};

/**
 * @en The Skinning Model Component
 * @zh 蒙皮模型组件
 */
@ccclass('cc.SkinningModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/SkinningModelComponent')
export class SkinningModelComponent extends ModelComponent {

    /**
     * @en The bone nodes
     * @zh 骨骼节点
     */
    @property({ type: Skeleton })
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

    /**
     * 骨骼根节点的引用
     */
    @property({ type: Node })
    get skinningRoot () {
        return this._skinningRoot;
    }

    set skinningRoot (value) {
        this._skinningRoot = value;
        this._resetSkinningTarget();
    }

    @property(Skeleton)
    protected _skeleton: Skeleton | null = null;

    @property(Node)
    protected _skinningRoot: Node | null = null;

    protected _joints: Joint[] = [];
    protected _boneSpaceBounds: null | Array<aabb | null> = null;
    protected _jointCount = JointUniformCapacity;

    public onLoad () {
        this._materials.forEach((material, index) => material && this._onMaterialModified(index, material));
        this._resetSkinningTarget();
        if (CC_EDITOR && this.mesh && this._skeleton) {
            this._boneSpaceBounds = boneSpaceBoundsManager.use(this.mesh, this._skeleton);
        }
    }

    public update () {
        if (!this._skeleton || !this._model) {
            return;
        }

        const skinningModel = this._model as SkinningModel;
        const skeleton = this._skeleton;
        const len = this._jointCount;

        for (let i = 0; i < len; ++i) {
            const cur = this._joints[i];
            cur.update();
            const bindpose = skeleton.bindposes[i];

            vec3.multiply(v3_1, bindpose.localPosition, cur.scale);
            vec3.transformQuat(v3_1, v3_1, cur.rotation);
            vec3.add(v3_1, v3_1, cur.position);
            quat.multiply(qt_1, cur.rotation, bindpose.localRotation);
            vec3.multiply(v3_2, cur.scale, bindpose.localScale);

            skinningModel.updateJointData(i, v3_1, qt_1, v3_2, i === 0);
        }

        skinningModel.commitJointData();
    }

    public calculateSkinnedBounds (out?: aabb): boolean {
        if (!this._skeleton || !this._boneSpaceBounds) {
            return false;
        }
        out = out || new aabb();
        let outInitialized = false;
        const len = this._joints.length;
        for (let i = 0; i < len; ++i) {
            const bounds = this._boneSpaceBounds[i];
            const targetNode = this._joints[i].node;
            if (!bounds || !targetNode) { continue; }
            targetNode.getWorldMatrix(m4_1);
            aabb.transform(ab_1, bounds, m4_1);
            if (outInitialized) {
                aabb.merge(out, out, ab_1);
            } else {
                outInitialized = true;
                aabb.copy(out, ab_1);
            }
        }
        return outInitialized;
    }

    public _updateModelParams () {
        // Should bind skeleton before super create pso
        this._bindSkeleton();
        super._updateModelParams();
    }

    protected _createModel () {
        if (!this.node.scene) { return; }
        const scene = this._getRenderScene();
        this._model = scene.createModel(this._getModelConstructor(), this.node.parent!);
    }

    protected _getModelConstructor () {
        return SkinningModel;
    }

    protected _onMeshChanged (old: Mesh | null) {
        super._onMeshChanged(old);
        if (!CC_EDITOR || !this._skeleton) { return; }
        if (old) { boneSpaceBoundsManager.unuse(old, this._skeleton); }
        if (this.mesh) { this._boneSpaceBounds = boneSpaceBoundsManager.use(this.mesh, this._skeleton); }
    }

    protected _onSkeletonChanged (old: Skeleton | null) {
        if (!CC_EDITOR || !this.mesh) { return; }
        if (old) { boneSpaceBoundsManager.unuse(this.mesh, old); }
        if (this._skeleton) { this._boneSpaceBounds = boneSpaceBoundsManager.use(this.mesh, this._skeleton); }
    }

    protected _onMaterialModified (index: number, material: Material | null) {
        const device: GFXDevice = cc.director.root && cc.director.root.device;
        const type = selectJointsMediumType(device, this._jointCount);
        const mat = this.getMaterial(index, CC_EDITOR) || this._getBuiltinMaterial();
        mat.recompileShaders({ CC_USE_SKINNING: type });
        super._onMaterialModified(index, mat);
    }

    protected _getBuiltinMaterial () {
        // classic ugly pink indicating missing material
        return builtinResMgr.get<Material>('missing-skinning-material');
    }

    private _bindSkeleton () {
        this._jointCount = this._skeleton && this._skeleton.joints.length || 0;
        if (this._model) {
            (this._model as SkinningModel).bindSkeleton(this._skeleton);
        }
        this._materials.forEach((material, index) => material && this._onMaterialModified(index, material));
    }

    private _resetSkinningTarget () {
        this._joints.length = 0;
        if (!this._skeleton || !this._skinningRoot) { return; }
        const root = LCA(this.node, this._skinningRoot);
        if (!root) { return; }

        const rootNode = this._skinningRoot;
        this._skeleton.joints.forEach((path) => {
            const targetNode = rootNode.getChildByPath(path);
            if (!targetNode) {
                console.warn(`Skinning target ${path} not found in scene graph.`);
                return;
            }
            this._joints.push(JointManager.get(targetNode, root));
        });
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
