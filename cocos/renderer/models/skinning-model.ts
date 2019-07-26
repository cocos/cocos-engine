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

import { Skeleton } from '../../3d/assets/skeleton';
import { SkeletalAnimationClip } from '../../animation';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { UBOSkinningTexture, UNIFORM_JOINTS_TEXTURE } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Pass } from '../core/pass';
import { ITextureBufferHandle } from '../core/texture-buffer-pool';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import { getJointsTextureSampler } from './joints-texture-utils';

interface IJointsInfo {
    buffer: GFXBuffer | null;
    jointsTextureInfo: Float32Array;
    frameID: Float32Array;
    texture: ITextureBufferHandle | null;
}

export class SkinningModel extends Model {

    public uploadedClip: SkeletalAnimationClip | null = null;

    private _jointsMedium: IJointsInfo;
    private _skeleton: Skeleton | null = null;

    get worldBounds () {
        return this.uploadedClip ? null : this._worldBounds;
    }

    constructor (scene: RenderScene, node: Node) {
        super(scene, node);
        this._type = 'skinning';
        const jointsTextureInfo = new Float32Array(5);
        const frameID = new Float32Array(1);
        const texture = this._scene.texturePool.getDefaultJointsTexture();
        this._jointsMedium = { buffer: null, jointsTextureInfo, frameID, texture };
    }

    public destroy () {
        super.destroy();
        if (this._jointsMedium.buffer) {
            this._jointsMedium.buffer.destroy();
            this._jointsMedium.buffer = null;
        }
    }

    public bindSkeleton (skeleton: Skeleton | null, skinningRoot: Node | null) {
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
        const texture = this.uploadedClip ?
        this._scene.texturePool.getJointsTextureWithClip(skeleton, this.uploadedClip) :
            this._scene.texturePool.getDefaultJointsTexture(skeleton);
        this._applyJointsTexture(texture);
    }

    public uploadAnimationClip (clip: SkeletalAnimationClip) {
        if (!this._skeleton) { return; }
        this.uploadedClip = clip;
        this._applyJointsTexture(this._scene.texturePool.getJointsTextureWithClip(this._skeleton, clip));
    }

    public setFrameID (val: number) {
        const { buffer, frameID } = this._jointsMedium;
        frameID[0] = val;
        buffer!.update(frameID, UBOSkinningTexture.JOINTS_FRAME_ID_OFFSET);
    }

    public getFrameID () {
        return this._jointsMedium.frameID[0];
    }

    protected _applyJointsTexture (texture: ITextureBufferHandle | null) {
        if (!texture) { return; }
        this._jointsMedium.texture = texture;
        const { buffer, jointsTextureInfo } = this._jointsMedium;
        jointsTextureInfo[0] = texture.texture.width;
        jointsTextureInfo[1] = 1 / texture.texture.width;
        jointsTextureInfo[2] = this._scene.texturePool.bytesToPixels(texture.start);
        jointsTextureInfo[3] = this.uploadedClip ? this.uploadedClip.keys[0].length : 1;
        jointsTextureInfo[4] = 0; // restore fid
        if (buffer) { buffer.update(jointsTextureInfo); }
        const sampler = getJointsTextureSampler(this._device);
        for (const submodel of this._subModels) {
            if (!submodel.psos) { continue; }
            for (const pso of submodel.psos) {
                pso.pipelineLayout.layouts[0].bindTextureView(UNIFORM_JOINTS_TEXTURE.binding, texture.texView);
                pso.pipelineLayout.layouts[0].bindSampler(UNIFORM_JOINTS_TEXTURE.binding, sampler);
            }
        }
    }

    protected _doCreatePSO (pass: Pass) {
        const pso = super._doCreatePSO(pass);
        const { buffer, texture } = this._jointsMedium;
        pso.pipelineLayout.layouts[0].bindBuffer(UBOSkinningTexture.BLOCK.binding, buffer!);
        const sampler = getJointsTextureSampler(this._device);
        if (texture) {
            pso.pipelineLayout.layouts[0].bindTextureView(UNIFORM_JOINTS_TEXTURE.binding, texture.texView);
            pso.pipelineLayout.layouts[0].bindSampler(UNIFORM_JOINTS_TEXTURE.binding, sampler);
        }
        return pso;
    }
}
