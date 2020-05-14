/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @category material
 */

import { IBlockInfo, IBuiltinInfo, IDefineInfo, ISamplerInfo, IShaderInfo } from '../../assets/effect-asset';
import { IGFXBinding } from '../../gfx/binding-layout';
import { GFXBindingType, GFXGetTypeSize, GFXShaderType } from '../../gfx/define';
import { GFXAPI, GFXDevice } from '../../gfx/device';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { GFXInputState } from '../../gfx/pipeline-state';
import { GFXShader, GFXUniformBlock } from '../../gfx/shader';
import { IInternalBindingDesc, localBindingsDesc } from '../../pipeline/define';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { genHandle, IDefineMap } from './pass-utils';
import { legacyCC } from '../../global-exports';

interface IDefineRecord extends IDefineInfo {
    _map: (value: any) => number;
    _offset: number;
}
interface IBlockInfoRT extends IBlockInfo, IGFXBinding {
    size: number;
}
interface ISamplerInfoRT extends ISamplerInfo, IGFXBinding {
}
export interface IProgramInfo extends IShaderInfo {
    blocks: IBlockInfoRT[];
    samplers: ISamplerInfoRT[];
    defines: IDefineRecord[];
    handleMap: Record<string, number>;
    offsets: number[][];
    globalsInited: boolean;
    localsInited: boolean;
    uber: boolean; // macro number exceeds default limits
}
export interface IMacroInfo {
    name: string;
    value: string;
    isDefault: boolean;
}

function getBitCount (cnt: number) {
    return Math.ceil(Math.log2(Math.max(cnt, 2)));
}

function mapDefine (info: IDefineInfo, def: number | string | boolean) {
    switch (info.type) {
        case 'boolean': return (typeof def === 'number' ? def : (def ? 1 : 0)) + '';
        case 'string': return def !== undefined ? def as string : info.options![0];
        case 'number': return (def !== undefined ? def as number : info.range![0]) + '';
    }
    console.warn(`unknown define type '${info.type}'`);
    return '-1'; // should neven happen
}

function prepareDefines (defs: IDefineMap, tDefs: IDefineInfo[]) {
    const macros: IMacroInfo[] = [];
    for (const tmpl of tDefs) {
        const name = tmpl.name;
        const v = defs[name];
        const value = mapDefine(tmpl, v);
        const isDefault = !v || v === '0';
        macros.push({ name, value, isDefault });
    }
    return macros;
}

function getShaderInstanceName (name: string, macros: IMacroInfo[]) {
    return name + macros.reduce((acc, cur) => cur.isDefault ? acc : `${acc}|${cur.name}${cur.value}`, '');
}

function insertBuiltinBindings (tmpl: IProgramInfo, source: Map<string, IInternalBindingDesc>, type: string) {
    const target = tmpl.builtins[type] as IBuiltinInfo;
    const blocks = tmpl.blocks;
    for (const b of target.blocks) {
        const info = source.get(b.name);
        if (!info || info.type !== GFXBindingType.UNIFORM_BUFFER) { console.warn(`builtin UBO '${b.name}' not available!`); continue; }
        const builtin: IBlockInfoRT = Object.assign({
            defines: b.defines,
            size: getSize(info.blockInfo!),
            bindingType: GFXBindingType.UNIFORM_BUFFER,
            defaultValue: info.defaultValue as ArrayBuffer,
        }, info.blockInfo!);
        blocks.push(builtin);
    }
    const samplers = tmpl.samplers;
    for (const s of target.samplers) {
        const info = source.get(s.name);
        if (!info || info.type !== GFXBindingType.SAMPLER) { console.warn(`builtin sampler '${s.name}' not available!`); continue; }
        const builtin = Object.assign({ defines: s.defines, bindingType: GFXBindingType.SAMPLER, defaultValue: info.defaultValue as string }, info.samplerInfo);
        samplers.push(builtin);
    }
}

function getSize (block: GFXUniformBlock) {
    return block.members.reduce((s, m) => s + GFXGetTypeSize(m.type) * m.count, 0);
}

function genHandles (tmpl: IProgramInfo) {
    const handleMap: Record<string, number> = {};
    // block member handles
    for (let i = 0; i < tmpl.blocks.length; i++) {
        const block = tmpl.blocks[i];
        const members = block.members;
        let offset = 0;
        for (let j = 0; j < members.length; j++) {
            const uniform = members[j];
            handleMap[uniform.name] = genHandle(GFXBindingType.UNIFORM_BUFFER, block.binding, uniform.type, offset);
            offset += (GFXGetTypeSize(uniform.type) >> 2) * uniform.count;
        }
    }
    // sampler handles
    for (let i = 0; i < tmpl.samplers.length; i++) {
        const sampler = tmpl.samplers[i];
        handleMap[sampler.name] = genHandle(GFXBindingType.SAMPLER, sampler.binding, sampler.type);
    }
    return handleMap;
}

function dependencyCheck (dependencies: string[], defines: IDefineMap) {
    for (let i = 0; i < dependencies.length; i++) {
        const d = dependencies[i];
        if (d[0] === '!') { if (defines[d.slice(1)]) { return false; } } // negative dependency
        else if (!defines[d]) { return false; }
    }
    return true;
}
function getShaderBindings (
        tmpl: IProgramInfo, defines: IDefineMap, outBlocks: IBlockInfoRT[], outSamplers: ISamplerInfoRT[],
        bindings: IGFXBinding[], outAttributes: IGFXAttribute[]) {
    const { blocks, samplers, attributes } = tmpl;
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (!dependencyCheck(block.defines, defines)) { continue; }
        outBlocks.push(block);
        bindings.push(block);
    }
    for (let i = 0; i < samplers.length; i++) {
        const sampler = samplers[i];
        if (!dependencyCheck(sampler.defines, defines)) { continue; }
        outSamplers.push(sampler);
        bindings.push(sampler);
    }
    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        if (!dependencyCheck(attribute.defines, defines)) { continue; }
        outAttributes.push(attribute);
    }
}

export interface IShaderResources {
    shader: GFXShader;
    bindings: IGFXBinding[];
    inputState: GFXInputState;
}

/**
 * @zh
 * 维护 shader 资源实例的全局管理器。
 */
class ProgramLib {
    protected _templates: Record<string, IProgramInfo>;
    protected _cache: Record<string, IShaderResources>;

    constructor () {
        this._templates = {};
        this._cache = {};
    }

    /**
     * @zh
     * 根据 effect 信息注册 shader 模板。
     */
    public define (prog: IShaderInfo) {
        const curTmpl = this._templates[prog.name];
        if (curTmpl && curTmpl.hash === prog.hash) { return; }
        const tmpl = prog as IProgramInfo;
        // calculate option mask offset
        let offset = 0;
        for (const def of tmpl.defines) {
            let cnt = 1;
            if (def.type === 'number') {
                const range = def.range!;
                cnt = getBitCount(range[1] - range[0] + 1); // inclusive on both ends
                def._map = (value: number) => value - range[0];
            } else if (def.type === 'string') {
                cnt = getBitCount(def.options!.length);
                def._map = (value: any) => Math.max(0, def.options!.findIndex((s) => s === value));
            } else if (def.type === 'boolean') {
                def._map = (value: any) => value ? 1 : 0;
            }
            def._offset = offset;
            offset += cnt;
        }
        if (offset > 31) { tmpl.uber = true; }
        tmpl.blocks.forEach((b) => {
            b.bindingType = GFXBindingType.UNIFORM_BUFFER; b.size = getSize(b);
        });
        tmpl.samplers.forEach((s) => s.bindingType = GFXBindingType.SAMPLER);
        tmpl.handleMap = genHandles(tmpl);
        if (!tmpl.localsInited) { insertBuiltinBindings(tmpl, localBindingsDesc, 'locals'); tmpl.localsInited = true; }
        // store it
        this._templates[prog.name] = tmpl;
    }

    public getTemplate (name: string) {
        return this._templates[name];
    }

    /**
     * @en
     * Does this library has the specified program?
     * @zh
     * 当前是否有已注册的指定名字的 shader？
     * @param name 目标 shader 名
     */
    public hasProgram (name: string) {
        return this._templates[name] !== undefined;
    }

    /**
     * @zh
     * 根据 shader 名和预处理宏列表获取 shader key。
     * @param name 目标 shader 名
     * @param defines 目标预处理宏列表
     */
    public getKey (name: string, defines: IDefineMap) {
        const tmpl = this._templates[name];
        const tmplDefs = tmpl.defines;
        if (tmpl.uber) {
            let key = '';
            for (let i = 0; i < tmplDefs.length; i++) {
                const tmplDef = tmplDefs[i];
                const value = defines[tmplDef.name];
                if (value === undefined || !tmplDef._map) {
                    continue;
                }
                const mapped = tmplDef._map(value);
                const offset = tmplDef._offset;
                key += offset + (mapped + '|');
            }
            return key + tmpl.hash;
        } else {
            let key = 0;
            for (let i = 0; i < tmplDefs.length; i++) {
                const tmplDef = tmplDefs[i];
                const value = defines[tmplDef.name];
                if (value === undefined || !tmplDef._map) {
                    continue;
                }
                const mapped = tmplDef._map(value);
                const offset = tmplDef._offset;
                key |= mapped << offset;
            }
            return `${key.toString(16)}|${tmpl.hash}`;
        }
    }

    /**
     * @zh
     * 销毁所有完全满足指定预处理宏特征的 shader 实例。
     * @param defines 用于筛选的预处理宏列表
     */
    public destroyShaderByDefines (defines: IDefineMap) {
        const names = Object.keys(defines); if (!names.length) { return; }
        const regexes = names.map((cur) => {
            let val = defines[cur];
            if (typeof val === 'boolean') { val = val ? '1' : '0'; }
            return new RegExp(cur + val);
        });
        const keys = Object.keys(this._cache).filter((k) => regexes.every((re) => re.test(this._cache[k].shader.name)));
        for (const k of keys) {
            const prog = this._cache[k].shader;
            console.log(`destroyed shader ${prog.name}`);
            prog.destroy();
            delete this._cache[k];
        }
    }

    /**
     * @zh
     * 获取指定 shader 的渲染资源实例
     * @param device 渲染设备 [[GFXDevice]]
     * @param name shader 名字
     * @param defines 预处理宏列表
     * @param pipeline 实际渲染命令执行时所属的 [[RenderPipeline]]
     */
    public getGFXShader (device: GFXDevice, name: string, defines: IDefineMap, pipeline: RenderPipeline) {
        Object.assign(defines, pipeline.macros);
        const key = this.getKey(name, defines);
        const res = this._cache[key];
        if (res) { return res; }

        // get template
        const tmpl = this._templates[name];
        if (!tmpl.globalsInited) { insertBuiltinBindings(tmpl, pipeline.globalBindings, 'globals'); tmpl.globalsInited = true; }

        const macroArray = prepareDefines(defines, tmpl.defines);
        const prefix = macroArray.reduce((acc, cur) => `${acc}#define ${cur.name} ${cur.value}\n`, '') + '\n';

        let src = tmpl.glsl3;
        switch (device.gfxAPI) {
            case GFXAPI.WEBGL2: src = tmpl.glsl3; break;
            default:            src = tmpl.glsl1; break;
        }

        const blocks: IBlockInfoRT[] = [];
        const samplers: ISamplerInfoRT[] = [];
        const bindings: IGFXBinding[] = [];
        const inputState = new GFXInputState();
        getShaderBindings(tmpl, defines, blocks, samplers, bindings, inputState.attributes);

        const shader = device.createShader({
            name: getShaderInstanceName(name, macroArray),
            blocks, samplers,
            stages: [
                { type: GFXShaderType.VERTEX, source: prefix + src.vert },
                { type: GFXShaderType.FRAGMENT, source: prefix + src.frag },
            ],
        });
        return this._cache[key] = { shader, bindings, inputState };
    }
}

export const programLib = new ProgramLib();
legacyCC.programLib = programLib;
