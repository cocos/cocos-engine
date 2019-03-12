// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { IDefineInfo, IShaderInfo } from '../../3d/assets/effect-asset';
import { GFXBindingType, GFXShaderType } from '../../gfx/define';
import { GFXAPI, GFXDevice } from '../../gfx/device';
import { GFXShader, GFXUniformBlock, GFXUniformSampler } from '../../gfx/shader';
import { IInternalBindingDesc, localBindingsDesc } from '../../pipeline/define';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { IDefineMap } from './pass';

function mapDefine (def: number | string | boolean) {
    switch (typeof def) {
        case 'boolean': return def ? 1 : 0;
        case 'string': case 'number': return def;
    }
    return 0;
}

function generateDefines (
    device: GFXDevice,
    defs: IDefineMap,
    tDefs: IDefineInfo[],
    deps: Record<string, string>,
) {
    const defines: string[] = [];
    for (const { name } of tDefs) {
        const d = defs[name];
        let result = mapDefine(d);
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
    globalsInited: boolean;
    localsInited: boolean;
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
        if (!tmpl.localsInited) { insertBuiltinBindings(tmpl, localBindingsDesc, 'locals'); tmpl.localsInited = true; }

        // calculate option mask offset
        let offset = 0;
        for (const def of tmpl.defines) {
            let cnt = 1;
            if (def.type === 'number') {
                const range = def.range || [0, def.options ? def.options.length - 1 : 4];
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
        Object.assign(defines, pipeline.macros);
        const key = this.getKey(name, defines);
        let program = this._cache[key];
        if (program !== undefined) {
            return program;
        }

        // get template
        const tmpl = this._templates[name];
        const customDef = generateDefines(device, defines, tmpl.defines, tmpl.dependencies) + '\n';
        if (!tmpl.globalsInited) { insertBuiltinBindings(tmpl, pipeline.globalBindings, 'globals'); tmpl.globalsInited = true; }

        let vert: string = '';
        let frag: string = '';
        if (device.gfxAPI === GFXAPI.WEBGL2) {
            vert = `#version 300 es\n${customDef}\n${tmpl.glsl3.vert}`;
            frag = `#version 300 es\n${customDef}\n${tmpl.glsl3.frag}`;
        } else {
            vert = `#version 100\n${customDef}\n${tmpl.glsl1.vert}`;
            frag = `#version 100\n${customDef}\n${tmpl.glsl1.frag}`;
        }

        const instanceName = getShaderInstaceName(name, defines);
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

function insertBuiltinBindings (tmpl: IProgramInfo, source: Map<string, IInternalBindingDesc>, type: string) {
    const target = tmpl.builtins[type];
    for (const b of target.blocks) {
        const info = source.get(b);
        if (!info || info.type !== GFXBindingType.UNIFORM_BUFFER) { console.warn(`builtin UBO '${b}' not available!`); continue; }
        const blocks = tmpl.blocks as GFXUniformBlock[];
        blocks.push(info.blockInfo!);
    }
    for (const s of target.samplers) {
        const info = source.get(s);
        if (!info || info.type !== GFXBindingType.SAMPLER) { console.warn(`builtin sampler '${s}' not available!`); continue; }
        const samplers = tmpl.samplers as GFXUniformSampler[];
        samplers.push(info.samplerInfo!);
    }
}

export function getShaderInstaceName (name: string, defines: IDefineMap) {
    return Object.keys(defines).reduce((acc, cur) => {
        const val = defines[cur];
        const res = (typeof val === 'boolean' ? '' : val);
        return val ? `${acc}|${cur}${res}` : acc;
    }, name);
}

export const programLib = new ProgramLib();
cc.programLib = programLib;
