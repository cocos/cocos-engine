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
import { Material } from '../../asset/assets';
import { Camera } from '../../render-scene/scene/camera';
import { GeometryRenderer } from '../geometry-renderer';
import { Buffer, Color, CommandBuffer, DescriptorSet, DescriptorSetLayout, Device, DrawInfo, Format, InputAssembler, PipelineState, Rect, Sampler, Swapchain, Texture, UniformBlock, Viewport } from '../../gfx';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { Mat4, Quat, Vec2, Vec4 } from '../../core/math';
import { MacroRecord } from '../../render-scene/core/pass-utils';
import { PipelineSceneData } from '../pipeline-scene-data';
import { ComputeView, CopyPair, DescriptorBlockFlattened, DescriptorBlockIndex, LightInfo, MovePair, QueueHint, RasterView, ResourceResidency, SceneFlags, TaskType, UpdateFrequency } from './types';
import { RenderScene } from '../../render-scene/core/render-scene';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Model } from '../../render-scene/scene';

export interface PipelineRuntime {
    activate (swapchain: Swapchain): boolean;
    destroy (): boolean;
    render (cameras: Camera[]): void;
    readonly device: Device;
    readonly globalDSManager: GlobalDSManager;
    readonly descriptorSetLayout: DescriptorSetLayout;
    readonly descriptorSet: DescriptorSet;
    readonly commandBuffers: CommandBuffer[];
    readonly pipelineSceneData: PipelineSceneData;
    readonly constantMacros: string;
    profiler: Model | null;
    readonly geometryRenderer: GeometryRenderer | null;
    shadingScale: number;
    getMacroString (name: string): string;
    getMacroInt (name: string): number;
    getMacroBool (name: string): boolean;
    setMacroString (name: string, value: string): void;
    setMacroInt (name: string, value: number): void;
    setMacroBool (name: string, value: boolean): void;
    onGlobalPipelineStateChanged (): void;

    readonly macros: MacroRecord;
}

export interface RenderNode {
    name: string;
}

export interface Setter extends RenderNode {
    setMat4 (name: string, mat: Mat4): void;
    setQuaternion (name: string, quat: Quat): void;
    setColor (name: string, color: Color): void;
    setVec4 (name: string, vec: Vec4): void;
    setVec2 (name: string, vec: Vec2): void;
    setFloat (name: string, v: number): void;
    setBuffer (name: string, buffer: Buffer): void;
    setTexture (name: string, texture: Texture): void;
    setReadWriteBuffer (name: string, buffer: Buffer): void;
    setReadWriteTexture (name: string, texture: Texture): void;
    setSampler (name: string, sampler: Sampler): void;
}

export interface RasterQueueBuilder extends Setter {
    addSceneOfCamera (camera: Camera, light: LightInfo, sceneFlags: SceneFlags): void;
    addScene (name: string, sceneFlags: SceneFlags): void;
    addFullscreenQuad (material: Material, passID: number, sceneFlags: SceneFlags): void;
    addCameraQuad (camera: Camera, material: Material, passID: number, sceneFlags: SceneFlags): void;
    clearRenderTarget (name: string, color: Color): void;
    setViewport (viewport: Viewport): void;
}

export interface RasterPassBuilder extends Setter {
    addRasterView (name: string, view: RasterView): void;
    addComputeView (name: string, view: ComputeView): void;
    addQueue (hint: QueueHint): RasterQueueBuilder;
    setViewport (viewport: Viewport): void;
}

export interface ComputeQueueBuilder extends Setter {
    addDispatch (shader: string, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number): void;
}

export interface ComputePassBuilder extends Setter {
    addComputeView (name: string, view: ComputeView): void;
    addQueue (): ComputeQueueBuilder;
}

export interface MovePassBuilder extends RenderNode {
    addPair (pair: MovePair): void;
}

export interface CopyPassBuilder extends RenderNode {
    addPair (pair: CopyPair): void;
}

export interface SceneVisitor {
    readonly pipelineSceneData: PipelineSceneData;
    setViewport (vp: Viewport): void;
    setScissor (rect: Rect): void;
    bindPipelineState (pso: PipelineState): void;
    bindInputAssembler (ia: InputAssembler): void;
    draw (info: DrawInfo): void;

    bindDescriptorSet (set: number, descriptorSet: DescriptorSet, dynamicOffsets?: number[]): void;
    updateBuffer (buffer: Buffer, data: ArrayBuffer, size?: number): void;
}

export interface SceneTask {
    readonly taskType: TaskType;
    start (): void;
    join (): void;
    submit (): void;
}

export interface SceneTransversal {
    transverse (visitor: SceneVisitor): SceneTask;
}

export interface LayoutGraphBuilder {
    clear (): void;
    addRenderStage (name: string): number;
    addRenderPhase (name: string, parentID: number): number;
    addShader (name: string, parentPhaseID: number): void;
    addDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlockFlattened): void;
    addUniformBlock (nodeID: number, index: DescriptorBlockIndex, name: string, uniformBlock: UniformBlock): void;
    reserveDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlockFlattened): void;
    compile (): number;
    print (): string;
}

export interface Pipeline extends PipelineRuntime {
    beginSetup (): void;
    endSetup (): void;
    containsResource (name: string): boolean;
    addRenderTexture (name: string, format: Format, width: number, height: number, renderWindow: RenderWindow): number;
    addRenderTarget (name: string, format: Format, width: number, height: number, residency: ResourceResidency): number;
    addDepthStencil (name: string, format: Format, width: number, height: number, residency: ResourceResidency): number;
    updateRenderWindow (name: string, renderWindow: RenderWindow): void;
    beginFrame (): void;
    endFrame (): void;
    addRasterPass (width: number, height: number, layoutName: string): RasterPassBuilder;
    addComputePass (layoutName: string): ComputePassBuilder;
    addMovePass (): MovePassBuilder;
    addCopyPass (): CopyPassBuilder;
    presentAll (): void;
    createSceneTransversal (camera: Camera, scene: RenderScene): SceneTransversal;
    readonly layoutGraphBuilder: LayoutGraphBuilder;
    getDescriptorSetLayout (shaderName: string, freq: UpdateFrequency): DescriptorSetLayout | null;
}

export interface PipelineBuilder {
    setup (cameras: Camera[], pipeline: Pipeline): void;
}

export class Factory {
}
