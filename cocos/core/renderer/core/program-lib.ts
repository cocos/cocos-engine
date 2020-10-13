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
 * @packageDocumentation
 * @module material
 */

import { IBlockInfo, IBuiltinInfo, IDefineInfo, IShaderInfo } from '../../assets/effect-asset';
import { GFXDescriptorType, GFXGetTypeSize, GFXShaderStageFlagBit, GFXAPI } from '../../gfx/define';
import { SetIndex, IDescriptorSetLayoutInfo, globalDescriptorSetLayout, localDescriptorSetLayout } from '../../pipeline/define';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { genHandle, MacroRecord, PropertyType } from './pass-utils';
import { legacyCC } from '../../global-exports';
import { ShaderPool, ShaderHandle, PipelineLayoutHandle, PipelineLayoutPool, NULL_HANDLE } from './memory-pools';
import { DESCRIPTOR_SAMPLER_TYPE, DESCRIPTOR_BUFFER_TYPE } from '../../gfx/descriptor-set';
import { GFXDescriptorSetLayout, GFXDescriptorSetLayoutBinding, GFXDescriptorSetLayoutInfo } from '../../gfx/descriptor-set-layout';
import { GFXPipelineLayoutInfo, GFXDevice, GFXAttribute, GFXUniformBlock, GFXShaderInfo, GFXUniformSampler, GFXUniform, GFXShaderStage } from '../../gfx';

const _dsLayoutInfo = new GFXDescriptorSetLayoutInfo();

interface IDefineRecord extends IDefineInfo {
    _map: (value: any) => number;
    _offset: number;
}

export interface IProgramInfo extends IShaderInfo {
    blockSizes: number[];
    gfxAttributes: GFXAttribute[];
    gfxBlocks: GFXUniformBlock[];
    gfxSamplers: GFXUniformSampler[];
    gfxStages: GFXShaderStage[];
    defines: IDefineRecord[];
    handleMap: Record<string, number>;
    bindings: GFXDescriptorSetLayoutBinding[];
    samplerStartBinding: number;
    uber: boolean; // macro number exceeds default limits, will fallback to string hash
}
interface IMacroInfo {
    name: string;
    value: string;
    isDefault: boolean;
}

export interface IPipelineLayoutInfo {
    setLayouts: GFXDescriptorSetLayout[];
    hPipelineLayout: PipelineLayoutHandle;
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

function prepareDefines (defs: MacroRecord, tDefs: IDefineInfo[]) {
    const macros: IMacroInfo[] = [];
    for (let i = 0; i < tDefs.length; i++) {
        const tmpl = tDefs[i];
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

function insertBuiltinBindings (tmpl: IProgramInfo, source: IDescriptorSetLayoutInfo, type: string) {
    const target = tmpl.builtins[type] as IBuiltinInfo;
    const tempBlocks: GFXUniformBlock[] = [];
    for (let i = 0; i < target.blocks.length; i++) {
        const b = target.blocks[i];
        const info = source.layouts[b.name] as GFXUniformBlock | undefined;
        if (!info || !(source.bindings[info.binding].descriptorType & DESCRIPTOR_BUFFER_TYPE)) {
            console.warn(`builtin UBO '${b.name}' not available!`);
            continue;
        }
        tempBlocks.push(info);
    }
    Array.prototype.unshift.apply(tmpl.gfxBlocks, tempBlocks);
    const tempSamplers: GFXUniformSampler[] = [];
    for (let i = 0; i < target.samplers.length; i++) {
        const s = target.samplers[i];
        const info = source.layouts[s.name] as GFXUniformSampler;
        if (!info || !(source.bindings[info.binding].descriptorType & DESCRIPTOR_SAMPLER_TYPE)) {
            console.warn(`builtin sampler '${s.name}' not available!`);
            continue;
        }
        tempSamplers.push(info);
    }
    Array.prototype.unshift.apply(tmpl.gfxSamplers, tempSamplers);
}

function getSize (block: IBlockInfo) {
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
            handleMap[uniform.name] = genHandle(PropertyType.UBO, SetIndex.MATERIAL, block.binding, uniform.type, offset);
            offset += (GFXGetTypeSize(uniform.type) >> 2) * uniform.count;
        }
    }
    // sampler handles
    for (let i = 0; i < tmpl.samplers.length; i++) {
        const sampler = tmpl.samplers[i];
        handleMap[sampler.name] = genHandle(PropertyType.SAMPLER, SetIndex.MATERIAL, sampler.binding, sampler.type);
    }
    return handleMap;
}

function dependencyCheck (dependencies: string[], defines: MacroRecord) {
    for (let i = 0; i < dependencies.length; i++) {
        const d = dependencies[i];
        if (d[0] === '!') { if (defines[d.slice(1)]) { return false; } } // negative dependency
        else if (!defines[d]) { return false; }
    }
    return true;
}
function getActiveAttributes (tmpl: IProgramInfo, defines: MacroRecord) {
    const out: GFXAttribute[] = [];
    const { attributes, gfxAttributes } = tmpl;
    for (let i = 0; i < attributes.length; i++) {
        if (!dependencyCheck(attributes[i].defines, defines)) { continue; }
        out.push(gfxAttributes[i]);
    }
    return out;
}

let _dsLayout: GFXDescriptorSetLayout | null = null;

/**
 * @en The global maintainer of all shader resources.
 * @zh 维护 shader 资源实例的全局管理器。
 */
class ProgramLib {
    protected _templates: Record<string, IProgramInfo> = {};
    protected _pipelineLayouts: Record<string, IPipelineLayoutInfo> = {};
    protected _cache: Record<string, ShaderHandle> = {};

    /**
     * @en Register the shader template with the given info
     * @zh 根据 effect 信息注册 shader 模板。
     * @param name Target shader name
     */
    public define (prog: IShaderInfo) {
        const curTmpl = this._templates[prog.name];
        if (curTmpl && curTmpl.hash === prog.hash) { return; }
        const tmpl = Object.assign({}, prog) as IProgramInfo;
        // calculate option mask offset
        let offset = 0;
        for (let i = 0; i < tmpl.defines.length; i++) {
            const def = tmpl.defines[i];
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

        // cache material-specific descriptor set layout
        tmpl.samplerStartBinding = tmpl.blocks.length;
        tmpl.gfxBlocks = []; tmpl.gfxSamplers = [];
        tmpl.bindings = []; tmpl.blockSizes = [];
        for (let i = 0; i < tmpl.blocks.length; i++) {
            const block = tmpl.blocks[i];
            tmpl.blockSizes.push(getSize(block));
            tmpl.bindings.push(new GFXDescriptorSetLayoutBinding(block.descriptorType || GFXDescriptorType.UNIFORM_BUFFER, 1, block.stageFlags));
            tmpl.gfxBlocks.push(new GFXUniformBlock(SetIndex.MATERIAL, block.binding, block.name,
                block.members.map((m) => new GFXUniform(m.name, m.type, m.count)), 1)); // effect compiler guarantees block count = 1
        }
        for (let i = 0; i < tmpl.samplers.length; i++) {
            const sampler = tmpl.samplers[i];
            tmpl.bindings.push(new GFXDescriptorSetLayoutBinding(sampler.descriptorType || GFXDescriptorType.SAMPLER, sampler.count, sampler.stageFlags));
            tmpl.gfxSamplers.push(new GFXUniformSampler(SetIndex.MATERIAL, sampler.binding, sampler.name, sampler.type, sampler.count));
        }
        tmpl.gfxAttributes = [];
        for (let i = 0; i < tmpl.attributes.length; i++) {
            const attr = tmpl.attributes[i];
            tmpl.gfxAttributes.push(new GFXAttribute(attr.name, attr.format, attr.isNormalized, 0, attr.isInstanced, attr.location));
        }

        tmpl.gfxStages = [];
        tmpl.gfxStages.push(new GFXShaderStage(GFXShaderStageFlagBit.VERTEX, ''));
        tmpl.gfxStages.push(new GFXShaderStage(GFXShaderStageFlagBit.FRAGMENT, ''));

        tmpl.handleMap = genHandles(tmpl);

        // store it
        this._templates[prog.name] = tmpl;
        this._pipelineLayouts[prog.name] = { hPipelineLayout: NULL_HANDLE, setLayouts: [] };
    }

    /**
     * @en Gets the shader template with its name
     * @zh 通过名字获取 Shader 模板
     * @param name Target shader name
     */
    public getTemplate (name: string) {
        return this._templates[name];
    }

    /**
     * @en Gets the pipeline layout of the shader template given its name
     * @zh 通过名字获取 Shader 模板相关联的管线布局
     * @param name Target shader name
     */
    public getPipelineLayout (name: string) {
        return this._pipelineLayouts[name];
    }

    /**
     * @en
     * Does this library has the specified program
     * @zh
     * 当前是否有已注册的指定名字的 shader
     * @param name Target shader name
     */
    public hasProgram (name: string) {
        return this._templates[name] !== undefined;
    }

    /**
     * @en Gets the shader key with the name and a macro combination
     * @zh 根据 shader 名和预处理宏列表获取 shader key。
     * @param name Target shader name
     * @param defines The combination of preprocess macros
     */
    public getKey (name: string, defines: MacroRecord) {
        const tmpl = this._templates[name];
        const tmplDefs = tmpl.defines;
        if (tmpl.uber) {
            let key = '';
            for (let i = 0; i < tmplDefs.length; i++) {
                const tmplDef = tmplDefs[i];
                const value = defines[tmplDef.name];
                if (!value || !tmplDef._map) {
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
                if (!value || !tmplDef._map) {
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
     * @en Destroy all shader instance match the preprocess macros
     * @zh 销毁所有完全满足指定预处理宏特征的 shader 实例。
     * @param defines The preprocess macros as filter
     */
    public destroyShaderByDefines (defines: MacroRecord) {
        const names = Object.keys(defines); if (!names.length) { return; }
        const regexes = names.map((cur) => {
            let val = defines[cur];
            if (typeof val === 'boolean') { val = val ? '1' : '0'; }
            return new RegExp(cur + val);
        });
        const keys = Object.keys(this._cache).filter((k) => regexes.every((re) => re.test(ShaderPool.get(this._cache[k]).name)));
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const prog = ShaderPool.get(this._cache[k]);
            console.log(`destroyed shader ${prog.name}`);
            prog.destroy();
            delete this._cache[k];
        }
    }

    /**
     * @en Gets the shader resource instance with given information
     * @zh 获取指定 shader 的渲染资源实例
     * @param device The device
     * @param name Shader name
     * @param defines Preprocess macros
     * @param pipeline The [[RenderPipeline]] which owns the render command
     */
    public getGFXShader (device: GFXDevice, name: string, defines: MacroRecord, pipeline: RenderPipeline, key?: string) {
        Object.assign(defines, pipeline.macros);
        if (!key) key = this.getKey(name, defines);
        const res = this._cache[key];
        if (res) { return res; }

        const tmpl = this._templates[name];
        const layout = this._pipelineLayouts[name];

        if (!layout.hPipelineLayout) {
            insertBuiltinBindings(tmpl, localDescriptorSetLayout, 'locals');
            insertBuiltinBindings(tmpl, globalDescriptorSetLayout, 'globals');
            layout.setLayouts[SetIndex.GLOBAL] = pipeline.descriptorSetLayout;
            // material set layout should already been created in pass, but if not
            // (like when the same shader is overriden) we create it again here
            if (!layout.setLayouts[SetIndex.MATERIAL]) {
                _dsLayoutInfo.bindings = tmpl.bindings;
                layout.setLayouts[SetIndex.MATERIAL] = device.createDescriptorSetLayout(_dsLayoutInfo);
            }
            _dsLayoutInfo.bindings = localDescriptorSetLayout.bindings;
            layout.setLayouts[SetIndex.LOCAL] = _dsLayout = _dsLayout || device.createDescriptorSetLayout(_dsLayoutInfo);
            layout.hPipelineLayout = PipelineLayoutPool.alloc(device, new GFXPipelineLayoutInfo(layout.setLayouts));
        }

        const macroArray = prepareDefines(defines, tmpl.defines);
        const prefix = macroArray.reduce((acc, cur) => `${acc}#define ${cur.name} ${cur.value}\n`, '') + '\n';

        let src = tmpl.glsl3;
        switch (device.gfxAPI) {
            case GFXAPI.GLES2:
            case GFXAPI.WEBGL: src = tmpl.glsl1; break;
            case GFXAPI.GLES3:
            case GFXAPI.WEBGL2: src = tmpl.glsl3; break;
            case GFXAPI.VULKAN:
            case GFXAPI.METAL: src = tmpl.glsl4; break;
            default: console.error('Invalid GFX API!'); break;
        }
        tmpl.gfxStages[0].source = prefix + src.vert;
        tmpl.gfxStages[1].source = prefix + src.frag;

        // strip out the active attributes only, instancing depend on this
        const attributes = getActiveAttributes(tmpl, defines);

        const instanceName = getShaderInstanceName(name, macroArray);
        const shaderInfo = new GFXShaderInfo(instanceName, tmpl.gfxStages, attributes, tmpl.gfxBlocks, tmpl.gfxSamplers);
        return this._cache[key] = ShaderPool.alloc(device, shaderInfo);
    }
}

export const programLib = new ProgramLib();
legacyCC.programLib = programLib;
