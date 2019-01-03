// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { BlockInfo, SamplerInfo } from '../../3d/assets/effect-asset';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXMemoryUsageBit, GFXPrimitiveMode } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXPipelineLayout } from '../../gfx/pipeline-layout';
import { GFXBlendState, GFXBlendTarget, GFXDepthStencilState,
    GFXInputState, GFXPipelineState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { GFXRenderPass } from '../../gfx/render-pass';
import { GFXSampler } from '../../gfx/sampler';
import { GFXShader } from '../../gfx/shader';
import { PassStage } from './constants';

export interface PassInfoBase {
    program: string;
    // effect-writer part
    primitive?: GFXPrimitiveMode;
    stage?: PassStage;
    rasterizerState?: GFXRasterizerState;
    depthStencilState?: GFXDepthStencilState;
    blendState?: GFXBlendState;
}
export interface PassInfo extends PassInfoBase {
    // generated part
    blocks: BlockInfo[];
    samplers: SamplerInfo[];
    shader: GFXShader;
    renderPass: GFXRenderPass;
}

export class Pass {
    protected _device: GFXDevice;
    protected _programName: string = '';
    protected _stage: PassStage = PassStage.DEFAULT;
    protected _pipelineState: GFXPipelineState | null = null;
    protected _pipelineLayout: GFXPipelineLayout | null = null;
    protected _bindingLayout: GFXBindingLayout | null = null;
    protected _buffers: GFXBuffer[] = [];
    protected _samplers: GFXSampler[] = [];

    public constructor(device: GFXDevice) {
        this._device = device;
    }

    public initialize(info: PassInfo) {
        const device = this._device;
        this._programName = info.program;
        this._stage = info.stage || PassStage.DEFAULT;

        // pipeline state
        const bindings = info.blocks.map((u) =>
            ({ name: u.name, binding: u.binding, type: GFXBindingType.UNIFORM_BUFFER })
        ).concat(info.samplers.map((u) =>
            ({ name: u.name, binding: u.binding, type: GFXBindingType.SAMPLER })
        ));
        this._bindingLayout = device.createBindingLayout({ bindings });
        if (!this._bindingLayout) { console.error('create binding layout failed'); return; }
        this._pipelineLayout = device.createPipelineLayout({ layouts: [this._bindingLayout] });
        if (!this._pipelineLayout) { console.error('create pipeline layout failed'); return; }
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
        this._pipelineState = device.createPipelineState({
          primitive: info.primitive || GFXPrimitiveMode.TRIANGLE_LIST,
          rs: Object.assign(new GFXRasterizerState(), info.rasterizerState),
          dss: Object.assign(new GFXDepthStencilState(), info.depthStencilState),
          is: new GFXInputState(), bs,
          shader: info.shader,
          layout: this._pipelineLayout,
          renderPass: info.renderPass,
        });

        for (const u of info.blocks) {
            const buffer = device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: u.size,
                stride: 1, // N/A for blocks
            });
            if (buffer) {
                this._bindingLayout.bindBuffer(u.binding, buffer);
                this._buffers.push(buffer);
            } else {
                console.error('create buffer failed.');
            }
        }
        for (const u of info.samplers) {
            const sampler = device.createSampler({
                name: u.name,
                // TODO: specify filter modes in effect
            });
            if (sampler) {
                this._bindingLayout.bindSampler(u.binding, sampler);
                this._samplers.push(sampler);
            } else {
                console.error('create sampler failed.');
            }
        }
    }

    public destroy() {
        if (this._buffers) { this._buffers.forEach((b) => b.destroy()); this._buffers.length = 0; }
        if (this._samplers) { this._samplers.forEach((b) => b.destroy()); this._samplers.length = 0; }
        if (this._bindingLayout) { this._bindingLayout.destroy(); this._bindingLayout = null; }
        if (this._pipelineLayout) { this._pipelineLayout.destroy(); this._pipelineLayout = null; }
        if (this._pipelineState) { this._pipelineState.destroy(); this._pipelineState = null; }
    }

    get programName() { return this._programName; }
    get pipelineState() { return this._pipelineState; }
}
