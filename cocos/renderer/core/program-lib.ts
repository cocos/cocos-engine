// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { IBlockInfo, IBlockMember, IDefineInfo, ISamplerInfo, IShaderInfo } from '../../3d/assets/effect-asset';
import { GFXGetTypeSize, GFXShaderType } from '../../gfx/define';
import { GFXAPI, GFXDevice } from '../../gfx/device';
import { GFXShader, GFXUniform, GFXUniformBlock, GFXUniformSampler } from '../../gfx/shader';
import { UBOForwardLights } from '../../pipeline/forward/forward-pipeline';
import { UBOGlobal, UBOLocal } from '../../pipeline/render-pipeline';
import { SkinningUBO } from '../models/model-uniforms';
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
     *     vert: vertTmpl,
     *     frag: fragTmpl,
     *     defines: [
     *       { name: 'shadow', type: 'boolean' },
     *       { name: 'lightCount', type: 'number', range: [1, 4] }
     *     ],
     *     blocks: [{ name: 'Constants', binding: 0, size: 16, members: [
     *       { name: 'color', type: 'vec4' }], defines: [] }
     *     ],
     *     dependencies: { 'USE_NORMAL_TEXTURE': 'OES_standard_derivatives' },
     *   };
     *   programLib.define(program);
     */
    public define (prog: IShaderInfo) {
        const tmpl = Object.assign({ id: ++_shdID }, prog) as IProgramInfo;
        tmpl.blocks = tmpl.blocks.concat(globals, locals, lights);

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
            if (def.name === 'CC_USE_SKINNING') {
                tmpl.blocks = tmpl.blocks.concat(skinning);
            } else if (def.name === 'CC_USE_JOINTS_TEXTURE') {
                tmpl.samplers = tmpl.samplers.concat(jointsTexture);
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

    public getGFXShader (device: GFXDevice, name: string, defines: IDefineMap = {}) {
        const key = this.getKey(name, defines);
        let program = this._cache[key];
        if (program !== undefined) {
            return program;
        }

        // get template
        const tmpl = this._templates[name];
        const customDef = _generateDefines(device, defines, tmpl.defines, tmpl.dependencies) + '\n';

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

const globals = convertToBlockInfo(UBOGlobal.BLOCK);
const locals = convertToBlockInfo(UBOLocal.BLOCK);
const lights = convertToBlockInfo(UBOForwardLights.BLOCK);
const skinning = convertToBlockInfo(SkinningUBO.BLOCK);
const jointsTexture = convertToSamplerInfo(SkinningUBO.JOINT_TEXTURE);

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
        name: block.name,
        binding: block.binding,
        defines: [],
        members,
        size,
    };
}

function convertToSamplerInfo (sampler: GFXUniformSampler): ISamplerInfo {
    return {
        name: sampler.name,
        binding: sampler.binding,
        defines: [],
        type: sampler.type,
        count: sampler.count,
    };
}

const programLib = cc.programLib = new ProgramLib();
export { programLib };
