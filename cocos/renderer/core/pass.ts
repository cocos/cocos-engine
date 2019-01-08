// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { BlockInfo, SamplerInfo } from '../../3d/assets/effect-asset';
import { color4, mat2, mat3, mat4, vec2, vec3, vec4 } from '../../core/vmath';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXMemoryUsageBit, GFXPrimitiveMode, GFXType } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXPipelineLayout } from '../../gfx/pipeline-layout';
import { GFXBlendState, GFXBlendTarget, GFXDepthStencilState,
    GFXInputState, GFXPipelineState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { GFXRenderPass } from '../../gfx/render-pass';
import { GFXSampler } from '../../gfx/sampler';
import { GFXShader } from '../../gfx/shader';
import { GFXTextureView } from '../../gfx/texture-view';
import { RenderPassStage } from '../../pipeline/render-pipeline';
import { PropertyMap } from './effect';

export interface PassInfoBase {
    program: string;
    // effect-writer part
    primitive?: GFXPrimitiveMode;
    stage?: RenderPassStage;
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
    uniforms: PropertyMap;
}

const _type2fn = {
  [GFXType.INT]: (a: Float32Array, v: any) => a[0] = v,
  [GFXType.INT2]: (a: Float32Array, v: any) => vec2.array(a, v),
  [GFXType.INT3]: (a: Float32Array, v: any) => vec3.array(a, v),
  [GFXType.INT4]: (a: Float32Array, v: any) => vec4.array(a, v),
  [GFXType.FLOAT]: (a: Float32Array, v: any) => a[0] = v,
  [GFXType.FLOAT2]: (a: Float32Array, v: any) => vec2.array(a, v),
  [GFXType.FLOAT3]: (a: Float32Array, v: any) => vec3.array(a, v),
  [GFXType.FLOAT4]: (a: Float32Array, v: any) => vec4.array(a, v),
  [GFXType.COLOR4]: (a: Float32Array, v: any) => color4.array(a, v),
  [GFXType.MAT2]: (a: Float32Array, v: any) => mat2.array(a, v),
  [GFXType.MAT3]: (a: Float32Array, v: any) => mat3.array(a, v),
  [GFXType.MAT4]: (a: Float32Array, v: any) => mat4.array(a, v),
};

const bindingMask = 0x0fff0000;
const indexMask  = 0x0000ffff;
const genHandle = (binding: number, index: number = 0) => (binding << 16) | index;
const parseHandle = (handle: number) => [(handle & bindingMask) >> 16, handle & indexMask];

interface Block {
    buffer: ArrayBuffer;
    views: Float32Array[];
    dirty: boolean;
}

export class Pass {
    // internal resources
    protected _pipelineState: GFXPipelineState | null = null;
    protected _pipelineLayout: GFXPipelineLayout | null = null;
    protected _bindingLayout: GFXBindingLayout | null = null;
    protected _buffers: GFXBuffer[] = [];
    protected _samplers: GFXSampler[] = [];
    // internal data
    protected _programName: string = '';
    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
    protected _stage: RenderPassStage = RenderPassStage.FORWARD;
    protected _handleMap: Record<string, number> = {};
    protected _typeMap: Record<number, GFXType> = {};
    protected _blocks: Block[] = [];
    protected _layoutDirty: boolean = false;
    // external references
    protected _device: GFXDevice;
    protected _shader: GFXShader | null = null;
    protected _renderPass: GFXRenderPass | null = null;

    public constructor(device: GFXDevice) {
        this._device = device;
    }

    public initialize(info: PassInfo) {
        this._programName = info.program;
        // pipeline state
        const device = this._device;
        const bindings = info.blocks.map((u) =>
            ({ name: u.name, binding: u.binding, type: GFXBindingType.UNIFORM_BUFFER })
        ).concat(info.samplers.map((u) =>
            ({ name: u.name, binding: u.binding, type: GFXBindingType.SAMPLER })
        ));
        this._bindingLayout = device.createBindingLayout({ bindings });
        if (!this._bindingLayout) { console.error('create binding layout failed'); return; }
        this._pipelineLayout = device.createPipelineLayout({ layouts: [this._bindingLayout] });
        if (!this._pipelineLayout) { console.error('create pipeline layout failed'); return; }
        this._shader = info.shader;
        this._renderPass = info.renderPass;
        this.createPipelineState(info);

        for (const u of info.blocks) {
            // create gfx buffer resource
            const buffer = device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: u.size,
                stride: 1, // N/A for blocks
            });
            if (buffer) {
                this._bindingLayout.bindBuffer(u.binding, buffer);
                this._buffers[u.binding] = buffer;
            } else {
                console.error('create buffer failed.');
                return;
            }
            // buffer data processing system
            const block: Block = this._blocks[u.binding] = {
                buffer: new ArrayBuffer(u.size),
                views: [],
                dirty: false,
            };
            u.members.reduce((acc, cur, idx) => {
                // create property-specific buffer views
                const view = new Float32Array(block.buffer, acc, cur.size / Float32Array.BYTES_PER_ELEMENT);
                block.views.push(view);
                // store handle map, type and initial value
                const handle = this._handleMap[cur.name] = genHandle(u.binding, idx);
                const inf = info.uniforms[cur.name];
                this._typeMap[handle] = inf.type;
                _type2fn[inf.type](view, inf.value);
                // proceed the counter
                return acc + cur.size;
            }, 0); // === u.size
            buffer.update(block.buffer);
        }
        for (const u of info.samplers) {
            this._handleMap[u.name] = genHandle(u.binding);
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
        this._bindingLayout.update();
    }

    public getHandleFromName(name: string) {
        return this._handleMap[name];
    }

    public getBindingFromName(name: string) {
        const handle = this.getHandleFromName(name);
        if (handle === undefined) { return -1; }
        return parseHandle(handle)[0];
    }

    public setUniform(handle: number, value: any) {
        const [ binding, idx ] = parseHandle(handle);
        const block = this._blocks[binding];
        const type = this._typeMap[handle];
        _type2fn[type](block.views[idx], value);
        block.dirty = true;
    }

    public bindTextureView(binding: number, value: GFXTextureView) {
        const bl = this._bindingLayout;
        if (bl && bl.getBindingUnit(binding).texView !== value) {
            bl.bindTextureView(binding, value);
            this._layoutDirty = true;
        }
    }

    public bindSampler(binding: number, value: GFXSampler) {
        const bl = this._bindingLayout;
        if (bl && bl.getBindingUnit(binding).sampler !== value) {
            bl.bindSampler(binding, value);
            this._layoutDirty = true;
        }
    }

    public setStates(info: PassInfoBase) {
        if (this._pipelineState) { this._pipelineState.destroy(); }
        this.createPipelineState(info);
    }

    public destroy() {
        if (this._buffers) { this._buffers.forEach((b) => b.destroy()); this._buffers.length = 0; }
        if (this._samplers) { this._samplers.forEach((b) => b.destroy()); this._samplers.length = 0; }
        if (this._bindingLayout) { this._bindingLayout.destroy(); this._bindingLayout = null; }
        if (this._pipelineLayout) { this._pipelineLayout.destroy(); this._pipelineLayout = null; }
        if (this._pipelineState) { this._pipelineState.destroy(); this._pipelineState = null; }
    }

    public update() {
        const len = this._blocks.length;
        for (let i = 0; i < len; i++) {
            const block = this._blocks[i];
            if (block.dirty) {
                this._buffers[i].update(block.buffer);
                block.dirty = false;
            }
        }
        if (this._bindingLayout && this._layoutDirty) {
            this._bindingLayout.update();
            this._layoutDirty = false;
        }
    }

    protected createPipelineState(info: PassInfoBase) {
        if (info.primitive) { this._primitive = info.primitive; }
        if (info.stage) { this._stage = info.stage; }

        if (!this._shader || !this._renderPass || !this._pipelineLayout) {
            console.error('gfx resouces incomplete, create pipeline state failed.');
            return null;
        }
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
        const stateInfo = {
            primitive: info.primitive || this._primitive,
            rs: Object.assign(new GFXRasterizerState(), info.rasterizerState),
            dss: Object.assign(new GFXDepthStencilState(), info.depthStencilState),
            is: new GFXInputState(), bs,
            shader: this._shader,
            layout: this._pipelineLayout,
            renderPass: this._renderPass,
        };
        if (this._pipelineState) {
            this._pipelineState.initialize(stateInfo);
        } else {
            this._pipelineState = this._device.createPipelineState(stateInfo);
        }
    }

    get programName() { return this._programName; }
    get pipelineState() { return <GFXPipelineState>this._pipelineState; }
    get bindingLayout() { return <GFXBindingLayout>this._bindingLayout; }
}
