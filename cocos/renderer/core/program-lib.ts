// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { IBlockInfo, IBlockMember, IDefineInfo, ISamplerInfo, IShaderInfo } from '../../3d/assets/effect-asset';
import { GFXBindingType, GFXGetTypeSize, GFXShaderType } from '../../gfx/define';
import { GFXAPI, GFXDevice } from '../../gfx/device';
import { GFXShader, GFXUniform, GFXUniformBlock, GFXUniformSampler } from '../../gfx/shader';
import { UBOLocal, UBOSkinning, UNIFORM_JOINTS_TEXTURE } from '../../pipeline/define';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { IDefineMap } from './effect';

function _generateDefines (
    device: GFXDevice,
    defs: IDefineMap,
    tDefs: IDefineInfo[],
    deps: Record<string, string>,
) {
    const defines: string[] = [];
    for (const { name } of tDefs) {
        const d = defs[name];
        let result = (typeof d === 'number') ? d : (d ? 1 : 0);
        // fallback if extension dependency not supported
        if (result && deps[name] && !device[deps[name]]) {
            console.warn(`${deps[name]} not supported on this platform, disabled ${name}`);
            result = 0;
        }
        defines.push(`#define ${name} ${result}`);
    }
    return defines.join('\n');
}

let _shdID = 0;
interface IDefineRecord extends IDefineInfo {
    _map: (value: any) => number;
    _offset: number;
}
interface IProgramInfo extends IShaderInfo {
    id: number;
    defines: IDefineRecord[];
    builtinInited: boolean;
}

class ProgramLib {
    protected _templates: Record<string, IProgramInfo>;
    protected _cache: Record<string, GFXShader | null>;

    constructor () {
        this._templates = {};
        this._cache = {};
    }

    /**
     * @example:
     *   // this object is auto-generated from your actual shaders
     *   let program = {
     *     name: 'foobar',
     *     glsl1: { vert: '// shader source', frag: '// shader source' },
     *     glsl3: { vert: '// shader source', frag: '// shader source' },
     *     defines: [
     *       { name: 'shadow', type: 'boolean', defines: [] },
     *       { name: 'lightCount', type: 'number', range: [1, 4], defines: [] }
     *     ],
     *     blocks: [{ name: 'Constants', binding: 0, members: [
     *       { name: 'color', type: 'vec4', count: 1, size: 16 }], defines: [], size: 16 }
     *     ],
     *     samplers: [],
     *     dependencies: { 'USE_NORMAL_TEXTURE': 'OES_standard_derivatives' },
     *   };
     *   programLib.define(program);
     */
    public define (prog: IShaderInfo) {
        const tmpl = Object.assign({ id: ++_shdID }, prog) as IProgramInfo;
        processSpecialBindingLayout(tmpl);

        // calculate option mask offset
        let offset = 0;
        for (const def of tmpl.defines) {
            let cnt = 1;
            if (def.type === 'number') {
                const range = def.range || [0, 4];
                cnt = Math.ceil(Math.log2(range[1] - range[0]));
                def._map = ((value: number) => (value - range[0]) << def._offset);
            } else { // boolean
                def._map = ((value: any) => (value ? (1 << def._offset) : 0));
            }
            offset += cnt;
            def._offset = offset;
        }
        // store it
        this._templates[prog.name] = tmpl;
    }

    public getTemplate (name: string) {
        return this._templates[name];
    }

    /**
     * Does this library has the specified program?
     */
    public hasProgram (name: string) {
        return this._templates[name] !== undefined;
    }

    public getKey (name: string, defines: IDefineMap) {
        const tmpl = this._templates[name];
        let key = 0;
        for (const tmplDef of tmpl.defines) {
            const value = defines[tmplDef.name];
            if (value === undefined || !tmplDef._map) {
                continue;
            }
            key |= tmplDef._map(value);
        }
        return key << 8 | (tmpl.id & 0xff);
    }

    public getGFXShader (device: GFXDevice, name: string, defines: IDefineMap = {}, pipeline: RenderPipeline) {
        const key = this.getKey(name, defines);
        let program = this._cache[key];
        if (program !== undefined) {
            return program;
        }

        // get template
        const tmpl = this._templates[name];
        const customDef = _generateDefines(device, defines, tmpl.defines, tmpl.dependencies) + '\n';
        if (!tmpl.builtinInited) { insertPipelineGlobalBindings(tmpl, pipeline); }

        let vert: string = '';
        let frag: string = '';
        if (device.gfxAPI === GFXAPI.WEBGL2) {
            vert = `#version 300 es\n${customDef}\n${tmpl.glsl3.vert}`;
            frag = `#version 300 es\n${customDef}\n${tmpl.glsl3.frag}`;
        } else {
            vert = `#version 100\n${customDef}\n${tmpl.glsl1.vert}`;
            frag = `#version 100\n${customDef}\n${tmpl.glsl1.frag}`;
        }

        const instanceName = Object.keys(defines).reduce((acc, cur) => defines[cur] ? `${acc}|${cur}` : acc, name);
        program = device.createShader({
            name: instanceName,
            blocks: tmpl.blocks,
            samplers: tmpl.samplers,
            stages: [
                { type: GFXShaderType.VERTEX, source: vert },
                { type: GFXShaderType.FRAGMENT, source: frag },
            ],
        });
        this._cache[key] = program;
        return program;
    }
}

function insertPipelineGlobalBindings (tmpl: IProgramInfo, pipeline: RenderPipeline) {
    const source = pipeline.globalBindings;
    const target = tmpl.builtins;
    for (const b of target.blocks) {
        const info = source.get(b);
        if (!info || info.type !== GFXBindingType.UNIFORM_BUFFER) { console.warn(`builtin UBO '${b}' not available!`); continue; }
        tmpl.blocks.push(convertToBlockInfo(info.blockInfo!));
    }
    for (const s of target.textures) {
        const info = source.get(s);
        if (!info || info.type !== GFXBindingType.SAMPLER) { console.warn(`builtin texture '${s}' not available!`); continue; }
        tmpl.samplers.push(convertToSamplerInfo(info.samplerInfo!));
    }
    tmpl.builtinInited = true;
}

const locals = convertToBlockInfo(UBOLocal.BLOCK);
const skinning = convertToBlockInfo(UBOSkinning.BLOCK);
const jointsTexture = convertToSamplerInfo(UNIFORM_JOINTS_TEXTURE);
function processSpecialBindingLayout (tmpl: IProgramInfo) {
    let blockIdx = tmpl.builtins.blocks.findIndex((b) => b === 'CCSkinning');
    if (blockIdx >= 0) { tmpl.blocks.push(skinning); tmpl.builtins.blocks.splice(blockIdx, 1); }
    const samplerIdx = tmpl.builtins.textures.findIndex((t) => t === 'cc_jointsTexture');
    if (samplerIdx >= 0) { tmpl.samplers.push(jointsTexture); tmpl.builtins.textures.splice(samplerIdx, 1); }
    blockIdx = tmpl.builtins.blocks.findIndex((t) => t === 'CCLocal');
    if (blockIdx >= 0) { tmpl.blocks.push(locals); tmpl.builtins.blocks.splice(blockIdx, 1); }
}

function convertToUniformInfo (uniform: GFXUniform): IBlockMember {
    return {
        name: uniform.name,
        type: uniform.type,
        count: uniform.count,
        size: GFXGetTypeSize(uniform.type) * uniform.count,
    };
}
function convertToBlockInfo (block: GFXUniformBlock): IBlockInfo {
    const members: IBlockMember[] = [];
    let size: number = 0;
    for (let i = 0; i < block.members.length; i++) {
        members.push(convertToUniformInfo(block.members[i]));
        size += members[i].size;
    }
    return {
        binding: block.binding,
        name: block.name,
        members,
        defines: [],
        size,
    };
}
function convertToSamplerInfo (sampler: GFXUniformSampler): ISamplerInfo {
    return {
        binding: sampler.binding,
        name: sampler.name,
        type: sampler.type,
        count: sampler.count,
        defines: [],
    };
}

const programLib = cc.programLib = new ProgramLib();
export { programLib };
