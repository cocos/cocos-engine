// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { IDefineInfo, IShaderInfo } from '../../3d/assets/effect-asset';
import { GFXBindingType, GFXShaderType } from '../../gfx/define';
import { GFXAPI, GFXDevice } from '../../gfx/device';
import { GFXShader, GFXUniformBlock, GFXUniformSampler } from '../../gfx/shader';
import { IInternalBindingDesc, localBindingsDesc } from '../../pipeline/define';
import { RenderPipeline } from '../../pipeline/render-pipeline';
import { IDefineMap } from './pass';

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
export interface IDefineValue {
    name: string;
    result: string | number;
}

const mapDefine = (info: IDefineInfo, def: number | string | boolean) => {
    switch (info.type) {
        case 'boolean': return def ? 1 : 0;
        case 'string': return def !== undefined ? def as string : info.options![0];
        case 'number': return def !== undefined ? def as number : info.range![0];
    }
    console.warn(`unknown define type '${info.type}'`);
    return -1; // should neven happen
};

const prepareDefines = (defs: IDefineMap, tDefs: IDefineInfo[]) => {
    const defines: IDefineValue[] = [];
    for (const tmpl of tDefs) {
        const name = tmpl.name;
        const result = mapDefine(tmpl, defs[name]);
        defines.push({ name, result });
    }
    return defines;
};

const validateDefines = (defines: IDefineValue[], device: GFXDevice, deps: Record<string, string>) => {
    for (const info of defines) {
        const name = info.name;
        // fallback if extension dependency not supported
        if (info.result && deps[name] && !device[deps[name]]) {
            console.warn(`${deps[name]} not supported on this platform, disabled ${name}`);
            info.result = 0;
        }
    }
};

const insertBuiltinBindings = (tmpl: IProgramInfo, source: Map<string, IInternalBindingDesc>, type: string) => {
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
};

class ProgramLib {
    protected _templates: Record<string, IProgramInfo>;
    protected _cache: Record<string, GFXShader>;

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
        const cur = this._templates[prog.name];
        if (cur && cur.hash === prog.hash) { return; }
        const tmpl = Object.assign({ id: ++_shdID }, prog) as IProgramInfo;
        if (!tmpl.localsInited) { insertBuiltinBindings(tmpl, localBindingsDesc, 'locals'); tmpl.localsInited = true; }

        // calculate option mask offset
        let offset = 0;
        for (const def of tmpl.defines) {
            let cnt = 1;
            if (def.type === 'number') {
                const range = def.range || [0, 4];
                cnt = Math.ceil(Math.log2(range[1] - range[0]));
                def._map = (value: number) => (value - range[0]) << def._offset;
            } else if (def.type === 'string') {
                const range = [0, def.options!.length - 1];
                cnt = Math.ceil(Math.log2(range[1] - range[0]));
                def._map = (value: any) => Math.max(0, def.options!.findIndex((s) => s === value)) << def._offset;
            } else { // boolean
                def._map = (value: any) => value ? (1 << def._offset) : 0;
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

    public destroyShaderByDefines (defines: IDefineMap) {
        const defs = Object.keys(defines); if (!defs.length) { return; }
        const re = new RegExp(defs.reduce((acc, cur) => `${cur}|${acc}`, '').slice(0, -1));
        const keys = Object.keys(this._cache).filter((k) => re.test(this._cache[k].name));
        for (const k of keys) {
            console.log(`destroyed shader ${this._cache[k].name}`);
            this._cache[k].destroy();
            delete this._cache[k];
        }
    }

    public getShaderInstaceName (name: string, defines: IDefineMap, defs?: IDefineValue[]) {
        if (!defs) { defs = prepareDefines(defines, this._templates[name].defines); }
        return name + defs.reduce((acc, cur) => cur.result ? `${acc}|${cur.name}${cur.result}` : acc, '');
    }

    public getGFXShader (device: GFXDevice, name: string, defines: IDefineMap, pipeline: RenderPipeline) {
        Object.assign(defines, pipeline.macros);
        const key = this.getKey(name, defines);
        let program = this._cache[key];
        if (program !== undefined) {
            return program;
        }

        // get template
        const tmpl = this._templates[name];
        if (!tmpl.globalsInited) { insertBuiltinBindings(tmpl, pipeline.globalBindings, 'globals'); tmpl.globalsInited = true; }

        const defs = prepareDefines(defines, tmpl.defines);
        const instanceName = this.getShaderInstaceName(name, defines, defs);
        validateDefines(defs, device, tmpl.dependencies);
        const customDef = defs.reduce((acc, cur) => `${acc}#define ${cur.name} ${cur.result}\n`, '');

        let vert: string = '';
        let frag: string = '';
        if (device.gfxAPI === GFXAPI.WEBGL2) {
            vert = `#version 300 es\n${customDef}\n${tmpl.glsl3.vert}`;
            frag = `#version 300 es\n${customDef}\n${tmpl.glsl3.frag}`;
        } else {
            vert = `#version 100\n${customDef}\n${tmpl.glsl1.vert}`;
            frag = `#version 100\n${customDef}\n${tmpl.glsl1.frag}`;
        }

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

export const programLib = new ProgramLib();
cc.programLib = programLib;
