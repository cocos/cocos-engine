/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { Material } from '../../asset/assets';
import { Camera } from '../../render-scene/scene/camera';
import { GeometryRenderer } from '../geometry-renderer';
import { Buffer, Color, CommandBuffer, DescriptorSet, DescriptorSetLayout, Device, DrawInfo, Format, InputAssembler, PipelineState, Rect, Sampler, Swapchain, Texture, Viewport } from '../../gfx';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { Mat4, Quat, Vec2, Vec4 } from '../../core/math';
import { MacroRecord } from '../../render-scene/core/pass-utils';
import { PipelineSceneData } from '../pipeline-scene-data';
import { ComputeView, CopyPair, LightInfo, MovePair, QueueHint, RasterView, ResourceResidency, SceneFlags, TaskType, UpdateFrequency } from './types';
import { RenderScene } from '../../render-scene/core/render-scene';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Model } from '../../render-scene/scene';

export interface PipelineRuntime {
    activate (swapchain: Swapchain): boolean;
    destroy (): boolean;
    render (cameras: Camera[]): void;
    readonly device: Device;
    readonly macros: MacroRecord;
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
    addSceneOfCamera (camera: Camera, light: LightInfo/*, SceneFlags.NONE*/): void;
    addScene (name: string, sceneFlags: SceneFlags): void;
    addScene (name: string/*, SceneFlags.NONE*/): void;
    addFullscreenQuad (material: Material, passID: number, sceneFlags: SceneFlags): void;
    addFullscreenQuad (material: Material, passID: number/*, SceneFlags.NONE*/): void;
    addCameraQuad (camera: Camera, material: Material, passID: number, sceneFlags: SceneFlags): void;
    addCameraQuad (camera: Camera, material: Material, passID: number/*, SceneFlags.NONE*/): void;
    clearRenderTarget (name: string, color: Color): void;
    clearRenderTarget (name: string/*, new Color()*/): void;
    setViewport (viewport: Viewport): void;
}

export interface RasterPassBuilder extends Setter {
    addRasterView (name: string, view: RasterView): void;
    addComputeView (name: string, view: ComputeView): void;
    addQueue (hint: QueueHint): RasterQueueBuilder;
    addQueue (/*QueueHint.NONE*/): RasterQueueBuilder;
    setViewport (viewport: Viewport): void;
    setVersion (name: string, version: number): void;
    showStatistics: boolean;
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

export interface Pipeline extends PipelineRuntime {
    beginSetup (): void;
    endSetup (): void;
    containsResource (name: string): boolean;
    addRenderTexture (name: string, format: Format, width: number, height: number, renderWindow: RenderWindow): number;
    addRenderTarget (name: string, format: Format, width: number, height: number, residency: ResourceResidency): number;
    addRenderTarget (name: string, format: Format, width: number, height: number/*, ResourceResidency.MANAGED*/): number;
    addDepthStencil (name: string, format: Format, width: number, height: number, residency: ResourceResidency): number;
    addDepthStencil (name: string, format: Format, width: number, height: number/*, ResourceResidency.MANAGED*/): number;
    updateRenderWindow (name: string, renderWindow: RenderWindow): void;
    updateRenderTarget (name: string, width: number, height: number, format: Format): void;
    updateRenderTarget (name: string, width: number, height: number/*, gfx.Format.UNKNOWN*/): void;
    updateDepthStencil (name: string, width: number, height: number, format: Format): void;
    updateDepthStencil (name: string, width: number, height: number/*, gfx.Format.UNKNOWN*/): void;
    beginFrame (): void;
    endFrame (): void;
    addRasterPass (width: number, height: number, layoutName: string): RasterPassBuilder;
    addRasterPass (width: number, height: number/*, 'default'*/): RasterPassBuilder;
    addComputePass (layoutName: string): ComputePassBuilder;
    addMovePass (): MovePassBuilder;
    addCopyPass (): CopyPassBuilder;
    presentAll (): void;
    createSceneTransversal (camera: Camera, scene: RenderScene): SceneTransversal;
    getDescriptorSetLayout (shaderName: string, freq: UpdateFrequency): DescriptorSetLayout | null;
}

export interface PipelineBuilder {
    setup (cameras: Camera[], pipeline: Pipeline): void;
}

export interface RenderingModule {
    getPassID (name: string): number;
    getPhaseID (passID: number, name: string): number;
}

export class Factory {
}
