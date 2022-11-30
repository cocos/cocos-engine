import { EffectAsset } from "../../asset/assets/effect-asset";
import { Attribute } from "../../gfx/base/define";
import { MacroRecord } from "./pass-utils";
import { IProgramInfo } from "./program-lib";

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

export interface IMacroInfo {
    name: string;
    value: string;
    isDefault: boolean;
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