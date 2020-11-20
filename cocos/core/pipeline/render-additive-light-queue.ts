/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 * @packageDocumentation
 * @module pipeline
 */
import { BatchedBuffer } from './batched-buffer';
import { BatchingSchemes } from '../renderer/core/pass';
import { ForwardPipeline } from './forward/forward-pipeline';
import { InstancedBuffer } from './instanced-buffer';
import { Model } from '../renderer/scene/model';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassView, PassPool, SubModelPool, SubModelView,
    ShaderHandle } from '../renderer/core/memory-pools';
import { Vec3, nextPow2, Mat4, Vec4, Color } from '../../core/math';
import { Sphere, intersect } from '../geometry';
import { Device, RenderPass, Buffer, BufferUsageBit, MemoryUsageBit,
    BufferInfo, BufferViewInfo, CommandBuffer, Filter, Address, Sampler, DescriptorSet, Texture, DescriptorSetInfo } from '../gfx';
import { Pool } from '../memop';
import { RenderBatchedQueue } from './render-batched-queue';
import { RenderInstancedQueue } from './render-instanced-queue';
import { RenderView } from './render-view';
import { SphereLight } from '../renderer/scene/sphere-light';
import { SpotLight } from '../renderer/scene/spot-light';
import { SubModel } from '../renderer/scene/submodel';
import { getPhaseID } from './pass-phase';
import { Light, LightType } from '../renderer/scene/light';
import { IRenderObject, SetIndex, UBOForwardLight, UBOGlobal, UBOShadow, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from './define';
import { legacyCC } from '../global-exports';
import { genSamplerHash, samplerLib } from '../renderer/core/sampler-lib';
import { builtinResMgr } from '../3d/builtin/init';
import { Texture2D } from '../assets/texture-2d';

const _samplerInfo = [
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
];

interface IAdditiveLightPass {
    subModel: SubModel;
    passIdx: number;
    dynamicOffsets: number[];
    lights: Light[];
}

const _lightPassPool = new Pool<IAdditiveLightPass>(() => ({ subModel: null!, passIdx: -1, dynamicOffsets: [], lights: []}), 16);

const _vec4Array = new Float32Array(4);
const _sphere = Sphere.create(0, 0, 0, 1);
const _dynamicOffsets: number[] = [];
const _lightIndices: number[] = [];
const _matShadowView = new Mat4();
const _matShadowViewProj = new Mat4();

function cullSphereLight (light: SphereLight, model: Model) {
    return !!(model.worldBounds && !intersect.aabbWithAABB(model.worldBounds, light.aabb));
}

function cullSpotLight (light: SpotLight, model: Model) {
    return !!(model.worldBounds
        && (!intersect.aabbWithAABB(model.worldBounds, light.aabb) || !intersect.aabbFrustum(model.worldBounds, light.frustum)));
}

const _phaseID = getPhaseID('forward-add');
const _lightPassIndices: number[] = [];
function getLightPassIndices (subModels: SubModel[], lightPassIndices: number[]) {
    lightPassIndices.length = 0;
    let hasValidLightPass = false;
    for (let j = 0; j < subModels.length; j++) {
        const { passes } = subModels[j];
        let lightPassIndex = -1;
        for (let k = 0; k < passes.length; k++) {
            if (passes[k].phase === _phaseID) {
                lightPassIndex = k;
                hasValidLightPass = true;
                break;
            }
        }
        lightPassIndices.push(lightPassIndex);
    }
    return hasValidLightPass;
}

/**
 * @zh 叠加光照队列。
 */
export class RenderAdditiveLightQueue {
    private _pipeline: ForwardPipeline;
    private _device: Device;

    private _validLights: Light[] = [];

    private _lightPasses: IAdditiveLightPass[] = [];

    private _descriptorSetMap: Map<Light, DescriptorSet> = new Map();

    private _globalUBO = new Float32Array(UBOGlobal.COUNT);

    private _shadowUBO = new Float32Array(UBOShadow.COUNT);

    private _lightBufferCount = 16;

    private _lightBufferStride: number;

    private _lightBufferElementCount: number;

    private _lightBuffer: Buffer;

    private _firstLightBufferView: Buffer;

    private _lightBufferData: Float32Array;

    private _isHDR: boolean;

    private _fpScale: number;

    private _renderObjects: IRenderObject[];

    private _instancedQueue: RenderInstancedQueue;

    private _batchedQueue: RenderBatchedQueue;

    private _lightMeterScale: number = 10000.0;
    private _sampler: Sampler | null = null;

    constructor (pipeline: ForwardPipeline) {
        this._pipeline = pipeline;
        this._device = pipeline.device;
        this._isHDR = pipeline.isHDR;
        this._fpScale = pipeline.fpScale;
        this._renderObjects = pipeline.renderObjects;
        this._instancedQueue = new RenderInstancedQueue();
        this._batchedQueue = new RenderBatchedQueue();

        this._lightBufferStride = Math.ceil(UBOForwardLight.SIZE / this._device.uboOffsetAlignment) * this._device.uboOffsetAlignment;
        this._lightBufferElementCount = this._lightBufferStride / Float32Array.BYTES_PER_ELEMENT;

        this._lightBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._lightBufferStride * this._lightBufferCount,
            this._lightBufferStride,
        ));

        this._firstLightBufferView = this._device.createBuffer(new BufferViewInfo(this._lightBuffer, 0, UBOForwardLight.SIZE));

        this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);

        const shadowMapSamplerHash = genSamplerHash(_samplerInfo);
        this._sampler = samplerLib.getSampler(this._device, shadowMapSamplerHash);
    }

    public clear () {
        this._instancedQueue.clear();
        this._batchedQueue.clear();

        this._validLights.length = 0;

        for (let i = 0; i < this._lightPasses.length; i++) {
            const lp = this._lightPasses[i];
            lp.dynamicOffsets.length = 0;
            lp.lights.length = 0;
        }
        _lightPassPool.freeArray(this._lightPasses);
        this._lightPasses.length = 0;
    }

    public destroy () {
        let descriptorSets = Array.from(this._descriptorSetMap.values());
        for (let i = 0; i < descriptorSets.length; ++i) {
            const descriptorSet = descriptorSets[i];
            if (descriptorSet) {
                descriptorSet.getBuffer(UBOGlobal.BINDING).destroy();
                descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
                descriptorSet.destroy();
            }
        }
        this._descriptorSetMap.clear();
    }

    public gatherLightPasses (view: RenderView, cmdBuff: CommandBuffer) {
        const validLights = this._validLights;
        const { sphereLights } = view.camera.scene!;

        this.clear();

        for (let i = 0; i < sphereLights.length; i++) {
            const light = sphereLights[i];
            Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
                this._getOrCreateDescriptorSet(light)!;
            }
        }
        const { spotLights } = view.camera.scene!;
        for (let i = 0; i < spotLights.length; i++) {
            const light = spotLights[i];
            Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
                this._getOrCreateDescriptorSet(light)!;
            }
        }

        if (!validLights.length) { return; }

        this._updateUBOs(view, cmdBuff);
        this._updateLightDescriptorSet(view, cmdBuff);

        for (let i = 0; i < this._renderObjects.length; i++) {
            const ro = this._renderObjects[i];
            const { model } = ro;
            const { subModels } = model;
            if (!getLightPassIndices(subModels, _lightPassIndices)) { continue; }

            _lightIndices.length = 0;
            for (let l = 0; l < validLights.length; l++) {
                const light = validLights[l];
                let isCulled = false;
                switch (light.type) {
                case LightType.SPHERE:
                    isCulled = cullSphereLight(light as SphereLight, model);
                    break;
                case LightType.SPOT:
                    isCulled = cullSpotLight(light as SpotLight, model);
                    break;
                default:
                }
                if (!isCulled) {
                    _lightIndices.push(l);
                }
            }

            if (!_lightIndices.length) { continue; }

            for (let j = 0; j < subModels.length; j++) {
                const lightPassIdx = _lightPassIndices[j];
                if (lightPassIdx < 0) { continue; }
                const subModel = subModels[j];
                const pass = subModel.passes[lightPassIdx];
                const { batchingScheme } = pass;
                subModel.descriptorSet.bindBuffer(UBOForwardLight.BINDING, this._firstLightBufferView);
                subModel.descriptorSet.update();

                if (batchingScheme === BatchingSchemes.INSTANCING) { // instancing
                    for (let l = 0; l < _lightIndices.length; l++) {
                        const idx = _lightIndices[l];
                        const buffer = InstancedBuffer.get(pass, idx);
                        buffer.merge(subModel, model.instancedAttributes, lightPassIdx);
                        buffer.dynamicOffsets[0] = this._lightBufferStride * idx;
                        this._instancedQueue.queue.add(buffer);
                    }
                } else if (batchingScheme === BatchingSchemes.VB_MERGING) { // vb-merging
                    for (let l = 0; l < _lightIndices.length; l++) {
                        const idx = _lightIndices[l];
                        const buffer = BatchedBuffer.get(pass, idx);
                        buffer.merge(subModel, lightPassIdx, model);
                        buffer.dynamicOffsets[0] = this._lightBufferStride * idx;
                        this._batchedQueue.queue.add(buffer);
                    }
                } else { // standard draw
                    const lp = _lightPassPool.alloc();
                    lp.subModel = subModel;
                    lp.passIdx = lightPassIdx;
                    for (let l = 0; l < _lightIndices.length; l++) {
                        lp.lights.push(validLights[l]);
                        lp.dynamicOffsets.push(this._lightBufferStride * _lightIndices[l]);
                    }

                    this._lightPasses.push(lp);
                }
            }
        }
        this._instancedQueue.uploadBuffers(cmdBuff);
        this._batchedQueue.uploadBuffers(cmdBuff);
    }

    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        for (let i = 0; i < this._lightPasses.length; i++) {
            const { subModel, passIdx, dynamicOffsets, lights } = this._lightPasses[i];
            const shader = ShaderPool.get(SubModelPool.get(subModel.handle, SubModelView.SHADER_0 + passIdx) as ShaderHandle);
            const pass = subModel.passes[passIdx];
            const ia = subModel.inputAssembler;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, ia);
            const matDS = DSPool.get(PassPool.get(pass.handle, PassView.DESCRIPTOR_SET));
            const localDS = subModel.descriptorSet;

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, matDS);
            cmdBuff.bindInputAssembler(ia);

            for (let j = 0; j < dynamicOffsets.length; ++j) {
                const light = lights[j];
                const descriptorSet = this._getOrCreateDescriptorSet(light);
                _dynamicOffsets[0] = dynamicOffsets[j];
                cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet!);
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, localDS, _dynamicOffsets);
                cmdBuff.draw(ia);
            }
        }
    }

    // update light DescriptorSet
    protected _updateLightDescriptorSet (view: RenderView, cmdBuff: CommandBuffer) {
        const shadowInfo = this._pipeline.shadows;
        
        for (let i = 0; i < this._validLights.length; i++) {
            const light = this._validLights[i];           
            const descriptorSet = this._getOrCreateDescriptorSet(light);
            if(!descriptorSet) { return; }

            // Main light sampler binding
            descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, this._sampler!);
            descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
            descriptorSet.update();
            this._updateGlobalDescriptorSet(view, cmdBuff);

            switch (light.type) {
                case LightType.SPHERE:
                    // Reserve sphere light shadow interface
                    Color.toArray(this._shadowUBO, shadowInfo.shadowColor,UBOShadow.SHADOW_COLOR_OFFSET);

                    this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 0] = shadowInfo.size.x;
                    this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 1] = shadowInfo.size.y;
                    this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 2] = shadowInfo.pcf;
                    this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 3] = shadowInfo.bias;

                    descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, this._sampler!);
                    descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
                    break;
                case LightType.SPOT:
                    const spotLight = light as SpotLight;

                    // light view
                    Mat4.invert(_matShadowView, spotLight.node!.getWorldMatrix());

                    // light proj
                    Mat4.perspective(_matShadowViewProj, spotLight.spotAngle, spotLight.aspect, 0.001, spotLight.range);

                    // light viewProj
                    Mat4.multiply(_matShadowViewProj, _matShadowViewProj, _matShadowView);

                    Mat4.toArray(this._shadowUBO, _matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

                    Color.toArray(this._shadowUBO, shadowInfo.shadowColor,UBOShadow.SHADOW_COLOR_OFFSET);

                    this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 0] = shadowInfo.size.x;
                    this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 1] = shadowInfo.size.y;
                    this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 2] = shadowInfo.pcf;
                    this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 3] = shadowInfo.bias;
                    descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, this._sampler!);
                    if (this._pipeline.shadowFrameBufferMap.has(light)) {
                        descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, this._pipeline.shadowFrameBufferMap.get(light)?.colorTextures[0]!);
                    } else {
                        descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
                    }
                    break;
                default:        
            }
            descriptorSet.update();

            cmdBuff.updateBuffer(descriptorSet.getBuffer(UBOGlobal.BINDING)!, this._globalUBO);
            cmdBuff.updateBuffer(descriptorSet.getBuffer(UBOShadow.BINDING)!, this._shadowUBO);
        }
    }

    protected _updateGlobalDescriptorSet (view: RenderView, cmdBuff: CommandBuffer) {
        const root = legacyCC.director.root;
        const device = this._pipeline.device;
        const pipeline = this._pipeline;
        const camera = view.camera;
        const scene = camera.scene!;
        const mainLight = scene.mainLight;
        const ambient = pipeline.ambient;
        const fog = pipeline.fog;
        const fv = this._globalUBO;
        const shadingScale = pipeline.shadingScale;
        

        const shadingWidth = Math.floor(device.width);
        const shadingHeight = Math.floor(device.height);

         // update UBOGlobal
         fv[UBOGlobal.TIME_OFFSET] = root.cumulativeTime;
         fv[UBOGlobal.TIME_OFFSET + 1] = root.frameTime;
         fv[UBOGlobal.TIME_OFFSET + 2] = legacyCC.director.getTotalFrames();
 
         fv[UBOGlobal.SCREEN_SIZE_OFFSET] = device.width;
         fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = device.height;
         fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.SCREEN_SIZE_OFFSET];
         fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1];
 
         fv[UBOGlobal.SCREEN_SCALE_OFFSET] = camera.width / shadingWidth * shadingScale;
         fv[UBOGlobal.SCREEN_SCALE_OFFSET + 1] = camera.height / shadingHeight * shadingScale;
         fv[UBOGlobal.SCREEN_SCALE_OFFSET + 2] = 1.0 / fv[UBOGlobal.SCREEN_SCALE_OFFSET];
         fv[UBOGlobal.SCREEN_SCALE_OFFSET + 3] = 1.0 / fv[UBOGlobal.SCREEN_SCALE_OFFSET + 1];
 
         fv[UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
         fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
         fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
         fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];
 
         Mat4.toArray(fv, camera.matView, UBOGlobal.MAT_VIEW_OFFSET);
         Mat4.toArray(fv, camera.node.worldMatrix, UBOGlobal.MAT_VIEW_INV_OFFSET);
         Mat4.toArray(fv, camera.matProj, UBOGlobal.MAT_PROJ_OFFSET);
         Mat4.toArray(fv, camera.matProjInv, UBOGlobal.MAT_PROJ_INV_OFFSET);
         Mat4.toArray(fv, camera.matViewProj, UBOGlobal.MAT_VIEW_PROJ_OFFSET);
         Mat4.toArray(fv, camera.matViewProjInv, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);
         Vec3.toArray(fv, camera.position, UBOGlobal.CAMERA_POS_OFFSET);
         let projectionSignY = device.screenSpaceSignY;
         if (view.window.hasOffScreenAttachments) {
             projectionSignY *= device.UVSpaceSignY; // need flipping if drawing on render targets
         }
         fv[UBOGlobal.CAMERA_POS_OFFSET + 3] = projectionSignY;
 
         const exposure = camera.exposure;
         fv[UBOGlobal.EXPOSURE_OFFSET] = exposure;
         fv[UBOGlobal.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
         fv[UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
         fv[UBOGlobal.EXPOSURE_OFFSET + 3] = this._fpScale / exposure;
 
         if (mainLight) {
             Vec3.toArray(fv, mainLight.direction, UBOGlobal.MAIN_LIT_DIR_OFFSET);
             Vec3.toArray(fv, mainLight.color, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
             if (mainLight.useColorTemperature) {
                 const colorTempRGB = mainLight.colorTemperatureRGB;
                 fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
                 fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
                 fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
             }
 
             if (this._isHDR) {
                 fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * this._fpScale;
             } else {
                 fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
             }
         } else {
             Vec3.toArray(fv, Vec3.UNIT_Z, UBOGlobal.MAIN_LIT_DIR_OFFSET);
             Vec4.toArray(fv, Vec4.ZERO, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
         }
 
         const skyColor = ambient.colorArray;
         if (this._isHDR) {
             skyColor[3] = ambient.skyIllum * this._fpScale;
         } else {
             skyColor[3] = ambient.skyIllum * exposure;
         }
         fv.set(skyColor, UBOGlobal.AMBIENT_SKY_OFFSET);
         fv.set(ambient.albedoArray, UBOGlobal.AMBIENT_GROUND_OFFSET);
 
         if (fog.enabled) {
             fv.set(fog.colorArray, UBOGlobal.GLOBAL_FOG_COLOR_OFFSET);
 
             fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
             fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
             fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;
 
             fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
             fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
             fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;
         }
    }

    protected _updateUBOs (view: RenderView, cmdBuff: CommandBuffer) {
        const { exposure } = view.camera;

        if (this._validLights.length > this._lightBufferCount) {
            this._firstLightBufferView.destroy();

            this._lightBufferCount = nextPow2(this._validLights.length);
            this._lightBuffer.resize(this._lightBufferStride * this._lightBufferCount);
            this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);

            this._firstLightBufferView.initialize(new BufferViewInfo(this._lightBuffer, 0, UBOForwardLight.SIZE));
        }

        for (let l = 0, offset = 0; l < this._validLights.length; l++, offset += this._lightBufferElementCount) {
            const light = this._validLights[l];

            switch (light.type) {
            case LightType.SPHERE:
                const sphereLight = light as SphereLight;

                // UBOForwardLight
                Vec3.toArray(_vec4Array, sphereLight.position);
                _vec4Array[3] = 0;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_POS_OFFSET);

                _vec4Array[0] = sphereLight.size;
                _vec4Array[1] = sphereLight.range;
                _vec4Array[2] = 0.0;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }
                if (this._isHDR) {
                    _vec4Array[3] = sphereLight.luminance * this._fpScale * this._lightMeterScale;
                } else {
                    _vec4Array[3] = sphereLight.luminance * exposure * this._lightMeterScale;
                }
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_COLOR_OFFSET);
                break;
            case LightType.SPOT:
                const spotLight = light as SpotLight;

                // UBOForwardLight
                Vec3.toArray(_vec4Array, spotLight.position);
                _vec4Array[3] = 1;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_POS_OFFSET);

                _vec4Array[0] = spotLight.size;
                _vec4Array[1] = spotLight.range;
                _vec4Array[2] = spotLight.spotAngle;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                Vec3.toArray(_vec4Array, spotLight.direction);
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_DIR_OFFSET);

                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }
                if (this._isHDR) {
                    _vec4Array[3] = spotLight.luminance * this._fpScale * this._lightMeterScale;
                } else {
                    _vec4Array[3] = spotLight.luminance * exposure * this._lightMeterScale;
                }
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_COLOR_OFFSET);
                break;
            default:
            }
        }

        cmdBuff.updateBuffer(this._lightBuffer, this._lightBufferData);
    }

    protected _getOrCreateDescriptorSet (light: Light) {
        if (!this._descriptorSetMap.has(light)) {
            const device = this._device;
            const descriptorSet = device.createDescriptorSet(new DescriptorSetInfo(this._pipeline.descriptorSetLayout));

            const globalUBO = device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                UBOGlobal.SIZE,
                UBOGlobal.SIZE,
            ));
            descriptorSet.bindBuffer(UBOGlobal.BINDING, globalUBO);

            const shadowBUO = device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                UBOShadow.SIZE,
                UBOShadow.SIZE,
            ));
            descriptorSet.bindBuffer(UBOShadow.BINDING, shadowBUO);

            descriptorSet.update();

            this._descriptorSetMap.set(light, descriptorSet);

            return descriptorSet;
        }

        return this._descriptorSetMap.get(light);
    }
}
