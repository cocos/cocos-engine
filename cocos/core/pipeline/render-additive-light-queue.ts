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
import { sphere, intersect } from '../geometry';
import { Device, RenderPass, Buffer, BufferUsageBit, MemoryUsageBit,
    BufferInfo, BufferViewInfo, CommandBuffer, Filter, Address, Sampler, DescriptorSet } from '../gfx';
import { Pool } from '../memop';
import { RenderBatchedQueue } from './render-batched-queue';
import { RenderInstancedQueue } from './render-instanced-queue';
import { RenderView } from './render-view';
import { SphereLight } from '../renderer/scene/sphere-light';
import { SpotLight } from '../renderer/scene/spot-light';
import { SubModel } from '../renderer/scene/submodel';
import { getPhaseID } from './pass-phase';
import { genSamplerHash, samplerLib } from '../renderer';
import { ShadowType } from '../renderer/scene/shadows';
import { Light, LightType } from '../renderer/scene/light';
import { IRenderObject, SetIndex, UBOForwardLight, UBOShadow, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from './define';

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
const _sphere = sphere.create(0, 0, 0, 1);
const _dynamicOffsets: number[] = [];
const _lightIndices: number[] = [];
const _matShadowView = new Mat4();
const _matShadowViewProj = new Mat4();
const _vec4ShadowInfo = new Vec4();

function cullSphereLight (light: SphereLight, model: Model) {
    return !!(model.worldBounds && !intersect.aabb_aabb(model.worldBounds, light.aabb));
}

function cullSpotLight (light: SpotLight, model: Model) {
    return !!(model.worldBounds
        && (!intersect.aabb_aabb(model.worldBounds, light.aabb) || !intersect.aabb_frustum(model.worldBounds, light.frustum)));
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

    private _lightBufferCount = 16;

    private _lightBufferStride: number;

    private _lightBufferElementCount: number;

    private _lightBuffer: Buffer;

    private _firstlightBufferView: Buffer;

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

        this._firstlightBufferView = this._device.createBuffer(new BufferViewInfo(this._lightBuffer, 0, UBOForwardLight.SIZE));

        this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);

        const shadowMapSamplerHash = genSamplerHash(_samplerInfo);
        this._sampler = samplerLib.getSampler(this._device, shadowMapSamplerHash);
    }

    public gatherLightPasses (view: RenderView, cmdBuff: CommandBuffer) {
        const validLights = this._validLights;
        const { sphereLights } = view.camera.scene!;

        this._instancedQueue.clear();
        this._batchedQueue.clear();
        validLights.length = 0;

        for (let i = 0; i < this._lightPasses.length; i++) {
            const lp = this._lightPasses[i];
            lp.dynamicOffsets.length = 0;
            lp.lights.length = 0;
        }
        _lightPassPool.freeArray(this._lightPasses);
        this._lightPasses.length = 0;

        for (let i = 0; i < sphereLights.length; i++) {
            const light = sphereLights[i];
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
            }
        }
        const { spotLights } = view.camera.scene!;
        for (let i = 0; i < spotLights.length; i++) {
            const light = spotLights[i];
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
            }
        }

        if (!validLights.length) { return; }

        this._updateUBOs(view, cmdBuff);

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
                subModel.descriptorSet.bindBuffer(UBOForwardLight.BINDING, this._firstlightBufferView);
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
                if (light.type === LightType.SPOT && this._pipeline.shadowFrameBufferMap.has(light) &&
                this._pipeline.shadows.type === ShadowType.ShadowMap) {
                    this._updateShadowUBO(localDS, light);
                }
                _dynamicOffsets[0] = dynamicOffsets[j];
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, localDS, _dynamicOffsets);
                cmdBuff.draw(ia);
            }
        }
    }

    // update spot light UBO
    protected _updateShadowUBO (descriptorSet: DescriptorSet, light: Light) {
        const shadowInfo = this._pipeline.shadows;
        const shadowUBO = this._pipeline.shadowUBO;
        const spotLight = light as SpotLight;
        // light view
        Mat4.invert(_matShadowView, spotLight.node!.getWorldMatrix());

        // light proj
        Mat4.perspective(_matShadowViewProj, spotLight.spotAngle, spotLight.aspect, 0.001, spotLight.range);

        // light viewProj
        Mat4.multiply(_matShadowViewProj, _matShadowViewProj, _matShadowView);

        Mat4.toArray(shadowUBO, _matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

        Color.toArray(shadowUBO, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);

        _vec4ShadowInfo.set(shadowInfo.size.x, shadowInfo.size.y, shadowInfo.pcf, shadowInfo.bias / 100.0);
        Vec4.toArray(shadowUBO, _vec4ShadowInfo, UBOShadow.SHADOW_INFO_OFFSET);

        descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, this._pipeline.shadowFrameBufferMap.get(light)!.colorTextures[0]!);
        descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, this._sampler!);
        descriptorSet.update();
        this._pipeline.descriptorSet.getBuffer(UBOShadow.BINDING).update(shadowUBO);
    }

    protected _updateUBOs (view: RenderView, cmdBuff: CommandBuffer) {
        const { exposure } = view.camera;

        if (this._validLights.length > this._lightBufferCount) {
            this._firstlightBufferView.destroy();

            this._lightBufferCount = nextPow2(this._validLights.length);
            this._lightBuffer.resize(this._lightBufferStride * this._lightBufferCount);
            this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);

            this._firstlightBufferView.initialize(new BufferViewInfo(this._lightBuffer, 0, UBOForwardLight.SIZE));
        }

        for (let l = 0, offset = 0; l < this._validLights.length; l++, offset += this._lightBufferElementCount) {
            const light = this._validLights[l];

            switch (light.type) {
            case LightType.SPHERE:
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
}
