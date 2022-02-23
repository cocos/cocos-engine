/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
****************************************************************************/

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { EffectAsset } from '../../assets';
import { Camera } from '../../renderer/scene/camera';
import { Buffer, Format, Sampler, Texture } from '../../gfx/index';
import { Color, Mat4, Quat, Vec2, Vec4 } from '../../math';
import { PipelineSceneData } from '../pipeline-scene-data';
import { QueueHint } from './types';
import { ComputeView, CopyPair, MovePair, RasterView } from './render-graph';

export abstract class DescriptorHierarchy {
    public abstract addEffect(asset: EffectAsset): void;
}

export abstract class Setter {
    public abstract setMat4(name: string, mat: Mat4): void;
    public abstract setQuaternion(name: string, quat: Quat): void;
    public abstract setColor(name: string, color: Color): void;
    public abstract setVec4(name: string, vec: Vec4): void;
    public abstract setVec2(name: string, vec: Vec2): void;
    public abstract setFloat(name: string, v: number): void;
    public abstract setBuffer(name: string, buffer: Buffer): void;
    public abstract setTexture(name: string, texture: Texture): void;
    public abstract setReadWriteBuffer(name: string, buffer: Buffer): void;
    public abstract setReadWriteTexture(name: string, texture: Texture): void;
    public abstract setSampler(name: string, sampler: Sampler): void;
}

export abstract class RasterQueueBuilder {
    public abstract addSceneOfCamera(camera: Camera, name: string): void;
    public abstract addSceneOfCamera(camera: Camera): void;
    public abstract addScene(name: string): void;
    public abstract addFullscreenQuad(shader: string, name: string): void;
    public abstract addFullscreenQuad(shader: string): void;
}

export abstract class RasterPassBuilder {
    public abstract addRasterView(name: string, view: RasterView): void;
    public abstract addComputeView(name: string, view: ComputeView): void;
    public abstract addQueue(hint: QueueHint, layoutName: string, name: string): RasterQueueBuilder;
    public abstract addQueue(hint: QueueHint, layoutName: string): RasterQueueBuilder;
    public abstract addQueue(hint: QueueHint): RasterQueueBuilder;
    public abstract addFullscreenQuad(shader: string, layoutName: string, name: string): void;
    public abstract addFullscreenQuad(shader: string, layoutName: string): void;
    public abstract addFullscreenQuad(shader: string): void;
}

export abstract class ComputeQueueBuilder {
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, layoutName: string, name: string): void;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, layoutName: string): void;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number): void;
}

export abstract class ComputePassBuilder {
    public abstract addComputeView(name: string, view: ComputeView): void;
    public abstract addQueue(layoutName: string, name: string): ComputeQueueBuilder;
    public abstract addQueue(layoutName: string): ComputeQueueBuilder;
    public abstract addQueue(): ComputeQueueBuilder;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, layoutName: string, name: string): void;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, layoutName: string): void;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number): void;
}

export abstract class MovePassBuilder {
    public abstract addPair(pair: MovePair): void;
}

export abstract class CopyPassBuilder {
    public abstract addPair(pair: CopyPair): void;
}

export abstract class Pipeline {
    public abstract addRenderTexture(name: string, format: Format, width: number, height: number): number;
    public abstract addRenderTarget(name: string, format: Format, width: number, height: number): number;
    public abstract addDepthStencil(name: string, format: Format, width: number, height: number): number;
    public abstract beginFrame(pplScene: PipelineSceneData): void;
    public abstract endFrame(): void;
    public abstract addRasterPass(width: number, height: number, layoutName: string, name: string): RasterPassBuilder;
    public abstract addRasterPass(width: number, height: number, layoutName: string): RasterPassBuilder;
    public abstract addComputePass(layoutName: string, name: string): ComputePassBuilder;
    public abstract addComputePass(layoutName: string): ComputePassBuilder;
    public abstract addMovePass(name: string): MovePassBuilder;
    public abstract addCopyPass(name: string): CopyPassBuilder;
    public abstract addPresentPass(name: string, swapchainName: string): void;
}
