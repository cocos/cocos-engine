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
import { Skeleton } from '../../assets/skeleton';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXAddress, GFXBufferUsageBit, GFXFilter, GFXMemoryUsageBit } from '../../gfx/define';
import { UBOSkinningAnimation, UBOSkinningTexture, UniformJointsTexture } from '../../pipeline/define';
import { INode } from '../../utils/interfaces';
import { Pass } from '../core/pass';
import { genSamplerHash, samplerLib } from '../core/sampler-lib';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import { IJointsTextureHandle, selectJointsMediumType } from './joints-texture-utils';

export interface IJointsAnimInfo {
    buffer: GFXBuffer;
    data: Float32Array;
}

export class JointsAnimationInfo {
    public static create (nodeID: string) {
        const res = JointsAnimationInfo.pool.get(nodeID);
        if (res) { return res; }
        const buffer = cc.director.root.device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOSkinningAnimation.SIZE,
            stride: UBOSkinningAnimation.SIZE,
        });
        const data = new Float32Array([1, 0, 0, 0]);
        buffer.update(data);
        const info = { buffer, data };
        JointsAnimationInfo.pool.set(nodeID, info);
        return info;
    }

    public static destroy (nodeID: string) {
        const info = JointsAnimationInfo.pool.get(nodeID);
        if (!info) { return; }
        info.buffer.destroy();
        JointsAnimationInfo.pool.delete(nodeID);
    }

    public static switchClip (nodeID: string, clip: AnimationClip | null) {
        const info = JointsAnimationInfo.pool.get(nodeID);
        if (!info) { return; }
        info.data[0] = clip ? clip.keys[0].length : 1;
        info.data[1] = 0;
        info.buffer.update(info.data);
    }

    public static get (nodeID: string) {
        return JointsAnimationInfo.pool.get(nodeID) || JointsAnimationInfo.create(-1 as any);
    }

    protected static pool = new Map<string, IJointsAnimInfo>();
}

const jointsTextureSamplerHash = genSamplerHash([
    GFXFilter.POINT,
    GFXFilter.POINT,
    GFXFilter.NONE,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
]);

interface IJointsInfo {
    buffer: GFXBuffer | null;
    jointsTextureInfo: Float32Array;
    texture: IJointsTextureHandle | null;
}

export class SkinningModel extends Model {

    public uploadedAnim: AnimationClip | null = null;

    private _jointsMedium: IJointsInfo;
    private _skeleton: Skeleton | null = null;

    get worldBounds () {
        return this.uploadedAnim ? null : this._worldBounds;
    }

    constructor (scene: RenderScene, node: INode) {
        super(scene, node);
        this._type = 'skinning';
        const jointsTextureInfo = new Float32Array(4);
        const texture = this._scene.texturePool.getDefaultJointsTexture();
        this._jointsMedium = { buffer: null, jointsTextureInfo, texture };
    }

    public destroy () {
        super.destroy();
        if (this._jointsMedium.buffer) {
            this._jointsMedium.buffer.destroy();
            this._jointsMedium.buffer = null;
        }
    }

    public bindSkeleton (skeleton: Skeleton | null, skinningRoot: INode | null) {
        this._skeleton = skeleton;
        if (!skeleton || !skinningRoot) { return; }
        this._transform = skinningRoot;
        if (!this._jointsMedium.buffer) {
            this._jointsMedium.buffer = this._device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOSkinningTexture.SIZE,
                stride: UBOSkinningTexture.SIZE,
            });
        }
    }

    public uploadAnimation (anim: AnimationClip | null) {
        if (!this._skeleton) { return; }
        this.uploadedAnim = anim;
        const texture = anim ?
        this._scene.texturePool.getJointsTextureWithAnimation(this._skeleton, anim) :
            this._scene.texturePool.getDefaultJointsTexture(this._skeleton);
        JointsAnimationInfo.switchClip(this._transform.uuid, anim);
        this._applyJointsTexture(texture);
    }

    protected _applyJointsTexture (texture: IJointsTextureHandle | null) {
        if (!texture) { return; }
        // we skip freeing the joints texture by default as an aggressive caching strategy
        // toggle the following when memory usage becomes more important than stable performance
        // const oldTex = this._jointsMedium.texture;
        // if (oldTex && oldTex !== texture) { this._scene.texturePool.releaseTexture(oldTex); }
        this._jointsMedium.texture = texture;
        const { buffer, jointsTextureInfo } = this._jointsMedium;
        jointsTextureInfo[0] = texture.handle.texture.width;
        jointsTextureInfo[1] = 1 / jointsTextureInfo[0];
        jointsTextureInfo[2] = texture.pixelOffset + 0.1; // guard against floor() underflow
        if (buffer) { buffer.update(jointsTextureInfo); }
        const sampler = samplerLib.getSampler(this._device, jointsTextureSamplerHash);
        for (const submodel of this._subModels) {
            if (!submodel.psos) { continue; }
            for (const pso of submodel.psos) {
                pso.pipelineLayout.layouts[0].bindTextureView(UniformJointsTexture.binding, texture.handle.texView);
                pso.pipelineLayout.layouts[0].bindSampler(UniformJointsTexture.binding, sampler);
            }
        }
    }

    protected _doCreatePSO (pass: Pass) {
        const pso = super._doCreatePSO(pass, { CC_USE_SKINNING: selectJointsMediumType(this._device) });
        const { buffer, texture } = this._jointsMedium;
        const animInfo = JointsAnimationInfo.get(this._transform.uuid);
        pso.pipelineLayout.layouts[0].bindBuffer(UBOSkinningTexture.BLOCK.binding, buffer!);
        pso.pipelineLayout.layouts[0].bindBuffer(UBOSkinningAnimation.BLOCK.binding, animInfo.buffer);
        const sampler = samplerLib.getSampler(this._device, jointsTextureSamplerHash);
        if (texture) {
            pso.pipelineLayout.layouts[0].bindTextureView(UniformJointsTexture.binding, texture.handle.texView);
            pso.pipelineLayout.layouts[0].bindSampler(UniformJointsTexture.binding, sampler);
        }
        return pso;
    }
}
