/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

import { EDITOR } from 'internal:constants';
import { BufferInfo, Buffer, BufferUsageBit, ClearFlagBit, Color, DescriptorSet, LoadOp,
    Format, Rect, Sampler, StoreOp, Texture, Viewport, MemoryUsageBit, Filter, Address, DescriptorSetLayoutInfo, DescriptorSetLayoutBinding } from '../../gfx';
import { ProbeType, ReflectionProbe } from '../../render-scene/scene/reflection-probe';
import { Camera, SKYBOX_FLAG } from '../../render-scene/scene/camera';
import { CSMLevel, ShadowType, Shadows } from '../../render-scene/scene/shadows';
import { Light, LightType } from '../../render-scene/scene/light';
import { DirectionalLight } from '../../render-scene/scene/directional-light';
import { RangedDirectionalLight } from '../../render-scene/scene/ranged-directional-light';
import { PointLight } from '../../render-scene/scene/point-light';
import { SphereLight } from '../../render-scene/scene/sphere-light';
import { SpotLight } from '../../render-scene/scene/spot-light';
import { UBOForwardLight, supportsR32FloatTexture, supportsRGBA16HalfFloatTexture } from '../define';
import { BasicPipeline, Pipeline } from './pipeline';
import {
    AccessType, AttachmentType, CopyPair, LightInfo,
    QueueHint, ResourceResidency, SceneFlags, UpdateFrequency, UploadPair,
} from './types';
import { Vec2, Vec3, Vec4, macro, geometry, toRadian, cclegacy, assert, nextPow2 } from '../../core';
import { ImageAsset, Material, Texture2D } from '../../asset/assets';
import { getProfilerCamera, SRGBToLinear } from '../pipeline-funcs';
import { RenderWindow } from '../../render-scene/core/render-window';
import { RenderData, RenderGraph } from './render-graph';
import { WebComputePassBuilder, WebPipeline } from './web-pipeline';
import { DescriptorSetData, DescriptorSetLayoutData, LayoutGraph, LayoutGraphData } from './layout-graph';
import { AABB } from '../../core/geometry';
import { DebugViewCompositeType, DebugViewSingleType } from '../debug-view';
import { ReflectionProbeManager } from '../../3d/reflection-probe/reflection-probe-manager';

const _rangedDirLightBoundingBox = new AABB(0.0, 0.0, 0.0, 0.5, 0.5, 0.5);
const _tmpBoundingBox = new AABB();

// Anti-aliasing type, other types will be gradually added in the future
export enum AntiAliasing {
    NONE,
    FXAA,
    FXAAHQ,
}

export function getRTFormatBeforeToneMapping (ppl: BasicPipeline): Format {
    const useFloatOutput = ppl.getMacroBool('CC_USE_FLOAT_OUTPUT');
    return ppl.pipelineSceneData.isHDR && useFloatOutput && supportsRGBA16HalfFloatTexture(ppl.device) ? Format.RGBA16F : Format.RGBA8;
}
function forceEnableFloatOutput (ppl: BasicPipeline): void {
    if (ppl.pipelineSceneData.isHDR && !ppl.getMacroBool('CC_USE_FLOAT_OUTPUT')) {
        const supportFloatOutput = supportsRGBA16HalfFloatTexture(ppl.device);
        ppl.setMacroBool('CC_USE_FLOAT_OUTPUT', supportFloatOutput);
        macro.ENABLE_FLOAT_OUTPUT = supportFloatOutput;
    }
}

export function validPunctualLightsCulling (pipeline: BasicPipeline, camera: Camera): void {
    const sceneData = pipeline.pipelineSceneData;
    const validPunctualLights = sceneData.validPunctualLights;
    validPunctualLights.length = 0;
    const _sphere = geometry.Sphere.create(0, 0, 0, 1);
    const { spotLights } = camera.scene!;
    for (let i = 0; i < spotLights.length; i++) {
        const light = spotLights[i];
        if (light.baked && !camera.node.scene.globals.disableLightmap) {
            continue;
        }

        geometry.Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (geometry.intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }

    const { sphereLights } = camera.scene!;
    for (let i = 0; i < sphereLights.length; i++) {
        const light = sphereLights[i];
        if (light.baked && !camera.node.scene.globals.disableLightmap) {
            continue;
        }
        geometry.Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (geometry.intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }

    const { pointLights } = camera.scene!;
    for (let i = 0; i < pointLights.length; i++) {
        const light = pointLights[i];
        if (light.baked) {
            continue;
        }
        geometry.Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (geometry.intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }

    const { rangedDirLights } = camera.scene!;
    for (let i = 0; i < rangedDirLights.length; i++) {
        const light = rangedDirLights[i];
        AABB.transform(_tmpBoundingBox, _rangedDirLightBoundingBox, light.node!.getWorldMatrix());
        if (geometry.intersect.aabbFrustum(_tmpBoundingBox, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }
    // in jsb, std::vector is not synchronized, so we need to assign it manually
    sceneData.validPunctualLights = validPunctualLights;
}

const _cameras: Camera[] = [];

export function getCameraUniqueID (camera: Camera): number {
    if (!_cameras.includes(camera)) {
        _cameras.push(camera);
    }
    return _cameras.indexOf(camera);
}

export function getLoadOpOfClearFlag (clearFlag: ClearFlagBit, attachment: AttachmentType): LoadOp {
    let loadOp = LoadOp.CLEAR;
    if (!(clearFlag & ClearFlagBit.COLOR)
        && attachment === AttachmentType.RENDER_TARGET) {
        if (clearFlag & SKYBOX_FLAG) {
            loadOp = LoadOp.CLEAR;
        } else {
            loadOp = LoadOp.LOAD;
        }
    }
    if ((clearFlag & ClearFlagBit.DEPTH_STENCIL) !== ClearFlagBit.DEPTH_STENCIL
        && attachment === AttachmentType.DEPTH_STENCIL) {
        if (!(clearFlag & ClearFlagBit.DEPTH)) loadOp = LoadOp.LOAD;
        if (!(clearFlag & ClearFlagBit.STENCIL)) loadOp = LoadOp.LOAD;
    }
    return loadOp;
}

export function getRenderArea (
    camera: Camera,
    width: number,
    height: number,
    light: Light | null = null,
    level = 0,
    out: Rect | undefined = undefined,
): Rect {
    out = out || new Rect();
    const vp = camera ? camera.viewport : new Rect(0, 0, 1, 1);
    const w = width;
    const h = height;
    out.x = vp.x * w;
    out.y = vp.y * h;
    out.width = vp.width * w;
    out.height = vp.height * h;
    if (light) {
        switch (light.type) {
        case LightType.DIRECTIONAL: {
            const mainLight = light as DirectionalLight;
            if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1) {
                out.x = 0;
                out.y = 0;
                out.width = w;
                out.height = h;
            } else {
                const screenSpaceSignY = cclegacy.director.root.device.capabilities.screenSpaceSignY;
                out.x = level % 2 * 0.5 * w;
                if (screenSpaceSignY > 0) {
                    out.y = (1 - Math.floor(level / 2)) * 0.5 * h;
                } else {
                    out.y = Math.floor(level / 2) * 0.5 * h;
                }
                out.width = 0.5 * w;
                out.height = 0.5 * h;
            }
            break;
        }
        case LightType.SPOT: {
            out.x = 0;
            out.y = 0;
            out.width = w;
            out.height = h;
            break;
        }
        default:
        }
    }
    return out;
}

class FxaaData {
    declare fxaaMaterial: Material;
    private _updateFxaaPass (): void {
        if (!this.fxaaMaterial) return;

        const combinePass = this.fxaaMaterial.passes[0];
        combinePass.beginChangeStatesSilently();
        combinePass.tryCompile();
        combinePass.endChangeStatesSilently();
    }
    private _init (): void {
        if (this.fxaaMaterial) return;
        this.fxaaMaterial = new Material();
        this.fxaaMaterial._uuid = 'builtin-fxaa-material';
        this.fxaaMaterial.initialize({ effectName: 'pipeline/post-process/fxaa-hq' });
        for (let i = 0; i < this.fxaaMaterial.passes.length; ++i) {
            this.fxaaMaterial.passes[i].tryCompile();
        }
        this._updateFxaaPass();
    }
    constructor () {
        this._init();
    }
}

export function buildCopyPass (ppl: BasicPipeline, inOuts: CopyPair[]): void {
    ppl.addCopyPass(inOuts);
}

let fxaaData: FxaaData | null = null;
export function buildFxaaPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
): { rtName: string; dsName: string; } {
    if (!fxaaData) {
        fxaaData = new FxaaData();
    }
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    let width = camera.window.width;
    let height = camera.window.height;
    const area = getRenderArea(camera, width, height);
    width = area.width;
    height = area.height;
    // Start
    const clearColor = new Color(0, 0, 0, 1);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        clearColor.x = camera.clearColor.x;
        clearColor.y = camera.clearColor.y;
        clearColor.z = camera.clearColor.z;
    }
    clearColor.w = camera.clearColor.w;

    const fxaaPassRTName = `dsFxaaPassColor${cameraName}`;

    // ppl.updateRenderWindow(inputRT, camera.window);
    if (!ppl.containsResource(fxaaPassRTName)) {
        ppl.addRenderTarget(fxaaPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(fxaaPassRTName, width, height);
    const fxaaPassIdx = 0;
    const fxaaPass = ppl.addRenderPass(width, height, 'fxaa');
    fxaaPass.name = `CameraFxaaPass${cameraID}`;
    fxaaPass.setViewport(new Viewport(area.x, area.y, width, height));
    if (ppl.containsResource(inputRT)) {
        fxaaPass.addTexture(inputRT, 'sceneColorMap');
    }
    fxaaPass.addRenderTarget(fxaaPassRTName, LoadOp.CLEAR, StoreOp.STORE, clearColor);
    fxaaData.fxaaMaterial.setProperty('texSize', new Vec4(width, height, 1.0 / width, 1.0 / height), fxaaPassIdx);
    fxaaPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera,
        fxaaData.fxaaMaterial,
        fxaaPassIdx,
        SceneFlags.NONE,
    );
    return { rtName: fxaaPassRTName, dsName: inputDS };
}

export const MAX_BLOOM_FILTER_PASS_NUM = 6;
export const BLOOM_PREFILTERPASS_INDEX = 0;
export const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
export const BLOOM_UPSAMPLEPASS_INDEX = BLOOM_DOWNSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export const BLOOM_COMBINEPASS_INDEX = BLOOM_UPSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
class BloomData {
    declare bloomMaterial: Material;
    threshold = 0.1;
    iterations = 2;
    intensity = 0.8;
    private _updateBloomPass (): void {
        if (!this.bloomMaterial) return;

        const prefilterPass = this.bloomMaterial.passes[BLOOM_PREFILTERPASS_INDEX];
        prefilterPass.beginChangeStatesSilently();
        prefilterPass.tryCompile();
        prefilterPass.endChangeStatesSilently();

        for (let i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
            const downsamplePass = this.bloomMaterial.passes[BLOOM_DOWNSAMPLEPASS_INDEX + i];
            downsamplePass.beginChangeStatesSilently();
            downsamplePass.tryCompile();
            downsamplePass.endChangeStatesSilently();

            const upsamplePass = this.bloomMaterial.passes[BLOOM_UPSAMPLEPASS_INDEX + i];
            upsamplePass.beginChangeStatesSilently();
            upsamplePass.tryCompile();
            upsamplePass.endChangeStatesSilently();
        }

        const combinePass = this.bloomMaterial.passes[BLOOM_COMBINEPASS_INDEX];
        combinePass.beginChangeStatesSilently();
        combinePass.tryCompile();
        combinePass.endChangeStatesSilently();
    }
    private _init (): void {
        if (this.bloomMaterial) return;
        this.bloomMaterial = new Material();
        this.bloomMaterial._uuid = 'builtin-bloom-material';
        this.bloomMaterial.initialize({ effectName: 'pipeline/post-process/bloom' });
        for (let i = 0; i < this.bloomMaterial.passes.length; ++i) {
            this.bloomMaterial.passes[i].tryCompile();
        }
        this._updateBloomPass();
    }
    constructor () {
        this._init();
    }
}
let bloomData: BloomData | null = null;
export function buildBloomPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    threshold = 0.6,
    iterations = 2,
    intensity = 2.0,
): { rtName: string; dsName: string; } {
    if (!bloomData) {
        bloomData = new BloomData();
    }
    bloomData.threshold = threshold;
    bloomData.iterations = iterations;
    bloomData.intensity = intensity;
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    let width = camera.window.width;
    let height = camera.window.height;
    const area = getRenderArea(camera, width, height);
    width = area.width;
    height = area.height;
    // Start bloom
    const bloomClearColor = new Color(0, 0, 0, 1);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        bloomClearColor.x = camera.clearColor.x;
        bloomClearColor.y = camera.clearColor.y;
        bloomClearColor.z = camera.clearColor.z;
    }
    bloomClearColor.w = camera.clearColor.w;
    // ==== Bloom prefilter ===
    const bloomPassPrefilterRTName = `dsBloomPassPrefilterColor${cameraName}`;
    const bloomPassPrefilterDSName = `dsBloomPassPrefilterDS${cameraName}`;

    width >>= 1;
    height >>= 1;
    if (!ppl.containsResource(bloomPassPrefilterRTName)) {
        ppl.addRenderTarget(bloomPassPrefilterRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(bloomPassPrefilterDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(bloomPassPrefilterRTName, width, height);
    ppl.updateDepthStencil(bloomPassPrefilterDSName, width, height);
    const bloomPrefilterPass = ppl.addRenderPass(width, height, 'bloom-prefilter');
    bloomPrefilterPass.name = `CameraBloomPrefilterPass${cameraID}`;
    bloomPrefilterPass.setViewport(new Viewport(area.x, area.y, width, height));
    if (ppl.containsResource(inputRT)) {
        bloomPrefilterPass.addTexture(inputRT, 'outputResultMap');
    }
    bloomPrefilterPass.addRenderTarget(bloomPassPrefilterRTName, LoadOp.CLEAR, StoreOp.STORE, bloomClearColor);
    bloomData.bloomMaterial.setProperty('texSize', new Vec4(0, 0, bloomData.threshold, 0), 0);
    bloomPrefilterPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera,
        bloomData.bloomMaterial,
        0,
        SceneFlags.NONE,
    );
    // === Bloom downSampler ===
    for (let i = 0; i < bloomData.iterations; ++i) {
        const texSize = new Vec4(width, height, 0, 0);
        const bloomPassDownSampleRTName = `dsBloomPassDownSampleColor${cameraName}${i}`;
        const bloomPassDownSampleDSName = `dsBloomPassDownSampleDS${cameraName}${i}`;
        width >>= 1;
        height >>= 1;
        if (!ppl.containsResource(bloomPassDownSampleRTName)) {
            ppl.addRenderTarget(bloomPassDownSampleRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
            ppl.addDepthStencil(bloomPassDownSampleDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        ppl.updateRenderTarget(bloomPassDownSampleRTName, width, height);
        ppl.updateDepthStencil(bloomPassDownSampleDSName, width, height);
        const bloomDownSamplePass = ppl.addRenderPass(width, height, `bloom-downsample${i}`);
        bloomDownSamplePass.name = `CameraBloomDownSamplePass${cameraID}${i}`;
        bloomDownSamplePass.setViewport(new Viewport(area.x, area.y, width, height));
        if (i === 0) {
            bloomDownSamplePass.addTexture(bloomPassPrefilterRTName, 'bloomTexture');
        } else {
            bloomDownSamplePass.addTexture(`dsBloomPassDownSampleColor${cameraName}${i - 1}`, 'bloomTexture');
        }
        bloomDownSamplePass.addRenderTarget(bloomPassDownSampleRTName, LoadOp.CLEAR, StoreOp.STORE, bloomClearColor);
        bloomData.bloomMaterial.setProperty('texSize', texSize, BLOOM_DOWNSAMPLEPASS_INDEX + i);
        bloomDownSamplePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            camera,
            bloomData.bloomMaterial,
            BLOOM_DOWNSAMPLEPASS_INDEX + i,
            SceneFlags.NONE,
        );
    }
    // === Bloom upSampler ===
    for (let i = 0; i < bloomData.iterations; ++i) {
        const texSize = new Vec4(width, height, 0, 0);
        const bloomPassUpSampleRTName = `dsBloomPassUpSampleColor${cameraName}${bloomData.iterations - 1 - i}`;
        const bloomPassUpSampleDSName = `dsBloomPassUpSampleDS${cameraName}${bloomData.iterations - 1 - i}`;
        width <<= 1;
        height <<= 1;
        if (!ppl.containsResource(bloomPassUpSampleRTName)) {
            ppl.addRenderTarget(bloomPassUpSampleRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
            ppl.addDepthStencil(bloomPassUpSampleDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        ppl.updateRenderTarget(bloomPassUpSampleRTName, width, height);
        ppl.updateDepthStencil(bloomPassUpSampleDSName, width, height);
        const bloomUpSamplePass = ppl.addRenderPass(width, height, `bloom-upsample${i}`);
        bloomUpSamplePass.name = `CameraBloomUpSamplePass${cameraID}${bloomData.iterations - 1 - i}`;
        bloomUpSamplePass.setViewport(new Viewport(area.x, area.y, width, height));
        if (i === 0) {
            bloomUpSamplePass.addTexture(`dsBloomPassDownSampleColor${cameraName}${bloomData.iterations - 1}`, 'bloomTexture');
        } else {
            bloomUpSamplePass.addTexture(`dsBloomPassUpSampleColor${cameraName}${bloomData.iterations - i}`, 'bloomTexture');
        }
        bloomUpSamplePass.addRenderTarget(bloomPassUpSampleRTName, LoadOp.CLEAR, StoreOp.STORE, bloomClearColor);
        bloomData.bloomMaterial.setProperty('texSize', texSize, BLOOM_UPSAMPLEPASS_INDEX + i);
        bloomUpSamplePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            camera,
            bloomData.bloomMaterial,
            BLOOM_UPSAMPLEPASS_INDEX + i,
            SceneFlags.NONE,
        );
    }
    // === Bloom Combine Pass ===
    const bloomPassCombineRTName = `dsBloomPassCombineColor${cameraName}`;
    const bloomPassCombineDSName = `dsBloomPassCombineDS${cameraName}`;

    width = area.width;
    height = area.height;
    if (!ppl.containsResource(bloomPassCombineRTName)) {
        ppl.addRenderTarget(bloomPassCombineRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(bloomPassCombineDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(bloomPassCombineRTName, width, height);
    ppl.updateDepthStencil(bloomPassCombineDSName, width, height);
    const bloomCombinePass = ppl.addRenderPass(width, height, 'bloom-combine');
    bloomCombinePass.name = `CameraBloomCombinePass${cameraID}`;
    bloomCombinePass.setViewport(new Viewport(area.x, area.y, width, height));
    bloomCombinePass.addTexture(inputRT, 'outputResultMap');
    bloomCombinePass.addTexture(`dsBloomPassUpSampleColor${cameraName}${0}`, 'bloomTexture');
    bloomCombinePass.addRenderTarget(bloomPassCombineRTName, LoadOp.CLEAR, StoreOp.STORE, bloomClearColor);
    bloomData.bloomMaterial.setProperty('texSize', new Vec4(0, 0, 0, bloomData.intensity), BLOOM_COMBINEPASS_INDEX);
    bloomCombinePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera,
        bloomData.bloomMaterial,
        BLOOM_COMBINEPASS_INDEX,
        SceneFlags.NONE,
    );
    return { rtName: bloomPassCombineRTName, dsName: bloomPassCombineDSName };
}

export class PostInfo {
    declare postMaterial: Material;
    antiAliasing: AntiAliasing = AntiAliasing.NONE;
    private _init (): void {
        this.postMaterial = new Material();
        this.postMaterial.name = 'builtin-post-process-material';
        this.postMaterial.initialize({
            effectName: 'pipeline/post-process',
            defines: {
                // Anti-aliasing type, currently only fxaa, so 1 means fxaa
                ANTIALIAS_TYPE: this.antiAliasing,
            },
        });
        for (let i = 0; i < this.postMaterial.passes.length; ++i) {
            this.postMaterial.passes[i].tryCompile();
        }
    }
    constructor (antiAliasing: AntiAliasing = AntiAliasing.NONE) {
        this.antiAliasing = antiAliasing;
        this._init();
    }
}

let postInfo: PostInfo;

export function buildPostprocessPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputTex: string,
): { rtName: string; dsName: string; } {
    if (!postInfo) {
        postInfo = new PostInfo();
    }
    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const postprocessPassRTName = `postprocessPassRTName${cameraID}`;
    const postprocessPassDS = `postprocessPassDS${cameraID}`;
    if (!ppl.containsResource(postprocessPassRTName)) {
        ppl.addRenderWindow(postprocessPassRTName, Format.BGRA8, width, height, camera.window);
        ppl.addDepthStencil(postprocessPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderWindow(postprocessPassRTName, camera.window);
    ppl.updateDepthStencil(postprocessPassDS, width, height);
    const postprocessPass = ppl.addRenderPass(width, height, 'post-process');
    postprocessPass.name = `CameraPostprocessPass${cameraID}`;
    postprocessPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    if (ppl.containsResource(inputTex)) {
        postprocessPass.addTexture(inputTex, 'outputResultMap');
    }
    const postClearColor = new Color(0, 0, 0, camera.clearColor.w);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        postClearColor.x = camera.clearColor.x;
        postClearColor.y = camera.clearColor.y;
        postClearColor.z = camera.clearColor.z;
    }
    postprocessPass.addRenderTarget(
        postprocessPassRTName,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),

        StoreOp.STORE,

        postClearColor,
    );
    postprocessPass.addDepthStencil(
        postprocessPassDS,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,

        camera.clearDepth,

        camera.clearStencil,

        camera.clearFlag,
    );
    postprocessPass.addQueue(QueueHint.NONE).addFullscreenQuad(postInfo.postMaterial, 0, SceneFlags.NONE);
    if (getProfilerCamera() === camera) {
        postprocessPass.showStatistics = true;
    }
    return { rtName: postprocessPassRTName, dsName: postprocessPassDS };
}

export function buildForwardPass (
    camera: Camera,
    ppl: BasicPipeline,
    isOffScreen: boolean,
    enabledAlpha = true,
): { rtName: string; dsName: string; } {
    if (EDITOR) {
        ppl.setMacroInt('CC_PIPELINE_TYPE', 0);
    }
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const shadowInfo = buildShadowPasses(cameraName, camera, ppl);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const forwardPassRTName = `dsForwardPassColor${cameraName}`;
    const forwardPassDSName = `dsForwardPassDS${cameraName}`;
    if (!ppl.containsResource(forwardPassRTName)) {
        if (!isOffScreen) {
            ppl.addRenderWindow(forwardPassRTName, Format.BGRA8, width, height, camera.window);
        } else {
            ppl.addRenderTarget(forwardPassRTName, getRTFormatBeforeToneMapping(ppl), width, height, ResourceResidency.PERSISTENT);
        }
        ppl.addDepthStencil(forwardPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    if (!isOffScreen) {
        ppl.updateRenderWindow(forwardPassRTName, camera.window);
        ppl.updateDepthStencil(forwardPassDSName, width, height);
    } else {
        ppl.updateRenderTarget(forwardPassRTName, width, height);
        ppl.updateDepthStencil(forwardPassDSName, width, height);
    }
    const forwardPass = ppl.addRenderPass(width, height, 'default');
    forwardPass.name = `CameraForwardPass${cameraID}`;
    forwardPass.setViewport(new Viewport(area.x, area.y, width, height));
    for (const dirShadowName of shadowInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            forwardPass.addTexture(dirShadowName, 'cc_shadowMap');
        }
    }
    for (const spotShadowName of shadowInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            forwardPass.addTexture(spotShadowName, 'cc_spotShadowMap');
        }
    }
    forwardPass.addRenderTarget(
        forwardPassRTName,
        isOffScreen ? LoadOp.CLEAR : getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w),
    );
    forwardPass.addDepthStencil(
        forwardPassDSName,
        isOffScreen ? LoadOp.CLEAR : getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        // If the depth texture is used by subsequent passes, it must be set to store.
        isOffScreen ? StoreOp.DISCARD : StoreOp.STORE,
        camera.clearDepth,
        camera.clearStencil,
        camera.clearFlag,
    );
    forwardPass
        .addQueue(QueueHint.RENDER_OPAQUE)
        .addSceneOfCamera(
            camera,
            new LightInfo(),
            SceneFlags.OPAQUE_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.CUTOUT_OBJECT
             | SceneFlags.DEFAULT_LIGHTING | SceneFlags.DRAW_INSTANCING,
        );
    let sceneFlags = SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY;
    if (!isOffScreen) {
        sceneFlags |= SceneFlags.UI;
        forwardPass.showStatistics = true;
    }
    if (enabledAlpha) {
        forwardPass
            .addQueue(QueueHint.RENDER_TRANSPARENT)
            .addSceneOfCamera(camera, new LightInfo(), sceneFlags);
    }
    return { rtName: forwardPassRTName, dsName: forwardPassDSName };
}

let shadowPass;
export function buildShadowPass (
    passName: Readonly<string>,
    ppl: BasicPipeline,
    camera: Camera,
    light: Light,
    level: number,
    width: Readonly<number>,
    height: Readonly<number>,
): void {
    const fboW = width;
    const fboH = height;
    const area = getRenderArea(camera, width, height, light, level);
    width = area.width;
    height = area.height;
    const device = ppl.device;
    const shadowMapName = passName;
    if (!ppl.containsResource(shadowMapName)) {
        const format = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;
        ppl.addRenderTarget(shadowMapName, format, fboW, fboH, ResourceResidency.MANAGED);
        ppl.addDepthStencil(`${shadowMapName}Depth`, Format.DEPTH_STENCIL, fboW, fboH, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(shadowMapName, fboW, fboH);
    ppl.updateDepthStencil(`${shadowMapName}Depth`, fboW, fboH);
    if (!level) {
        shadowPass = ppl.addRenderPass(width, height, 'default');
        shadowPass.name = passName;
        shadowPass.setViewport(new Viewport(0, 0, fboW, fboH));
        shadowPass.addRenderTarget(shadowMapName, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, camera.clearColor.w));
        shadowPass.addDepthStencil(
            `${shadowMapName}Depth`,
            LoadOp.CLEAR,
            StoreOp.DISCARD,
            camera.clearDepth,
            camera.clearStencil,
            ClearFlagBit.DEPTH_STENCIL,
        );
    }
    const queue = shadowPass.addQueue(QueueHint.RENDER_OPAQUE, 'shadow-caster');
    queue.addScene(
        camera,
        SceneFlags.SHADOW_CASTER | SceneFlags.OPAQUE_OBJECT | SceneFlags.MASK,
    ).useLightFrustum(light, light.type !== LightType.DIRECTIONAL ? 0 : level);
    queue.setViewport(new Viewport(area.x, area.y, area.width, area.height));
}

export function buildReflectionProbePasss (
    camera: Camera,
    ppl: BasicPipeline,
): void {
    const reflectionProbeManager = cclegacy.internal.reflectionProbeManager as ReflectionProbeManager;
    if (!reflectionProbeManager) return;
    const probes = reflectionProbeManager.getProbes();
    if (probes.length === 0) return;
    for (let i = 0; i < probes.length; i++) {
        const probe = probes[i];
        if (probe.needRender) {
            if (probes[i].probeType === ProbeType.PLANAR) {
                buildReflectionProbePass(camera, ppl, probe, probe.realtimePlanarTexture!.window!, 0);
            } else if (EDITOR) {
                for (let faceIdx = 0; faceIdx < probe.bakedCubeTextures.length; faceIdx++) {
                    probe.updateCameraDir(faceIdx);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    buildReflectionProbePass(camera, ppl, probe, probe.bakedCubeTextures[faceIdx].window!, faceIdx);
                }
                probe.needRender = false;
            }
        }
    }
}

export function buildReflectionProbePass (
    camera: Camera,
    ppl: BasicPipeline,
    probe: ReflectionProbe,
    renderWindow: RenderWindow,
    faceIdx: number,
): void {
    const cameraName = `Camera${faceIdx}`;
    const area = probe.renderArea();
    const width = area.x;
    const height = area.y;
    const probeCamera = probe.camera;

    const probePassRTName = `reflectionProbePassColor${cameraName}`;
    const probePassDSName = `reflectionProbePassDS${cameraName}`;

    if (!ppl.containsResource(probePassRTName)) {
        ppl.addRenderWindow(probePassRTName, Format.RGBA8, width, height, renderWindow);
        ppl.addDepthStencil(probePassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.EXTERNAL);
    }
    ppl.updateRenderWindow(probePassRTName, renderWindow);
    ppl.updateDepthStencil(probePassDSName, width, height);

    const probePass = ppl.addRenderPass(width, height, 'default');
    probePass.name = `ReflectionProbePass${faceIdx}`;
    probePass.setViewport(new Viewport(0, 0, width, height));
    probePass.addRenderTarget(
        probePassRTName,
        getLoadOpOfClearFlag(probeCamera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        new Color(probeCamera.clearColor.x, probeCamera.clearColor.y, probeCamera.clearColor.z, probeCamera.clearColor.w),
    );
    probePass.addDepthStencil(
        probePassDSName,
        getLoadOpOfClearFlag(probeCamera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        probeCamera.clearDepth,
        probeCamera.clearStencil,
        probeCamera.clearFlag,
    );
    const passBuilder = probePass.addQueue(QueueHint.RENDER_OPAQUE, 'reflect-map');
    const lightInfo = new LightInfo();
    lightInfo.probe = probe;
    passBuilder.addSceneOfCamera(camera, lightInfo, SceneFlags.REFLECTION_PROBE | SceneFlags.OPAQUE_OBJECT);
    updateCameraUBO(passBuilder as unknown as any, probeCamera, ppl);
}

export class ShadowInfo {
    shadowEnabled = false;
    mainLightShadowNames = new Array<string>();
    spotLightShadowNames = new Array<string>();
    validLights: Light[] = [];
    reset (): void {
        this.shadowEnabled = false;
        this.mainLightShadowNames.length = 0;
        this.spotLightShadowNames.length = 0;
        this.validLights.length = 0;
    }
}

export function buildShadowPasses (cameraName: string, camera: Camera, ppl: BasicPipeline): ShadowInfo {
    validPunctualLightsCulling(ppl, camera);
    const pipeline = ppl;
    const shadow = pipeline.pipelineSceneData.shadows;
    const validPunctualLights = ppl.pipelineSceneData.validPunctualLights;
    shadowInfo.reset();
    const shadows = ppl.pipelineSceneData.shadows;
    if (!shadow.enabled || shadow.type !== ShadowType.ShadowMap) { return shadowInfo; }
    shadowInfo.shadowEnabled = true;
    let n = 0;
    let m = 0;
    for (;n < shadow.maxReceived && m < validPunctualLights.length;) {
        const light = validPunctualLights[m];
        if (light.type === LightType.SPOT) {
            const spotLight = light as SpotLight;
            if (spotLight.shadowEnabled) {
                shadowInfo.validLights.push(light);
                n++;
            }
        }
        m++;
    }

    const { mainLight } = camera.scene!;
    // build shadow map
    const mapWidth = shadows.size.x;
    const mapHeight = shadows.size.y;
    if (mainLight && mainLight.shadowEnabled) {
        shadowInfo.mainLightShadowNames[0] = `MainLightShadow${cameraName}`;
        if (mainLight.shadowFixedArea) {
            buildShadowPass(
                shadowInfo.mainLightShadowNames[0],
                ppl,
                camera,
                mainLight,
                0,
                mapWidth,
                mapHeight,
            );
        } else {
            const csmLevel = pipeline.pipelineSceneData.csmSupported ? mainLight.csmLevel : 1;
            shadowInfo.mainLightShadowNames[0] = `MainLightShadow${cameraName}`;
            for (let i = 0; i < csmLevel; i++) {
                buildShadowPass(
                    shadowInfo.mainLightShadowNames[0],
                    ppl,
                    camera,
                    mainLight,
                    i,
                    mapWidth,
                    mapHeight,
                );
            }
        }
    }

    for (let l = 0; l < shadowInfo.validLights.length; l++) {
        const light = shadowInfo.validLights[l];
        const passName = `SpotLightShadow${l.toString()}${cameraName}`;
        shadowInfo.spotLightShadowNames[l] = passName;
        buildShadowPass(
            passName,
            ppl,
            camera,
            light,
            0,
            mapWidth,
            mapHeight,
        );
    }
    return shadowInfo;
}
const shadowInfo = new ShadowInfo();

export class GBufferInfo {
    color!: string;
    normal!: string;
    emissive!: string;
    ds!: string;
}
// deferred passes
export function buildGBufferPass (
    camera: Camera,
    ppl: BasicPipeline,
): GBufferInfo {
    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const gBufferPassRTName = `gBufferPassColorCamera`;
    const gBufferPassNormal = `gBufferPassNormal`;
    const gBufferPassEmissive = `gBufferPassEmissive`;
    const gBufferPassDSName = `gBufferPassDSCamera`;
    if (!ppl.containsResource(gBufferPassRTName)) {
        const colFormat = Format.RGBA16F;
        ppl.addRenderTarget(gBufferPassRTName, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget(gBufferPassNormal, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget(gBufferPassEmissive, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(gBufferPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(gBufferPassRTName, width, height);
    ppl.updateRenderTarget(gBufferPassNormal, width, height);
    ppl.updateRenderTarget(gBufferPassEmissive, width, height);
    ppl.updateDepthStencil(gBufferPassDSName, width, height);
    // gbuffer pass
    const gBufferPass = ppl.addRenderPass(width, height, 'default');
    gBufferPass.name = `CameraGBufferPass${cameraID}`;
    gBufferPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    const rtColor = new Color(0, 0, 0, 0);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        if (ppl.pipelineSceneData.isHDR) {
            SRGBToLinear(rtColor, camera.clearColor);
        } else {
            rtColor.x = camera.clearColor.x;
            rtColor.y = camera.clearColor.y;
            rtColor.z = camera.clearColor.z;
        }
    }
    gBufferPass.addRenderTarget(gBufferPassRTName, LoadOp.CLEAR, StoreOp.STORE, rtColor);
    gBufferPass.addRenderTarget(gBufferPassNormal, LoadOp.CLEAR, StoreOp.STORE, new Color(0, 0, 0, 0));
    gBufferPass.addRenderTarget(gBufferPassEmissive, LoadOp.CLEAR, StoreOp.STORE, new Color(0, 0, 0, 0));
    gBufferPass.addDepthStencil(gBufferPassDSName, LoadOp.CLEAR, StoreOp.STORE, camera.clearDepth, camera.clearStencil, camera.clearFlag);
    gBufferPass
        .addQueue(QueueHint.RENDER_OPAQUE)
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
    const gBufferInfo = new GBufferInfo();
    gBufferInfo.color = gBufferPassRTName;
    gBufferInfo.normal = gBufferPassNormal;
    gBufferInfo.emissive = gBufferPassEmissive;
    gBufferInfo.ds = gBufferPassDSName;
    return gBufferInfo;
}

export class LightingInfo {
    declare deferredLightingMaterial: Material;
    public enableCluster: number;

    private _init (): void {
        this.deferredLightingMaterial = new Material();
        this.deferredLightingMaterial.name = 'builtin-deferred-material';
        this.deferredLightingMaterial.initialize({
            effectName: 'pipeline/deferred-lighting',
            defines: { CC_ENABLE_CLUSTERED_LIGHT_CULLING: this.enableCluster, CC_RECEIVE_SHADOW: 1 },
        });
        for (let i = 0; i < this.deferredLightingMaterial.passes.length; ++i) {
            this.deferredLightingMaterial.passes[i].tryCompile();
        }
    }
    constructor (clusterEn: boolean) {
        this.enableCluster = clusterEn ? 1 : 0;
        this._init();
    }
}

let lightingInfo: LightingInfo;

// deferred lighting pass
export function buildLightingPass (camera: Camera, ppl: BasicPipeline, gBuffer: GBufferInfo): { rtName: string } {
    if (!lightingInfo) {
        lightingInfo = new LightingInfo(false);
    }
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const deferredLightingPassRTName = `deferredLightingPassRTName`;
    if (!ppl.containsResource(deferredLightingPassRTName)) {
        ppl.addRenderTarget(deferredLightingPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(deferredLightingPassRTName, width, height);
    // lighting pass
    const lightingPass = ppl.addRenderPass(width, height, 'deferred-lighting');
    lightingPass.name = `CameraLightingPass${cameraID}`;
    lightingPass.setViewport(new Viewport(area.x, area.y, width, height));
    for (const dirShadowName of cameraInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            lightingPass.addTexture(dirShadowName, 'cc_shadowMap');
        }
    }
    for (const spotShadowName of cameraInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            lightingPass.addTexture(spotShadowName, 'cc_spotShadowMap');
        }
    }
    if (ppl.containsResource(gBuffer.color)) {
        lightingPass.addTexture(gBuffer.color, 'albedoMap');
        lightingPass.addTexture(gBuffer.normal, 'normalMap');
        lightingPass.addTexture(gBuffer.emissive, 'emissiveMap');
        lightingPass.addTexture(gBuffer.ds, 'depthStencil');
    }
    const lightingClearColor = new Color(0, 0, 0, 0);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        lightingClearColor.x = camera.clearColor.x;
        lightingClearColor.y = camera.clearColor.y;
        lightingClearColor.z = camera.clearColor.z;
    }
    lightingClearColor.w = 0;
    lightingPass.addRenderTarget(deferredLightingPassRTName, LoadOp.CLEAR, StoreOp.STORE, lightingClearColor);
    lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera,
        lightingInfo.deferredLightingMaterial,
        0,
        SceneFlags.VOLUMETRIC_LIGHTING,
    );
    // lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
    //     SceneFlags.TRANSPARENT_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.GEOMETRY);
    return { rtName: deferredLightingPassRTName };
}

function getClearFlags (attachment: AttachmentType, clearFlag: ClearFlagBit, loadOp: LoadOp): ClearFlagBit {
    switch (attachment) {
    case AttachmentType.DEPTH_STENCIL:
        if (loadOp === LoadOp.CLEAR) {
            if (clearFlag & ClearFlagBit.DEPTH_STENCIL) {
                return clearFlag;
            } else {
                return ClearFlagBit.DEPTH_STENCIL;
            }
        } else {
            return ClearFlagBit.NONE;
        }
    case AttachmentType.RENDER_TARGET:
    default:
        if (loadOp === LoadOp.CLEAR) {
            return ClearFlagBit.COLOR;
        } else {
            return ClearFlagBit.NONE;
        }
    }
}

export function buildUIPass (
    camera: Camera,
    ppl: BasicPipeline,
): void {
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const dsUIAndProfilerPassRTName = `dsUIAndProfilerPassColor${cameraName}`;
    const dsUIAndProfilerPassDSName = `dsUIAndProfilerPassDS${cameraName}`;
    if (!ppl.containsResource(dsUIAndProfilerPassRTName)) {
        ppl.addRenderWindow(dsUIAndProfilerPassRTName, Format.BGRA8, width, height, camera.window);
        ppl.addDepthStencil(dsUIAndProfilerPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderWindow(dsUIAndProfilerPassRTName, camera.window);
    ppl.updateDepthStencil(dsUIAndProfilerPassDSName, width, height);
    const uiAndProfilerPass = ppl.addRenderPass(width, height, 'default');
    uiAndProfilerPass.name = `CameraUIAndProfilerPass${cameraID}`;
    uiAndProfilerPass.setViewport(new Viewport(area.x, area.y, width, height));
    uiAndProfilerPass.addRenderTarget(
        dsUIAndProfilerPassRTName,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w),
    );
    uiAndProfilerPass.addDepthStencil(
        dsUIAndProfilerPassDSName,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        camera.clearDepth,

        camera.clearStencil,

        camera.clearFlag,
    );
    const sceneFlags = SceneFlags.UI;
    uiAndProfilerPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(), sceneFlags);
    if (getProfilerCamera() === camera) {
        uiAndProfilerPass.showStatistics = true;
    }
}

export function updateCameraUBO (setter: any, camera: Readonly<Camera>, ppl: Readonly<BasicPipeline>): void {
    const pipeline = cclegacy.director.root!.pipeline as WebPipeline;
    const sceneData = ppl.pipelineSceneData;
    const skybox = sceneData.skybox;
    setter.addConstant('CCCamera');
    setter.setMat4('cc_matView', camera.matView);
    setter.setMat4('cc_matViewInv', camera.node.worldMatrix);
    setter.setMat4('cc_matProj', camera.matProj);
    setter.setMat4('cc_matProjInv', camera.matProjInv);
    setter.setMat4('cc_matViewProj', camera.matViewProj);
    setter.setMat4('cc_matViewProjInv', camera.matViewProjInv);
    setter.setVec4('cc_cameraPos', new Vec4(camera.position.x, camera.position.y, camera.position.z, pipeline.getCombineSignY()));
    // eslint-disable-next-line max-len
    setter.setVec4('cc_surfaceTransform', new Vec4(camera.surfaceTransform, 0.0, Math.cos(toRadian(skybox.getRotationAngle())), Math.sin(toRadian(skybox.getRotationAngle()))));
    // eslint-disable-next-line max-len
    setter.setVec4('cc_screenScale', new Vec4(sceneData.shadingScale, sceneData.shadingScale, 1.0 / sceneData.shadingScale, 1.0 / sceneData.shadingScale));
    setter.setVec4('cc_exposure', new Vec4(camera.exposure, 1.0 / camera.exposure, sceneData.isHDR ? 1.0 : 0.0, 1.0 / Camera.standardExposureValue));
}

function bindDescValue (desc: DescriptorSet, binding: number, value): void {
    if (value instanceof Buffer) {
        desc.bindBuffer(binding, value);
    } else if (value instanceof Texture) {
        desc.bindTexture(binding, value);
    } else if (value instanceof Sampler) {
        desc.bindSampler(binding, value);
    }
}

function bindGlobalDesc (desc: DescriptorSet, binding: number, value): void {
    bindDescValue(desc, binding, value);
}

export function getDescBinding (descId, descData: DescriptorSetData): number {
    const layoutData = descData;
    // find descriptor binding
    for (const block of layoutData.descriptorSetLayoutData.descriptorBlocks) {
        for (let i = 0; i !== block.descriptors.length; ++i) {
            if (descId === block.descriptors[i].descriptorID) {
                return block.offset + i;
            }
        }
    }
    return -1;
}

export function getDescBindingFromName (bindingName: string): number {
    const pipeline = cclegacy.director.root.pipeline as WebPipeline;
    const layoutGraph = pipeline.layoutGraph;
    const vertIds = layoutGraph.vertices();
    const descId = layoutGraph.attributeIndex.get(bindingName);
    let currDesData: DescriptorSetData;
    for (const i of vertIds) {
        const layout = layoutGraph.getLayout(i);
        for (const [k, descData] of layout.descriptorSets) {
            const layoutData = descData.descriptorSetLayoutData;
            const blocks = layoutData.descriptorBlocks;
            for (const b of blocks) {
                for (const ds of b.descriptors) {
                    if (ds.descriptorID === descId) {
                        currDesData = descData;
                        return getDescBinding(descId, currDesData);
                    }
                }
            }
        }
    }
    return -1;
}

const uniformMap: Map<string, Float32Array> = new Map();
function applyGlobalDescBinding (data: RenderData, layout: string, isUpdate = false): void {
    const constants = data.constants;
    const samplers = data.samplers;
    const textures = data.textures;
    const buffers = data.buffers;
    const root = cclegacy.director.root;
    const device = root.device;
    const pipeline = root.pipeline as WebPipeline;
    const descriptorSetData = getDescriptorSetDataFromLayout(layout)!;
    const descriptorSet = descriptorSetData.descriptorSet!;
    for (const [key, value] of constants) {
        const bindId = getDescBinding(key, descriptorSetData);
        if (bindId === -1) { continue; }
        const uniformKey = `${layout}${bindId}`;
        let buffer = descriptorSet.getBuffer(bindId);
        let haveBuff = true;
        if (!buffer && !isUpdate) {
            buffer = device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                value.length * 4,
                value.length * 4,
            ));
            haveBuff = false;
        }
        if (isUpdate) {
            let currUniform = uniformMap.get(uniformKey);
            if (!currUniform) {
                uniformMap.set(uniformKey, new Float32Array(value));
                currUniform = uniformMap.get(uniformKey)!;
            }
            currUniform.set(value);
            buffer.update(currUniform);
        }
        if (!haveBuff) bindGlobalDesc(descriptorSet, bindId, buffer);
    }
    for (const [key, value] of textures) {
        const bindId = getDescBinding(key, descriptorSetData);
        if (bindId === -1) { continue; }
        const tex = descriptorSet.getTexture(bindId);
        if (!tex || (isUpdate && value !== pipeline.defaultTexture)
        // @ts-ignore
        || (!tex.gpuTexture && !(tex.gpuTextureView && tex.gpuTextureView.gpuTexture))) {
            bindGlobalDesc(descriptorSet, bindId, value);
        }
    }
    for (const [key, value] of samplers) {
        const bindId = getDescBinding(key, descriptorSetData);
        if (bindId === -1) { continue; }
        const sampler = descriptorSet.getSampler(bindId);
        if (!sampler || (isUpdate && value !== pipeline.defaultSampler)) {
            bindGlobalDesc(descriptorSet, bindId, value);
        }
    }
    for (const [key, value] of buffers) {
        const bindId = getDescBinding(key, descriptorSetData);
        if (bindId === -1) { continue; }
        const buffer = descriptorSet.getBuffer(bindId);
        if (!buffer || isUpdate) {
            bindGlobalDesc(descriptorSet, bindId, value);
        }
    }
}
const layouts: Map<string, DescriptorSetData> = new Map();
export function getDescriptorSetDataFromLayout (layoutName: string): DescriptorSetData | undefined {
    const descLayout = layouts.get(layoutName);
    if (descLayout) {
        return descLayout;
    }
    const webPip = cclegacy.director.root.pipeline as WebPipeline;
    const stageId = webPip.layoutGraph.locateChild(webPip.layoutGraph.nullVertex(), layoutName);
    assert(stageId !== 0xFFFFFFFF);
    const layout = webPip.layoutGraph.getLayout(stageId);
    const layoutData = layout.descriptorSets.get(UpdateFrequency.PER_PASS);
    layouts.set(layoutName, layoutData!);
    return layoutData;
}

export function getDescriptorSetDataFromLayoutId (id: number): DescriptorSetData | undefined {
    const webPip = cclegacy.director.root.pipeline as WebPipeline;
    const layout = webPip.layoutGraph.getLayout(id);
    const layoutData = layout.descriptorSets.get(UpdateFrequency.PER_PASS);
    return layoutData;
}

export function initGlobalDescBinding (data: RenderData, layoutName = 'default'): void {
    applyGlobalDescBinding(data, layoutName);
}

export function updateGlobalDescBinding (data: RenderData, layoutName = 'default'): void {
    applyGlobalDescBinding(data, layoutName, true);
}

export function mergeSrcToTargetDesc (fromDesc, toDesc, isForce = false): number[] {
    fromDesc.update();
    const fromGpuDesc = fromDesc.gpuDescriptorSet;
    const toGpuDesc = toDesc.gpuDescriptorSet;
    const extResId: number[] = [];
    if (isForce) {
        toGpuDesc.gpuDescriptors = fromGpuDesc.gpuDescriptors;
        toGpuDesc.descriptorIndices = fromGpuDesc.descriptorIndices;
        return extResId;
    }
    for (let i = 0; i < toGpuDesc.gpuDescriptors.length; i++) {
        const fromRes = fromGpuDesc.gpuDescriptors[i];
        if (!fromRes) continue;
        const currRes = toGpuDesc.gpuDescriptors[i];
        if (!currRes.gpuBuffer && fromRes.gpuBuffer) {
            currRes.gpuBuffer = fromRes.gpuBuffer;
            extResId.push(i);
        } else if ('gpuTextureView' in currRes && !currRes.gpuTextureView) {
            currRes.gpuTextureView = fromRes.gpuTextureView;
            currRes.gpuSampler = fromRes.gpuSampler;
            extResId.push(i);
        } else if ('gpuTexture' in currRes && !currRes.gpuTexture) {
            currRes.gpuTexture = fromRes.gpuTexture;
            currRes.gpuSampler = fromRes.gpuSampler;
            extResId.push(i);
        }
    }
    return extResId;
}

const _varianceArray: number[] = [0.0484, 0.187, 0.567, 1.99, 7.41];
const _strengthParameterArray: number[] = [0.100, 0.118, 0.113, 0.358, 0.078];
const _vec3Temp: Vec3 = new Vec3();
const _vec3Temp2: Vec3 = new Vec3();
const _vec4Temp: Vec4 = new Vec4();
const _vec4Temp2: Vec4 = new Vec4();

export const COPY_INPUT_DS_PASS_INDEX = 0;
export const SSSS_BLUR_X_PASS_INDEX = 1;
export const SSSS_BLUR_Y_PASS_INDEX = 2;
export const EXPONENT = 2.0;
export const I_SAMPLES_COUNT = 25;
class SSSSBlurData {
    declare ssssBlurMaterial: Material;
    ssssFov = 45.0 / 57.3;
    ssssWidth = 0.01;
    boundingBox = 0.4;
    ssssScale = 3.0;

    get ssssStrength (): Vec3 {
        return this._v3SSSSStrength;
    }
    set ssssStrength (val: Vec3) {
        this._v3SSSSStrength = val;
        this._updateSampleCount();
    }

    get ssssFallOff (): Vec3 {
        return this._v3SSSSFallOff;
    }
    set ssssFallOff (val: Vec3) {
        this._v3SSSSFallOff = val;
        this._updateSampleCount();
    }

    get kernel (): Vec4[] {
        return this._kernel;
    }

    private _v3SSSSStrength = new Vec3(0.48, 0.41, 0.28);
    private _v3SSSSFallOff = new Vec3(1.0, 0.37, 0.3);
    private _kernel: Vec4[] = [];

    /**
     * We use a falloff to modulate the shape of the profile. Big falloffs
     * spreads the shape making it wider, while small falloffs make it
     * narrower.
     */
    private _gaussian (out: Vec3, variance: number, r: number): void {
        const xx = r / (0.001 + this._v3SSSSFallOff.x);
        out.x = Math.exp((-(xx * xx)) / (2.0 * variance)) / (2.0 * 3.14 * variance);
        const yy = r / (0.001 + this._v3SSSSFallOff.y);
        out.y = Math.exp((-(yy * yy)) / (2.0 * variance)) / (2.0 * 3.14 * variance);
        const zz = r / (0.001 + this._v3SSSSFallOff.z);
        out.z = Math.exp((-(zz * zz)) / (2.0 * variance)) / (2.0 * 3.14 * variance);
    }

    /**
     * We used the red channel of the original skin profile defined in
     * [d'Eon07] for all three channels. We noticed it can be used for green
     * and blue channels (scaled using the falloff parameter) without
     * introducing noticeable differences and allowing for total control over
     * the profile. For example, it allows to create blue SSS gradients, which
     * could be useful in case of rendering blue creatures.
     */
    private _profile (out: Vec3, val: number): void {
        for (let i = 0; i < 5; i++) {
            this._gaussian(_vec3Temp2, _varianceArray[i], val);
            _vec3Temp2.multiplyScalar(_strengthParameterArray[i]);
            out.add(_vec3Temp2);
        }
    }

    private _updateSampleCount (): void {
        const strength = this._v3SSSSStrength;
        const nSamples = I_SAMPLES_COUNT;
        const range = nSamples > 20 ? 3.0 : 2.0;

        // Calculate the offsets:
        const step = 2.0 * range / (nSamples - 1);
        for (let i = 0; i < nSamples; i++) {
            const o = -range + i * step;
            const sign = o < 0.0 ? -1.0 : 1.0;
            // eslint-disable-next-line no-restricted-properties
            this._kernel[i].w = range * sign * Math.abs(o ** EXPONENT) / range ** EXPONENT;
        }

        // Calculate the weights:
        for (let i = 0; i < nSamples; i++) {
            const w0 = i > 0 ? Math.abs(this._kernel[i].w - this._kernel[i - 1].w) : 0.0;
            const w1 = i < nSamples - 1 ? Math.abs(this._kernel[i].w - this._kernel[i + 1].w) : 0.0;
            const area = (w0 + w1) / 2.0;
            _vec3Temp.set(0);
            this._profile(_vec3Temp, this._kernel[i].w);
            _vec3Temp.multiplyScalar(area);
            this._kernel[i].x = _vec3Temp.x;
            this._kernel[i].y = _vec3Temp.y;
            this._kernel[i].z = _vec3Temp.z;
        }

        // We want the offset 0.0 to come first:
        const remainder = nSamples % 2;
        _vec4Temp.set(this._kernel[(nSamples - remainder) / 2]);
        for (let i = (nSamples - remainder) / 2; i > 0; i--) {
            _vec4Temp2.set(this._kernel[i - 1]);
            this._kernel[i].set(_vec4Temp2);
        }
        this._kernel[0].set(_vec4Temp);

        // Calculate the sum of the weights, we will need to normalize them below:
        _vec3Temp.set(0.0);
        for (let i = 0; i < nSamples; i++) {
            _vec3Temp.add3f(this._kernel[i].x, this._kernel[i].y, this._kernel[i].z);
        }
        // Normalize the weights:
        for (let i = 0; i < nSamples; i++) {
            this._kernel[i].x /= _vec3Temp.x;
            this._kernel[i].y /= _vec3Temp.y;
            this._kernel[i].z /= _vec3Temp.z;
        }

        // Tweak them using the desired strength. The first one is:
        // lerp(1.0, kernel[0].rgb, strength)
        this._kernel[0].x = (1.0 - strength.x) * 1.0 + strength.x * this._kernel[0].x;
        this._kernel[0].y = (1.0 - strength.y) * 1.0 + strength.y * this._kernel[0].y;
        this._kernel[0].z = (1.0 - strength.z) * 1.0 + strength.z * this._kernel[0].z;

        // The others:
        // lerp(0.0, kernel[0].rgb, strength)
        for (let i = 1; i < nSamples; i++) {
            this._kernel[i].x *= strength.x;
            this._kernel[i].y *= strength.y;
            this._kernel[i].z *= strength.z;
        }
    }

    private _updateBlurPass (): void {
        if (!this.ssssBlurMaterial) return;

        const copyInputDSPass = this.ssssBlurMaterial.passes[COPY_INPUT_DS_PASS_INDEX];
        copyInputDSPass.beginChangeStatesSilently();
        copyInputDSPass.tryCompile();
        copyInputDSPass.endChangeStatesSilently();
        const ssssBlurXPass = this.ssssBlurMaterial.passes[SSSS_BLUR_X_PASS_INDEX];
        ssssBlurXPass.beginChangeStatesSilently();
        ssssBlurXPass.tryCompile();
        ssssBlurXPass.endChangeStatesSilently();
        const ssssBlurYPass = this.ssssBlurMaterial.passes[SSSS_BLUR_Y_PASS_INDEX];
        ssssBlurYPass.beginChangeStatesSilently();
        ssssBlurYPass.tryCompile();
        ssssBlurYPass.endChangeStatesSilently();
    }

    private _init (): void {
        if (this.ssssBlurMaterial) return;

        this.ssssBlurMaterial = new Material();
        this.ssssBlurMaterial._uuid = 'builtin-ssssBlur-material';
        this.ssssBlurMaterial.initialize({ effectName: 'pipeline/ssss-blur' });
        for (let i = 0; i < this.ssssBlurMaterial.passes.length; ++i) {
            this.ssssBlurMaterial.passes[i].tryCompile();
        }
        this._updateBlurPass();

        for (let i = 0; i < I_SAMPLES_COUNT; i++) {
            this._kernel[i] = new Vec4();
        }
        this._updateSampleCount();
    }

    constructor () {
        this._init();
    }
}

let ssssBlurData: SSSSBlurData | null = null;
export function hasSkinObject (ppl: BasicPipeline): boolean {
    const sceneData = ppl.pipelineSceneData;
    return sceneData.skin.enabled && sceneData.standardSkinModel !== null;
}

function _buildSSSSBlurPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
): { rtName: string; dsName: string; } {
    const sceneData = ppl.pipelineSceneData;
    const skin = sceneData.skin;
    const standardSkinModel = sceneData.standardSkinModel;
    if (!skin.enabled && standardSkinModel) return { rtName: inputRT, dsName: inputDS };

    if (!ssssBlurData) ssssBlurData = new SSSSBlurData();
    ssssBlurData.ssssFov = camera.fov;
    ssssBlurData.ssssWidth = skin.blurRadius;
    if (standardSkinModel && standardSkinModel.worldBounds) {
        const halfExtents = standardSkinModel.worldBounds.halfExtents;
        ssssBlurData.boundingBox = Math.min(halfExtents.x, halfExtents.y, halfExtents.z) * 2.0;
    }
    ssssBlurData.ssssScale = skin.sssIntensity;

    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const webPipeline = (ppl as WebPipeline);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    // Start blur
    const ssssBlurClearColor = new Color(0, 0, 0, 1);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        ssssBlurClearColor.x = camera.clearColor.x;
        ssssBlurClearColor.y = camera.clearColor.y;
        ssssBlurClearColor.z = camera.clearColor.z;
    }
    ssssBlurClearColor.w = camera.clearColor.w;

    const ssssBlurRTName = `dsSSSSBlurColor${cameraName}`;
    const ssssBlurDSName = `dsSSSSBlurDSColor${cameraName}`;
    if (!ppl.containsResource(ssssBlurRTName)) {
        ppl.addRenderTarget(ssssBlurRTName, getRTFormatBeforeToneMapping(ppl), width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget(ssssBlurDSName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(ssssBlurRTName, width, height);
    ppl.updateRenderTarget(ssssBlurDSName, width, height);

    // ==== Copy input DS ===
    const copyInputDSPass = ppl.addRenderPass(width, height, 'copy-pass');
    copyInputDSPass.name = `CameraCopyDSPass${cameraID}`;
    copyInputDSPass.setViewport(new Viewport(area.x, area.y, width, height));
    if (ppl.containsResource(inputDS)) {
        const verId = webPipeline.resourceGraph.vertex(inputDS);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = Filter.POINT;
        sampler.magFilter = Filter.POINT;
        sampler.mipFilter = Filter.NONE;
        copyInputDSPass.addTexture(inputDS, 'depthRaw');
    }
    copyInputDSPass.addRenderTarget(
        ssssBlurDSName,
        LoadOp.CLEAR,

        StoreOp.STORE,

        new Color(1.0, 0.0, 0.0, 0.0),
    );
    copyInputDSPass.addQueue(QueueHint.RENDER_OPAQUE | QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera,
        ssssBlurData.ssssBlurMaterial,
        COPY_INPUT_DS_PASS_INDEX,
        SceneFlags.NONE,
    );

    // ==== SSSS Blur X Pass ===
    const ssssblurXPass = ppl.addRenderPass(width, height, 'ssss-blurX');
    ssssblurXPass.name = `CameraSSSSBlurXPass${cameraID}`;
    ssssblurXPass.setViewport(new Viewport(area.x, area.y, width, height));
    if (ppl.containsResource(inputRT)) {
        const verId = webPipeline.resourceGraph.vertex(inputRT);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = Filter.POINT;
        sampler.magFilter = Filter.POINT;
        sampler.mipFilter = Filter.NONE;
        ssssblurXPass.addTexture(inputRT, 'colorTex');
    }
    if (ppl.containsResource(ssssBlurDSName)) {
        const verId = webPipeline.resourceGraph.vertex(ssssBlurDSName);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = Filter.POINT;
        sampler.magFilter = Filter.POINT;
        sampler.mipFilter = Filter.NONE;
        ssssblurXPass.addTexture(ssssBlurDSName, 'depthTex');
    }
    ssssblurXPass.addRenderTarget(ssssBlurRTName, LoadOp.CLEAR, StoreOp.STORE, ssssBlurClearColor);
    ssssblurXPass.addDepthStencil(
        inputDS,
        LoadOp.LOAD,
        StoreOp.STORE,
        camera.clearDepth,
        camera.clearStencil,
        camera.clearFlag,
    );
    ssssBlurData.ssssBlurMaterial.setProperty('blurInfo', new Vec4(
        ssssBlurData.ssssFov,
        ssssBlurData.ssssWidth,
        ssssBlurData.boundingBox,
        ssssBlurData.ssssScale,
    ), SSSS_BLUR_X_PASS_INDEX);
    ssssBlurData.ssssBlurMaterial.setProperty('kernel', ssssBlurData.kernel, SSSS_BLUR_X_PASS_INDEX);
    ssssblurXPass.addQueue(QueueHint.RENDER_OPAQUE | QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera,
        ssssBlurData.ssssBlurMaterial,
        SSSS_BLUR_X_PASS_INDEX,
        SceneFlags.NONE,
    );

    // === SSSS Blur Y Pass ===
    const ssssblurYPass = ppl.addRenderPass(width, height, 'ssss-blurY');
    ssssblurYPass.name = `CameraSSSSBlurYPass${cameraID}`;
    ssssblurYPass.setViewport(new Viewport(area.x, area.y, width, height));
    if (ppl.containsResource(ssssBlurRTName)) {
        const verId = webPipeline.resourceGraph.vertex(ssssBlurRTName);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = Filter.POINT;
        sampler.magFilter = Filter.POINT;
        sampler.mipFilter = Filter.NONE;
        ssssblurYPass.addTexture(ssssBlurRTName, 'colorTex');
    }
    if (ppl.containsResource(ssssBlurDSName)) {
        const verId = webPipeline.resourceGraph.vertex(ssssBlurDSName);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = Filter.POINT;
        sampler.magFilter = Filter.POINT;
        sampler.mipFilter = Filter.NONE;
        ssssblurYPass.addTexture(ssssBlurDSName, 'depthTex');
    }
    ssssblurYPass.addRenderTarget(inputRT, LoadOp.LOAD, StoreOp.STORE, ssssBlurClearColor);
    ssssblurYPass.addDepthStencil(
        inputDS,
        LoadOp.LOAD,
        StoreOp.STORE,
        camera.clearDepth,
        camera.clearStencil,
        camera.clearFlag,
    );
    ssssBlurData.ssssBlurMaterial.setProperty('blurInfo', new Vec4(
        ssssBlurData.ssssFov,
        ssssBlurData.ssssWidth,
        ssssBlurData.boundingBox,
        ssssBlurData.ssssScale,
    ), SSSS_BLUR_Y_PASS_INDEX);
    ssssBlurData.ssssBlurMaterial.setProperty('kernel', ssssBlurData.kernel, SSSS_BLUR_Y_PASS_INDEX);
    ssssblurYPass.addQueue(QueueHint.RENDER_OPAQUE | QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera,
        ssssBlurData.ssssBlurMaterial,
        SSSS_BLUR_Y_PASS_INDEX,
        SceneFlags.NONE,
    );
    return { rtName: inputRT, dsName: inputDS };
}

class ToneMappingInfo {
    declare toneMappingMaterial: Material;
    private _init (): void {
        this.toneMappingMaterial = new Material();
        this.toneMappingMaterial.name = 'builtin-tone-mapping-material';
        this.toneMappingMaterial.initialize({
            effectName: 'pipeline/tone-mapping',
        });
        for (let i = 0; i < this.toneMappingMaterial.passes.length; ++i) {
            this.toneMappingMaterial.passes[i].tryCompile();
        }
    }
    constructor () {
        this._init();
    }
}

let toneMappingInfo: ToneMappingInfo | null = null;
export function buildToneMappingPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
): { rtName: string; dsName: string; } {
    if (!ppl.pipelineSceneData.isHDR || !ppl.getMacroBool('CC_USE_FLOAT_OUTPUT')) return { rtName: inputRT, dsName: inputDS };
    if (!toneMappingInfo) {
        toneMappingInfo = new ToneMappingInfo();
    }

    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const toneMappingClearColor = new Color(0, 0, 0, camera.clearColor.w);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        toneMappingClearColor.x = camera.clearColor.x;
        toneMappingClearColor.y = camera.clearColor.y;
        toneMappingClearColor.z = camera.clearColor.z;
    }

    const toneMappingPassRTName = `toneMappingPassRTName${cameraID}`;
    const toneMappingPassDS = `toneMappingPassDS${cameraID}`;
    if (!ppl.containsResource(toneMappingPassRTName)) {
        ppl.addRenderTarget(toneMappingPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(toneMappingPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(toneMappingPassRTName, width, height);
    ppl.updateDepthStencil(toneMappingPassDS, width, height);
    const toneMappingPass = ppl.addRenderPass(width, height, 'tone-mapping');
    toneMappingPass.name = `CameraToneMappingPass${cameraID}`;
    toneMappingPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    if (ppl.containsResource(inputRT)) {
        toneMappingPass.addTexture(inputRT, 'u_texSampler');
    }
    toneMappingPass.addRenderTarget(
        toneMappingPassRTName,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,

        toneMappingClearColor,
    );
    toneMappingPass.addDepthStencil(
        toneMappingPassDS,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        camera.clearDepth,

        camera.clearStencil,

        camera.clearFlag,
    );
    toneMappingPass.addQueue(QueueHint.NONE).addFullscreenQuad(toneMappingInfo.toneMappingMaterial, 0, SceneFlags.NONE);
    toneMappingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(
        camera,
        new LightInfo(),
        SceneFlags.UI,
    );
    if (getProfilerCamera() === camera) {
        toneMappingPass.showStatistics = true;
    }
    return { rtName: toneMappingPassRTName, dsName: toneMappingPassDS };
}

export function buildTransparencyPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
    hasDeferredTransparencyObject: boolean,
): { rtName: string; dsName: string; } {
    if (hasDeferredTransparencyObject) return { rtName: inputRT, dsName: inputDS };

    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const alphaPass = ppl.addRenderPass(width, height, 'default');
    alphaPass.name = `CameraAlphaPass${cameraID}`;
    alphaPass.setViewport(new Viewport(area.x, area.y, width, height));
    for (const dirShadowName of cameraInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            alphaPass.addTexture(dirShadowName, 'cc_shadowMap');
        }
    }
    for (const spotShadowName of cameraInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            alphaPass.addTexture(spotShadowName, 'cc_spotShadowMap');
        }
    }
    alphaPass.addRenderTarget(
        inputRT,
        LoadOp.LOAD,

        StoreOp.STORE,
        new Color(camera.clearDepth, camera.clearStencil, 0, 0),
    );
    alphaPass.addDepthStencil(
        inputDS,
        LoadOp.LOAD,

        StoreOp.STORE,
        camera.clearDepth,

        camera.clearStencil,

        camera.clearFlag,
    );
    alphaPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY);
    return { rtName: inputRT, dsName: inputDS };
}

function _buildSpecularPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
): { rtName: string; dsName: string; } {
    if (EDITOR) {
        ppl.setMacroInt('CC_PIPELINE_TYPE', 0);
    }
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const specalurPass = ppl.addRenderPass(width, height, 'specular-pass');
    specalurPass.name = `CameraSpecalurPass${cameraID}`;
    specalurPass.setViewport(new Viewport(area.x, area.y, width, height));
    for (const dirShadowName of cameraInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            specalurPass.addTexture(dirShadowName, 'cc_shadowMap');
        }
    }
    for (const spotShadowName of cameraInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            specalurPass.addTexture(spotShadowName, 'cc_spotShadowMap');
        }
    }
    specalurPass.addRenderTarget(
        inputRT,
        LoadOp.LOAD,

        StoreOp.STORE,
        new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w),
    );
    specalurPass.addDepthStencil(
        inputDS,
        LoadOp.LOAD,

        StoreOp.STORE,
        camera.clearDepth,

        camera.clearStencil,

        camera.clearFlag,
    );
    specalurPass
        .addQueue(QueueHint.RENDER_OPAQUE, 'default')
        .addSceneOfCamera(
            camera,
            new LightInfo(),
            SceneFlags.TRANSPARENT_OBJECT | SceneFlags.DEFAULT_LIGHTING | SceneFlags.PLANAR_SHADOW
            | SceneFlags.CUTOUT_OBJECT | SceneFlags.DRAW_INSTANCING | SceneFlags.GEOMETRY,
        );
    specalurPass
        .addQueue(QueueHint.RENDER_TRANSPARENT, 'forward-add')
        .addSceneOfCamera(
            camera,
            new LightInfo(),
            SceneFlags.TRANSPARENT_OBJECT | SceneFlags.DEFAULT_LIGHTING | SceneFlags.PLANAR_SHADOW
            | SceneFlags.CUTOUT_OBJECT | SceneFlags.DRAW_INSTANCING | SceneFlags.GEOMETRY,
        );
    return { rtName: inputRT, dsName: inputDS };
}

export function buildSSSSPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
): { rtName: string; dsName: string; } {
    if (hasSkinObject(ppl)) {
        forceEnableFloatOutput(ppl);
        const blurInfo = _buildSSSSBlurPass(camera, ppl, inputRT, inputDS);
        const specularInfo = _buildSpecularPass(camera, ppl, blurInfo.rtName, blurInfo.dsName);
        return { rtName: specularInfo.rtName, dsName: specularInfo.dsName };
    } else {
        const specularInfo = _buildSpecularPass(camera, ppl, inputRT, inputDS);
        return { rtName: specularInfo.rtName, dsName: specularInfo.dsName };
    }
}

class HBAOParams {
    declare hbaoMaterial: Material;
    declare randomTexture: Texture2D;

    get uvDepthToEyePosParams (): Vec4 {
        return this._uvDepthToEyePosParams;
    }

    get radiusParam (): Vec4 {
        return this._radiusParam;
    }

    get miscParam (): Vec4 {
        return this._miscParam;
    }

    get blurParam (): Vec4 {
        return this._blurParam;
    }

    set depthTexFullResolution (val: Vec2) {
        this._depthTexFullResolution.set(val);
    }

    set depthTexResolution (val: Vec2) {
        this._depthTexResolution.set(val);
    }

    set sceneScale (val: number) {
        this._sceneScale = val;
    }

    set cameraFov (val: number) {
        this._cameraFov = val;
    }

    set radiusScale (val: number) {
        this._radiusScale = val;
    }

    set angleBiasDegree (val: number) {
        this._angleBiasDegree = val;
    }

    set aoStrength (val: number) {
        this._aoStrength = val;
    }

    set blurSharpness (val: number) {
        this._blurSharpness = val;
    }

    set aoSaturation (val: number) {
        this._aoSaturation = val;
    }

    private _uvDepthToEyePosParams = new Vec4();
    private _radiusParam = new Vec4();
    private _miscParam = new Vec4();
    private _blurParam = new Vec4();

    private _depthTexFullResolution = new Vec2(1024);
    private _depthTexResolution = new Vec2(1024);
    private _sceneScale = 1.0;
    private _cameraFov = toRadian(45.0);
    private _radiusScale = 1.0;
    private _angleBiasDegree = 10.0;
    private _aoStrength = 1.0;
    private _blurSharpness = 8;
    private _aoSaturation = 1.0;

    private _randomDirAndJitter: number[] = [
        238, 91, 87, 255, 251, 44, 119, 255, 247, 64, 250, 255, 232, 5, 225, 255,
        253, 177, 140, 255, 250, 51, 84, 255, 243, 76, 97, 255, 252, 36, 232, 255,
        235, 100, 24, 255, 252, 36, 158, 255, 254, 20, 142, 255, 245, 135, 124, 255,
        251, 43, 121, 255, 253, 31, 145, 255, 235, 98, 160, 255, 240, 146, 198, 255,
    ];
    private _init (): void {
        if (this.hbaoMaterial) return;
        this.hbaoMaterial = new Material();
        this.hbaoMaterial.name = 'builtin-hbao-material';
        this.hbaoMaterial.initialize({ effectName: 'pipeline/post-process/hbao' });
        for (let i = 0; i < this.hbaoMaterial.passes.length; ++i) {
            this.hbaoMaterial.passes[i].tryCompile();
        }

        const width = 4;
        const height = 4;
        const pixelFormat = Texture2D.PixelFormat.RGBA8888;
        const arrayBuffer = new Uint8Array(width * height * 4);
        for (let i = 0; i < this._randomDirAndJitter.length; i++) {
            arrayBuffer[i] = this._randomDirAndJitter[i];
        }
        const image = new ImageAsset({
            width,
            height,
            _data: arrayBuffer,
            _compressed: false,
            format: pixelFormat,
        });
        this.randomTexture = new Texture2D();
        this.randomTexture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        this.randomTexture.setMipFilter(Texture2D.Filter.NONE);
        this.randomTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        this.randomTexture.image = image;
        this.hbaoMaterial.setProperty('RandomTex', this.randomTexture, 0);
    }

    public update (): void {
        // should be same value as shader
        const HALF_KERNEL_RADIUS = 4;
        const INV_LN2 = 1.44269504;
        const SQRT_LN2 = 0.8325546;

        const gR = this._radiusScale * this._sceneScale;
        const gR2 = gR * gR;
        const gNegInvR2 = -1.0 / gR2;
        const gMaxRadiusPixels = 0.1 * Math.min(this._depthTexFullResolution.x, this._depthTexFullResolution.y);
        this._radiusParam.set(gR, gR2, gNegInvR2, gMaxRadiusPixels);

        const vec2 = new Vec2(this._depthTexResolution.y / this._depthTexResolution.x, 1.0);
        const gFocalLen = new Vec2(vec2.x / Math.tan(this._cameraFov * 0.5), vec2.y / Math.tan(this._cameraFov * 0.5));
        const gTanAngleBias = Math.tan(toRadian(this._angleBiasDegree));
        const gStrength = this._aoStrength;
        this._miscParam.set(gFocalLen.x, gFocalLen.y, gTanAngleBias, gStrength);

        const gUVToViewA = new Vec2(2.0 / gFocalLen.x, -2.0 / gFocalLen.y);
        const gUVToViewB = new Vec2(-1.0 / gFocalLen.x, 1.0 / gFocalLen.y);
        this._uvDepthToEyePosParams.set(gUVToViewA.x, gUVToViewA.y, gUVToViewB.x, gUVToViewB.y);

        const BlurSigma = (HALF_KERNEL_RADIUS + 1.0) * 0.5;
        const gBlurFallOff = INV_LN2 / (2.0 * BlurSigma * BlurSigma);
        const gBlurDepthThreshold = 2.0 * SQRT_LN2 * (this._sceneScale / this._blurSharpness);
        this._blurParam.set(gBlurFallOff, gBlurDepthThreshold, this._blurSharpness / 8.0, this._aoSaturation);
    }

    constructor () {
        this._init();
        this.update();
    }
}

let _hbaoParams: HBAOParams | null = null;
const vec2 = new Vec2();
function _buildHBAOPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
): { rtName: string; dsName: string; } {
    if (!_hbaoParams) return { rtName: inputRT, dsName: inputDS };

    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const hbaoClearColor = new Color(0, 0, 0, camera.clearColor.w);

    const hbaoRTName = `hbaoRTName${cameraID}`;
    if (!ppl.containsResource(hbaoRTName)) {
        ppl.addRenderTarget(hbaoRTName, Format.BGRA8, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(hbaoRTName, width, height);
    const hbaoPass = ppl.addRenderPass(width, height, 'hbao-pass');
    hbaoPass.name = `CameraHBAOPass${cameraID}`;
    hbaoPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    if (ppl.containsResource(inputDS)) {
        const webPipeline = (ppl as WebPipeline);
        const verId = webPipeline.resourceGraph.vertex(inputDS);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = sampler.magFilter = Filter.POINT;
        sampler.mipFilter = Filter.NONE;
        sampler.addressU = sampler.addressV = Address.CLAMP;
        hbaoPass.addTexture(inputDS, 'DepthTex');
    }
    hbaoPass.addRenderTarget(
        hbaoRTName,
        LoadOp.LOAD,
        StoreOp.STORE,
        hbaoClearColor,
    );
    const passIdx = 0;
    _hbaoParams.hbaoMaterial.setProperty('uvDepthToEyePosParams', _hbaoParams.uvDepthToEyePosParams, passIdx);
    _hbaoParams.hbaoMaterial.setProperty('radiusParam', _hbaoParams.radiusParam, passIdx);
    _hbaoParams.hbaoMaterial.setProperty('miscParam', _hbaoParams.miscParam, passIdx);
    // eslint-disable-next-line max-len
    _hbaoParams.hbaoMaterial.setProperty('randomTexSize', new Vec4(_hbaoParams.randomTexture.width, _hbaoParams.randomTexture.height, 1.0 / _hbaoParams.randomTexture.width, 1.0 / _hbaoParams.randomTexture.height), passIdx);
    _hbaoParams.hbaoMaterial.setProperty('blurParam', _hbaoParams.blurParam, passIdx);
    hbaoPass.addQueue(QueueHint.RENDER_TRANSPARENT | QueueHint.RENDER_OPAQUE).addCameraQuad(
        camera,
        _hbaoParams.hbaoMaterial,
        passIdx,
        SceneFlags.NONE,
    );
    return { rtName: hbaoRTName, dsName: inputDS };
}

function _buildHBAOBlurPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
    isYPass: boolean,
): { rtName: string; dsName: string; } {
    if (!_hbaoParams) return { rtName: inputRT, dsName: inputDS };

    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const hbaoClearColor = new Color(0, 0, 0, camera.clearColor.w);

    let inputRTName = `hbaoRTName${cameraID}`;
    let outputRTName = `hbaoBluredRTName${cameraID}`;
    let shaderPassName = 'blurx-pass';
    let blurPassName = `CameraHBAOBluredXPass${cameraID}`;
    if (isYPass) {
        outputRTName = `hbaoRTName${cameraID}`;
        inputRTName = `hbaoBluredRTName${cameraID}`;
        shaderPassName = 'blury-pass';
        blurPassName = `CameraHBAOBluredYPass${cameraID}`;
    }

    if (!ppl.containsResource(outputRTName)) {
        ppl.addRenderTarget(outputRTName, Format.BGRA8, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(outputRTName, width, height);
    const blurPass = ppl.addRenderPass(width, height, shaderPassName);
    blurPass.name = blurPassName;
    blurPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    if (ppl.containsResource(inputDS)) {
        const webPipeline = (ppl as WebPipeline);
        const verId = webPipeline.resourceGraph.vertex(inputDS);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = sampler.magFilter = Filter.POINT;
        sampler.mipFilter = Filter.NONE;
        sampler.addressU = sampler.addressV = Address.CLAMP;
        blurPass.addTexture(inputDS, 'DepthTex');
    }
    if (ppl.containsResource(inputRTName)) {
        const webPipeline = (ppl as WebPipeline);
        const verId = webPipeline.resourceGraph.vertex(inputRTName);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = sampler.magFilter = Filter.LINEAR;
        sampler.mipFilter = Filter.NONE;
        sampler.addressU = sampler.addressV = Address.CLAMP;
        blurPass.addTexture(inputRTName, 'AOTexNearest');
    }
    blurPass.addRenderTarget(
        outputRTName,
        LoadOp.LOAD,
        StoreOp.STORE,
        hbaoClearColor,
    );
    const passIdx = isYPass ? 2 : 1;
    _hbaoParams.hbaoMaterial.setProperty('uvDepthToEyePosParams', _hbaoParams.uvDepthToEyePosParams, passIdx);
    _hbaoParams.hbaoMaterial.setProperty('radiusParam', _hbaoParams.radiusParam, passIdx);
    _hbaoParams.hbaoMaterial.setProperty('miscParam', _hbaoParams.miscParam, passIdx);
    _hbaoParams.hbaoMaterial.setProperty('blurParam', _hbaoParams.blurParam, passIdx);
    blurPass.addQueue(QueueHint.RENDER_TRANSPARENT | QueueHint.RENDER_OPAQUE).addCameraQuad(
        camera,
        _hbaoParams.hbaoMaterial,
        passIdx,
        SceneFlags.NONE,
    );
    return { rtName: outputRTName, dsName: inputDS };
}

function _buildHBAOCombinedPass (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
    outputRT: string,
): { rtName: string; dsName: string; } {
    if (!_hbaoParams) return { rtName: inputRT, dsName: inputDS };

    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const hbaoClearColor = new Color(0, 0, 0, camera.clearColor.w);

    const outputRTName = outputRT;
    if (!ppl.containsResource(outputRTName)) {
        ppl.addRenderTarget(outputRTName, getRTFormatBeforeToneMapping(ppl), width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(outputRTName, width, height);
    const hbaoPass = ppl.addRenderPass(width, height, 'combine-pass');
    hbaoPass.name = `CameraHBAOCombinedPass${cameraID}`;
    hbaoPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));

    const inputRTName = inputRT;
    if (ppl.containsResource(inputRTName)) {
        const webPipeline = (ppl as WebPipeline);
        const verId = webPipeline.resourceGraph.vertex(inputRTName);
        const sampler = webPipeline.resourceGraph.getSampler(verId);
        sampler.minFilter = sampler.magFilter = Filter.LINEAR;
        sampler.mipFilter = Filter.NONE;
        sampler.addressU = sampler.addressV = Address.CLAMP;
        hbaoPass.addTexture(inputRTName, 'AOTexNearest');
    }

    hbaoPass.addRenderTarget(
        outputRTName,
        LoadOp.LOAD,
        StoreOp.STORE,
        hbaoClearColor,
    );
    const passIdx = 3;
    _hbaoParams.hbaoMaterial.setProperty('uvDepthToEyePosParams', _hbaoParams.uvDepthToEyePosParams, passIdx);
    _hbaoParams.hbaoMaterial.setProperty('radiusParam', _hbaoParams.radiusParam, passIdx);
    _hbaoParams.hbaoMaterial.setProperty('miscParam', _hbaoParams.miscParam, passIdx);
    _hbaoParams.hbaoMaterial.setProperty('blurParam', _hbaoParams.blurParam, passIdx);
    hbaoPass.addQueue(QueueHint.RENDER_TRANSPARENT | QueueHint.RENDER_OPAQUE).addCameraQuad(
        camera,
        _hbaoParams.hbaoMaterial,
        passIdx,
        SceneFlags.NONE,
    );
    return { rtName: outputRTName, dsName: inputDS };
}

export function buildHBAOPasses (
    camera: Camera,
    ppl: BasicPipeline,
    inputRT: string,
    inputDS: string,
    radiusScale = 1.0,
    angleBiasDegree = 10.0,
    blurSharpness = 3,
    aoSaturation = 1.0,
    aoStrength = 1.0,
    needBlur = true,
): { rtName: string; dsName: string; } {
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    // params
    if (!_hbaoParams) _hbaoParams = new HBAOParams();
    // todo: nearest object distance from camera
    const sceneScale = camera.nearClip;
    // todo: Half Res Depth Tex
    _hbaoParams.depthTexFullResolution = vec2.set(width, height);
    _hbaoParams.depthTexResolution = vec2.set(width, height);
    _hbaoParams.sceneScale = sceneScale;
    _hbaoParams.cameraFov = camera.fov;
    _hbaoParams.radiusScale = radiusScale;
    _hbaoParams.angleBiasDegree = angleBiasDegree;
    _hbaoParams.aoStrength = aoStrength;
    _hbaoParams.blurSharpness = blurSharpness;
    _hbaoParams.aoSaturation = aoSaturation;
    _hbaoParams.update();

    // debug view
    const director = cclegacy.director;
    const root = director.root;
    if (root.debugView) {
        if (root.debugView.isEnabled()
            && (root.debugView.singleMode !== DebugViewSingleType.NONE && root.debugView.singleMode !== DebugViewSingleType.AO
            || !root.debugView.isCompositeModeEnabled(DebugViewCompositeType.AO))) {
            return { rtName: inputRT, dsName: inputDS };
        }
    }

    // passes
    const hbaoInfo = _buildHBAOPass(camera, ppl, inputRT, inputDS);
    let hbaoCombinedInputRTName = hbaoInfo.rtName;
    if (needBlur) {
        const haboBlurInfoX = _buildHBAOBlurPass(camera, ppl, hbaoInfo.rtName, inputDS, false);
        const haboBlurInfoY = _buildHBAOBlurPass(camera, ppl, haboBlurInfoX.rtName, inputDS, true);
        hbaoCombinedInputRTName = haboBlurInfoY.rtName;
    }
    const haboCombined = _buildHBAOCombinedPass(camera, ppl, hbaoCombinedInputRTName, inputDS, inputRT);
    return { rtName: haboCombined.rtName, dsName: inputDS };
}

export const MAX_LIGHTS_PER_CLUSTER = 200;
export const CLUSTERS_X = 16;
export const CLUSTERS_Y = 8;
export const CLUSTERS_Z = 24;
export const CLUSTER_COUNT = CLUSTERS_X * CLUSTERS_Y * CLUSTERS_Z;

class ClusterLightData {
    declare clusterBuildCS: Material;
    declare clusterLightCullingCS: Material;
    clusters_x_threads = 16;
    clusters_y_threads = 8;
    clusters_z_threads = 1;
    dispatchX = 1;
    dispatchY = 1;
    dispatchZ = 1;

    private _initMaterial (id: string, effect: string): Material {
        const mat = new Material();
        mat.name = id;
        mat.initialize({ effectName: effect });
        for (let i = 0; i < mat.passes.length; ++i) {
            mat.passes[i].tryCompile();
        }
        return mat;
    }

    private _init (): void {
        this.clusterBuildCS = this._initMaterial('builtin-cluster-build-cs-material', 'pipeline/cluster-build');
        this.clusterLightCullingCS = this._initMaterial('builtin-cluster-culling-cs-material', 'pipeline/cluster-culling');

        this.dispatchX = CLUSTERS_X / this.clusters_x_threads;
        this.dispatchY = CLUSTERS_Y / this.clusters_y_threads;
        this.dispatchZ = CLUSTERS_Z / this.clusters_z_threads;
    }

    constructor () {
        this._init();
    }
}

let _clusterLightData: ClusterLightData | null = null;
export function buildLightClusterBuildPass (
    camera: Camera,
    clusterData: ClusterLightData,
    ppl: Pipeline,
): void {
    const cameraID = getCameraUniqueID(camera);
    const clusterBufferName = `clusterBuffer${cameraID}`;

    const clusterBufferSize = CLUSTER_COUNT * 2 * 4 * 4;
    if (!ppl.containsResource(clusterBufferName)) {
        ppl.addStorageBuffer(clusterBufferName, Format.UNKNOWN, clusterBufferSize, ResourceResidency.MANAGED);
    }
    ppl.updateStorageBuffer(clusterBufferName, clusterBufferSize);

    const clusterPass = ppl.addComputePass('cluster-build-cs');
    clusterPass.addStorageBuffer(clusterBufferName, AccessType.WRITE, 'b_clustersBuffer');
    clusterPass.addQueue()
        .addDispatch(clusterData.dispatchX, clusterData.dispatchY, clusterData.dispatchZ, clusterData.clusterBuildCS, 0);

    const width = camera.width * ppl.pipelineSceneData.shadingScale;
    const height = camera.height * ppl.pipelineSceneData.shadingScale;
    if ('setCurrConstant' in clusterPass) { // web-pipeline
        (clusterPass as WebComputePassBuilder).addConstant('CCConst', 'cluster-build-cs');
    }
    clusterPass.setVec4('cc_nearFar', new Vec4(camera.nearClip, camera.farClip, camera.getClipSpaceMinz(), 0));
    clusterPass.setVec4('cc_viewPort', new Vec4(0, 0, width, height));
    clusterPass.setVec4('cc_workGroup', new Vec4(CLUSTERS_X, CLUSTERS_Y, CLUSTERS_Z, 0));
    clusterPass.setMat4('cc_matView', camera.matView);
    clusterPass.setMat4('cc_matProjInv', camera.matProjInv);
}

export function buildLightClusterCullingPass (
    camera: Camera,
    clusterData: ClusterLightData,
    ppl: Pipeline,
): void {
    const cameraID = getCameraUniqueID(camera);
    const clusterBufferName = `clusterBuffer${cameraID}`;
    const clusterLightBufferName = `clusterLightBuffer${cameraID}`;
    const clusterGlobalIndexBufferName = `globalIndexBuffer${cameraID}`;
    const clusterLightIndicesBufferName = `clusterLightIndicesBuffer${cameraID}`;
    const clusterLightGridBufferName = `clusterLightGridBuffer${cameraID}`;

    // index buffer
    const lightIndexBufferSize = MAX_LIGHTS_PER_CLUSTER * CLUSTER_COUNT * 4;
    const lightGridBufferSize = CLUSTER_COUNT * 4 * 4;
    if (!ppl.containsResource(clusterLightIndicesBufferName)) {
        ppl.addStorageBuffer(clusterLightIndicesBufferName, Format.UNKNOWN, lightIndexBufferSize, ResourceResidency.MANAGED);
    }
    if (!ppl.containsResource(clusterLightGridBufferName)) {
        ppl.addStorageBuffer(clusterLightGridBufferName, Format.UNKNOWN, lightGridBufferSize, ResourceResidency.MANAGED);
    }

    const clusterPass = ppl.addComputePass('cluster-culling-cs');
    clusterPass.addStorageBuffer(clusterLightBufferName, AccessType.READ, 'b_ccLightsBuffer');
    clusterPass.addStorageBuffer(clusterBufferName, AccessType.READ, 'b_clustersBuffer');
    clusterPass.addStorageBuffer(clusterLightIndicesBufferName, AccessType.WRITE, 'b_clusterLightIndicesBuffer');
    clusterPass.addStorageBuffer(clusterLightGridBufferName, AccessType.WRITE, 'b_clusterLightGridBuffer');
    clusterPass.addStorageBuffer(clusterGlobalIndexBufferName, AccessType.WRITE, 'b_globalIndexBuffer');
    clusterPass.addQueue()
        .addDispatch(clusterData.dispatchX, clusterData.dispatchY, clusterData.dispatchZ, clusterData.clusterLightCullingCS, 0);

    const width = camera.width * ppl.pipelineSceneData.shadingScale;
    const height = camera.height * ppl.pipelineSceneData.shadingScale;
    if ('setCurrConstant' in clusterPass) { // web-pipeline
        (clusterPass as WebComputePassBuilder).addConstant('CCConst', 'cluster-build-cs');
    }
    clusterPass.setVec4('cc_nearFar', new Vec4(camera.nearClip, camera.farClip, camera.getClipSpaceMinz(), 0));
    clusterPass.setVec4('cc_viewPort', new Vec4(width, height, width, height));
    clusterPass.setVec4('cc_workGroup', new Vec4(CLUSTERS_X, CLUSTERS_Y, CLUSTERS_Z, 0));
    clusterPass.setMat4('cc_matView', camera.matView);
    clusterPass.setMat4('cc_matProjInv', camera.matProjInv);
}

export function buildLightBuffer (size: number, floatPerLight: number, camera: Camera, pipeline: BasicPipeline): ArrayBuffer {
    const buffer = new ArrayBuffer(size);
    const view = new Float32Array(buffer);

    const data = pipeline.pipelineSceneData;
    const lightMeterScale = 10000.0;
    const exposure = camera.exposure;

    // gather light data
    let index = 0;
    for (const light of data.validPunctualLights) {
        const offset = index * floatPerLight;
        const positionOffset = offset + 0;
        const colorOffset = offset + 4;
        const sizeRangeAngleOffset = offset + 8;
        const directionOffset = offset + 12;
        const boundSizeOffset = offset + 16;

        let luminanceHDR = 0;
        let luminanceLDR = 0;
        let position: Vec3 | null;
        if (light.type === LightType.POINT) {
            const point = light as PointLight;
            position = point.position;
            luminanceLDR = point.luminanceLDR;
            luminanceHDR = point.luminanceHDR;

            view[sizeRangeAngleOffset]     = 0;
            view[sizeRangeAngleOffset + 1] = point.range;
            view[sizeRangeAngleOffset + 2] = 0;
            view[sizeRangeAngleOffset + 3] = 0;
        } else if (light.type === LightType.SPHERE) {
            const sphere = light as SphereLight;
            position = sphere.position;
            luminanceLDR = sphere.luminanceLDR;
            luminanceHDR = sphere.luminanceHDR;

            view[sizeRangeAngleOffset]     = sphere.size;
            view[sizeRangeAngleOffset + 1] = sphere.range;
            view[sizeRangeAngleOffset + 2] = 0;
            view[sizeRangeAngleOffset + 3] = 0;
        } else if (light.type === LightType.SPOT) {
            const spot = light as SpotLight;
            position = spot.position;
            luminanceLDR = spot.luminanceLDR;
            luminanceHDR = spot.luminanceHDR;

            view[sizeRangeAngleOffset]     = spot.size;
            view[sizeRangeAngleOffset + 1] = spot.range;
            view[sizeRangeAngleOffset + 2] = spot.spotAngle;
            view[sizeRangeAngleOffset + 3] = 0;

            const dir = spot.direction;
            view[directionOffset]     = dir.x;
            view[directionOffset + 1] = dir.y;
            view[directionOffset + 2] = dir.z;
            view[directionOffset + 3] = 0;
        } else if (light.type === LightType.RANGED_DIRECTIONAL) {
            const directional = light as RangedDirectionalLight;
            position = directional.position;
            luminanceLDR = directional.illuminanceLDR;
            luminanceHDR = directional.illuminanceHDR;

            const right = directional.right;
            view[sizeRangeAngleOffset]     = right.x;
            view[sizeRangeAngleOffset + 1] = right.y;
            view[sizeRangeAngleOffset + 2] = right.z;
            view[sizeRangeAngleOffset + 3] = 0;

            const dir = directional.direction;
            view[directionOffset]     = dir.x;
            view[directionOffset + 1] = dir.y;
            view[directionOffset + 2] = dir.z;
            view[directionOffset + 3] = 0;

            const scale = directional.scale;
            view[boundSizeOffset]     = scale.x * 0.5;
            view[boundSizeOffset + 1] = scale.y * 0.5;
            view[boundSizeOffset + 2] = scale.z * 0.5;
            view[boundSizeOffset + 3] = 0;
        }
        // position
        view[positionOffset]     = position!.x;
        view[positionOffset + 1] = position!.y;
        view[positionOffset + 2] = position!.z;
        view[positionOffset + 3] = light.type;

        // color
        const color = light.color;
        if (light.useColorTemperature) {
            const tempRGB = light.colorTemperatureRGB;
            view[colorOffset]     = color.x * tempRGB.x;
            view[colorOffset + 1] = color.y * tempRGB.y;
            view[colorOffset + 2] = color.z * tempRGB.z;
        } else {
            view[colorOffset]     = color.x;
            view[colorOffset + 1] = color.y;
            view[colorOffset + 2] = color.z;
        }
        view[colorOffset + 3] = data.isHDR ? luminanceHDR * exposure * lightMeterScale : luminanceLDR;
        index++;
    }
    // last float of first light data
    view[3 * 4 + 3] = data.validPunctualLights.length;
    return buffer;
}

export function buildStandardLightData (camera: Camera, pipeline: BasicPipeline): void {
    validPunctualLightsCulling(pipeline, camera);
}

export function buildClusterLightData (camera: Camera, pipeline: BasicPipeline): void {
    validPunctualLightsCulling(pipeline, camera);

    // build cluster light data
    const data = pipeline.pipelineSceneData;
    const validLightCountForBuffer = nextPow2(Math.max(data.validPunctualLights.length, 1));

    const lightBufferFloatNum = 20; // 5 * vec4
    const clusterLightBufferSize = validLightCountForBuffer * 4 * lightBufferFloatNum;

    const cameraID = getCameraUniqueID(camera);
    const clusterLightBufferName = `clusterLightBuffer${cameraID}`;
    const clusterGlobalIndexBufferName = `globalIndexBuffer${cameraID}`;

    const ppl = (pipeline as Pipeline);
    if (!ppl.containsResource(clusterGlobalIndexBufferName)) {
        ppl.addStorageBuffer(clusterGlobalIndexBufferName, Format.UNKNOWN, 4, ResourceResidency.PERSISTENT);
    }

    if (!ppl.containsResource(clusterLightBufferName)) {
        ppl.addStorageBuffer(clusterLightBufferName, Format.UNKNOWN, clusterLightBufferSize, ResourceResidency.PERSISTENT);
    }
    ppl.updateStorageBuffer(clusterLightBufferName, clusterLightBufferSize);

    const buffer = buildLightBuffer(clusterLightBufferSize, lightBufferFloatNum, camera, pipeline);

    // global index buffer
    const globalIndexBuffer = new ArrayBuffer(4);
    const globalIndexBufferView = new Uint32Array(globalIndexBuffer);
    globalIndexBufferView[0] = 0;

    const uploadPair1 = new UploadPair(new Uint8Array(buffer), clusterLightBufferName);
    const uploadPair2 = new UploadPair(new Uint8Array(globalIndexBuffer), clusterGlobalIndexBufferName);
    ppl.addUploadPass([uploadPair1, uploadPair2]);
}

export function buildClusterPasses (camera: Camera, pipeline: BasicPipeline): void {
    buildClusterLightData(camera, pipeline);

    const ppl = (pipeline as Pipeline);
    if (!_clusterLightData) _clusterLightData = new ClusterLightData();

    buildLightClusterBuildPass(camera, _clusterLightData, ppl);
    buildLightClusterCullingPass(camera, _clusterLightData, ppl);
}

function hashCombine (hash, currHash: number): number {
    return currHash ^= (hash >>> 0) + 0x9e3779b9 + (currHash << 6) + (currHash >> 2);
}

export function hashCombineNum (val: number, currHash: number): number {
    const hash = 5381;
    return hashCombine((hash * 33) ^ val, currHash);
}

export function hashCombineStr (str: string, currHash: number): number {
    // DJB2 HASH
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hashCombine(hash, currHash);
}

export function bool (val): boolean {
    return !!val;
}

export function AlignUp (value: number, alignment: number): number {
    return (value + (alignment - 1)) & ~(alignment - 1);
}
const kLightMeterScale = 10000;
export function SetLightUBO (
    light: Light | null,
    bHDR: boolean,
    exposure: number,
    shadowInfo: Shadows | null,
    buffer: Float32Array,
    offset: number,
    elemSize: number,
): void {
    const vec4Array = new Float32Array(4);
    let size = 0.0;
    let range = 0.0;
    let luminanceHDR = 0.0;
    let luminanceLDR = 0.0;

    if (light && light.type === LightType.SPHERE) {
        const sphereLight = light as SphereLight;
        vec4Array[0] = sphereLight.position.x;
        vec4Array[1] = sphereLight.position.y;
        vec4Array[2] = sphereLight.position.z;
        vec4Array[3] = LightType.SPHERE;
        size = sphereLight.size;
        range = sphereLight.range;
        luminanceHDR = sphereLight.luminanceHDR;
        luminanceLDR = sphereLight.luminanceLDR;
    } else if (light && light.type === LightType.SPOT) {
        const spotLight = light as SpotLight;
        vec4Array[0] = spotLight.position.x;
        vec4Array[1] = spotLight.position.y;
        vec4Array[2] = spotLight.position.z;
        vec4Array[3] = LightType.SPOT;
        size = spotLight.size;
        range = spotLight.range;
        luminanceHDR = spotLight.luminanceHDR;
        luminanceLDR = spotLight.luminanceLDR;
    } else if (light && light.type === LightType.POINT) {
        const pointLight = light as PointLight;
        vec4Array[0] = pointLight.position.x;
        vec4Array[1] = pointLight.position.y;
        vec4Array[2] = pointLight.position.z;
        vec4Array[3] = LightType.POINT;
        size = 0.0;
        range = pointLight.range;
        luminanceHDR = pointLight.luminanceHDR;
        luminanceLDR = pointLight.luminanceLDR;
    } else if (light && light.type === LightType.RANGED_DIRECTIONAL) {
        const rangedDirLight = light as RangedDirectionalLight;
        vec4Array[0] = rangedDirLight.position.x;
        vec4Array[1] = rangedDirLight.position.y;
        vec4Array[2] = rangedDirLight.position.z;
        vec4Array[3] = LightType.RANGED_DIRECTIONAL;
        size = 0.0;
        range = 0.0;
        luminanceHDR = rangedDirLight.illuminanceHDR;
        luminanceLDR = rangedDirLight.illuminanceLDR;
    }

    let index = offset + UBOForwardLight.LIGHT_POS_OFFSET;
    buffer.set(vec4Array, index);

    index = offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET;
    vec4Array.set([size, range, 0, 0]);
    buffer.set(vec4Array, index);

    index = offset + UBOForwardLight.LIGHT_COLOR_OFFSET;
    const color = light ? light.color : new Color();
    if (light && light.useColorTemperature) {
        const tempRGB = light.colorTemperatureRGB;
        buffer[index++] = color.x * tempRGB.x;
        buffer[index++] = color.y * tempRGB.y;
        buffer[index++] = color.z * tempRGB.z;
    } else {
        buffer[index++] = color.x;
        buffer[index++] = color.y;
        buffer[index++] = color.z;
    }

    if (bHDR) {
        buffer[index] = luminanceHDR * exposure * kLightMeterScale;
    } else {
        buffer[index] = luminanceLDR;
    }

    switch (light ? light.type : LightType.UNKNOWN) {
    case LightType.SPHERE:
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;
        break;
    case LightType.SPOT: {
        const spotLight = light as SpotLight;
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = spotLight.spotAngle;
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] =                (shadowInfo && shadowInfo.enabled
                 && spotLight.shadowEnabled
                 && shadowInfo.type === ShadowType.ShadowMap) ? 1.0 : 0.0;

        index = offset + UBOForwardLight.LIGHT_DIR_OFFSET;
        const direction = spotLight.direction;
        buffer[index++] = direction.x;
        buffer[index++] = direction.y;
        buffer[index] = direction.z;

        buffer[offset + UBOForwardLight.LIGHT_BOUNDING_SIZE_VS_OFFSET + 0] = 0;
        buffer[offset + UBOForwardLight.LIGHT_BOUNDING_SIZE_VS_OFFSET + 1] = 0;
        buffer[offset + UBOForwardLight.LIGHT_BOUNDING_SIZE_VS_OFFSET + 2] = 0;
        buffer[offset + UBOForwardLight.LIGHT_BOUNDING_SIZE_VS_OFFSET + 3] = spotLight.angleAttenuationStrength;
    } break;
    case LightType.POINT:
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;
        break;
    case LightType.RANGED_DIRECTIONAL: {
        const rangedDirLight = light as RangedDirectionalLight;
        const right = rangedDirLight.right;
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 0] = right.x;
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 1] = right.y;
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = right.z;
        buffer[offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + 3] = 0;

        const direction = rangedDirLight.direction;
        buffer[offset + UBOForwardLight.LIGHT_DIR_OFFSET + 0] = direction.x;
        buffer[offset + UBOForwardLight.LIGHT_DIR_OFFSET + 1] = direction.y;
        buffer[offset + UBOForwardLight.LIGHT_DIR_OFFSET + 2] = direction.z;
        buffer[offset + UBOForwardLight.LIGHT_DIR_OFFSET + 3] = 0;

        const scale = rangedDirLight.scale;
        buffer[offset + UBOForwardLight.LIGHT_BOUNDING_SIZE_VS_OFFSET + 0] = scale.x * 0.5;
        buffer[offset + UBOForwardLight.LIGHT_BOUNDING_SIZE_VS_OFFSET + 1] = scale.y * 0.5;
        buffer[offset + UBOForwardLight.LIGHT_BOUNDING_SIZE_VS_OFFSET + 2] = scale.z * 0.5;
        buffer[offset + UBOForwardLight.LIGHT_BOUNDING_SIZE_VS_OFFSET + 3] = 0;
    } break;
    default:
        break;
    }
}

export function getSubpassOrPassID (sceneId: number, rg: RenderGraph, lg: LayoutGraphData): number {
    const queueId = rg.getParent(sceneId);
    assert(queueId !== 0xFFFFFFFF);
    const subpassOrPassID = rg.getParent(queueId);
    assert(subpassOrPassID !== 0xFFFFFFFF);
    const passId = rg.getParent(subpassOrPassID);
    let layoutId = lg.nullVertex();
    // single render pass
    if (passId === rg.nullVertex()) {
        const layoutName: string = rg.getLayout(subpassOrPassID);
        assert(!!layoutName);
        layoutId = lg.locateChild(lg.nullVertex(), layoutName);
    } else {
        const passLayoutName: string = rg.getLayout(passId);
        assert(!!passLayoutName);
        const passLayoutId = lg.locateChild(lg.nullVertex(), passLayoutName);
        assert(passLayoutId !== lg.nullVertex());

        const subpassLayoutName: string = rg.getLayout(subpassOrPassID);
        if (subpassLayoutName.length === 0) {
            layoutId = passLayoutId;
        } else {
            const subpassLayoutId = lg.locateChild(passLayoutId, subpassLayoutName);
            assert(subpassLayoutId !== lg.nullVertex());
            layoutId = subpassLayoutId;
        }
    }
    assert(layoutId !== lg.nullVertex());
    return layoutId;
}
