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

import { IBuiltinInfo, IDefineInfo, IShaderInfo } from '../../3d/assets/effect-asset';
import { GFXBindingType, GFXShaderType } from '../../gfx/define';
import { GFXAPI, GFXDevice } from '../../gfx/device';
import { GFXShader } from '../../gfx/shader';
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
    result: string | boolean;
}

const getBitCount = (cnt: number) => Math.ceil(Math.log2(Math.max(cnt, 2)));

const mapDefine = (info: IDefineInfo, def: number | string | boolean) => {
    switch (info.type) {
        case 'boolean': return def as boolean ? '1' : '0';
        case 'string': return def !== undefined ? def as string : info.options![0];
        case 'number': return (def !== undefined ? def as number : info.range![0]) + '';
    }
    console.warn(`unknown define type '${info.type}'`);
    return '0'; // should neven happen
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
            info.result = '0';
        }
    }
};

const getShaderInstanceName = (name: string, defs: IDefineValue[]) => {
    return name + defs.reduce((acc, cur) => cur.result ? `${acc}|${cur.name}${cur.result}` : acc, '');
};

const insertBuiltinBindings = (tmpl: IProgramInfo, source: Map<string, IInternalBindingDesc>, type: string) => {
    const target = tmpl.builtins[type] as IBuiltinInfo;
    const blocks = tmpl.blocks;
    for (const b of target.blocks) {
        const info = source.get(b.name);
        if (!info || info.type !== GFXBindingType.UNIFORM_BUFFER) { console.warn(`builtin UBO '${b.name}' not available!`); continue; }
        const builtin = Object.assign({ defines: b.defines }, info.blockInfo);
        blocks.push(builtin);
    }
    const samplers = tmpl.samplers;
    for (const s of target.samplers) {
        const info = source.get(s.name);
        if (!info || info.type !== GFXBindingType.SAMPLER) { console.warn(`builtin sampler '${s.name}' not available!`); continue; }
        const builtin = Object.assign({ defines: s.defines }, info.samplerInfo);
        samplers.push(builtin);
    }
};

/**
 * @zh
 * 维护 shader 资源实例的全局管理器。
 */
class ProgramLib {
    protected _templates: Record<string, IProgramInfo>;
    protected _cache: Record<string, GFXShader>;

    constructor () {
        this._templates = {};
        this._cache = {};
    }

    /**
     * @zh
     * 根据 effect 信息注册 shader 模板。
     * @example
     * ```typescript
     *   // this object is auto-generated from your actual shaders
     *   let program = {
     *     name: 'foobar',
     *     glsl1: { vert: '...', frag: '...' },
     *     glsl3: { vert: '...', frag: '...' },
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
     * ```
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
                const range = def.range!;
                cnt = getBitCount(range[1] - range[0]);
                def._map = (value: number) => (value - range[0]) << def._offset;
            } else if (def.type === 'string') {
                const range = [0, def.options!.length - 1];
                cnt = getBitCount(range[1] - range[0]);
                def._map = (value: any) => Math.max(0, def.options!.findIndex((s) => s === value)) << def._offset;
            } else if (def.type === 'boolean') {
                def._map = (value: any) => value ? (1 << def._offset) : 0;
            }
            def._offset = offset;
            offset += cnt;
        }
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

    /**
     * @zh
     * 销毁所有完全满足指定预处理宏特征的 shader 实例。
     * @param defines 用于筛选的预处理宏列表
     */
    public destroyShaderByDefines (defines: IDefineMap) {
        const defs = Object.keys(defines); if (!defs.length) { return; }
        const regexes = defs.map((cur) => {
            let val = defs[cur];
            if (typeof val === 'boolean') { val = val ? '1' : '0'; }
            return new RegExp(cur + val);
        });
        const keys = Object.keys(this._cache).filter((k) => regexes.every((re) => re.test(this._cache[k].name)));
        for (const k of keys) {
            console.log(`destroyed shader ${this._cache[k].name}`);
            this._cache[k].destroy();
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
        let program = this._cache[key];
        if (program !== undefined) {
            return program;
        }

        // get template
        const tmpl = this._templates[name];
        if (!tmpl.globalsInited) { insertBuiltinBindings(tmpl, pipeline.globalBindings, 'globals'); tmpl.globalsInited = true; }

        const defs = prepareDefines(defines, tmpl.defines);
        validateDefines(defs, device, tmpl.dependencies);
        const customDef = defs.reduce((acc, cur) => {
            return `${acc}#define ${cur.name} ${cur.result}\n`;
        }, '');

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
            name: getShaderInstanceName(name, defs),
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
