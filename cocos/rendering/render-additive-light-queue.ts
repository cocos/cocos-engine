/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { BatchingSchemes, Pass } from '../render-scene/core/pass';
import { Model } from '../render-scene/scene/model';
import { PipelineStateManager } from './pipeline-state-manager';
import { Vec3, nextPow2, Mat4, Color, Pool, geometry, cclegacy } from '../core';
import { Device, RenderPass, Buffer, BufferUsageBit, MemoryUsageBit,
    BufferInfo, BufferViewInfo, CommandBuffer } from '../gfx';
import { RenderBatchedQueue } from './render-batched-queue';
import { RenderInstancedQueue } from './render-instanced-queue';
import { SphereLight } from '../render-scene/scene/sphere-light';
import { SpotLight } from '../render-scene/scene/spot-light';
import { SubModel } from '../render-scene/scene/submodel';
import { getPhaseID } from './pass-phase';
import { Light, LightType } from '../render-scene/scene/light';
import { SetIndex, UBOForwardLight, UBOShadow, UNIFORM_SHADOWMAP_BINDING,
    UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING, supportsR32FloatTexture, isEnableEffect } from './define';
import { Camera, ShadowType } from '../render-scene/scene';
import { GlobalDSManager } from './global-descriptor-set-manager';
import { PipelineUBO } from './pipeline-ubo';
import { PipelineRuntime } from './custom/pipeline';
import { getDescBindingFromName } from './custom/define';

interface IAdditiveLightPass {
    subModel: SubModel;
    passIdx: number;
    dynamicOffsets: number[];
    lights: Light[];
}

const _lightPassPool = new Pool<IAdditiveLightPass>(() => ({ subModel: null!, passIdx: -1, dynamicOffsets: [], lights: [] }), 16);

const _vec4Array = new Float32Array(4);
const _dynamicOffsets: number[] = [];
const _lightIndices: number[] = [];
const _matShadowView = new Mat4();
const _matShadowViewProj = new Mat4();

function cullSphereLight (light: SphereLight, model: Model) {
    return !!(model.worldBounds && !geometry.intersect.aabbWithAABB(model.worldBounds, light.aabb));
}

function cullSpotLight (light: SpotLight, model: Model) {
    return !!(model.worldBounds
        && (!geometry.intersect.aabbWithAABB(model.worldBounds, light.aabb) || !geometry.intersect.aabbFrustum(model.worldBounds, light.frustum)));
}

const phaseName = 'forward-add';
let _phaseID = getPhaseID(phaseName);
const _lightPassIndices: number[] = [];
function getLightPassIndices (subModels: SubModel[], lightPassIndices: number[]) {
    const r = cclegacy.rendering;
    if (isEnableEffect()) {
        _phaseID = r.getPhaseID(r.getPassID('default'), phaseName);
    }
    lightPassIndices.length = 0;
    let hasValidLightPass = false;
    for (let j = 0; j < subModels.length; j++) {
        const { passes } = subModels[j];
        let lightPassIndex = -1;
        for (let k = 0; k < passes.length; k++) {
            if (((!r || !r.enableEffectImport) && passes[k].phase === _phaseID)
            || (isEnableEffect() && passes[k].phaseID === _phaseID)) {
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
    private _pipeline: PipelineRuntime;
    private _device: Device;
    private _lightPasses: IAdditiveLightPass[] = [];
    private _instancedLightPassPool = _lightPassPool.alloc();
    private _batchedLightPassPool = _lightPassPool.alloc();
    private _shadowUBO = new Float32Array(UBOShadow.COUNT);
    private _lightBufferCount = 16;
    private _lightBufferStride: number;
    private _lightBufferElementCount: number;
    private _lightBuffer: Buffer;
    private _firstLightBufferView: Buffer;
    private _lightBufferData: Float32Array;
    private _instancedQueues: RenderInstancedQueue[] = [];
    private _batchedQueues: RenderBatchedQueue[] = [];
    private _lightMeterScale = 10000.0;

    constructor (pipeline: PipelineRuntime) {
        this._pipeline = pipeline;
        this._device = pipeline.device;

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
        this._instancedQueues.forEach((instancedQueue) => {
            instancedQueue.clear();
        });
        this._instancedQueues.length = 0;
        this._batchedQueues.forEach((batchedQueue) => {
            batchedQueue.clear();
        });
        this._batchedQueues.length = 0;

        for (let i = 0; i < this._lightPasses.length; i++) {
            const lp = this._lightPasses[i];
            lp.dynamicOffsets.length = 0;
            lp.lights.length = 0;
        }
        _lightPassPool.freeArray(this._lightPasses);
        this._lightPasses.length = 0;

        this._instancedLightPassPool.dynamicOffsets.length = 0;
        this._instancedLightPassPool.lights.length = 0;
        this._batchedLightPassPool.dynamicOffsets.length = 0;
        this._batchedLightPassPool.lights.length = 0;
    }

    public destroy () {
        const descriptorSetMap = this._pipeline.globalDSManager.descriptorSetMap;
        const keys = descriptorSetMap.keys;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const descriptorSet = descriptorSetMap.get(key)!;
            if (descriptorSet) {
                const binding = isEnableEffect() ? getDescBindingFromName('CCShadow') : UBOShadow.BINDING;
                descriptorSet.getBuffer(binding).destroy();
                descriptorSet.getTexture(UNIFORM_SHADOWMAP_BINDING).destroy();
                descriptorSet.getTexture(UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING).destroy();
                descriptorSet.destroy();
            }
            descriptorSetMap.delete(key);
        }
    }

    public gatherLightPasses (camera: Camera, cmdBuff: CommandBuffer) {
        this.clear();

        const validPunctualLights = this._pipeline.pipelineSceneData.validPunctualLights;
        if (!validPunctualLights.length) { return; }

        this._updateUBOs(camera, cmdBuff);
        this._updateLightDescriptorSet(camera, cmdBuff);
        const renderObjects = this._pipeline.pipelineSceneData.renderObjects;
        for (let i = 0; i < renderObjects.length; i++) {
            const ro = renderObjects[i];
            const { model } = ro;
            const { subModels } = model;
            if (!getLightPassIndices(subModels, _lightPassIndices)) { continue; }

            _lightIndices.length = 0;

            this._lightCulling(model, validPunctualLights);

            if (!_lightIndices.length) { continue; }

            for (let j = 0; j < subModels.length; j++) {
                const lightPassIdx = _lightPassIndices[j];
                if (lightPassIdx < 0) { continue; }
                const subModel = subModels[j];
                const pass = subModel.passes[lightPassIdx];
                // object has translucent base pass, prohibiting forward-add pass for multi light sources lighting
                const isTransparent = subModel.passes[0].blendState.targets[0].blend;
                if (isTransparent) {
                    continue;
                }
                const binding = isEnableEffect() ? getDescBindingFromName('CCForwardLight') : UBOForwardLight.BINDING;
                subModel.descriptorSet.bindBuffer(UBOForwardLight.BINDING, this._firstLightBufferView);
                subModel.descriptorSet.update();

                this._addRenderQueue(pass, subModel, model, lightPassIdx);
            }
        }

        // only for instanced and batched, no light culling applied
        for (let l = 0; l < validPunctualLights.length; l++) {
            const light = validPunctualLights[l];
            this._instancedLightPassPool.lights.push(light);
            this._instancedLightPassPool.dynamicOffsets.push(this._lightBufferStride * l);
            this._batchedLightPassPool.lights.push(light);
            this._batchedLightPassPool.dynamicOffsets.push(this._lightBufferStride * l);
        }

        this._instancedQueues.forEach((instancedQueue) => {
            instancedQueue.uploadBuffers(cmdBuff);
        });
        this._batchedQueues.forEach((batchedQueue) => {
            batchedQueue.uploadBuffers(cmdBuff);
        });
    }

    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        const globalDSManager: GlobalDSManager = this._pipeline.globalDSManager;
        for (let j = 0; j < this._instancedQueues.length; ++j) {
            const light = this._instancedLightPassPool.lights[j];
            _dynamicOffsets[0] = this._instancedLightPassPool.dynamicOffsets[j];
            const descriptorSet = globalDSManager.getOrCreateDescriptorSet(light);
            this._instancedQueues[j].recordCommandBuffer(device, renderPass, cmdBuff, descriptorSet, _dynamicOffsets);
        }

        for (let j = 0; j < this._batchedQueues.length; ++j) {
            const light = this._batchedLightPassPool.lights[j];
            _dynamicOffsets[0] = this._batchedLightPassPool.dynamicOffsets[j];
            const descriptorSet = globalDSManager.getOrCreateDescriptorSet(light);
            this._batchedQueues[j].recordCommandBuffer(device, renderPass, cmdBuff, descriptorSet, _dynamicOffsets);
        }

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
    protected _lightCulling (model: Model, validPunctualLights: Light[]) {
        let isCulled = false;
        for (let l = 0; l < validPunctualLights.length; l++) {
            const light = validPunctualLights[l];
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
        const validPunctualLights = this._pipeline.pipelineSceneData.validPunctualLights;
        const { batchingScheme } = pass;

        let lp: IAdditiveLightPass | null = null;
        if (batchingScheme === BatchingSchemes.NONE) {
            lp = _lightPassPool.alloc();
            lp.subModel = subModel;
            lp.passIdx = lightPassIdx;
        }

        for (let l = 0; l < _lightIndices.length; l++) {
            const lightIdx = _lightIndices[l];
            const light = validPunctualLights[lightIdx];
            const visibility = light.visibility;
            if (((visibility & model.node.layer) === model.node.layer)) {
                switch (batchingScheme) {
                case BatchingSchemes.INSTANCING: {
                    const buffer = pass.getInstancedBuffer(l);
                    buffer.merge(subModel, lightPassIdx);
                    buffer.dynamicOffsets[0] = this._lightBufferStride;
                    if (!this._instancedQueues[l]) { this._instancedQueues[l] = new RenderInstancedQueue(); }
                    this._instancedQueues[l].queue.add(buffer);
                } break;
                case BatchingSchemes.VB_MERGING: {
                    const buffer = pass.getBatchedBuffer(l);
                    buffer.merge(subModel, lightPassIdx, model);
                    buffer.dynamicOffsets[0] = this._lightBufferStride;
                    if (!this._batchedQueues[l]) { this._batchedQueues[l] = new RenderBatchedQueue(); }
                    this._batchedQueues[l].queue.add(buffer);
                } break;
                default:
                    lp!.lights.push(light);
                    lp!.dynamicOffsets.push(this._lightBufferStride * lightIdx);
                }
            }
        }

        if (batchingScheme === BatchingSchemes.NONE) {
            this._lightPasses.push(lp!);
        }
    }

    // update light DescriptorSet
    protected _updateLightDescriptorSet (camera: Camera, cmdBuff: CommandBuffer) {
        const device = this._pipeline.device;
        const sceneData = this._pipeline.pipelineSceneData;
        const shadowInfo = sceneData.shadows;
        const shadowFrameBufferMap = sceneData.shadowFrameBufferMap;
        const mainLight = camera.scene!.mainLight;
        const packing = supportsR32FloatTexture(device) ? 0.0 : 1.0;
        const globalDSManager: GlobalDSManager = this._pipeline.globalDSManager;
        const validPunctualLights = sceneData.validPunctualLights;
        const cap = this._pipeline.device.capabilities;

        for (let i = 0; i < validPunctualLights.length; i++) {
            const light = validPunctualLights[i];
            const descriptorSet = globalDSManager.getOrCreateDescriptorSet(light);
            if (!descriptorSet) { continue; }
            let matShadowProj: Mat4;
            let matShadowInvProj: Mat4;
            switch (light.type) {
            case LightType.SPHERE: {
                // planar PROJ
                if (mainLight) {
                    PipelineUBO.updatePlanarNormalAndDistance(shadowInfo, this._shadowUBO);
                }

                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 0] = shadowInfo.size.x;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 1] = shadowInfo.size.y;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 2] = 1.0;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 3] = 0.0;

                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 0] = 2.0;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 1] = packing;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 2] = 0.0;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 3] = 0.0;

                // Reserve sphere light shadow interface
                Color.toArray(this._shadowUBO, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
                break;
            }
            case LightType.SPOT: {
                const spotLight = light as SpotLight;

                // planar PROJ
                if (mainLight) {
                    PipelineUBO.updatePlanarNormalAndDistance(shadowInfo, this._shadowUBO);
                }

                // light view
                Mat4.invert(_matShadowView, (light as SpotLight).node!.getWorldMatrix());

                // light proj
                Mat4.perspective(_matShadowViewProj, (light as SpotLight).angle, 1.0, 0.001, (light as SpotLight).range,
                    true, cap.clipSpaceMinZ, cap.clipSpaceSignY, 0);
                matShadowProj = _matShadowViewProj.clone();
                matShadowInvProj = _matShadowViewProj.clone().invert();

                // light viewProj
                Mat4.multiply(_matShadowViewProj, _matShadowViewProj, _matShadowView);

                Mat4.toArray(this._shadowUBO, _matShadowView, UBOShadow.MAT_LIGHT_VIEW_OFFSET);
                Mat4.toArray(this._shadowUBO, _matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

                this._shadowUBO[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 0] = 0.01;
                this._shadowUBO[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 1] = (light as SpotLight).range;
                this._shadowUBO[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 2] = 0.0;
                this._shadowUBO[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 3] = 0.0;

                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 0] = shadowInfo.size.x;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 1] = shadowInfo.size.y;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 2] = spotLight.shadowPcf;
                this._shadowUBO[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 3] = spotLight.shadowBias;

                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 0] = 1.0;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 1] = packing;
                this._shadowUBO[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 2] = spotLight.shadowNormalBias;
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
                        descriptorSet.bindTexture(UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING, texture);
                    }
                }
                break;
            }
            default:
            }
            descriptorSet.update();
            const binding = isEnableEffect() ? getDescBindingFromName('CCShadow') : UBOShadow.BINDING;
            cmdBuff.updateBuffer(descriptorSet.getBuffer(binding)!, this._shadowUBO);
        }
    }

    protected _updateUBOs (camera: Camera, cmdBuff: CommandBuffer) {
        const { exposure } = camera;
        const sceneData = this._pipeline.pipelineSceneData;
        const isHDR = sceneData.isHDR;
        const shadowInfo = sceneData.shadows;
        const validPunctualLights = sceneData.validPunctualLights;

        if (validPunctualLights.length > this._lightBufferCount) {
            this._firstLightBufferView.destroy();

            this._lightBufferCount = nextPow2(validPunctualLights.length);
            this._lightBuffer.resize(this._lightBufferStride * this._lightBufferCount);
            this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);

            this._firstLightBufferView.initialize(new BufferViewInfo(this._lightBuffer, 0, UBOForwardLight.SIZE));
        }

        for (let l = 0, offset = 0; l < validPunctualLights.length; l++, offset += this._lightBufferElementCount) {
            const light = validPunctualLights[l];

            switch (light.type) {
            case LightType.SPHERE:
                // UBOForwardLight
                Vec3.toArray(_vec4Array, (light as SphereLight).position);
                _vec4Array[3] = 0;
                this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_POS_OFFSET);

                _vec4Array[0] = (light as SphereLight).size;
                _vec4Array[1] = (light as SphereLight).range;
                _vec4Array[2] = 0.0;
                _vec4Array[3] = 0.0;
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
                _vec4Array[3] = (shadowInfo.enabled && (light as SpotLight).shadowEnabled && shadowInfo.type === ShadowType.ShadowMap) ? 1 : 0;
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
