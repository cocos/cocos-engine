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

import { SubModel } from '../render-scene/scene/submodel';
import { SetIndex } from './define';
import { Device, RenderPass, Shader, CommandBuffer } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { Pass } from '../render-scene/core/pass';
import { Model } from '../render-scene/scene/model';
import { ReflectionProbe, SKYBOX_FLAG } from '../render-scene/scene';
import { PipelineRuntime } from './custom/pipeline';
import { RenderScene } from '../render-scene';

const CC_USE_RGBE_OUTPUT = 'CC_USE_RGBE_OUTPUT';
const _phaseID = getPhaseID('default');
const _phaseReflectMapID = getPhaseID('reflect-map');
function getPassIndex (subModel: SubModel): number {
    const passes = subModel.passes;
    for (let k = 0; k < passes.length; k++) {
        if (passes[k].phase === _phaseID) {
            return k;
        }
    }
    return -1;
}

function getReflectMapPassIndex (subModel: SubModel): number {
    const passes = subModel.passes;
    for (let k = 0; k < passes.length; k++) {
        if (passes[k].phase === _phaseReflectMapID) {
            return k;
        }
    }
    return -1;
}

/**
 * @zh
 * 反射探针渲染队列
 */
export class RenderReflectionProbeQueue {
    private _pipeline: PipelineRuntime;
    private _subModelsArray: SubModel[] = [];
    private _passArray: Pass[] = [];
    private _shaderArray: Shader[] = [];

    public constructor (pipeline: PipelineRuntime) {
        this._pipeline = pipeline;
    }

    public gatherRenderObjects (probe: ReflectionProbe, scene:RenderScene) {
        this.clear();
        const sceneData = this._pipeline.pipelineSceneData;
        const skybox = sceneData.skybox;

        if (skybox.enabled && skybox.model && (probe.camera.clearFlag & SKYBOX_FLAG)) {
            this.add(skybox.model);
        }

        const models = scene.models;
        const visibility = probe.camera.visibility;

        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            // filter model by view visibility
            if (model.enabled) {
                if (model.node && ((visibility & model.node.layer) === model.node.layer)
                      || (visibility & model.visFlags)) {
                    if (model.bakeToReflectionProbe) {
                        this.add(model);
                    }
                }
            }
        }
    }

    public clear () {
        this._subModelsArray.length = 0;
        this._shaderArray.length = 0;
        this._passArray.length = 0;
    }

    public add (model: Model) {
        const subModels = model.subModels;
        for (let j = 0; j < subModels.length; j++) {
            const subModel = subModels[j];

            let passIdx = getReflectMapPassIndex(subModel);
            let bUseReflectPass = true;
            if (passIdx < 0) {
                passIdx = getPassIndex(subModel);
                bUseReflectPass = false;
            }
            if (passIdx < 0) { continue; }
            const pass = subModel.passes[passIdx];
            if (!bUseReflectPass) {
                pass.defines[CC_USE_RGBE_OUTPUT] = true;
                subModel.onPipelineStateChanged();
            }
            const shader = subModel.shaders[passIdx];
            this._subModelsArray.push(subModel);
            if (shader) this._shaderArray.push(shader);
            this._passArray.push(pass);
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        for (let i = 0; i < this._subModelsArray.length; ++i) {
            const subModel = this._subModelsArray[i];
            const shader = this._shaderArray[i];
            const pass = this._passArray[i];
            const ia = subModel.inputAssembler;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, ia);
            const descriptorSet = pass.descriptorSet;

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            cmdBuff.bindInputAssembler(ia);
            cmdBuff.draw(ia);
        }
    }
    public resetMacro () {
        for (let i = 0; i < this._subModelsArray.length; ++i) {
            const subModel = this._subModelsArray[i];
            const pass = this._passArray[i];
            pass.defines[CC_USE_RGBE_OUTPUT] = false;
            subModel.onPipelineStateChanged();
        }
    }
}
