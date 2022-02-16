/* eslint-disable max-len */
import { Camera } from '../../renderer/scene/camera';
import { Buffer, Format, Sampler, Texture } from '../../gfx/index';
import { Color, Mat4, Quat, Vec2, Vec4 } from '../../math';
import { QueueHint } from './types';
import { ComputeView, CopyPair, MovePair, RasterView } from './render-graph';

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

export abstract class RasterQueue extends Setter {
    public abstract addSceneOfCamera(camera: Camera, name: string): void;
    public abstract addSceneOfCamera(camera: Camera): void;
    public abstract addScene(name: string): void;
    public abstract addFullscreenQuad(shader: string, layoutName: string, name: string): void;
    public abstract addFullscreenQuad(shader: string, layoutName: string): void;
    public abstract addFullscreenQuad(shader: string): void;
}

export abstract class RasterPass extends Setter {
    public abstract addRasterView(name: string, view: RasterView): void;
    public abstract addComputeView(name: string, view: ComputeView): void;
    public abstract addQueue(hint: QueueHint, layoutName: string, name: string): RasterQueue;
    public abstract addQueue(hint: QueueHint, layoutName: string): RasterQueue;
    public abstract addQueue(hint: QueueHint): RasterQueue;
    public abstract addFullscreenQuad(shader: string, layoutName: string, name: string): void;
    public abstract addFullscreenQuad(shader: string, layoutName: string): void;
    public abstract addFullscreenQuad(shader: string): void;
}

export abstract class ComputeQueue extends Setter {
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, layoutName: string, name: string): void;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, layoutName: string): void;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number): void;
}

export abstract class ComputePass extends Setter {
    public abstract addComputeView(name: string, view: ComputeView): void;
    public abstract addQueue(layoutName: string, name: string): ComputeQueue;
    public abstract addQueue(layoutName: string): ComputeQueue;
    public abstract addQueue(): ComputeQueue;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, layoutName: string, name: string): void;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, layoutName: string): void;
    public abstract addDispatch(shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number): void;
}

export abstract class MovePass {
    public abstract addPair(pair: MovePair): void;
}

export abstract class CopyPass {
    public abstract addPair(pair: CopyPair): void;
}

export abstract class Pipeline {
    public abstract addRenderTexture(name: string, format: Format, width: number, height: number): number;
    public abstract addRenderTarget(name: string, format: Format, width: number, height: number): number;
    public abstract addDepthStencil(name: string, format: Format, width: number, height: number): number;
    public abstract beginFrame(): void;
    public abstract endFrame(): void;
    public abstract addRasterPass(width: number, height: number, layoutName: string, name: string): RasterPass;
    public abstract addRasterPass(width: number, height: number, layoutName: string): RasterPass;
    public abstract addComputePass(layoutName: string, name: string): ComputePass;
    public abstract addComputePass(layoutName: string): ComputePass;
    public abstract addMovePass(name: string): MovePass;
    public abstract addCopyPass(name: string): CopyPass;
}
