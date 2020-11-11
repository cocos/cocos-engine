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

import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, SetIndex, UBOShadow } from './define';
import { Device, RenderPass, Buffer, Shader, CommandBuffer, DescriptorSet } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { ShaderPool, SubModelPool, SubModelView, ShaderHandle } from '../renderer/core/memory-pools';
import { Pass } from '../renderer/core/pass';
import { RenderInstancedQueue } from './render-instanced-queue';
import { BatchingSchemes } from '../renderer/core/pass';
import { InstancedBuffer } from './instanced-buffer';
import { RenderBatchedQueue } from './render-batched-queue';
import { BatchedBuffer } from './batched-buffer';
import { Color, Mat4, Vec4, Vec3 } from '../math';
import { Shadows, ShadowType } from '../renderer/scene/shadows';
import { ForwardPipeline } from './forward/forward-pipeline';
import { Light, LightType } from '../renderer/scene/light';
import { SpotLight } from '../renderer/scene/spot-light';
import { intersect } from '../geometry';
import { Model } from '../renderer/scene/model';
import { DirectionalLight } from '../renderer/scene/directional-light';
import { getShadowWorldMatrix } from './forward/scene-culling';

const _matShadowView = new Mat4();
const _matShadowViewProj = new Mat4();
const _vec4ShadowInfo = new Vec4();
const _vec3Center = new Vec3();

const _phaseID = getPhaseID('shadow-caster');
function getShadowPassIndex (subModels: SubModel[]) {
    for (let j = 0; j < subModels.length; j++) {
        const passes = subModels[j].passes;
        for (let k = 0; k < passes.length; k++) {
            if (passes[k].phase === _phaseID) {
                return k;
            }
        }
    }
    return -1;
}

/**
 * @zh
 * 阴影渲染队列
 */
export class RenderShadowMapBatchedQueue {
    private _pipeline: ForwardPipeline;
    private _subModelsArray: SubModel[] = [];
    private _passArray: Pass[] = [];
    private _shaderArray: Shader[] = [];
    private _shadowMapBuffer: Buffer;

    // changes
    private _device: Device;
    private _shadowInfo: Shadows;
    private _descriptorSet: DescriptorSet;
    private _shadowObjects: IRenderObject[];
    private _shadowUBO: Float32Array;
    private _instancedQueue: RenderInstancedQueue;
    private _batchedQueue: RenderBatchedQueue;


    public constructor (pipeline: ForwardPipeline) {
        this._pipeline = pipeline;
        this._device = pipeline.device;
        this._shadowInfo = pipeline.shadows;
        this._descriptorSet = pipeline.descriptorSet;
        this._shadowObjects = pipeline.shadowObjects;
        this._shadowUBO = pipeline.shadowUBO;
        this._shadowMapBuffer = pipeline.descriptorSet.getBuffer(UBOShadow.BINDING);

        this._instancedQueue = new RenderInstancedQueue();
        this._batchedQueue = new RenderBatchedQueue();
    }

    public gatherLightPasses (light: Light) {
        this.clear();
        if (light && this._shadowInfo.type === ShadowType.ShadowMap) {
            this._updateUBOs(light);

            for (let i = 0; i < this._shadowObjects.length; i++) {
                const ro = this._shadowObjects[i];
                const model = ro.model;

                switch (light.type) {
                    case LightType.DIRECTIONAL:
                        this.add(model);
                        break;
                    case LightType.SPOT:
                        const spotLight = light as SpotLight;
                        if ((model.worldBounds &&
                            (!intersect.aabb_aabb(model.worldBounds, spotLight.aabb) ||
                            !intersect.aabb_frustum(model.worldBounds, spotLight.frustum)))) continue;
                        this.add(model);
                        break;
                }
            }
        }
    }

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear () {
        this._subModelsArray.length = 0;
        this._shaderArray.length = 0;
        this._passArray.length = 0;
        this._instancedQueue.clear();
        this._batchedQueue.clear();
    }

    public add (model: Model) {
        const subModels = model.subModels;
        // this assumes shadow pass index is the same for all submodels
        const shadowPassIdx = getShadowPassIndex(subModels);

        if (shadowPassIdx < 0) return;

        for (let j = 0; j < subModels.length; j++) {
            const subModel = subModels[j];
            const pass = subModel.passes[shadowPassIdx];
            const batchingScheme = pass.batchingScheme;
            subModel.descriptorSet.bindBuffer(UBOShadow.BINDING, this._shadowMapBuffer);
            subModel.descriptorSet.update();

            if (batchingScheme === BatchingSchemes.INSTANCING) {            // instancing
                const buffer = InstancedBuffer.get(pass);
                buffer.merge(subModel, model.instancedAttributes, shadowPassIdx);
                this._instancedQueue.queue.add(buffer);
            } else if (pass.batchingScheme === BatchingSchemes.VB_MERGING) { // vb-merging
                const buffer = BatchedBuffer.get(pass);
                buffer.merge(subModel, shadowPassIdx, model);
                this._batchedQueue.queue.add(buffer);
            } else {
                const shader = ShaderPool.get(SubModelPool.get(subModel.handle, SubModelView.SHADER_0 + shadowPassIdx) as ShaderHandle);
                this._subModelsArray.push(subModel);
                this._shaderArray.push(shader);
                this._passArray.push(pass);
            }
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        for (let i = 0; i < this._subModelsArray.length; ++i) {
            const subModel = this._subModelsArray[i];
            const shader = this._shaderArray[i];
            const pass = this._passArray[i];
            const ia = subModel.inputAssembler!;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, ia);
            const descriptorSet = pass.descriptorSet;

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            cmdBuff.bindInputAssembler(ia);
            cmdBuff.draw(ia);
        }
    }

    private _updateUBOs (light: Light) {
        switch (light.type) {
            case LightType.DIRECTIONAL:
                // light view
                let shadowCameraView: Mat4;
                const mainLight = light as DirectionalLight;
                mainLight.update();

                // light proj
                let x: number = 0;
                let y: number = 0;
                let far: number = 0;
                if (this._shadowInfo.autoAdapt) {
                    shadowCameraView = getShadowWorldMatrix(this._pipeline, mainLight.node?.getWorldRotation()!, mainLight.direction, _vec3Center);
                    // if orthoSize is the smallest, auto calculate orthoSize.
                    const radius = this._shadowInfo.sphere.radius;
                    x = radius * this._shadowInfo.aspect;
                    y = radius;

                    const halfFar = Vec3.distance(this._shadowInfo.sphere.center, _vec3Center);
                    far = Math.min(halfFar * Shadows.COEFFICIENT_OF_EXPANSION, Shadows.MAX_FAR);
                } else {
                    shadowCameraView = mainLight.node!.getWorldMatrix();

                    x = this._shadowInfo.orthoSize * this._shadowInfo.aspect;
                    y = this._shadowInfo.orthoSize;

                    far = this._shadowInfo.far;
                }

                Mat4.invert(_matShadowView, shadowCameraView!);

                const projectionSignY = this._device.screenSpaceSignY * this._device.UVSpaceSignY;
                Mat4.ortho(_matShadowViewProj, -x, x, -y, y, this._shadowInfo.near, far,
                    this._device.clipSpaceMinZ, projectionSignY);
                break;
            case LightType.SPOT:
                const spotLight = light as SpotLight;
                // light view
                Mat4.invert(_matShadowView, spotLight.node!.getWorldMatrix());

                // light proj
                Mat4.perspective(_matShadowViewProj, spotLight.spotAngle, spotLight.aspect, 0.001, spotLight.range);
                break;
        }
        // light viewProj
        Mat4.multiply(_matShadowViewProj, _matShadowViewProj, _matShadowView);

        Mat4.toArray(this._shadowUBO, _matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

        Color.toArray(this._shadowUBO, this._shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);

        _vec4ShadowInfo.set(this._shadowInfo.size.x, this._shadowInfo.size.y, this._shadowInfo.pcf, this._shadowInfo.bias);
        Vec4.toArray(this._shadowUBO, _vec4ShadowInfo, UBOShadow.SHADOW_INFO_OFFSET);

        this._descriptorSet.getBuffer(UBOShadow.BINDING).update(this._shadowUBO);
    }
}
