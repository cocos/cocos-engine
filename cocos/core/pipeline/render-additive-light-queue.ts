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
import { RenderPipeline } from './render-pipeline';
import { InstancedBuffer } from './instanced-buffer';
import { Model } from '../renderer/scene/model';
import { PipelineStateManager } from './pipeline-state-manager';
import { Vec3, nextPow2, Mat4, Color } from '../math';
import { Sphere, intersect } from '../geometry';
import { Device, RenderPass, Buffer, BufferUsageBit, MemoryUsageBit,
    BufferInfo, BufferViewInfo, CommandBuffer } from '../gfx';
import { Pool } from '../memop';
import { RenderBatchedQueue } from './render-batched-queue';
import { RenderInstancedQueue } from './render-instanced-queue';
import { SphereLight } from '../renderer/scene/sphere-light';
import { SpotLight } from '../renderer/scene/spot-light';
import { SubModel } from '../renderer/scene/submodel';
import { getPhaseID } from './pass-phase';
import { Light, LightType } from '../renderer/scene/light';
import { SetIndex, UBOForwardLight, UBOGlobal, UBOShadow, UNIFORM_SHADOWMAP_BINDING,
    UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, supportsFloatTexture } from './define';
import { updatePlanarPROJ } from './scene-culling';
import { Camera, ShadowType } from '../renderer/scene';
import { GlobalDSManager } from './global-descriptor-set-manager';

interface IAdditiveLightPass {
    subModel: SubModel;
    passIdx: number;
    dynamicOffsets: number[];
    lights: number[];
}

const _lightPassPool = new Pool<IAdditiveLightPass>(() => ({ subModel: null!, passIdx: -1, dynamicOffsets: [], lights: [] }), 16);

const _vec4Array = new Float32Array(4);
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
    private _pipeline: RenderPipeline;
    private _device: Device;
    private _validPunctualLights: Light[] = [];
    private _lightPasses: IAdditiveLightPass[] = [];
    private _shadowUBO = new Float32Array(UBOShadow.COUNT);
    private _lightBufferCount = 16;
    private _lightBufferStride: number;
    private _lightBufferElementCount: number;
    private _lightBuffer: Buffer;
    private _firstLightBufferView: Buffer;
    private _lightBufferData: Float32Array;
    private _instancedQueue: RenderInstancedQueue;
    private _batchedQueue: RenderBatchedQueue;
    private _lightMeterScale = 10000.0;

    constructor (pipeline: RenderPipeline) {
        this._pipeline = pipeline;
        this._device = pipeline.device;
        this._instancedQueue = new RenderInstancedQueue();
        this._batchedQueue = new RenderBatchedQueue();

        const alignment = this._device.capabilities.uboOffsetAlignment;
        this._lightBufferStride = Math.ceil(UBOForwardLight.SIZE / alignment) * alignment;
        this._lightBufferElementCount = this._lightBufferStride / Float32Array.BYTES_PER_ELEMENT;

        this._lightBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._lightBufferStride * this._lightBufferCount,
            this._lightBufferStride,
        ));

        this._firstLightBufferView = this._device.createBuffer(new BufferViewInfo(this._lightBuffer, 0, UBOForwardLight.SIZE));

        this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);
    }

    public clear () {
        this._instancedQueue.clear();
        this._batchedQueue.clear();

        for (let i = 0; i < this._lightPasses.length; i++) {
            const lp = this._lightPasses[i];
            lp.dynamicOffsets.length = 0;
            lp.lights.length = 0;
        }
        _lightPassPool.freeArray(this._lightPasses);
        this._lightPasses.length = 0;
    }

    public destroy () {
        const descriptorSetMap = this._pipeline.globalDSManager.descriptorSetMap;
        const keys = descriptorSetMap.keys;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const descriptorSet = descriptorSetMap.get(key)!;
            if (descriptorSet) {
                descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
                descriptorSet.getTexture(UNIFORM_SHADOWMAP_BINDING).destroy();
                descriptorSet.getTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
                descriptorSet.destroy();
            }
            descriptorSetMap.delete(key);
        }
    }

    public gatherLightPasses (camera: Camera, cmdBuff: CommandBuffer) {
        this.clear();

        this._validPunctualLights = this._pipeline.pipelineSceneData.validPunctualLights;
        if (!this._validPunctualLights.length) { return; }

        this._updateUBOs(camera, cmdBuff);
        this._updateLightDescriptorSet(camera, cmdBuff);
        const renderObjects = this._pipeline.pipelineSceneData.renderObjects;
        for (let i = 0; i < renderObjects.length; i++) {
            const ro = renderObjects[i];
            const { model } = ro;
            const { subModels } = model;
            if (!getLightPassIndices(subModels, _lightPassIndices)) { continue; }

            _lightIndices.length = 0;

            this._lightCulling(model, this._validPunctualLights);

            if (!_lightIndices.length) { continue; }

            for (let j = 0; j < subModels.length; j++) {
                const lightPassIdx = _lightPassIndices[j];
                if (lightPassIdx < 0) { continue; }
                const subModel = subModels[j];
                const pass = subModel.passes[lightPassIdx];
                subModel.descriptorSet.bindBuffer(UBOForwardLight.BINDING, this._firstLightBufferView);
                subModel.descriptorSet.update();

                this._addRenderQueue(pass, subModel, model, lightPassIdx);
            }
        }
        this._instancedQueue.uploadBuffers(cmdBuff);
        this._batchedQueue.uploadBuffers(cmdBuff);
    }

    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        const globalDSManager: GlobalDSManager = this._pipeline.globalDSManager;
        for (let i = 0; i < this._lightPasses.length; i++) {
            const { subModel, passIdx, dynamicOffsets, lights } = this._lightPasses[i];
            const pass = subModel.passes[passIdx];
            const shader = subModel.shaders[passIdx];
            const ia = subModel.inputAssembler;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, ia);
            const matDS = pass.descriptorSet;
            const localDS = subModel.descriptorSet;

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, matDS);
            cmdBuff.bindInputAssembler(ia);

            for (let j = 0; j < dynamicOffsets.length; ++j) {
                const light = lights[j];
                const descriptorSet = globalDSManager.getOrCreateDescriptorSet(light)!;
                _dynamicOffsets[0] = dynamicOffsets[j];
                cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet);
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, localDS, _dynamicOffsets);
                cmdBuff.draw(ia);
            }
        }
    }

    // light culling
    protected _lightCulling (model:Model, validPunctualLights: Light[]) {
        for (let l = 0; l < validPunctualLights.length; l++) {
            const light = validPunctualLights[l];
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
    protected _addRenderQueue (pass: Pass, subModel: SubModel, model: Model, lightPassIdx: number) {
        const { batchingScheme } = pass;
        if (batchingScheme === BatchingSchemes.INSTANCING) {            // instancing
            for (let l = 0; l < _lightIndices.length; l++) {
                const idx = _lightIndices[l];
                const buffer = pass.getInstancedBuffer(idx);
                buffer.merge(subModel, model.instancedAttributes, lightPassIdx);
                buffer.dynamicOffsets[0] = this._lightBufferStride * idx;
                this._instancedQueue.queue.add(buffer);
            }
        } else if (batchingScheme === BatchingSchemes.VB_MERGING) {     // vb-merging
            for (let l = 0; l < _lightIndices.length; l++) {
                const idx = _lightIndices[l];
                const buffer = pass.getBatchedBuffer(idx);
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
                lp.lights.push(idx);
                lp.dynamicOffsets.push(this._lightBufferStride * idx);
            }

            this._lightPasses.push(lp);
        }
    }

    // update light DescriptorSet
    protected _updateLightDescriptorSet (camera: Camera, cmdBuff: CommandBuffer) {
        const device = this._pipeline.device;
        const sceneData = this._pipeline.pipelineSceneData;
        const shadowInfo = sceneData.shadows;
        const shadowFrameBufferMap = sceneData.shadowFrameBufferMap;
        const mainLight = camera.scene!.mainLight;
        const linear = 0.0;
        const packing = supportsFloatTexture(device) ? 0.0 : 1.0;
        const globalDSManager: GlobalDSManager = this._pipeline.globalDSManager;

        for (let i = 0; i < this._validPunctualLights.length; i++) {
            const light = this._validPunctualLights[i];
            const descriptorSet = globalDSManager.getOrCreateDescriptorSet(i);
            if (!descriptorSet) { continue; }
            let matShadowProj : Mat4;
            let matShadowInvProj : Mat4;
            switch (light.type) {
            case LightType.SPHERE:
                // planar PROJ
                if (mainLight) { updatePlanarPROJ(shadowInfo, mainLight, this._shadowUBO); }

                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 0] = shadowInfo.size.x;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 1] = shadowInfo.size.y;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 2] = shadowInfo.pcf;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 3] = shadowInfo.bias;

                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 0] = 2.0;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 1] = packing;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 2] = shadowInfo.normalBias;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 3] = 0.0;

                // Reserve sphere light shadow interface
                Color.toArray(this._shadowUBO, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
                break;
            case LightType.SPOT:

                // planar PROJ
                if (mainLight) { updatePlanarPROJ(shadowInfo, mainLight, this._shadowUBO); }

                // light view
                Mat4.invert(_matShadowView, (light as SpotLight).node!.getWorldMatrix());

                // light proj
                Mat4.perspective(_matShadowViewProj, (light as SpotLight).angle, (light as SpotLight).aspect, 0.001, (light as SpotLight).range);
                matShadowProj = _matShadowViewProj.clone();
                matShadowInvProj = _matShadowViewProj.clone().invert();

                // light viewProj
                Mat4.multiply(_matShadowViewProj, _matShadowViewProj, _matShadowView);

                Mat4.toArray(this._shadowUBO, _matShadowView, UBOShadow.MAT_LIGHT_VIEW_OFFSET);
                Mat4.toArray(this._shadowUBO, _matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

                this._shadowUBO[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 0] = 0.01;
                this._shadowUBO[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 1] = (light as SpotLight).range;
                this._shadowUBO[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 2] = linear;
                this._shadowUBO[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 3] = 1.0 - shadowInfo.saturation;

                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 0] = shadowInfo.size.x;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 1] = shadowInfo.size.y;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 2] = shadowInfo.pcf;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 3] = shadowInfo.bias;

                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 0] = 1.0;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 1] = packing;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 2] = shadowInfo.normalBias;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 3] = 0.0;

                this._shadowUBO[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 0] = matShadowProj.m10;
                this._shadowUBO[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 1] = matShadowProj.m14;
                this._shadowUBO[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 2] = matShadowProj.m11;
                this._shadowUBO[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 3] = matShadowProj.m15;

                this._shadowUBO[UBOShadow.SHADOW_INV_PROJ_DEPTH_INFO_OFFSET + 0] = matShadowInvProj.m10;
                this._shadowUBO[UBOShadow.SHADOW_INV_PROJ_DEPTH_INFO_OFFSET + 1] = matShadowInvProj.m14;
                this._shadowUBO[UBOShadow.SHADOW_INV_PROJ_DEPTH_INFO_OFFSET + 2] = matShadowInvProj.m11;
                this._shadowUBO[UBOShadow.SHADOW_INV_PROJ_DEPTH_INFO_OFFSET + 3] = matShadowInvProj.m15;

                this._shadowUBO[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 0] = matShadowProj.m00;
                this._shadowUBO[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 1] = matShadowProj.m05;
                this._shadowUBO[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 2] = 1.0 / matShadowProj.m00;
                this._shadowUBO[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 3] = 1.0 / matShadowProj.m05;

                Color.toArray(this._shadowUBO, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);

                // Spot light sampler binding
                if (shadowFrameBufferMap.has(light)) {
                    const texture = shadowFrameBufferMap.get(light)?.colorTextures[0];
                    if (texture) {
                        descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, texture);
                    }
                }
                break;
            default:
            }
            descriptorSet.update();

            cmdBuff.updateBuffer(descriptorSet.getBuffer(UBOShadow.BINDING)!, this._shadowUBO);
        }
    }

    protected _updateUBOs (camera: Camera, cmdBuff: CommandBuffer) {
        const { exposure } = camera;
        const sceneData = this._pipeline.pipelineSceneData;
        const isHDR = sceneData.isHDR;
        const shadowInfo = sceneData.shadows;

        if (this._validPunctualLights.length > this._lightBufferCount) {
            this._firstLightBufferView.destroy();

            this._lightBufferCount = nextPow2(this._validPunctualLights.length);
            this._lightBuffer.resize(this._lightBufferStride * this._lightBufferCount);
            this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);

            this._firstLightBufferView.initialize(new BufferViewInfo(this._lightBuffer, 0, UBOForwardLight.SIZE));
        }

        for (let l = 0, offset = 0; l < this._validPunctualLights.length; l++, offset += this._lightBufferElementCount) {
            const light = this._validPunctualLights[l];

            switch (light.type) {
            case LightType.SPHERE:
                // UBOForwardLight
                Vec3.toArray(_vec4Array, (light as SphereLight).position);
                _vec4Array[3] = 0;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_POS_OFFSET);

                _vec4Array[0] = (light as SphereLight).size;
                _vec4Array[1] = (light as SphereLight).range;
                _vec4Array[2] = 0.0;
                _vec4Array[3] = (shadowInfo.enabled && shadowInfo.type === ShadowType.ShadowMap) ? 1 : 0;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }
                if (isHDR) {
                    _vec4Array[3] = (light as SphereLight).luminance * exposure * this._lightMeterScale;
                } else {
                    _vec4Array[3] = (light as SphereLight).luminance;
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
                _vec4Array[3] = (shadowInfo.enabled && shadowInfo.type === ShadowType.ShadowMap) ? 1 : 0;
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
                if (isHDR) {
                    _vec4Array[3] = (light as SpotLight).luminance * exposure * this._lightMeterScale;
                } else {
                    _vec4Array[3] = (light as SpotLight).luminance;
                }
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_COLOR_OFFSET);
                break;
            default:
            }
        }

        cmdBuff.updateBuffer(this._lightBuffer, this._lightBufferData);
    }
}
