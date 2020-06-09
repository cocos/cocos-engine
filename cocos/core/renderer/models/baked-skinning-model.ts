/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { AnimationClip } from '../../animation/animation-clip';
import { Mesh } from '../../assets/mesh';
import { Skeleton } from '../../assets/skeleton';
import { aabb } from '../../geometry';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { Vec3 } from '../../math';
import { INST_JOINT_ANIM_INFO, UBOSkinningAnimation, UBOSkinningTexture, UniformJointTexture } from '../../pipeline/define';
import { Node } from '../../scene-graph';
import { Pass } from '../core/pass';
import { samplerLib } from '../core/sampler-lib';
import { DataPoolManager } from '../data-pool-manager';
import { ModelType } from '../scene/model';
import { IAnimInfo, IJointTextureHandle, jointTextureSamplerHash } from './skeletal-animation-utils';
import { MorphModel } from './morph-model';
import { IPSOCreateInfo } from '../scene/submodel';
import { legacyCC } from '../../global-exports';
import { IGFXAttribute } from '../../gfx';

interface IJointsInfo {
    buffer: GFXBuffer | null;
    jointTextureInfo: Float32Array;
    texture: IJointTextureHandle | null;
    animInfo: IAnimInfo;
    boundsInfo: aabb[] | null;
}

const myPatches = [
    { name: 'CC_USE_SKINNING', value: true },
    { name: 'CC_USE_BAKED_ANIMATION', value: true },
];

/**
 * @en
 * The skinning model that is using baked animation.
 * @zh
 * 预烘焙动画的蒙皮模型。
 */
export class BakedSkinningModel extends MorphModel {

    public uploadedAnim: AnimationClip | null | undefined = undefined; // uninitialized

    private _jointsMedium: IJointsInfo;

    private _skeleton: Skeleton | null = null;
    private _mesh: Mesh | null = null;
    private _dataPoolManager: DataPoolManager;
    private _instAnimInfoIdx = -1;

    constructor () {
        super();
        this.type = ModelType.BAKED_SKINNING;
        this._dataPoolManager = legacyCC.director.root.dataPoolManager;
        const jointTextureInfo = new Float32Array(4);
        const animInfo = this._dataPoolManager.jointAnimationInfo.getData();
        this._jointsMedium = { buffer: null, jointTextureInfo, animInfo, texture: null, boundsInfo: null };
    }

    public destroy () {
        this.uploadedAnim = undefined; // uninitialized
        this._jointsMedium.boundsInfo = null;
        if (this._jointsMedium.buffer) {
            this._jointsMedium.buffer.destroy();
            this._jointsMedium.buffer = null;
        }
        this._applyJointTexture();
        super.destroy();
    }

    public bindSkeleton (skeleton: Skeleton | null = null, skinningRoot: Node | null = null, mesh: Mesh | null = null) {
        this._skeleton = skeleton;
        this._mesh = mesh;
        if (!skeleton || !skinningRoot || !mesh) { return; }
        this.transform = skinningRoot;
        const resMgr = this._dataPoolManager;
        this._jointsMedium.animInfo = resMgr.jointAnimationInfo.getData(skinningRoot.uuid);
        if (!this._jointsMedium.buffer) {
            this._jointsMedium.buffer = this._device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOSkinningTexture.SIZE,
                stride: UBOSkinningTexture.SIZE,
            });
        }
    }

    public updateTransform (stamp: number) {
        super.updateTransform(stamp);
        if (!this.uploadedAnim) { return; }
        const { animInfo, boundsInfo } = this._jointsMedium;
        const skelBound = boundsInfo![animInfo.data[0]];
        const node = this.transform;
        if (this._worldBounds && skelBound) {
            // @ts-ignore TS2339
            skelBound.transform(node._mat, node._pos, node._rot, node._scale, this._worldBounds);
        }
    }

    // update fid buffer only when visible
    public updateUBOs (stamp: number) {
        super.updateUBOs(stamp);
        const info = this._jointsMedium.animInfo;
        const idx = this._instAnimInfoIdx;
        if (idx >= 0) {
            const view = this.instancedAttributes.list[idx].view;
            view[0] = info.data[0];
        } else if (info.dirty) {
            info.buffer.update(info.data);
            info.dirty = false;
        }
        return true;
    }

    public createBoundingShape (minPos?: Vec3, maxPos?: Vec3) {
        if (!minPos || !maxPos) { return; }
        this._worldBounds = new aabb();
    }

    public uploadAnimation (anim: AnimationClip | null) {
        if (!this._skeleton || !this._mesh || this.uploadedAnim === anim) { return; }
        this.uploadedAnim = anim;
        const resMgr = this._dataPoolManager;
        let texture: IJointTextureHandle | null = null;
        if (anim) {
            texture = resMgr.jointTexturePool.getSequencePoseTexture(this._skeleton, anim, this._mesh, this.transform!);
            this._jointsMedium.boundsInfo = texture && texture.bounds.get(this._mesh.hash)!;
            this._modelBounds = null; // don't calc bounds again in Model
        } else {
            texture = resMgr.jointTexturePool.getDefaultPoseTexture(this._skeleton, this._mesh, this.transform!);
            this._jointsMedium.boundsInfo = null;
            this._modelBounds = texture && texture.bounds.get(this._mesh.hash)![0];
        }
        this._applyJointTexture(texture);
    }

    protected _applyJointTexture (texture: IJointTextureHandle | null = null) {
        const oldTex = this._jointsMedium.texture;
        if (oldTex && oldTex !== texture) { this._dataPoolManager.jointTexturePool.releaseHandle(oldTex); }
        this._jointsMedium.texture = texture;
        if (!texture) { return; }
        const { buffer, jointTextureInfo } = this._jointsMedium;
        jointTextureInfo[0] = texture.handle.texture.width;
        jointTextureInfo[1] = this._skeleton!.joints.length;
        jointTextureInfo[2] = texture.pixelOffset + 0.1; // guard against floor() underflow
        jointTextureInfo[3] = 1 / jointTextureInfo[0];
        this.updateInstancedJointTextureInfo();
        if (buffer) { buffer.update(jointTextureInfo); }
        const tex = texture.handle.texture;

        for (let i = 0; i < this._subModels.length; ++i) {
            const psoCreateInfos = this._subModels[i].psoInfos;
            for (let j = 0; j < psoCreateInfos.length; ++j) {
                const bindingLayout = psoCreateInfos[j].bindingLayout;
                bindingLayout.bindTexture(UniformJointTexture.binding, tex);
            }
        }

        for (let i = 0; i < this._implantPSOCIs.length; i++) {
            const bindingLayout = this._implantPSOCIs[i].bindingLayout;
            bindingLayout.bindTexture(UniformJointTexture.binding, tex);
            bindingLayout.update();
        }
    }

    public getMacroPatches (subModelIndex: number) : any {
        return myPatches;
    }

    public updateLocalBindings (psoci: IPSOCreateInfo, submodelIdx: number) {
        super.updateLocalBindings(psoci, submodelIdx);
        const { buffer, texture, animInfo } = this._jointsMedium;
        const bindingLayout = psoci.bindingLayout;
        bindingLayout.bindBuffer(UBOSkinningTexture.BLOCK.binding, buffer!);
        bindingLayout.bindBuffer(UBOSkinningAnimation.BLOCK.binding, animInfo.buffer);
        const sampler = samplerLib.getSampler(this._device, jointTextureSamplerHash);
        if (texture) {
            bindingLayout.bindTexture(UniformJointTexture.binding, texture.handle.texture);
            bindingLayout.bindSampler(UniformJointTexture.binding, sampler);
        }
    }

    protected updateInstancedAttributeList (attributes: IGFXAttribute[], pass: Pass) {
        super.updateInstancedAttributeList(attributes, pass);
        this._instAnimInfoIdx = this.getInstancedAttributeIndex(INST_JOINT_ANIM_INFO);
        this.updateInstancedJointTextureInfo();
    }

    private updateInstancedJointTextureInfo () {
        const { jointTextureInfo, animInfo } = this._jointsMedium;
        const idx = this._instAnimInfoIdx;
        if (idx >= 0) { // update instancing data too
            const view = this.instancedAttributes.list[idx].view;
            view[0] = animInfo.data[0];
            view[1] = jointTextureInfo[1];
            view[2] = jointTextureInfo[2];
        }
    }
}
