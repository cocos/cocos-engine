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
import { Buffer, ClearFlagBit, Color, CommandBuffer, DescriptorSet, DescriptorSetLayout, Device, DrawInfo, Format, InputAssembler, LoadOp, PipelineState, Rect, Sampler, StoreOp, Swapchain, Texture, Viewport } from '../../gfx';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { Mat4, Quat, Vec2, Vec4 } from '../../core/math';
import { MacroRecord } from '../../render-scene/core/pass-utils';
import { PipelineSceneData } from '../pipeline-scene-data';
import { AccessType, ComputeView, CopyPair, LightInfo, MovePair, QueueHint, RasterView, ResourceResidency, SceneFlags, TaskType, UpdateFrequency } from './types';
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
    /**
     * @beta method's name might change
     */
    setCustomBehavior (name: string): void;
}

export interface Setter extends RenderNode {
    setMat4 (name: string, mat: Mat4): void;
    setQuaternion (name: string, quat: Quat): void;
    setColor (name: string, color: Color): void;
    setVec4 (name: string, vec: Vec4): void;
    setVec2 (name: string, vec: Vec2): void;
    setFloat (name: string, v: number): void;
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void;
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
    /**
     * @beta method's name might change
     */
    addCustomCommand (customBehavior: string): void;
}

export interface RasterSubpassBuilder extends Setter {
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, accessType: AccessType, slotName: string, loadOp: LoadOp, storeOp: StoreOp, color: Color): void;
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, accessType: AccessType, slotName: string, loadOp: LoadOp, storeOp: StoreOp/*, new Color()*/): void;
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, accessType: AccessType, slotName: string, loadOp: LoadOp/*, StoreOp.STORE, new Color()*/): void;
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, accessType: AccessType, slotName: string/*, LoadOp.CLEAR, StoreOp.STORE, new Color()*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, accessType: AccessType, slotName: string, loadOp: LoadOp, storeOp: StoreOp, depth: number, stencil: number, clearFlags: ClearFlagBit): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, accessType: AccessType, slotName: string, loadOp: LoadOp, storeOp: StoreOp, depth: number, stencil: number/*, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, accessType: AccessType, slotName: string, loadOp: LoadOp, storeOp: StoreOp, depth: number/*, 0, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, accessType: AccessType, slotName: string, loadOp: LoadOp, storeOp: StoreOp/*, 1, 0, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, accessType: AccessType, slotName: string, loadOp: LoadOp/*, StoreOp.STORE, 1, 0, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, accessType: AccessType, slotName: string/*, LoadOp.CLEAR, StoreOp.STORE, 1, 0, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addTexture (name: string, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addStorageBuffer (name: string, accessType: AccessType, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addStorageImage (name: string, accessType: AccessType, slotName: string): void;
    /**
     * @deprecated method will be removed in 3.8.0
     */
    addComputeView (name: string, view: ComputeView): void;
    setViewport (viewport: Viewport): void;
    addQueue (hint: QueueHint, layoutName: string): RasterQueueBuilder;
    addQueue (hint: QueueHint/*, ''*/): RasterQueueBuilder;
    addQueue (/*QueueHint.NONE, ''*/): RasterQueueBuilder;
    showStatistics: boolean;
}

export interface ComputeQueueBuilder extends Setter {
    addDispatch (threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, material: Material, passID: number): void;
    addDispatch (threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, material: Material/*, 0*/): void;
    addDispatch (threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number/*, null, 0*/): void;
}

export interface ComputeSubpassBuilder extends Setter {
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addTexture (name: string, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addStorageBuffer (name: string, accessType: AccessType, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addStorageImage (name: string, accessType: AccessType, slotName: string): void;
    /**
     * @deprecated method will be removed in 3.8.0
     */
    addComputeView (name: string, view: ComputeView): void;
    addQueue (layoutName: string): ComputeQueueBuilder;
    addQueue (/*''*/): ComputeQueueBuilder;
}

export interface RasterPassBuilder extends Setter {
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, slotName: string, loadOp: LoadOp, storeOp: StoreOp, color: Color): void;
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, slotName: string, loadOp: LoadOp, storeOp: StoreOp/*, new Color()*/): void;
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, slotName: string, loadOp: LoadOp/*, StoreOp.STORE, new Color()*/): void;
    /**
     * @beta method's name might change
     */
    addRenderTarget (name: string, slotName: string/*, LoadOp.CLEAR, StoreOp.STORE, new Color()*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, slotName: string, loadOp: LoadOp, storeOp: StoreOp, depth: number, stencil: number, clearFlags: ClearFlagBit): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, slotName: string, loadOp: LoadOp, storeOp: StoreOp, depth: number, stencil: number/*, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, slotName: string, loadOp: LoadOp, storeOp: StoreOp, depth: number/*, 0, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, slotName: string, loadOp: LoadOp, storeOp: StoreOp/*, 1, 0, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, slotName: string, loadOp: LoadOp/*, StoreOp.STORE, 1, 0, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addDepthStencil (name: string, slotName: string/*, LoadOp.CLEAR, StoreOp.STORE, 1, 0, ClearFlagBit.DEPTH_STENCIL*/): void;
    /**
     * @beta method's name might change
     */
    addTexture (name: string, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addStorageBuffer (name: string, accessType: AccessType, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addStorageImage (name: string, accessType: AccessType, slotName: string): void;
    /**
     * @deprecated method will be removed in 3.8.0
     */
    addRasterView (name: string, view: RasterView): void;
    /**
     * @deprecated method will be removed in 3.8.0
     */
    addComputeView (name: string, view: ComputeView): void;
    addQueue (hint: QueueHint, layoutName: string): RasterQueueBuilder;
    addQueue (hint: QueueHint/*, ''*/): RasterQueueBuilder;
    addQueue (/*QueueHint.NONE, ''*/): RasterQueueBuilder;
    addRasterSubpass (layoutName: string): RasterSubpassBuilder;
    addRasterSubpass (/*''*/): RasterSubpassBuilder;
    addComputeSubpass (layoutName: string): ComputeSubpassBuilder;
    addComputeSubpass (/*''*/): ComputeSubpassBuilder;
    setViewport (viewport: Viewport): void;
    setVersion (name: string, version: number): void;
    showStatistics: boolean;
}

export interface ComputePassBuilder extends Setter {
    /**
     * @beta method's name might change
     */
    addTexture (name: string, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addStorageBuffer (name: string, accessType: AccessType, slotName: string): void;
    /**
     * @beta method's name might change
     */
    addStorageImage (name: string, accessType: AccessType, slotName: string): void;
    /**
     * @deprecated method will be removed in 3.8.0
     */
    addComputeView (name: string, view: ComputeView): void;
    addQueue (layoutName: string): ComputeQueueBuilder;
    addQueue (/*''*/): ComputeQueueBuilder;
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
    /**
     * @deprecated method will be removed in 3.8.0
     */
    addRenderTexture (name: string, format: Format, width: number, height: number, renderWindow: RenderWindow): number;
    addRenderWindow (name: string, format: Format, width: number, height: number, renderWindow: RenderWindow): number;
    updateRenderWindow (name: string, renderWindow: RenderWindow): void;
    addStorageBuffer (name: string, format: Format, size: number, residency: ResourceResidency): number;
    addStorageBuffer (name: string, format: Format, size: number/*, ResourceResidency.MANAGED*/): number;
    addRenderTarget (name: string, format: Format, width: number, height: number, residency: ResourceResidency): number;
    addRenderTarget (name: string, format: Format, width: number, height: number/*, ResourceResidency.MANAGED*/): number;
    addDepthStencil (name: string, format: Format, width: number, height: number, residency: ResourceResidency): number;
    addDepthStencil (name: string, format: Format, width: number, height: number/*, ResourceResidency.MANAGED*/): number;
    addStorageTexture (name: string, format: Format, width: number, height: number, residency: ResourceResidency): number;
    addStorageTexture (name: string, format: Format, width: number, height: number/*, ResourceResidency.MANAGED*/): number;
    addShadingRateTexture (name: string, width: number, height: number, residency: ResourceResidency): number;
    addShadingRateTexture (name: string, width: number, height: number/*, ResourceResidency.MANAGED*/): number;
    updateStorageBuffer (name: string, size: number, format: Format): void;
    updateStorageBuffer (name: string, size: number/*, Format.UNKNOWN*/): void;
    updateRenderTarget (name: string, width: number, height: number, format: Format): void;
    updateRenderTarget (name: string, width: number, height: number/*, Format.UNKNOWN*/): void;
    updateDepthStencil (name: string, width: number, height: number, format: Format): void;
    updateDepthStencil (name: string, width: number, height: number/*, Format.UNKNOWN*/): void;
    updateStorageTexture (name: string, width: number, height: number, format: Format): void;
    updateStorageTexture (name: string, width: number, height: number/*, Format.UNKNOWN*/): void;
    updateShadingRateTexture (name: string, width: number, height: number): void;
    beginFrame (): void;
    endFrame (): void;
    addRasterPass (width: number, height: number, layoutName: string): RasterPassBuilder;
    addRasterPass (width: number, height: number/*, 'default'*/): RasterPassBuilder;
    addComputePass (layoutName: string): ComputePassBuilder;
    addMovePass (): MovePassBuilder;
    addCopyPass (): CopyPassBuilder;
    /**
     * @deprecated method will be removed in 3.8.0
     */
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
