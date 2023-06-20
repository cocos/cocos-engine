/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

import { EffectAsset } from '../../asset/assets/effect-asset';
import { Attribute, GetTypeSize, ShaderInfo, Uniform } from '../../gfx/base/define';
import { UBOForwardLight, UBOSkinning } from '../../rendering/define';
import { genHandle, MacroRecord } from './pass-utils';
import { IProgramInfo } from './program-lib';

export interface IMacroInfo {
    name: string;
    value: string;
    isDefault: boolean;
}

function mapDefine (info: EffectAsset.IDefineInfo, def: number | string | boolean): string {
    switch (info.type) {
    case 'boolean': return typeof def === 'number' ? def.toString() : (def ? '1' : '0');
    case 'string': return def !== undefined ? def as string : info.options![0];
    case 'number': return def !== undefined ? def.toString() : info.range![0].toString();
    default:
        console.warn(`unknown define type '${info.type}'`);
        return '-1'; // should neven happen
    }
}

export function prepareDefines (defs: MacroRecord, tDefs: EffectAsset.IDefineInfo[]): IMacroInfo[] {
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

export function getShaderInstanceName (name: string, macros: IMacroInfo[]): string {
    return name + macros.reduce((acc, cur): string => (cur.isDefault ? acc : `${acc}|${cur.name}${cur.value}`), '');
}

function dependencyCheck (dependencies: string[], defines: MacroRecord): boolean {
    for (let i = 0; i < dependencies.length; i++) {
        const d = dependencies[i];
        if (d[0] === '!') { // negative dependency
            if (defines[d.slice(1)]) { return false; }
        } else if (!defines[d]) {
            return false;
        }
    }
    return true;
}

export function getActiveAttributes (tmpl: IProgramInfo, gfxAttributes: Attribute[], defines: MacroRecord): Attribute[] {
    const out: Attribute[] = [];
    const attributes = tmpl.attributes;
    for (let i = 0; i < attributes.length; i++) {
        if (!dependencyCheck(attributes[i].defines, defines)) { continue; }
        out.push(gfxAttributes[i]);
    }
    return out;
}

export function getVariantKey (programInfo: IProgramInfo, defines: MacroRecord): string {
    const tmplDefs = programInfo.defines;
    if (programInfo.uber) {
        let key = '';
        for (let i = 0; i < tmplDefs.length; i++) {
            const tmplDef = tmplDefs[i];
            const value = defines[tmplDef.name];
            if (!value || !tmplDef._map) {
                continue;
            }
            const mapped = tmplDef._map(value);
            const offset = tmplDef._offset;
            key += `${offset}${mapped}|`;
        }
        return `${key}${programInfo.hash}`;
    }
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
    return `${key.toString(16)}|${programInfo.hash}`;
}

const defaultUniformCounts = new Map<string, number>();
defaultUniformCounts.set('cc_joints', UBOSkinning.LAYOUT.members[0].count);
defaultUniformCounts.set('cc_lightPos', UBOForwardLight.LIGHTS_PER_PASS);
defaultUniformCounts.set('cc_lightColor', UBOForwardLight.LIGHTS_PER_PASS);
defaultUniformCounts.set('cc_lightSizeRangeAngle', UBOForwardLight.LIGHTS_PER_PASS);
defaultUniformCounts.set('cc_lightDir', UBOForwardLight.LIGHTS_PER_PASS);
defaultUniformCounts.set('cc_lightBoundingSizeVS', UBOForwardLight.LIGHTS_PER_PASS);

function getUniformSize (prevSize: number, m: Uniform): number {
    if (m.count) {
        return prevSize + GetTypeSize(m.type) * m.count;
    } else {
        const count = defaultUniformCounts.get(m.name);
        if (count !== undefined) {
            return prevSize + GetTypeSize(m.type) * count;
        }
        console.error(`uniform '${m.name}' must have a count`);
    }
    return prevSize;
}

export function getSize (blockMembers: Uniform[]): number {
    return blockMembers.reduce(getUniformSize, 0);
}

export function genHandles (tmpl: EffectAsset.IShaderInfo | ShaderInfo): Record<string, number> {
    const handleMap: Record<string, number> = {};
    // block member handles
    for (let i = 0; i < tmpl.blocks.length; i++) {
        const block = tmpl.blocks[i];
        const members = block.members;
        let offset = 0;
        for (let j = 0; j < members.length; j++) {
            const uniform = members[j];
            handleMap[uniform.name] = genHandle(block.binding, uniform.type, uniform.count, offset);
            offset += (GetTypeSize(uniform.type) >> 2) * uniform.count; // assumes no implicit padding, which is guaranteed by effect compiler
        }
    }
    // samplerTexture handles
    for (let i = 0; i < tmpl.samplerTextures.length; i++) {
        const samplerTexture = tmpl.samplerTextures[i];
        handleMap[samplerTexture.name] = genHandle(samplerTexture.binding, samplerTexture.type, samplerTexture.count);
    }
    return handleMap;
}

function getBitCount (cnt: number): number {
    return Math.ceil(Math.log2(Math.max(cnt, 2)));
}

export function populateMacros (tmpl: IProgramInfo): void {
    // calculate option mask offset
    let offset = 0;
    for (let i = 0; i < tmpl.defines.length; i++) {
        const def = tmpl.defines[i];
        let cnt = 1;
        if (def.type === 'number') {
            const range = def.range!;
            cnt = getBitCount(range[1] - range[0] + 1); // inclusive on both ends
            def._map = (value: number): number => value - range[0];
        } else if (def.type === 'string') {
            cnt = getBitCount(def.options!.length);
            def._map = (value: any): number => Math.max(0, def.options!.findIndex((s): boolean => s === value));
        } else if (def.type === 'boolean') {
            def._map = (value: any): number => (value ? 1 : 0);
        }
        def._offset = offset;
        offset += cnt;
    }
    if (offset > 31) { tmpl.uber = true; }
    // generate constant macros
    tmpl.constantMacros = '';
    for (const key in tmpl.builtins.statistics) {
        tmpl.constantMacros += `#define ${key} ${tmpl.builtins.statistics[key]}\n`;
    }
}

export function getCombinationDefines (combination: EffectAsset.IPreCompileInfo): Record<string, string | number | boolean>[] {
    const defines = Object.keys(combination).reduce((out, name): Record<string, string | number | boolean>[] => out.reduce((acc, cur): Record<string, string | number | boolean>[] => {
        const choices = combination[name];
        for (let i = 0; i < choices.length; ++i) {
            const defines = { ...cur };
            defines[name] = choices[i];
            acc.push(defines);
        }
        return acc;
    }, [] as MacroRecord[]), [{}] as MacroRecord[]);
    return defines;
}

export function addEffectDefaultProperties (effect: EffectAsset): void {
    for (let i = 0; i < effect.techniques.length; i++) {
        const tech = effect.techniques[i];
        for (let j = 0; j < tech.passes.length; j++) {
            const pass = tech.passes[j];
            // grab default property declaration if there is none
            if (pass.propertyIndex !== undefined && pass.properties === undefined) {
                pass.properties = tech.passes[pass.propertyIndex].properties;
            }
        }
    }
}
