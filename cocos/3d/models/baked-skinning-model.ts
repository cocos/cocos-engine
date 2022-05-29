/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import type { AnimationClip } from '../../core/animation/animation-clip';
import { Mesh } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { AABB } from '../../core/geometry';
import { BufferUsageBit, MemoryUsageBit, Attribute, DescriptorSet, Buffer, BufferInfo } from '../../core/gfx';
import { INST_JOINT_ANIM_INFO, UBOSkinningAnimation, UBOSkinningTexture, UNIFORM_JOINT_TEXTURE_BINDING } from '../../core/pipeline/define';
import { Node } from '../../core/scene-graph';
import { IMacroPatch, Pass } from '../../core/renderer/core/pass';
import type { DataPoolManager } from '../skeletal-animation/data-pool-manager';
import { ModelType } from '../../core/renderer/scene/model';
import { IAnimInfo, IJointTextureHandle } from '../skeletal-animation/skeletal-animation-utils';
import { MorphModel } from './morph-model';
import { legacyCC } from '../../core/global-exports';
import { jointTextureSamplerInfo } from '../misc/joint-texture-sampler-info';

interface IJointsInfo {
    buffer: Buffer | null;
    jointTextureInfo: Float32Array;
    texture: IJointTextureHandle | null;
    animInfo: IAnimInfo;
    boundsInfo: AABB[] | null;
}

const myPatches = [
    { name: 'CC_USE_SKINNING', value: true },
    { name: 'CC_USE_BAKED_ANIMATION', value: true },
];

/**
 * @en
 * The skinning model that is using GPU baked animation.
 * @zh
 * GPU 预烘焙动画的蒙皮模型。
 */
export class BakedSkinningModel extends MorphModel {
    /**
     * @en The animation clip that have been uploaded
     * @zh 已被上传的动画片段
     */
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

    // Override
    public bindSkeleton (skeleton: Skeleton | null = null, skinningRoot: Node | null = null, mesh: Mesh | null = null) {
        this._skeleton = skeleton;
        this._mesh = mesh;
        if (!skeleton || !skinningRoot || !mesh) { return; }
        this.transform = skinningRoot;
        const resMgr = this._dataPoolManager;
        this._jointsMedium.animInfo = resMgr.jointAnimationInfo.getData(skinningRoot.uuid);
        if (!this._jointsMedium.buffer) {
            this._jointsMedium.buffer = this._device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                UBOSkinningTexture.SIZE,
                UBOSkinningTexture.SIZE,
            ));
        }
    }

    // Override
    public updateTransform (stamp: number) {
        super.updateTransform(stamp);

        if (!this.uploadedAnim) { return; }
        const { animInfo, boundsInfo } = this._jointsMedium;
        const skelBound = boundsInfo![animInfo.data[0]];
        const worldBounds = this._worldBounds;
        if (worldBounds && skelBound) {
            const node = this.transform;
            // @ts-expect-error TS2339
            skelBound.transform(node._mat, node._pos, node._rot, node._scale, worldBounds);
        }
    }

    // Override, update fid buffer only when visible
    public updateUBOs (stamp: number) {
        super.updateUBOs(stamp);

        const info = this._jointsMedium.animInfo;
        const idx = this._instAnimInfoIdx;
        if (idx >= 0) {
            const view = this.instancedAttributes.views[idx];
            view[0] = info.data[0];
        } else if (info.dirty) {
            info.buffer.update(info.data);
            info.dirty = false;
        }
        return true;
    }

    // Override
    public getMacroPatches (subModelIndex: number): IMacroPatch[] | null {
        const patches = super.getMacroPatches(subModelIndex);
        return patches ? patches.concat(myPatches) : myPatches;
    }

    /**
     * @en Pre-simulate and store the frames data of the given animation clip to a joint texture and upload it to GPU.
     * Normally, it's automatically managed by [[SkeletalAnimationState]].
     * But user can also use Joint Texture Layout Settings in the editor to manually organize the joint textures.
     * @zh 预计算并存储一个指定动画片段的完整帧数据到一张骨骼贴图上，并将其上传到 GPU。
     * 一般情况下 [[SkeletalAnimationState]] 会自动管理所有骨骼贴图，但用户也可以使用编辑器的骨骼贴图布局设置面板来手动管理所有骨骼贴图。
     * @param anim @en The animation clip to be uploaded to the joint texture. @zh 需要上传到骨骼贴图上的动画片段。
     * @returns void
     */
    public uploadAnimation (anim: AnimationClip | null) {
        if (!this._skeleton || !this._mesh || this.uploadedAnim === anim) { return; }
        this.uploadedAnim = anim;
        const resMgr = this._dataPoolManager;
        let texture: IJointTextureHandle | null = null;
        if (anim) {
            texture = resMgr.jointTexturePool.getSequencePoseTexture(this._skeleton, anim, this._mesh, this.transform);
            this._jointsMedium.boundsInfo = texture && texture.bounds.get(this._mesh.hash)!;
            this._modelBounds = null; // don't calc bounds again in Model
        } else {
            texture = resMgr.jointTexturePool.getDefaultPoseTexture(this._skeleton, this._mesh, this.transform);
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
            const descriptorSet = this._subModels[i].descriptorSet;
            descriptorSet.bindTexture(UNIFORM_JOINT_TEXTURE_BINDING, tex);
        }
    }

    protected _updateLocalDescriptors (submodelIdx: number, descriptorSet: DescriptorSet) {
        super._updateLocalDescriptors(submodelIdx, descriptorSet);
        const { buffer, texture, animInfo } = this._jointsMedium;
        descriptorSet.bindBuffer(UBOSkinningTexture.BINDING, buffer!);
        descriptorSet.bindBuffer(UBOSkinningAnimation.BINDING, animInfo.buffer);
        if (texture) {
            const sampler = this._device.getSampler(jointTextureSamplerInfo);
            descriptorSet.bindTexture(UNIFORM_JOINT_TEXTURE_BINDING, texture.handle.texture);
            descriptorSet.bindSampler(UNIFORM_JOINT_TEXTURE_BINDING, sampler);
        }
    }

    protected _updateInstancedAttributes (attributes: Attribute[], pass: Pass) {
        super._updateInstancedAttributes(attributes, pass);
        this._instAnimInfoIdx = this._getInstancedAttributeIndex(INST_JOINT_ANIM_INFO);
        this.updateInstancedJointTextureInfo();
    }

    private updateInstancedJointTextureInfo () {
        const { jointTextureInfo, animInfo } = this._jointsMedium;
        const idx = this._instAnimInfoIdx;
        if (idx >= 0) { // update instancing data too
            const view = this.instancedAttributes.views[idx];
            view[0] = animInfo.data[0];
            view[1] = jointTextureInfo[1];
            view[2] = jointTextureInfo[2];
        }
    }
}
