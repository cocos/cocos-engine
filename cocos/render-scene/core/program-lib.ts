/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

import * as env from 'internal:constants';
import { EffectAsset } from '../../asset/assets/effect-asset';
import { SetIndex, IDescriptorSetLayoutInfo, globalDescriptorSetLayout, localDescriptorSetLayout } from '../../rendering/define';
import { PipelineRuntime } from '../../rendering/custom/pipeline';
import { MacroRecord } from './pass-utils';
import {
    PipelineLayoutInfo, Device, Attribute, UniformBlock, ShaderInfo,
    Uniform, ShaderStage, DESCRIPTOR_SAMPLER_TYPE, DESCRIPTOR_BUFFER_TYPE,
    DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo,
    DescriptorType, ShaderStageFlagBit, API, UniformSamplerTexture, PipelineLayout,
    Shader, UniformStorageBuffer, UniformStorageImage, UniformSampler, UniformTexture, UniformInputAttachment,
} from '../../gfx';
import { genHandles, getActiveAttributes, getShaderInstanceName, getSize,
    getVariantKey, IMacroInfo, populateMacros, prepareDefines } from './program-utils';
import { debug, cclegacy } from '../../core';

const _dsLayoutInfo = new DescriptorSetLayoutInfo();

export interface IDefineRecord extends EffectAsset.IDefineInfo {
    _map: (value: any) => number;
    _offset: number;
}

export interface ITemplateInfo {
    gfxAttributes: Attribute[];
    shaderInfo: ShaderInfo;
    blockSizes: number[];
    setLayouts: DescriptorSetLayout[];
    pipelineLayout: PipelineLayout;
    handleMap: Record<string, number>;
    bindings: DescriptorSetLayoutBinding[];
    samplerStartBinding: number;
}

export interface IProgramInfo extends EffectAsset.IShaderInfo {
    effectName: string;
    defines: IDefineRecord[];
    constantMacros: string;
    uber: boolean; // macro number exceeds default limits, will fallback to string hash
}

function insertBuiltinBindings (
    tmpl: IProgramInfo, tmplInfo: ITemplateInfo, source: IDescriptorSetLayoutInfo,
    type: 'locals' | 'globals', outBindings?: DescriptorSetLayoutBinding[],
): void {
    const target = tmpl.builtins[type];
    const tempBlocks: UniformBlock[] = [];
    for (let i = 0; i < target.blocks.length; i++) {
        const b = target.blocks[i];
        const info = source.layouts[b.name] as UniformBlock | undefined;
        const binding = info && source.bindings.find((bd): boolean => bd.binding === info.binding);
        if (!info || !binding || !(binding.descriptorType & DESCRIPTOR_BUFFER_TYPE)) {
            console.warn(`builtin UBO '${b.name}' not available!`);
            continue;
        }
        tempBlocks.push(info);
        if (outBindings && !outBindings.includes(binding)) outBindings.push(binding);
    }
    Array.prototype.unshift.apply(tmplInfo.shaderInfo.blocks, tempBlocks);
    const tempSamplerTextures: UniformSamplerTexture[] = [];
    for (let i = 0; i < target.samplerTextures.length; i++) {
        const s = target.samplerTextures[i];
        const info = source.layouts[s.name] as UniformSamplerTexture;
        const binding = info && source.bindings.find((bd): boolean => bd.binding === info.binding);
        if (!info || !binding || !(binding.descriptorType & DESCRIPTOR_SAMPLER_TYPE)) {
            console.warn(`builtin samplerTexture '${s.name}' not available!`);
            continue;
        }
        tempSamplerTextures.push(info);
        if (outBindings && !outBindings.includes(binding)) outBindings.push(binding);
    }
    Array.prototype.unshift.apply(tmplInfo.shaderInfo.samplerTextures, tempSamplerTextures);
    if (outBindings) outBindings.sort((a, b): number => a.binding - b.binding);
}

// find those location which won't be affected by defines, and replace by ascending order of existing slot if location > 15
function findDefineIndependent (source: string, tmpl: IProgramInfo, attrMap: Map<string, number>, locSet: Set<number>): string {
    const locExistingRegStr = `layout\\(location = (\\d+)\\)\\s+in.*?\\s(\\w+)[;,\\)]`;
    const locExistingReg = new RegExp(locExistingRegStr, 'g');
    let locExistingRes = locExistingReg.exec(source);
    let code = source;
    // layout(location = 3) in mediump vec3 v_normal;
    // 3
    // v_normal
    while (locExistingRes) {
        const attrName = locExistingRes[2];
        const attrInfo = tmpl.attributes.find((ele): boolean => ele.name === attrName);
        // no define required.
        const preExisted = attrInfo?.defines.length === 0 || attrInfo?.defines.every((ele): boolean => ele === '');
        if (preExisted) {
            let loc = parseInt(locExistingRes[1]);
            if (loc > 15) {
                // fill hole by ascending order if location > 15
                let n = 0;
                while (locSet.has(n)) {
                    n++;
                }
                loc = n;
                // flatten location index
                const locDefStr = locExistingRes[0].replace(locExistingRes[1], `${loc}`);
                code = source.replace(locExistingRes[0], locDefStr);
            }
            locSet.add(loc);
            attrMap.set(locExistingRes[2], loc);
        }
        locExistingRes = locExistingReg.exec(source);
    }
    return code;
}

// replace those which could be affected by defines
function replaceVertexMutableLocation (
    source: string,
    tmpl: IProgramInfo,
    macroInfo: IMacroInfo[],
    inOrOut: string,
    attrMap: Map<string, number>,
    locSet: Set<number> = new Set<number>(),
): string {
    const locHolderRegStr = `layout\\(location = ([^\\)]+)\\)\\s+${inOrOut}.*?\\s(\\w+)[;,\\)]`;
    const locHolderReg = new RegExp(locHolderRegStr, 'g');

    let code = source;
    // layout(location = 3) in mediump vec3 v_normal;
    // 3
    // v_normal
    let locHolder = locHolderReg.exec(source);
    while (locHolder) {
        const attrName = locHolder[2];
        if (!attrMap.has(attrName)) {
            const attrInfo = tmpl.attributes.find((ele): boolean => ele.name === attrName);
            let active = true;
            let location = 0;
            // only vertexshader input is checked
            if (inOrOut === 'in') {
                const targetStr = source.slice(0, locHolder.index);
                // attrInfo?.defines store defines need to be satisfied
                // macroInfo stores value of defines
                // '!CC_USE_XXX' starts with a '!' is inverse condition.
                // all defines satisfied?
                active = !!attrInfo?.defines.every((defStrIn): boolean => {
                    const inverseCond = defStrIn.startsWith('!');
                    const defStr = inverseCond ? defStrIn.slice(1) : defStrIn;
                    const v = macroInfo.find((ele): boolean => ele.name === defStr);
                    let res = !!v;
                    if (v) {
                        res = !(v.value === '0' || v.value === 'false' || v.value === 'FALSE');
                    }
                    res = inverseCond ? !res : res;
                    if (res) {
                        // #if CC_RENDER_MODE == xx ......
                        // 'CC_RENDER_MODE == 1' or ' CC_RENDER_MODE == 1 ||  CC_RENDER_MODE == 4'
                        const lastIfRegStr = `[\\n|\\s]+#(?:if|elif)(.*?${defStr}.*?(?:(?!#if|#elif).)*)[\\n|\\s]+$`;
                        const lastIfReg = new RegExp(lastIfRegStr, 'g');
                        const lastIfRes = lastIfReg.exec(targetStr);
                        if (lastIfRes) {
                            const evalStr = lastIfRes[1];
                            const evalORElements = evalStr.split('||');
                            // simple grammar, no parenthesses support yet.
                            const evalRes = evalORElements.some((eleOrTestStr): boolean => {
                                const evalANDElements = eleOrTestStr.split('&&');
                                return evalANDElements.every((eleAndTestStr): boolean => {
                                    let evalEleRes = true;
                                    if (eleAndTestStr.includes('==')) {
                                        const opVars = eleAndTestStr.split('==');
                                        if ((opVars[0] as any).replaceAll(' ', '') === defStr) {
                                            evalEleRes = (opVars[1] as any).replaceAll(' ', '') === v!.value;
                                        }
                                    } else if (eleAndTestStr.includes('!=')) {
                                        const opVars = eleAndTestStr.split('!=');
                                        if ((opVars[0] as any).replaceAll(' ', '') === defStr) {
                                            evalEleRes = (opVars[1] as any).replaceAll(' ', '') !== v!.value;
                                        }
                                    } else {
                                        // no compare just define or not
                                        // expect to be true
                                    }
                                    return evalEleRes;
                                });
                            });
                            res = res && evalRes;
                        }
                    }
                    return res;
                });
            }

            // those didn't pass the check above are deactive, ignore
            if (active) {
                while (locSet.has(location)) {
                    location++;
                }
                locSet.add(location);
                // const attrInfo = tmpl.attributes.find((ele) => ele.name === attrName);
                if (attrInfo) {
                    attrInfo.location = location;
                }

                attrMap.set(attrName, location);
            }

            const locInstStr = locHolder[0].replace(locHolder[1], `${location}`);
            code = code.replace(locHolder[0], locInstStr);
        }
        locHolder = locHolderReg.exec(source);
    }
    return code;
}

function replaceFragmentLocation (
    source: string,
    inOrOut: string,
    attrMap: Map<string, number>,
): string {
    let code = source;
    const locHolderRegStr = `layout\\(location = ([^\\)]+)\\)\\s+${inOrOut}.*?\\s(\\w+)[;,\\)]`;
    const locHolderReg = new RegExp(locHolderRegStr, 'g');

    // layout(location = 3) in mediump vec3 v_normal;
    // 3
    // v_normal
    let locHolder = locHolderReg.exec(source);
    while (locHolder) {
        const attrName = locHolder[2];
        if (!attrMap.has(attrName)) {
            let location = 0;

            if (inOrOut === 'in') {
                // {...fragment_in} === {...vertex_out}
                location = attrMap.get(attrName) || 0;

                const locInstStr = locHolder[0].replace(locHolder[1], `${location}`);
                code = code.replace(locHolder[0], locInstStr);
            }
        }
        locHolder = locHolderReg.exec(source);
    }
    return code;
}

// eslint-disable-next-line max-len
export function flattenShaderLocation (
    source: string,
    tmpl: IProgramInfo,
    macroInfo: IMacroInfo[],
    shaderStage,
    attrMap: Map<string, number>,
): string {
    let code = source;
    if (shaderStage === 'vert') {
        const locSet = new Set<number>();
        code = findDefineIndependent(source, tmpl, attrMap, locSet);
        code = replaceVertexMutableLocation(code, tmpl, macroInfo, 'in', attrMap, locSet);

        code = replaceVertexMutableLocation(code, tmpl, macroInfo, 'out', attrMap);
    } else if (shaderStage === 'frag') {
        code = replaceFragmentLocation(code, 'in', attrMap);
    } else {
        // error
    }

    return code;
}

function processShaderInfo (
    tmpl: IProgramInfo,
    macroInfo: IMacroInfo[],
    shaderInfo,
): void {
    // during configuring vertex state when make a pipelinestate
    // webgpu request max location of vertex attribute should not be greater than 15
    // shader source comes from offline effect-compiler can't have sense what macro is activate
    // so here we flatten attribute location in runtime
    const attrMap = new Map<string, number>();

    shaderInfo.stages[0].source = flattenShaderLocation(shaderInfo.stages[0].source, tmpl, macroInfo, 'vert', attrMap);
    shaderInfo.stages[1].source = flattenShaderLocation(shaderInfo.stages[1].source, tmpl, macroInfo, 'frag', attrMap);
    // don't forget to change location 'shaderInfo.attributes' which comes from serialization
    // to keep consistency with shader source
    for (let i = 0; i < shaderInfo.attributes.length; ++i) {
        const name = shaderInfo.attributes[i].name;
        let loc = 0;
        if (attrMap.has(name)) {
            loc = attrMap.get(name)!;
            shaderInfo.attributes[i].location = loc;
        }
    }
}

/**
 * @en The global maintainer of all shader resources.
 * @zh 维护 shader 资源实例的全局管理器。
 */
export class ProgramLib {
    protected _templates: Record<string, IProgramInfo> = {}; // per shader
    protected _cache: Record<string, Shader> = {};
    protected _templateInfos: Record<number, ITemplateInfo> = {};

    public register (effect: EffectAsset): void {
        for (let i = 0; i < effect.shaders.length; i++) {
            const tmpl = this.define(effect.shaders[i]);
            tmpl.effectName = effect.name;
        }
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

    /**
     * @en Register the shader template with the given info
     * @zh 注册 shader 模板。
     */
    public define (shader: EffectAsset.IShaderInfo): IProgramInfo {
        const curTmpl = this._templates[shader.name];
        if (curTmpl && curTmpl.hash === shader.hash) { return curTmpl; }
        const tmpl = ({ ...shader }) as IProgramInfo;

        // update defines and constant macros
        populateMacros(tmpl);

        // store it
        this._templates[shader.name] = tmpl;
        if (!this._templateInfos[tmpl.hash]) {
            const tmplInfo = {} as ITemplateInfo;
            // cache material-specific descriptor set layout
            tmplInfo.samplerStartBinding = tmpl.blocks.length;
            tmplInfo.shaderInfo = new ShaderInfo();
            tmplInfo.blockSizes = []; tmplInfo.bindings = [];
            for (let i = 0; i < tmpl.blocks.length; i++) {
                const block = tmpl.blocks[i];
                tmplInfo.blockSizes.push(getSize(block.members));
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(block.binding,
                    DescriptorType.UNIFORM_BUFFER, 1, block.stageFlags));
                tmplInfo.shaderInfo.blocks.push(new UniformBlock(SetIndex.MATERIAL, block.binding, block.name,
                    block.members.map((m): Uniform => new Uniform(m.name, m.type, m.count)), 1)); // effect compiler guarantees block count = 1
            }
            for (let i = 0; i < tmpl.samplerTextures.length; i++) {
                const samplerTexture = tmpl.samplerTextures[i];
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(samplerTexture.binding,
                    DescriptorType.SAMPLER_TEXTURE, samplerTexture.count, samplerTexture.stageFlags));
                tmplInfo.shaderInfo.samplerTextures.push(new UniformSamplerTexture(
                    SetIndex.MATERIAL, samplerTexture.binding, samplerTexture.name, samplerTexture.type, samplerTexture.count,
                ));
            }
            for (let i = 0; i < tmpl.samplers.length; i++) {
                const sampler = tmpl.samplers[i];
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(sampler.binding,
                    DescriptorType.SAMPLER, sampler.count, sampler.stageFlags));
                tmplInfo.shaderInfo.samplers.push(new UniformSampler(
                    SetIndex.MATERIAL, sampler.binding, sampler.name, sampler.count,
                ));
            }
            for (let i = 0; i < tmpl.textures.length; i++) {
                const texture = tmpl.textures[i];
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(texture.binding,
                    DescriptorType.TEXTURE, texture.count, texture.stageFlags));
                tmplInfo.shaderInfo.textures.push(new UniformTexture(
                    SetIndex.MATERIAL, texture.binding, texture.name, texture.type, texture.count,
                ));
            }
            for (let i = 0; i < tmpl.buffers.length; i++) {
                const buffer = tmpl.buffers[i];
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(buffer.binding,
                    DescriptorType.STORAGE_BUFFER, 1, buffer.stageFlags));
                tmplInfo.shaderInfo.buffers.push(new UniformStorageBuffer(
                    SetIndex.MATERIAL, buffer.binding, buffer.name, 1, buffer.memoryAccess,
                )); // effect compiler guarantees buffer count = 1
            }
            for (let i = 0; i < tmpl.images.length; i++) {
                const image = tmpl.images[i];
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(image.binding,
                    DescriptorType.STORAGE_IMAGE, image.count, image.stageFlags));
                tmplInfo.shaderInfo.images.push(new UniformStorageImage(
                    SetIndex.MATERIAL, image.binding, image.name, image.type, image.count, image.memoryAccess,
                ));
            }
            for (let i = 0; i < tmpl.subpassInputs.length; i++) {
                const subpassInput = tmpl.subpassInputs[i];
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(subpassInput.binding,
                    DescriptorType.INPUT_ATTACHMENT, subpassInput.count, subpassInput.stageFlags));
                tmplInfo.shaderInfo.subpassInputs.push(new UniformInputAttachment(
                    SetIndex.MATERIAL, subpassInput.binding, subpassInput.name, subpassInput.count,
                ));
            }
            tmplInfo.gfxAttributes = [];
            for (let i = 0; i < tmpl.attributes.length; i++) {
                const attr = tmpl.attributes[i];
                tmplInfo.gfxAttributes.push(new Attribute(attr.name, attr.format, attr.isNormalized, 0, attr.isInstanced, attr.location));
            }
            insertBuiltinBindings(tmpl, tmplInfo, localDescriptorSetLayout, 'locals');

            tmplInfo.shaderInfo.stages.push(new ShaderStage(ShaderStageFlagBit.VERTEX, ''));
            tmplInfo.shaderInfo.stages.push(new ShaderStage(ShaderStageFlagBit.FRAGMENT, ''));
            tmplInfo.handleMap = genHandles(tmpl);
            tmplInfo.setLayouts = [];

            this._templateInfos[tmpl.hash] = tmplInfo;
        }

        return tmpl;
    }

    /**
     * @en Gets the shader template with its name
     * @zh 通过名字获取 Shader 模板
     * @param name Target shader name
     */
    public getTemplate (name: string): IProgramInfo {
        return this._templates[name];
    }

    /**
     * @en Gets the shader template info with its name
     * @zh 通过名字获取 Shader 模版信息
     * @param name Target shader name
     */
    public getTemplateInfo (name: string): ITemplateInfo {
        const hash = this._templates[name].hash;
        return this._templateInfos[hash];
    }

    /**
     * @en Gets the pipeline layout of the shader template given its name
     * @zh 通过名字获取 Shader 模板相关联的管线布局
     * @param name Target shader name
     */
    public getDescriptorSetLayout (device: Device, name: string, isLocal = false): DescriptorSetLayout {
        const tmpl = this._templates[name];
        const tmplInfo = this._templateInfos[tmpl.hash];
        if (!tmplInfo.setLayouts.length) {
            _dsLayoutInfo.bindings = tmplInfo.bindings;
            tmplInfo.setLayouts[SetIndex.MATERIAL] = device.createDescriptorSetLayout(_dsLayoutInfo);
            _dsLayoutInfo.bindings = localDescriptorSetLayout.bindings;
            tmplInfo.setLayouts[SetIndex.LOCAL] = device.createDescriptorSetLayout(_dsLayoutInfo);
        }
        return tmplInfo.setLayouts[isLocal ? SetIndex.LOCAL : SetIndex.MATERIAL];
    }

    /**
     * @en
     * Does this library has the specified program
     * @zh
     * 当前是否有已注册的指定名字的 shader
     * @param name Target shader name
     */
    public hasProgram (name: string): boolean {
        return this._templates[name] !== undefined;
    }

    /**
     * @en Gets the shader key with the name and a macro combination
     * @zh 根据 shader 名和预处理宏列表获取 shader key。
     * @param name Target shader name
     * @param defines The combination of preprocess macros
     */
    public getKey (name: string, defines: MacroRecord): string {
        const tmpl = this._templates[name];
        return getVariantKey(tmpl, defines);
    }

    /**
     * @en Destroy all shader instance match the preprocess macros
     * @zh 销毁所有完全满足指定预处理宏特征的 shader 实例。
     * @param defines The preprocess macros as filter
     */
    public destroyShaderByDefines (defines: MacroRecord): void {
        const names = Object.keys(defines); if (!names.length) { return; }
        const regexes = names.map((cur): RegExp => {
            let val = defines[cur];
            if (typeof val === 'boolean') { val = val ? '1' : '0'; }
            return new RegExp(`${cur}${val}`);
        });
        const keys = Object.keys(this._cache).filter((k): boolean => regexes.every((re): boolean => re.test(this._cache[k].name)));
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const prog = this._cache[k];
            debug(`destroyed shader ${prog.name}`);
            prog.destroy();
            delete this._cache[k];
        }
    }

    /**
     * @en Gets the shader resource instance with given information
     * @zh 获取指定 shader 的渲染资源实例
     * @param name Shader name
     * @param defines Preprocess macros
     * @param pipeline The [[RenderPipeline]] which owns the render command
     * @param key The shader cache key, if already known
     */
    public getGFXShader (device: Device, name: string, defines: MacroRecord, pipeline: PipelineRuntime, key?: string): Shader {
        Object.assign(defines, pipeline.macros);
        if (!key) key = this.getKey(name, defines);
        const res = this._cache[key];
        if (res) { return res; }

        const tmpl = this._templates[name];
        const tmplInfo = this._templateInfos[tmpl.hash];
        if (!tmplInfo.pipelineLayout) {
            this.getDescriptorSetLayout(device, name); // ensure set layouts have been created
            insertBuiltinBindings(tmpl, tmplInfo, globalDescriptorSetLayout, 'globals');
            tmplInfo.setLayouts[SetIndex.GLOBAL] = pipeline.descriptorSetLayout;
            tmplInfo.pipelineLayout = device.createPipelineLayout(new PipelineLayoutInfo(tmplInfo.setLayouts));
        }

        const macroArray = prepareDefines(defines, tmpl.defines);
        const prefix = pipeline.constantMacros + tmpl.constantMacros
            + macroArray.reduce((acc, cur): string => `${acc}#define ${cur.name} ${cur.value}\n`, '');

        let src = tmpl.glsl3;
        const deviceShaderVersion = getDeviceShaderVersion(device);
        if (deviceShaderVersion) {
            src = tmpl[deviceShaderVersion];
        } else {
            console.error('Invalid GFX API!');
        }
        tmplInfo.shaderInfo.stages[0].source = prefix + src.vert;
        tmplInfo.shaderInfo.stages[1].source = prefix + src.frag;

        // strip out the active attributes only, instancing depend on this
        tmplInfo.shaderInfo.attributes = getActiveAttributes(tmpl, tmplInfo.gfxAttributes, defines);

        tmplInfo.shaderInfo.name = getShaderInstanceName(name, macroArray);

        let shaderInfo = tmplInfo.shaderInfo;
        if (env.WEBGPU) {
            // keep 'tmplInfo.shaderInfo' originally
            shaderInfo = new ShaderInfo();
            shaderInfo.copy(tmplInfo.shaderInfo);
            processShaderInfo(tmpl, macroArray, shaderInfo);
        }

        return this._cache[key] = device.createShader(shaderInfo);
    }
}

export function getDeviceShaderVersion (device: Device): string {
    switch (device.gfxAPI) {
    case API.GLES2:
    case API.WEBGL: return 'glsl1';
    case API.GLES3:
    case API.WEBGL2: return 'glsl3';
    default: return 'glsl4';
    }
}

export const programLib = new ProgramLib();
cclegacy.programLib = programLib;
