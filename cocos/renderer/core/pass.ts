// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { IBlockInfo, IPassInfo, ISamplerInfo } from '../../3d/assets/effect-asset';
import { builtinResMgr } from '../../3d/builtin';
import { TextureBase } from '../../assets/texture-base';
import { color4, mat2, mat3, mat4, vec2, vec3, vec4 } from '../../core/vmath';
import { GFXBindingLayout, IGFXBinding } from '../../gfx/binding-layout';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXDynamicState,
    GFXMemoryUsageBit, GFXPrimitiveMode, GFXType } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXPipelineLayout } from '../../gfx/pipeline-layout';
import { GFXBlendState, GFXBlendTarget, GFXDepthStencilState,
    GFXInputState, GFXPipelineState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { GFXRenderPass } from '../../gfx/render-pass';
import { GFXSampler } from '../../gfx/sampler';
import { GFXShader } from '../../gfx/shader';
import { GFXTextureView } from '../../gfx/texture-view';
import { RenderPassStage, RenderPriority } from '../../pipeline/define';
import { UBOGlobal } from '../../pipeline/render-pipeline';

export interface IPassInfoFull extends IPassInfo {
    // generated part
    blocks: IBlockInfo[];
    samplers: ISamplerInfo[];
    shader: GFXShader;
    renderPass: GFXRenderPass;
    globals: GFXBuffer;
}

type RecursivePartial<T> = {
    [P in keyof T]?:
        T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
        T[P] extends ReadonlyArray<infer V> ? ReadonlyArray<RecursivePartial<V>> : RecursivePartial<T[P]>;
};
export type PassOverrides = RecursivePartial<IPassInfo>;

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
  [GFXType.SAMPLER2D]: 'default-texture',
  [GFXType.SAMPLER_CUBE]: 'default-cube-texture',
};

const builtinRE = /^CC.*?/;

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

interface IPassResources {
    bindingLayout: GFXBindingLayout;
    pipelineLayout: GFXPipelineLayout;
    pipelineState: GFXPipelineState;
}

interface IPassDynamics {
    [type: string]: {
        dirty: boolean,
        value: number[],
    };
}

export class Pass {
    public static getBindingTypeFromHandle = getBindingTypeFromHandle;
    public static getTypeFromHandle = getTypeFromHandle;
    public static getBindingFromHandle = getBindingFromHandle;
    public static getIndexFromHandle = getIndexFromHandle;
    // internal resources
    protected _buffers: Record<number, GFXBuffer> = {};
    protected _samplers: Record<number, GFXSampler> = {};
    protected _textureViews: Record<number, GFXTextureView> = {};
    protected _resources: IPassResources[] = [];
    // internal data
    protected _programName: string = '';
    protected _priority: RenderPriority = RenderPriority.DEFAULT;
    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
    protected _stage: RenderPassStage = RenderPassStage.DEFAULT;
    protected _bindings: IGFXBinding[] = [];
    protected _bs: GFXBlendState = new GFXBlendState();
    protected _dss: GFXDepthStencilState = new GFXDepthStencilState();
    protected _rs: GFXRasterizerState = new GFXRasterizerState();
    protected _dynamicStates: GFXDynamicState[] = [];
    protected _dynamics: IPassDynamics = {};
    protected _handleMap: Record<string, number> = {};
    protected _blocks: IBlock[] = [];
    // external references
    protected _device: GFXDevice;
    protected _shader: GFXShader | null = null;
    protected _renderPass: GFXRenderPass | null = null;
    protected _globalUBO: GFXBuffer | null = null;

    public constructor (device: GFXDevice) {
        this._device = device;
    }

    public initialize (info: IPassInfoFull) {
        this._programName = info.program;
        // pipeline state
        const device = this._device;
        this._bindings = info.blocks.map((u) =>
            ({ name: u.name, binding: u.binding, type: GFXBindingType.UNIFORM_BUFFER }),
        ).concat(info.samplers.map((u) =>
            ({ name: u.name, binding: u.binding, type: GFXBindingType.SAMPLER }),
        ));
        this._shader = info.shader;
        this._renderPass = info.renderPass;
        this._globalUBO = info.globals;
        this._fillinPipelineInfo(info);

        for (const u of info.blocks) {
            if (builtinRE.test(u.name)) { continue; }
            // create gfx buffer resource
            const buffer = device.createBuffer({
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: u.size,
                stride: 1, // N/A for blocks
                usage: GFXBufferUsageBit.UNIFORM,
            });
            if (buffer) {
                this._buffers[u.binding] = buffer;
            } else {
                console.error('create buffer failed.');
                return;
            }
            // buffer data processing system
            const block: IBlock = this._blocks[u.binding] = {
                buffer: buffer.buffer as ArrayBuffer,
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

        for (const u of info.samplers) {
            this._handleMap[u.name] = genHandle(GFXBindingType.SAMPLER, u.type, u.binding);
            const inf = info.properties && info.properties[u.name];
            const samplerInfo = Object.assign({ name: u.name }, inf && inf.sampler);
            const sampler = device.createSampler(samplerInfo);
            if (sampler) {
                this._samplers[u.binding] = sampler;
            } else {
                console.error('create sampler failed.');
            }
            const texName = inf && inf.value ? inf.value + '-texture' : _type2default[u.type];
            this._textureViews[u.binding] = builtinResMgr.get<TextureBase>(texName).getGFXTextureView()!;
        }
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
        this._textureViews[binding] = value;
        for (const res of this._resources) {
            res.bindingLayout.bindTextureView(binding, value);
        }
    }

    public bindSampler (binding: number, value: GFXSampler) {
        this._samplers[binding] = value;
        for (const res of this._resources) {
            res.bindingLayout.bindSampler(binding, value);
        }
    }

    public setDynamicState (state: GFXDynamicState, value: any) {
        const ds = this._dynamics[state];
        if (ds && ds.value === value) { return; }
        ds.value = value; ds.dirty = true;
    }

    public overridePipelineStates (original: IPassInfo, overrides: PassOverrides) {
        this._bs = new GFXBlendState();
        this._dss = new GFXDepthStencilState();
        this._rs = new GFXRasterizerState();
        this._fillinPipelineInfo(original);
        this._fillinPipelineInfo(overrides);
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
    }

    public destroy () {
        if (this._buffers) {
            for (const b of Object.values(this._buffers)) {
                b.destroy();
            }
            this._buffers = {};
        }
        if (this._samplers) {
            for (const s of Object.values(this._samplers)) {
                s.destroy();
            }
            this._samplers = {};
        }
    }

    public createPipelineState () {
        if (!this._renderPass || !this._shader) { return null; }
        const bindingLayout = this._device.createBindingLayout({ bindings: this._bindings });
        for (const b of Object.keys(this._buffers)) {
            bindingLayout.bindBuffer(parseInt(b), this._buffers[b]);
        }
        for (const s of Object.keys(this._samplers)) {
            bindingLayout.bindSampler(parseInt(s), this._samplers[s]);
        }
        for (const t of Object.keys(this._textureViews)) {
            bindingLayout.bindTextureView(parseInt(t), this._textureViews[t]);
        }
        bindingLayout.bindBuffer(UBOGlobal.BLOCK.binding, this._globalUBO!);
        const pipelineLayout = this._device.createPipelineLayout({ layouts: [bindingLayout] });
        const pipelineState = this._device.createPipelineState({
            bs: this._bs,
            dss: this._dss,
            dynamicStates: this._dynamicStates,
            is: new GFXInputState(),
            layout: pipelineLayout,
            primitive: this._primitive,
            renderPass: this._renderPass,
            rs: this._rs,
            shader: this._shader,
        });
        this._resources.push({ bindingLayout, pipelineLayout, pipelineState });
        return pipelineState;
    }

    public destroyPipelineState (pipelineStates: GFXPipelineState) {
        const idx = this._resources.findIndex((res) => res.pipelineState === pipelineStates);
        if (idx >= 0) {
            const { bindingLayout: bl, pipelineLayout: pl, pipelineState: ps } = this._resources[idx];
            bl.destroy(); pl.destroy(); ps.destroy();
            this._resources.splice(idx, 1);
        }
    }

    public serializePipelineStates () {
        const shaderName = this._shader && this._shader.name;
        let res = `${shaderName},${this._stage},${this._primitive}`;
        res += serializeBlendState(this._bs);
        res += serializeDepthStencilState(this._dss);
        res += serializeRasterizerState(this._rs);
        return res;
    }

    protected _fillinPipelineInfo (info: PassOverrides) {
        if (info.priority !== undefined) { this._priority = info.priority; }
        if (info.primitive !== undefined) { this._primitive = info.primitive; }
        if (info.stage !== undefined) { this._stage = info.stage; }
        if (info.dynamics !== undefined) { this._dynamicStates = info.dynamics; }

        const bs = this._bs;
        if (info.blendState) {
            const bsInfo = Object.assign({}, info.blendState);
            if (bsInfo.targets) {
                bsInfo.targets.forEach((t, i) => Object.assign(
                bs.targets[i] || (bs.targets[i] = new GFXBlendTarget()), t));
            }
            delete bsInfo.targets;
            Object.assign(bs, bsInfo);
        }
        Object.assign(this._rs, info.rasterizerState);
        Object.assign(this._dss, info.depthStencilState);
    }

    get programName () { return this._programName; }
    get priority () { return this._priority; }
    get primitive () { return this._primitive; }
    get stage () { return this._stage; }
    get bindings () { return this._bindings; }
    get blendState () { return this._bs; }
    get depthStencilState () { return this._dss; }
    get rasterizerState () { return this._rs; }
    get shader () { return this._shader; }
    get renderPass () { return this._renderPass; }
    get dynamics () { return this._dynamics; }
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
    const res = `,rs,${rs.cullMode},${rs.depthBias},${rs.isFrontFaceCCW}`;
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
