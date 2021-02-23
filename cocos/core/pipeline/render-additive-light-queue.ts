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
import { BatchingSchemes, Pass } from '../renderer/core/pass';
import { ForwardPipeline } from './forward/forward-pipeline';
import { InstancedBuffer } from './instanced-buffer';
import { Model } from '../renderer/scene/model';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassView, PassPool, SubModelPool, SubModelView,
    ShaderHandle } from '../renderer/core/memory-pools';
import { Vec3, nextPow2, Mat4, Vec4, Color } from '../math';
import { Sphere, intersect } from '../geometry';
import { Device, RenderPass, Buffer, BufferUsageBit, MemoryUsageBit,
    BufferInfo, BufferViewInfo, CommandBuffer, Filter, Address, Sampler, DescriptorSet, Texture, DescriptorSetInfo } from '../gfx';
import { Pool } from '../memop';
import { RenderBatchedQueue } from './render-batched-queue';
import { RenderInstancedQueue } from './render-instanced-queue';
import { SphereLight } from '../renderer/scene/sphere-light';
import { SpotLight } from '../renderer/scene/spot-light';
import { SubModel } from '../renderer/scene/submodel';
import { getPhaseID } from './pass-phase';
import { Light, LightType } from '../renderer/scene/light';
import { IRenderObject, SetIndex, UBOForwardLight, UBOGlobal, UBOShadow, UBOCamera, UNIFORM_SHADOWMAP_BINDING,
    UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from './define';
import { legacyCC } from '../global-exports';
import { genSamplerHash, samplerLib } from '../renderer/core/sampler-lib';
import { builtinResMgr } from '../builtin/builtin-res-mgr';
import { Texture2D } from '../assets/texture-2d';
import { updatePlanarPROJ } from './forward/scene-culling';
import { Camera } from '../renderer/scene';

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

const _lightPassPool = new Pool<IAdditiveLightPass>(() => ({ subModel: null!, passIdx: -1, dynamicOffsets: [], lights: [] }), 16);

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

    private _cameraUBO = new Float32Array(UBOCamera.COUNT);

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

    private _lightMeterScale = 10000.0;

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
        const descriptorSets = Array.from(this._descriptorSetMap.values());
        for (let i = 0; i < descriptorSets.length; ++i) {
            const descriptorSet = descriptorSets[i];
            if (descriptorSet) {
                descriptorSet.getBuffer(UBOGlobal.BINDING).destroy();
                descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
                descriptorSet.getSampler(UNIFORM_SHADOWMAP_BINDING).destroy();
                descriptorSet.getSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
                descriptorSet.getTexture(UNIFORM_SHADOWMAP_BINDING).destroy();
                descriptorSet.getTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
                descriptorSet.destroy();
            }
        }
        this._descriptorSetMap.clear();
    }

    public gatherLightPasses (camera: Camera, cmdBuff: CommandBuffer) {
        const validLights = this._validLights;

        this.clear();

        this._gatherValidLights(camera, validLights);

        if (!validLights.length) { return; }

        this._updateUBOs(camera, cmdBuff);
        this._updateLightDescriptorSet(camera, cmdBuff);

        for (let i = 0; i < this._renderObjects.length; i++) {
            const ro = this._renderObjects[i];
            const { model } = ro;
            const { subModels } = model;
            if (!getLightPassIndices(subModels, _lightPassIndices)) { continue; }

            _lightIndices.length = 0;

            this._lightCulling(model, validLights);

            if (!_lightIndices.length) { continue; }

            for (let j = 0; j < subModels.length; j++) {
                const lightPassIdx = _lightPassIndices[j];
                if (lightPassIdx < 0) { continue; }
                const subModel = subModels[j];
                const pass = subModel.passes[lightPassIdx];
                subModel.descriptorSet.bindBuffer(UBOForwardLight.BINDING, this._firstLightBufferView);
                subModel.descriptorSet.update();

                this._addRenderQueue(pass, subModel, model, lightPassIdx, validLights);
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

    // gather validLights
    protected _gatherValidLights (camera: Camera, validLights: Light[]) {
        const { sphereLights } = camera.scene!;
        for (let i = 0; i < sphereLights.length; i++) {
            const light = sphereLights[i];
            if (light.baked) {
                continue;
            }

            Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, camera.frustum)) {
                validLights.push(light);
                this._getOrCreateDescriptorSet(light);
            }
        }
        const { spotLights } = camera.scene!;
        for (let i = 0; i < spotLights.length; i++) {
            const light = spotLights[i];
            if (light.baked) {
                continue;
            }

            Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, camera.frustum)) {
                validLights.push(light);
                this._getOrCreateDescriptorSet(light);
            }
        }
    }

    // light culling
    protected _lightCulling (model:Model, validLights: Light[]) {
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
    }

    // add renderQueue
    protected _addRenderQueue (pass: Pass, subModel: SubModel, model: Model, lightPassIdx: number, validLights: Light[]) {
        const { batchingScheme } = pass;
        if (batchingScheme === BatchingSchemes.INSTANCING) {            // instancing
            for (let l = 0; l < _lightIndices.length; l++) {
                const idx = _lightIndices[l];
                const buffer = InstancedBuffer.get(pass, idx);
                buffer.merge(subModel, model.instancedAttributes, lightPassIdx);
                buffer.dynamicOffsets[0] = this._lightBufferStride * idx;
                this._instancedQueue.queue.add(buffer);
            }
        } else if (batchingScheme === BatchingSchemes.VB_MERGING) {     // vb-merging
            for (let l = 0; l < _lightIndices.length; l++) {
                const idx = _lightIndices[l];
                const buffer = BatchedBuffer.get(pass, idx);
                buffer.merge(subModel, lightPassIdx, model);
                buffer.dynamicOffsets[0] = this._lightBufferStride * idx;
                this._batchedQueue.queue.add(buffer);
            }
        } else {                                                         // standard draw
            const lp = _lightPassPool.alloc();
            lp.subModel = subModel;
            lp.passIdx = lightPassIdx;
            for (let l = 0; l < _lightIndices.length; l++) {
                const idx = _lightIndices[l];
                lp.lights.push(validLights[idx]);
                lp.dynamicOffsets.push(this._lightBufferStride * idx);
            }

            this._lightPasses.push(lp);
        }
    }

    // update light DescriptorSet
    protected _updateLightDescriptorSet (camera: Camera, cmdBuff: CommandBuffer) {
        const shadowInfo = this._pipeline.shadows;
        const mainLight = camera.scene!.mainLight;

        for (let i = 0; i < this._validLights.length; i++) {
            const light = this._validLights[i];
            const descriptorSet = this._getOrCreateDescriptorSet(light);
            if (!descriptorSet) { continue; }

            this._updateGlobalDescriptorSet(camera, cmdBuff);

            switch (light.type) {
            case LightType.SPHERE:
                // planar PROJ
                if (mainLight) { updatePlanarPROJ(shadowInfo, mainLight, this._shadowUBO); }

                // Reserve sphere light shadow interface
                Color.toArray(this._shadowUBO, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);

                this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 0] = shadowInfo.size.x;
                this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 1] = shadowInfo.size.y;
                this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 2] = shadowInfo.pcf;
                this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 3] = shadowInfo.bias;
                break;
            case LightType.SPOT:

                // planar PROJ
                if (mainLight) { updatePlanarPROJ(shadowInfo, mainLight, this._shadowUBO); }

                // light view
                Mat4.invert(_matShadowView, (light as SpotLight).node!.getWorldMatrix());

                // light proj
                Mat4.perspective(_matShadowViewProj, (light as SpotLight).spotAngle, (light as SpotLight).aspect, 0.001, (light as SpotLight).range);

                // light viewProj
                Mat4.multiply(_matShadowViewProj, _matShadowViewProj, _matShadowView);

                Mat4.toArray(this._shadowUBO, _matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

                Color.toArray(this._shadowUBO, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);

                this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 0] = shadowInfo.size.x;
                this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 1] = shadowInfo.size.y;
                this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 2] = shadowInfo.pcf;
                this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 3] = shadowInfo.bias;
                // Spot light sampler binding
                if (this._pipeline.shadowFrameBufferMap.has(light)) {
                    if (this._pipeline.shadowFrameBufferMap.has(light)) {
                        const texture = this._pipeline.shadowFrameBufferMap.get(light)?.colorTextures[0];
                        if (texture) {
                            descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, texture);
                        }
                    }
                }
                break;
            default:
            }
            descriptorSet.update();

            cmdBuff.updateBuffer(descriptorSet.getBuffer(UBOGlobal.BINDING)!, this._globalUBO);
            cmdBuff.updateBuffer(descriptorSet.getBuffer(UBOCamera.BINDING)!, this._cameraUBO);
            cmdBuff.updateBuffer(descriptorSet.getBuffer(UBOShadow.BINDING)!, this._shadowUBO);
        }
    }

    protected _updateGlobalDescriptorSet (camera: Camera, cmdBuff: CommandBuffer) {
        const root = legacyCC.director.root;
        const device = this._pipeline.device;
        const fv = this._globalUBO;

        const shadingWidth = Math.floor(device.width);
        const shadingHeight = Math.floor(device.height);

        // update UBOGlobal
        fv[UBOGlobal.TIME_OFFSET] = root.cumulativeTime;
        fv[UBOGlobal.TIME_OFFSET + 1] = root.frameTime;
        fv[UBOGlobal.TIME_OFFSET + 2] = legacyCC.director.getTotalFrames();

        fv[UBOGlobal.SCREEN_SIZE_OFFSET] = device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = device.height;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / device.height;

        fv[UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];

        this._updateCameraUBO(camera);
    }

    protected _updateCameraUBO (camera: Camera) {
        const pipeline = this._pipeline;
        const scene = camera.scene!;
        const mainLight = scene.mainLight;
        const ambient = pipeline.ambient;
        const shadingScale = pipeline.shadingScale;
        const device = this._pipeline.device;
        const shadingWidth = Math.floor(device.width);
        const shadingHeight = Math.floor(device.height);
        const fog = pipeline.fog;

        const cv = this._cameraUBO;
        cv[UBOCamera.SCREEN_SCALE_OFFSET] = camera.width / shadingWidth * shadingScale;
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 1] = camera.height / shadingHeight * shadingScale;
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 2] = 1.0 / cv[UBOCamera.SCREEN_SCALE_OFFSET];
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 3] = 1.0 / cv[UBOCamera.SCREEN_SCALE_OFFSET + 1];

        const exposure = camera.exposure;
        cv[UBOCamera.EXPOSURE_OFFSET] = exposure;
        cv[UBOCamera.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        cv[UBOCamera.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
        cv[UBOCamera.EXPOSURE_OFFSET + 3] = this._fpScale / exposure;

        if (mainLight) {
            Vec3.toArray(cv, mainLight.direction, UBOCamera.MAIN_LIT_DIR_OFFSET);
            Vec3.toArray(cv, mainLight.color, UBOCamera.MAIN_LIT_COLOR_OFFSET);
            if (mainLight.useColorTemperature) {
                const colorTempRGB = mainLight.colorTemperatureRGB;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
            }

            if (this._isHDR) {
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * this._fpScale;
            } else {
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
            }
        } else {
            Vec3.toArray(cv, Vec3.UNIT_Z, UBOCamera.MAIN_LIT_DIR_OFFSET);
            Vec4.toArray(cv, Vec4.ZERO, UBOCamera.MAIN_LIT_COLOR_OFFSET);
        }
        Mat4.toArray(cv, camera.matView, UBOCamera.MAT_VIEW_OFFSET);
        Mat4.toArray(cv, camera.node.worldMatrix, UBOCamera.MAT_VIEW_INV_OFFSET);
        Mat4.toArray(cv, camera.matProj, UBOCamera.MAT_PROJ_OFFSET);
        Mat4.toArray(cv, camera.matProjInv, UBOCamera.MAT_PROJ_INV_OFFSET);
        Mat4.toArray(cv, camera.matViewProj, UBOCamera.MAT_VIEW_PROJ_OFFSET);
        Mat4.toArray(cv, camera.matViewProjInv, UBOCamera.MAT_VIEW_PROJ_INV_OFFSET);
        Vec3.toArray(cv, camera.position, UBOCamera.CAMERA_POS_OFFSET);
        let projectionSignY = device.screenSpaceSignY;
        if (camera.window!.hasOffScreenAttachments) {
            projectionSignY *= device.UVSpaceSignY; // need flipping if drawing on render targets
        }
        cv[UBOCamera.CAMERA_POS_OFFSET + 3] = projectionSignY;

        const skyColor = ambient.colorArray;
        if (this._isHDR) {
            skyColor[3] = ambient.skyIllum * this._fpScale;
        } else {
            skyColor[3] = ambient.skyIllum * exposure;
        }
        cv.set(skyColor, UBOCamera.AMBIENT_SKY_OFFSET);
        cv.set(ambient.albedoArray, UBOCamera.AMBIENT_GROUND_OFFSET);

        cv.set(fog.colorArray, UBOCamera.GLOBAL_FOG_COLOR_OFFSET);

        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;
    }

    protected _updateUBOs (camera: Camera, cmdBuff: CommandBuffer) {
        const { exposure } = camera;

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
                // UBOForwardLight
                Vec3.toArray(_vec4Array, (light as SphereLight).position);
                _vec4Array[3] = 0;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_POS_OFFSET);

                _vec4Array[0] = (light as SphereLight).size;
                _vec4Array[1] = (light as SphereLight).range;
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
                    _vec4Array[3] = (light as SphereLight).luminance * this._fpScale * this._lightMeterScale;
                } else {
                    _vec4Array[3] = (light as SphereLight).luminance * exposure * this._lightMeterScale;
                }
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_COLOR_OFFSET);
                break;
            case LightType.SPOT:
                // UBOForwardLight
                Vec3.toArray(_vec4Array, (light as SpotLight).position);
                _vec4Array[3] = 1;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_POS_OFFSET);

                _vec4Array[0] = (light as SpotLight).size;
                _vec4Array[1] = (light as SpotLight).range;
                _vec4Array[2] = (light as SpotLight).spotAngle;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                Vec3.toArray(_vec4Array, (light as SpotLight).direction);
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_DIR_OFFSET);

                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }
                if (this._isHDR) {
                    _vec4Array[3] = (light as SpotLight).luminance * this._fpScale * this._lightMeterScale;
                } else {
                    _vec4Array[3] = (light as SpotLight).luminance * exposure * this._lightMeterScale;
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

            const cameraBUO = device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                UBOCamera.SIZE,
                UBOCamera.SIZE,
            ));
            descriptorSet.bindBuffer(UBOCamera.BINDING, cameraBUO);

            const shadowBUO = device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                UBOShadow.SIZE,
                UBOShadow.SIZE,
            ));
            descriptorSet.bindBuffer(UBOShadow.BINDING, shadowBUO);

            descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, this._sampler!);
            descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
            descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, this._sampler!);
            descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);

            descriptorSet.update();

            this._descriptorSetMap.set(light, descriptorSet);

            return descriptorSet;
        }

        return this._descriptorSetMap.get(light);
    }
}
