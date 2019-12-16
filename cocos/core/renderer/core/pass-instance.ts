import { builtinResMgr } from '../../3d/builtin/init';
import { IPassInfo, IPassStates, IPropertyInfo } from '../../assets/effect-asset';
import { TextureBase } from '../../assets/texture-base';
// tslint:disable-next-line: max-line-length
import { GFXBindingType, GFXBuffer, GFXBufferUsageBit, GFXDevice, GFXDynamicState, GFXGetTypeSize, GFXMemoryUsageBit, GFXPrimitiveMode, GFXRenderPass, GFXSampler, GFXShader, GFXTextureView, GFXType, IGFXBufferInfo } from '../../gfx';
import { GFXBindingLayout, IGFXBinding, IGFXBindingLayoutInfo } from '../../gfx/binding-layout';
import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../../gfx/pipeline-layout';
import { GFXBlendState, GFXDepthStencilState, GFXPipelineState, GFXRasterizerState, IGFXPipelineStateInfo } from '../../gfx/pipeline-state';
import { BatchedBuffer } from '../../pipeline/batched-buffer';
import { isBuiltinBinding, RenderPassStage, RenderPriority } from '../../pipeline/define';
import { getPhaseID } from '../../pipeline/pass-phase';
import { IMaterial } from '../../utils/material-interface';
import { generatePassPSOHash, IBlock, IPass, IPassDynamics, IPSOHashInfo } from '../../utils/pass-interface';
import { IDefineMap, Pass } from './pass';
import { getBindingFromHandle, getOffsetFromHandle, getTypeFromHandle, type2default, type2reader, type2writer } from './pass-utils';
import { IProgramInfo, programLib } from './program-lib';
import { samplerLib } from './sampler-lib';

const _bfInfo: IGFXBufferInfo = {
    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
    size: 0,
    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
};

const _blInfo: IGFXBindingLayoutInfo = {} as IGFXBindingLayoutInfo;

const _plInfo: IGFXPipelineLayoutInfo = {} as IGFXPipelineLayoutInfo;

const _psoInfo: IGFXPipelineStateInfo & IPSOHashInfo = {} as IGFXPipelineStateInfo & IPSOHashInfo;

export class PassInstance implements IPass {
    get batchedBuffer (): BatchedBuffer | null {
        return null;
    }

    get parent (): IPass {
        return this._parent;
    }

    get priority (): RenderPriority {
        return this._priority;
    }

    get primitive (): GFXPrimitiveMode {
        return this._primitive;
    }

    get stage (): RenderPassStage {
        return this._stage;
    }

    get rasterizerState (): GFXRasterizerState {
        return this._rs;
    }

    get depthStencilState (): GFXDepthStencilState {
        return this._dss;
    }

    get blendState (): GFXBlendState {
        return this._bs;
    }

    get dynamicStates (): GFXDynamicState[] {
        return this._dynamicStates;
    }

    get customizations (): string[] {
        return this._customizations;
    }

    get phase (): number {
        return this._phase;
    }

    get shaderInfo (): IProgramInfo {
        return this._parent.shaderInfo;
    }

    get program (): string {
        return this._parent.program;
    }

    get properties (): Record<string, IPropertyInfo> {
        return this._parent.properties;
    }

    get defines (): IDefineMap {
        return this._defines;
    }

    get idxInTech (): number {
        return this._parent.idxInTech;
    }

    get device (): GFXDevice {
        return this._parent.device;
    }

    get bindings (): IGFXBinding[] {
        return this._bindings;
    }

    get shader (): GFXShader {
        return this._shader!;
    }

    get renderPass (): GFXRenderPass {
        return this._renderPass!;
    }

    get dynamics (): IPassDynamics {
        return this._dynamics;
    }

    get blocks (): IBlock[] {
        return this._blocks;
    }

    get psoHash (): number {
        return this._hash;
    }

    private _parent: Pass;
    private _owner: IMaterial;
    private _idx: number;
    private _dontNotify: boolean = false;
    // instance resources
    private _hash: number;
    private _blocks: IBlock[] = [];
    private _buffers: Record<number, GFXBuffer> = {};
    private _samplers: Record<number, GFXSampler> = {};
    private _textureViews: Record<number, GFXTextureView> = {};
    private _bindingLayout: GFXBindingLayout | null = null;
    private _pipelineLayout: GFXPipelineLayout | null = null;
    private _pipelineState: GFXPipelineState | null = null;

    // states could be overwritten
    private _phase = getPhaseID('default');
    private _priority: RenderPriority = RenderPriority.DEFAULT;
    private _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
    private _stage: RenderPassStage = RenderPassStage.DEFAULT;
    private _renderPass: GFXRenderPass | null = null;
    private _bindings: IGFXBinding[] = [];
    private _bs: GFXBlendState = new GFXBlendState();
    private _dss: GFXDepthStencilState = new GFXDepthStencilState();
    private _rs: GFXRasterizerState = new GFXRasterizerState();
    private _dynamicStates: GFXDynamicState[] = [];
    private _dynamics: IPassDynamics = {};
    private _customizations: string[] = [];
    private _defines: IDefineMap = {};
    private _shader: GFXShader | null = null;

    constructor (parent: Pass, mat: IMaterial, idx: number) {
        this._parent = parent;
        this._owner = mat;
        this._idx = idx;
        this._hash = parent.psoHash;
        this._shader = parent.shader;
        this._bindings = parent.bindings;

        const blocks = this.shaderInfo.blocks;
        for (let i = 0; i < blocks.length; i++) {
            const { size, binding } = blocks[i];
            if (isBuiltinBinding(binding)) {
                continue;
            }
            // create gfx buffer resource
            _bfInfo.size = Math.ceil(size / 16) * 16; // https://bugs.chromium.org/p/chromium/issues/detail?id=988988
            this._buffers[binding] = this.device.createBuffer(_bfInfo);
            // non-builtin UBO data pools, note that the effect compiler
            // guarantees these bindings to be consecutive, starting from 0
            const buffer = new ArrayBuffer(size);
            this._blocks[binding] = {
                buffer,
                dirty: true,
                view: new Float32Array(buffer),
            };
            const source = parent.blocks[binding].view;
            const dest = this._blocks[binding].view;
            for (let j = 0; j < source.length; j++) {
                dest[j] = source[j];
            }
        }
        for (let i = 0; i < this.shaderInfo.samplers.length; i++) {
            const binding = this.shaderInfo.samplers[i].binding;
            if (isBuiltinBinding(binding)) {
                continue;
            }
            // @ts-ignore
            this._textureViews[binding] = parent._textureViews[binding];
            // @ts-ignore
            this._samplers[binding] = parent._samplers[binding];
        }
        Pass.fillinPipelineInfo(this as unknown as Pass, this._parent);
    }

    public getHandle (name: string, offset?: number, targetType?: GFXType): number | undefined {
        return this._parent.getHandle(name, offset, targetType);
    }

    public getBinding (name: string): number | undefined {
        return this._parent.getBinding(name);
    }

    public setUniform (handle: number, value: any): void {
        const binding = getBindingFromHandle(handle);
        const type = getTypeFromHandle(handle);
        const ofs = getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        type2writer[type](block.view, value, ofs);
        block.dirty = true;
    }

    public getUniform (handle: number, out: any) {
        const binding = getBindingFromHandle(handle);
        const type = getTypeFromHandle(handle);
        const ofs = getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        return type2reader[type](block.view, out, ofs);
    }

    public setUniformArray (handle: number, value: any[]): void {
        const binding = getBindingFromHandle(handle);
        const type = getTypeFromHandle(handle);
        const stride = GFXGetTypeSize(type) >> 2;
        const block = this._blocks[binding];
        let ofs = getOffsetFromHandle(handle);
        for (let i = 0; i < value.length; i++ , ofs += stride) {
            if (value[i] === null) { continue; }
            type2writer[type](block.view, value[i], ofs);
        }
        block.dirty = true;
    }

    public bindBuffer (binding: number, value: GFXBuffer): void {
        if (this._buffers[binding] === value) {
            return;
        }
        this._buffers[binding] = value;
        if (!this._bindingLayout) {
            return;
        }
        this._bindingLayout.bindBuffer(binding, value);
    }

    public bindTextureView (binding: number, value: GFXTextureView): void {
        if (this._textureViews[binding] === value) {
            return;
        }
        this._textureViews[binding] = value;
        if (!this._bindingLayout) {
            return;
        }
        this._bindingLayout.bindTextureView(binding, value);
    }

    public bindSampler (binding: number, value: GFXSampler): void {
        if (!this._bindingLayout || this._samplers[binding] === value) {
            return;
        }
        this._samplers[binding] = value;
        this._bindingLayout.bindSampler(binding, value);
    }

    public setDynamicState (state: GFXDynamicState, value: any): void {
        const ds = this._dynamics[state];
        if (ds && ds.value === value) {
            return;
        }
        ds.value = value;
        ds.dirty = true;
    }

    public overridePipelineStates (original: IPassInfo, overrides: any): void {
        this._bs = new GFXBlendState();
        this._dss = new GFXDepthStencilState();
        this._rs = new GFXRasterizerState();
        Pass.fillinPipelineInfo(this as unknown as Pass, original);
        Pass.fillinPipelineInfo(this as unknown as Pass, overrides);
        this._hash = generatePassPSOHash(this);
        this._onPipelineStateChanged();
    }

    public update (): void {
        const len = this._blocks.length;
        for (let i = 0; i < len; i++) {
            const block = this._blocks[i];
            if (block.dirty) {
                this._buffers[i].update(block.buffer);
                block.dirty = false;
            }
        }
        const source = cc.director.root.pipeline.globalBindings;
        const target = this.shaderInfo.builtins.globals;
        const samplerLen = target.samplers.length;
        for (let i = 0; i < samplerLen; i++) {
            const s = target.samplers[i];
            const info = source.get(s.name)!;
            if (info.sampler) {
                this.bindSampler(info.samplerInfo!.binding, info.sampler);
            }
            this.bindTextureView(info.samplerInfo!.binding, info.textureView!);
        }
    }

    public destroy (): void {
        for (const u of this.shaderInfo.blocks) {
            if (isBuiltinBinding(u.binding)) { continue; }
            this._buffers[u.binding].destroy();
        }
        this._buffers = {};
        // textures are reused
        this._samplers = {};
        this._textureViews = {};
    }

    public resetUBOs (): void {
        for (const u of this.shaderInfo.blocks) {
            if (isBuiltinBinding(u.binding)) {
                continue;
            }
            const block: IBlock = this._blocks[u.binding];
            let ofs = 0;
            for (let i = 0; i < u.members.length; i++) {
                const cur = u.members[i];
                const inf = this.properties[cur.name];
                const givenDefault = inf && inf.value;
                const value = givenDefault ? givenDefault : type2default[cur.type];
                const stride = GFXGetTypeSize(cur.type) >> 2;
                for (let j = 0; j < cur.count; j++) {
                    block.view.set(value, ofs + j * stride);
                }
                ofs += stride * cur.count;
            }
            block.dirty = true;
        }
    }

    public resetTextures (): void {
        if (!this._bindingLayout) {
            return;
        }
        for (const u of this.shaderInfo.samplers) {
            if (isBuiltinBinding(u.binding)) {
                continue;
            }
            const inf = this.properties[u.name];
            const texName = inf && inf.value ? inf.value + '-texture' : type2default[u.type];
            const texture = builtinResMgr.get<TextureBase>(texName);
            const textureView = texture && texture.getGFXTextureView();
            if (!textureView) {
                console.warn('illegal texture default value: ' + texName); continue;
            }
            this._textureViews[u.binding] = textureView;
            const samplerHash = inf && (inf.samplerHash !== undefined) ? inf.samplerHash : texture.getSamplerHash();
            const sampler = this._samplers[u.binding] = samplerLib.getSampler(this.device, samplerHash);
            this._bindingLayout.bindSampler(u.binding, sampler);
            this._bindingLayout.bindTextureView(u.binding, textureView);
        }
    }

    public tryCompile (defineOverrides?: IDefineMap, saveOverrides?: boolean): any {
        const pipeline = cc.director.root.pipeline;
        if (!pipeline) {
            return null;
        }
        this._renderPass = pipeline.getRenderPass(this._stage);
        if (!this._renderPass) {
            console.warn(`illegal pass stage.`); return null;
        }
        let defines = this._defines;
        if (defineOverrides) {
            if (saveOverrides) {
                Object.assign(this._defines, defineOverrides);
            }
            else {
                Object.assign(defineOverrides, this._defines);
                defines = defineOverrides;
            }
        }
        const res = programLib.getGFXShader(this.device, this.program, defines, pipeline);
        if (!res.shader) {
            console.warn(`create shader ${this.program} failed`);
            return null;
        }
        if (saveOverrides) {
            this._shader = res.shader;
            this._bindings = res.bindings;
        }
        this._hash = generatePassPSOHash(this);
        this._onPipelineStateChanged();
        return res;
    }

    public createPipelineState (): GFXPipelineState | null {
        if ((!this._renderPass || !this._shader || !this._bindings.length) && !this.tryCompile()) {
            console.warn(`pass resources not complete, create PSO failed`);
            return null;
        }
        _blInfo.bindings = this._bindings;
        // bind resources
        this._bindingLayout = this.device.createBindingLayout(_blInfo);
        for (const b in this._buffers) {
            this._bindingLayout.bindBuffer(parseInt(b), this._buffers[b]);
        }
        for (const s in this._samplers) {
            this._bindingLayout.bindSampler(parseInt(s), this._samplers[s]);
        }
        for (const t in this._textureViews) {
            this._bindingLayout.bindTextureView(parseInt(t), this._textureViews[t]);
        }
        // bind pipeline builtins
        const source = cc.director.root.pipeline.globalBindings;
        const target = this.shaderInfo.builtins.globals;
        for (const b of target.blocks) {
            const info = source.get(b.name);
            if (!info || info.type !== GFXBindingType.UNIFORM_BUFFER) {
                console.warn(`builtin UBO '${b.name}' not available!`); continue;
            }
            this._bindingLayout.bindBuffer(info.blockInfo!.binding, info.buffer!);
        }
        for (const s of target.samplers) {
            const info = source.get(s.name);
            if (!info || info.type !== GFXBindingType.SAMPLER) {
                console.warn(`builtin texture '${s.name}' not available!`); continue;
            }
            if (info.sampler) {
                this._bindingLayout.bindSampler(info.samplerInfo!.binding, info.sampler);
            }
            this._bindingLayout.bindTextureView(info.samplerInfo!.binding, info.textureView!);
        }
        _plInfo.layouts = [this._bindingLayout];
        this._pipelineLayout = this.device.createPipelineLayout(_plInfo);
        // create pipeline state
        _psoInfo.primitive = this._primitive;
        _psoInfo.shader = this._shader!;
        _psoInfo.rasterizerState = this._rs;
        _psoInfo.depthStencilState = this._dss;
        _psoInfo.blendState = this._bs;
        _psoInfo.dynamicStates = this._dynamicStates;
        _psoInfo.layout = this._pipelineLayout;
        _psoInfo.renderPass = this._renderPass!;
        _psoInfo.program = this.program;
        _psoInfo.defines = this._defines;
        _psoInfo.stage = this._stage;
        _psoInfo.hash = this._hash;
        this._pipelineState = this.device.createPipelineState(_psoInfo);
        return this._pipelineState;
    }

    public destroyPipelineState (pipelineStates?: GFXPipelineState): void {
        if (this._pipelineState) {
            if (this._pipelineState !== pipelineStates) {
                console.warn('Node(' + this._owner.owner!.node.name + ')\s pso doesn\'t equal to pass instance\'s pso,please check the destroy logic.(pass info:' + this.shaderInfo.name + ')');
            }
            this._pipelineState.destroy();
            this._pipelineLayout!.destroy();
            this._bindingLayout!.destroy();
            this._pipelineState = null;
            this._pipelineLayout = null;
            this._bindingLayout = null;
        }
    }

    public createBatchedBuffer (): void {
        throw new Error('Pass instance don\'t have batched buffer.');
    }

    public clearBatchedBuffer (): void {
        throw new Error('Pass instance don\'t have batched buffer.');
    }

    public beginChangeStatesSilently (): void {
        this._dontNotify = true;
    }

    public endChangeStatesSilently (): void {
        this._dontNotify = false;
    }

    protected _onPipelineStateChanged () {
        this._owner._onPassStateChanged(this._idx);
        if (!this._dontNotify) {
            // @ts-ignore
            this._owner.owner._onRebuildPSO(this._idx, this._owner);
        }
    }
}
