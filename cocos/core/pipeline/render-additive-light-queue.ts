/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, UBOForwardLight, SetIndex } from './define';
import { Light, LightType, SphereLight, SpotLight, DirectionalLight, BatchingSchemes } from '../renderer';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassView, PassPool, SubModelPool, SubModelView } from '../renderer/core/memory-pools';
import { Vec3, nextPow2 } from '../../core/math';
import { RenderView } from './render-view';
import { sphere, intersect } from '../geometry';
import { cullDirectionalLight, cullSphereLight, cullSpotLight } from './culling';
import { GFXDevice, GFXRenderPass, GFXBuffer, GFXBufferUsageBit, GFXMemoryUsageBit } from '../gfx';
import { Pool } from '../memop';
import { InstancedBuffer } from './instanced-buffer';
import { BatchedBuffer } from './batched-buffer';
import { ForwardPipeline } from '../../../exports/base';
import { RenderInstancedQueue } from './render-instanced-queue';
import { RenderBatchedQueue } from './render-batched-queue';

interface IAdditiveLightPass {
    subModel: SubModel;
    passIdx: number;
    dynamicOffsets: number[];
}

const _lightPassPool = new Pool<IAdditiveLightPass>(() => ({ subModel: null!, passIdx: -1, dynamicOffsets: [] }), 16);

const _tempVec3 = new Vec3();
const _vec4Array = new Float32Array(4);
const _sphere = sphere.create(0, 0, 0, 1);
const _dynamicOffsets: number[] = [];

/**
 * @zh 叠加光照队列。
 */
export class RenderAdditiveLightQueue {

    private _validLights: Light[] = [];
    private _lightIndexOffsets: number[] = [];
    private _lightIndices: number[] = [];
    private _lightPasses: IAdditiveLightPass[] = [];

    private _lightBufferCount = 16;
    private _lightBufferStride: number;
    private _lightBufferElementCount: number;
    private _lightBuffer: GFXBuffer;
    private _firstlightBufferView: GFXBuffer;
    private _lightBufferData: Float32Array;

    private _isHDR: boolean;
    private _fpScale: number;
    private _renderObjects: IRenderObject[];
    private _instancedQueue: RenderInstancedQueue;
    private _batchedQueue: RenderBatchedQueue;
    private _lightMeterScale: number = 10000.0;

    constructor (pipeline: ForwardPipeline) {
        this._isHDR = pipeline.isHDR;
        this._fpScale = pipeline.fpScale;
        this._renderObjects = pipeline.renderObjects;
        this._instancedQueue = new RenderInstancedQueue();
        this._batchedQueue = new RenderBatchedQueue();

        const device = pipeline.device;
        this._lightBufferStride = Math.ceil(UBOForwardLight.SIZE / device.uboOffsetAlignment) * device.uboOffsetAlignment;
        this._lightBufferElementCount = this._lightBufferStride / Float32Array.BYTES_PER_ELEMENT;

        this._lightBuffer = device.createBuffer({
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            usage: GFXBufferUsageBit.UNIFORM,
            stride: this._lightBufferStride,
            size: this._lightBufferStride * this._lightBufferCount,
        });

        this._firstlightBufferView = device.createBuffer({
            buffer: this._lightBuffer,
            offset: 0,
            range: UBOForwardLight.SIZE,
        });

        this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);
    }

    public sceneCulling (view: RenderView) {

        const validLights = this._validLights;
        const lightIndexOffsets = this._lightIndexOffsets;
        const lightIndices = this._lightIndices;

        this._instancedQueue.clear();
        this._batchedQueue.clear();
        validLights.length = lightIndexOffsets.length = lightIndices.length = 0;
        const sphereLights = view.camera.scene!.sphereLights;

        for (let i = 0; i < sphereLights.length; i++) {
            const light = sphereLights[i];
            light.update();
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
            }
        }
        const spotLights = view.camera.scene!.spotLights;
        for (let i = 0; i < spotLights.length; i++) {
            const light = spotLights[i];
            light.update();
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
            }
        }

        if (validLights.length > 0) {
            for (let i = 0; i < this._renderObjects.length; i++) {
                const model = this._renderObjects[i].model;

                lightIndexOffsets[i] = lightIndices.length;

                if (model.node) {
                    model.node.getWorldPosition(_tempVec3);
                } else {
                    _tempVec3.set(0.0, 0.0, 0.0);
                }
                for (let j = 0; j < validLights.length; j++) {
                    let isCulled = false;
                    switch (validLights[j].type) {
                        case LightType.DIRECTIONAL:
                            isCulled = cullDirectionalLight(validLights[j] as DirectionalLight, model);
                            break;
                        case LightType.SPHERE:
                            isCulled = cullSphereLight(validLights[j] as SphereLight, model);
                            break;
                        case LightType.SPOT:
                            isCulled = cullSpotLight(validLights[j] as SpotLight, model);
                            break;
                    }
                    if (!isCulled) {
                        lightIndices.push(j);
                    }
                }
            }
        }

        if (validLights.length > this._lightBufferCount) {
            this._lightBufferCount = nextPow2(validLights.length);
            this._lightBuffer.resize(this._lightBufferStride * this._lightBufferCount);
            this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);
        }

        for (let i = 0; i < this._lightPasses.length; i++) {
            const lp = this._lightPasses[i];
            lp.dynamicOffsets.length = 0;
        }
        _lightPassPool.freeArray(this._lightPasses);
        this._lightPasses.length = 0;
    }

    public updateUBOs (view: RenderView) {
        const exposure = view.camera.exposure;

        for(let l = 0, offset = 0; l < this._validLights.length; ++l, offset += this._lightBufferElementCount) {
            const light = this._validLights[l];

            switch (light.type) {
                case LightType.SPHERE:
                    const sphereLit = light as SphereLight;
                    Vec3.toArray(_vec4Array, sphereLit.position);
                    _vec4Array[3] = 0;
                    this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_POS_OFFSET);

                    _vec4Array[0] = sphereLit.size;
                    _vec4Array[1] = sphereLit.range;
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
                        _vec4Array[3] = sphereLit.luminance * this._fpScale * this._lightMeterScale;
                    } else {
                        _vec4Array[3] = sphereLit.luminance * exposure * this._lightMeterScale;
                    }
                    this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_COLOR_OFFSET);
                break;
                case LightType.SPOT:
                    const spotLit = light as SpotLight;

                    Vec3.toArray(_vec4Array, spotLit.position);
                    _vec4Array[3] = 1;
                    this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_POS_OFFSET);

                    _vec4Array[0] = spotLit.size;
                    _vec4Array[1] = spotLit.range;
                    _vec4Array[2] = spotLit.spotAngle;
                    this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                    Vec3.toArray(_vec4Array, spotLit.direction);
                    this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_DIR_OFFSET);

                    Vec3.toArray(_vec4Array, light.color);
                    if (light.useColorTemperature) {
                        const tempRGB = light.colorTemperatureRGB;
                        _vec4Array[0] *= tempRGB.x;
                        _vec4Array[1] *= tempRGB.y;
                        _vec4Array[2] *= tempRGB.z;
                    }
                    if (this._isHDR) {
                        _vec4Array[3] = spotLit.luminance * this._fpScale * this._lightMeterScale;
                    } else {
                        _vec4Array[3] = spotLit.luminance * exposure * this._lightMeterScale;
                    }
                    this._lightBufferData.set(_vec4Array, offset + UBOForwardLight.LIGHT_COLOR_OFFSET);
                break;
            }
        }
        this._lightBuffer.update(this._lightBufferData);
    }

    public add (roIdx: number, subModelIdx: number, passIdx: number) {
        const begIdx = this._lightIndexOffsets[roIdx];
        const endIdx = roIdx + 1 < this._renderObjects.length ? this._lightIndexOffsets[roIdx + 1] : this._lightIndices.length;

        if (begIdx < endIdx) {
            const ro = this._renderObjects[roIdx];
            const model = ro.model;
            const subModel = model.subModels[subModelIdx];
            const pass = subModel.passes[passIdx];
            const batchingScheme = pass.batchingScheme;

            subModel.descriptorSet.bindBuffer(UBOForwardLight.BLOCK.binding, this._firstlightBufferView);
            subModel.descriptorSet.update();

            if (batchingScheme === BatchingSchemes.INSTANCING) { // instancing
                for (let i = begIdx; i < endIdx; i++) {
                    const idx = this._lightIndices[i];
                    const buffer = InstancedBuffer.get(pass, idx);
                    buffer.merge(subModel, model.instancedAttributes, passIdx);
                    buffer.dynamicOffsets[0] = this._lightBufferStride * idx;
                    this._instancedQueue.queue.add(buffer);
                }
            } else if (batchingScheme === BatchingSchemes.VB_MERGING) { // vb-merging
                for (let i = begIdx; i < endIdx; i++) {
                    const idx = this._lightIndices[i];
                    const buffer = BatchedBuffer.get(pass, idx);
                    buffer.merge(subModel, passIdx, ro);
                    buffer.dynamicOffsets[0] = this._lightBufferStride * this._lightIndices[idx];
                    this._batchedQueue.queue.add(buffer);
                }
            } else { // standard draw
                const lp = _lightPassPool.alloc();
                lp.subModel = subModel;
                lp.passIdx = passIdx;
                for (let i = begIdx; i < endIdx; i++) {
                    lp.dynamicOffsets.push(this._lightBufferStride * this._lightIndices[i]);
                }

                this._lightPasses.push(lp);
            }
        }
    }

    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        for (let i = 0; i < this._lightPasses.length; i++) {
            const { subModel, passIdx, dynamicOffsets } = this._lightPasses[i];
            const shader = ShaderPool.get(SubModelPool.get(subModel.handle, SubModelView.SHADER_0 + passIdx));
            const pass = subModel.passes[passIdx];
            const ia = subModel.inputAssembler;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass.handle, shader, renderPass, ia);
            const matDS = DSPool.get(PassPool.get(pass.handle, PassView.DESCRIPTOR_SET));
            const localDS = subModel.descriptorSet;

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, matDS);
            cmdBuff.bindInputAssembler(ia);

            for (let j = 0; j < dynamicOffsets.length; ++j) {
                _dynamicOffsets[0] = dynamicOffsets[j];
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, localDS, _dynamicOffsets);
                cmdBuff.draw(ia);
            }
        }
    }
}
