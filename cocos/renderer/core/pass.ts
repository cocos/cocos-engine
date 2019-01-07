// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { GFXBinding } from '../../gfx/binding-layout';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXPrimitiveMode } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXBlendState, GFXBlendTarget, GFXDepthStencilState,
    GFXInputState, GFXPipelineState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { GFXSampler } from '../../gfx/sampler';
import { PassStage } from './constants';

export interface PassInfo {
    // generated part
    device: GFXDevice;
    bindingLayoutInfo: GFXBinding[];
    program: string;
    // effect-writer part
    primitive?: GFXPrimitiveMode;
    stage?: PassStage;
    rasterizerState?: GFXRasterizerState;
    depthStencilState?: GFXDepthStencilState;
    blendState?: GFXBlendState;
}

export class Pass {
    public static create(info: PassInfo) {
        const pass = new Pass();
        const device = pass._device = info.device;
        pass._programName = info.program;
        pass._stage = info.stage || PassStage.DEFAULT;

        // pipeline state
        const shader = device.createShader({ name: info.program, stages: [] });
        if (!shader) { console.error('create shader failed'); return pass; }
        const bindingLayout = device.createBindingLayout({ bindings: info.bindingLayoutInfo });
        if (!bindingLayout) { console.error('create binding layout failed'); return pass; }
        const layout = device.createPipelineLayout({ layouts: [bindingLayout] });
        if (!layout) { console.error('create pipeline layout failed'); return pass; }
        const renderPass = cc.director.root.pipeline.getRenderPass(pass._stage);
        if (!renderPass) { console.error('create render pass failed'); return pass; }
        const bs = new GFXBlendState();
        if (info.blendState) {
            const bsInfo = Object.assign({}, info.blendState);
            if (bsInfo.targets) {
                bsInfo.targets.forEach((t, i) => Object.assign(
                bs.targets[i] || (bs.targets[i] = new GFXBlendTarget()), t));
            }
            delete bsInfo.targets;
            Object.assign(bs, bsInfo);
        }

        pass._pipelineState = device.createPipelineState({
          primitive: info.primitive || GFXPrimitiveMode.TRIANGLE_LIST,
          rs: Object.assign(new GFXRasterizerState(), info.rasterizerState),
          dss: Object.assign(new GFXDepthStencilState(), info.rasterizerState),
          is: new GFXInputState(), bs,
          shader, layout, renderPass,
        });
        return pass;
    }

    get programName() { return this._programName; }
    get pipelineState(): GFXPipelineState { return <GFXPipelineState>this._pipelineState; }

    protected _device: GFXDevice | null = null;
    protected _programName: string = '';
    protected _stage: PassStage = PassStage.DEFAULT;
    protected _pipelineState: GFXPipelineState | null = null;
    protected _buffers: GFXBuffer[] = [];
    protected _samplers: GFXSampler[] = [];
}
