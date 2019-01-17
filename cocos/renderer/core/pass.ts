// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { IBlockInfo, IPassInfo, ISamplerInfo } from '../../3d/assets/effect-asset';
import { color4, mat2, mat3, mat4, vec2, vec3, vec4 } from '../../core/vmath';
import { GFXBindingLayout, IGFXBinding } from '../../gfx/binding-layout';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXMemoryUsageBit, GFXPrimitiveMode, GFXType } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXPipelineLayout } from '../../gfx/pipeline-layout';
import { GFXBlendState, GFXBlendTarget, GFXDepthStencilState,
    GFXInputState, GFXPipelineState, GFXRasterizerState, IGFXPipelineStateInfo } from '../../gfx/pipeline-state';
import { GFXRenderPass } from '../../gfx/render-pass';
import { GFXSampler } from '../../gfx/sampler';
import { GFXShader } from '../../gfx/shader';
import { GFXTextureView } from '../../gfx/texture-view';
import { RenderPassStage } from '../../pipeline/define';
import { UBOGlobal, UBOLocal } from '../../pipeline/render-pipeline';

export interface IPassInfoFull extends IPassInfo {
    // generated part
    blocks: IBlockInfo[];
    samplers: ISamplerInfo[];
    shader: GFXShader;
    renderPass: GFXRenderPass;
    globals: GFXBuffer;
}

export interface IPassOverrides {
    bs: GFXBlendState;
    dss: GFXDepthStencilState;
    rs: GFXRasterizerState;
    primitive: GFXPrimitiveMode;
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

const _type2default = {
  [GFXType.INT]: 0,
  [GFXType.INT2]: [0, 0],
  [GFXType.INT3]: [0, 0, 0],
  [GFXType.INT4]: [0, 0, 0, 0],
  [GFXType.FLOAT]: 0,
  [GFXType.FLOAT2]: [0, 0],
  [GFXType.FLOAT3]: [0, 0, 0],
  [GFXType.FLOAT4]: [0, 0, 0, 0],
  [GFXType.COLOR4]: [0, 0, 0, 1],
  [GFXType.MAT2]: [1, 0, 0, 1],
  [GFXType.MAT3]: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [GFXType.MAT4]: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
};

const builtinRE = new RegExp(UBOGlobal.BLOCK.name + '|' + UBOLocal.BLOCK.name);

const btMask      = 0xf0000000; // 4 bits, 16 slots
const typeMask    = 0x0fc00000; // 6 bits, 64 slots
const bindingMask = 0x003ff800; // 11 bits, 2048 slots
const indexMask   = 0x000007ff; // 11 bits, 2048 slots
const genHandle = (bt: GFXBindingType, type: GFXType, binding: number, index: number = 0) =>
    ((bt << 28) & btMask) | ((type << 22) & typeMask) | ((binding << 11) & bindingMask) | (index & indexMask);
const getBindingTypeFromHandle = (handle: number) => (handle & btMask) >>> 28;
const getTypeFromHandle = (handle: number) => (handle & typeMask) >>> 22;
const getBindingFromHandle = (handle: number) => (handle & bindingMask) >>> 11;
const getIndexFromHandle = (handle: number) => (handle & indexMask);

interface IBlock {
    buffer: ArrayBuffer;
    views: Float32Array[];
    dirty: boolean;
}

export class Pass {
    public static getBindingTypeFromHandle = getBindingTypeFromHandle;
    public static getTypeFromHandle = getTypeFromHandle;
    public static getBindingFromHandle = getBindingFromHandle;
    public static getIndexFromHandle = getIndexFromHandle;
    // internal resources
    protected _pipelineState: GFXPipelineState | null = null;
    protected _pipelineLayout: GFXPipelineLayout | null = null;
    protected _bindingLayout: GFXBindingLayout | null = null;
    protected _buffers: GFXBuffer[] = [];
    protected _samplers: GFXSampler[] = [];
    // internal data
    protected _programName: string = '';
    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
    protected _stage: RenderPassStage = RenderPassStage.DEFAULT;
    protected _handleMap: Record<string, number> = {};
    protected _blocks: IBlock[] = [];
    protected _bindings: IGFXBinding[] = [];
    // external references
    protected _device: GFXDevice;
    protected _shader: GFXShader | null = null;
    protected _renderPass: GFXRenderPass | null = null;

    public constructor (device: GFXDevice) {
        this._device = device;
    }

    public initialize (info: IPassInfoFull) {
        this._programName = info.program;
        // pipeline state
        const device = this._device;
        const bindings = this._bindings = info.blocks.map((u) =>
            ({ name: u.name, binding: u.binding, type: GFXBindingType.UNIFORM_BUFFER }),
        ).concat(info.samplers.map((u) =>
            ({ name: u.name, binding: u.binding, type: GFXBindingType.SAMPLER }),
        ));
        this._bindingLayout = device.createBindingLayout({ bindings });
        if (!this._bindingLayout) { console.error('create binding layout failed'); return; }
        this._pipelineLayout = device.createPipelineLayout({ layouts: [this._bindingLayout] });
        if (!this._pipelineLayout) { console.error('create pipeline layout failed'); return; }
        this._shader = info.shader;
        this._renderPass = info.renderPass;
        this._createPipelineState(info);

        for (const u of info.blocks) {
            if (builtinRE.test(u.name)) {
                continue;
            }
            // create gfx buffer resource
            const buffer = device.createBuffer({
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: u.size,
                stride: 1, // N/A for blocks
                usage: GFXBufferUsageBit.UNIFORM,
            });
            if (buffer) {
                this._bindingLayout.bindBuffer(u.binding, buffer);
                this._buffers[u.binding] = buffer;
            } else {
                console.error('create buffer failed.');
                return;
            }
            // buffer data processing system
            const block: IBlock = this._blocks[u.binding] = {
                buffer: new ArrayBuffer(u.size),
                dirty: false,
                views: [],
            };
            u.members.reduce((acc, cur, idx) => {
                // create property-specific buffer views
                const view = new Float32Array(block.buffer, acc, cur.size / Float32Array.BYTES_PER_ELEMENT);
                block.views.push(view);
                // store handle map, type and initial value
                const inf = info.properties && info.properties[cur.name];
                const type = inf && inf.type || cur.type; // property overloads
                const value = inf && inf.value;
                view.set(value ? value as number[] : _type2default[type]);
                this._handleMap[cur.name] = genHandle(GFXBindingType.UNIFORM_BUFFER, type, u.binding, idx);
                // proceed the counter
                return acc + cur.size;
            }, 0); // === u.size
            buffer.update(block.buffer);
        }
        // also bind builtin globals
        this._bindingLayout.bindBuffer(UBOGlobal.BLOCK.binding, info.globals);

        for (const u of info.samplers) {
            this._handleMap[u.name] = genHandle(GFXBindingType.SAMPLER, u.type, u.binding);
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

    public getHandle (name: string) {
        return this._handleMap[name];
    }

    public getBinding (name: string) {
        return Pass.getBindingFromHandle(this.getHandle(name));
    }

    public setUniform (handle: number, value: any) {
        const binding = Pass.getBindingFromHandle(handle);
        const type = Pass.getTypeFromHandle(handle);
        const idx = Pass.getIndexFromHandle(handle);
        const block = this._blocks[binding];
        _type2fn[type](block.views[idx], value);
        block.dirty = true;
    }

    public bindTextureView (binding: number, value: GFXTextureView) {
        (this._bindingLayout as GFXBindingLayout).bindTextureView(binding, value);
    }

    public bindSampler (binding: number, value: GFXSampler) {
        (this._bindingLayout as GFXBindingLayout).bindSampler(binding, value);
    }

    public rebuildWithOverrides (info: Partial<IPassInfo>, overrides: IPassOverrides) {
        if (this._pipelineState) { this._pipelineState.destroy(); }
        const ors = Object.assign({}, overrides);
        this._createPipelineState(info, (states) => {
            if (overrides.primitive !== undefined) { this._primitive = states.primitive = overrides.primitive; }
            Object.assign(states.rs, ors.rs);
            Object.assign(states.dss, ors.dss);
            if (ors.bs) {
                if (ors.bs.targets) {
                    for (let i = 0; i < ors.bs.targets.length; i++) {
                        Object.assign(states.bs.targets[i], ors.bs.targets[i]);
                    }
                    delete ors.bs.targets;
                }
                Object.assign(states.bs, ors.bs);
            }
        });
    }

    public destroy () {
        if (this._buffers) { this._buffers.forEach((b) => b.destroy()); this._buffers.length = 0; }
        if (this._samplers) { this._samplers.forEach((b) => b.destroy()); this._samplers.length = 0; }
        if (this._bindingLayout) { this._bindingLayout.destroy(); this._bindingLayout = null; }
        if (this._pipelineLayout) { this._pipelineLayout.destroy(); this._pipelineLayout = null; }
        if (this._pipelineState) { this._pipelineState.destroy(); this._pipelineState = null; }
    }

    public update () {
        const len = this._blocks.length;
        for (let i = 0; i < len; i++) {
            const block = this._blocks[i];
            if (block.dirty) {
                this._buffers[i].update(block.buffer);
                block.dirty = false;
            }
        }
        (this._bindingLayout as GFXBindingLayout).update();
    }

    public serializePipelineStates () {
        const ps = this._pipelineState as GFXPipelineState;
        let res = `${ps.shader.name},${this._stage},${ps.primitive}`;
        res += serializeBlendState(ps.blendState);
        res += serializeDepthStencilState(ps.depthStencilState);
        res += serializeRasterizerState(ps.rasterizerState);
        return res;
    }

    protected _createPipelineState (info: Partial<IPassInfo>, override?: (states: IGFXPipelineStateInfo) => any) {
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
            bs,
            dss: Object.assign(new GFXDepthStencilState(), info.depthStencilState),
            is: new GFXInputState(),
            layout: this._pipelineLayout,
            primitive: info.primitive || this._primitive,
            renderPass: this._renderPass,
            rs: Object.assign(new GFXRasterizerState(), info.rasterizerState),
            shader: this._shader,
        };
        if (override) { override(stateInfo); }
        if (this._pipelineState) {
            this._pipelineState.initialize(stateInfo);
        } else {
            this._pipelineState = this._device.createPipelineState(stateInfo);
        }
    }

    get programName () { return this._programName; }
    get pipelineState () { return this._pipelineState as GFXPipelineState; }
    get bindingLayout () { return this._bindingLayout as GFXBindingLayout; }
    get primitive () { return this._primitive; }
    get bindings () { return this.bindings; }
}

function serializeBlendState (bs: GFXBlendState)  {
    let res = `,bs,${bs.isA2C},${bs.blendColor}`;
    for (const t of bs.targets) {
        res += `,bt,${t.blend},${t.blendEq},${t.blendAlphaEq},${t.blendColorMask}`;
        res += `,${t.blendSrc},${t.blendDst},${t.blendSrcAlpha},${t.blendDstAlpha}`;
    }
    return res;
}

function serializeRasterizerState (rs: GFXRasterizerState)  {
    const res = `,rs,${rs.cullMode},${rs.depthBias},${rs.depthBiasFactor},${rs.isFrontFaceCCW}`;
    return res;
}

// tslint:disable: max-line-length
function serializeDepthStencilState (dss: GFXDepthStencilState)  {
    let res = `,dss,${dss.depthTest},${dss.depthWrite},${dss.depthFunc}`;
    res += `,${dss.stencilTestFront},${dss.stencilFuncFront},${dss.stencilRefFront},${dss.stencilReadMaskFront}`;
    res += `,${dss.stencilFailOpFront},${dss.stencilZFailOpFront},${dss.stencilPassOpFront},${dss.stencilWriteMaskFront}`;
    res += `,${dss.stencilTestBack},${dss.stencilFuncBack},${dss.stencilRefBack},${dss.stencilReadMaskBack}`;
    res += `,${dss.stencilFailOpBack},${dss.stencilZFailOpBack},${dss.stencilPassOpBack},${dss.stencilWriteMaskBack}`;
    return res;
}
