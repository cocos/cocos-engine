/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
****************************************************************************/

import { EffectAsset } from '../../asset/assets/effect-asset';
import { Attribute } from '../../gfx/base/define';
import { MacroRecord } from './pass-utils';
import { IMacroInfo, IProgramInfo } from './program-lib';

function mapDefine (info: EffectAsset.IDefineInfo, def: number | string | boolean) {
    switch (info.type) {
    case 'boolean': return typeof def === 'number' ? def.toString() : (def ? '1' : '0');
    case 'string': return def !== undefined ? def as string : info.options![0];
    case 'number': return def !== undefined ? def.toString() : info.range![0].toString();
    default:
        console.warn(`unknown define type '${info.type}'`);
        return '-1'; // should neven happen
    }
}

export function prepareDefines (defs: MacroRecord, tDefs: EffectAsset.IDefineInfo[]) {
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

export function getShaderInstanceName (name: string, macros: IMacroInfo[]) {
    return name + macros.reduce((acc, cur) => (cur.isDefault ? acc : `${acc}|${cur.name}${cur.value}`), '');
}

function dependencyCheck (dependencies: string[], defines: MacroRecord) {
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

export function getActiveAttributes (tmpl: IProgramInfo, gfxAttributes: Attribute[], defines: MacroRecord) {
    const out: Attribute[] = [];
    const attributes = tmpl.attributes;
    for (let i = 0; i < attributes.length; i++) {
        if (!dependencyCheck(attributes[i].defines, defines)) { continue; }
        out.push(gfxAttributes[i]);
    }
    return out;
}

export function getVariantKey (programInfo: IProgramInfo, defines: MacroRecord) {
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
