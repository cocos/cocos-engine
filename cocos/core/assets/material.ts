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
 * 材质系统的相关内容
 * @category material
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { murmurhash2_32_gc } from '../../core/utils/murmurhash2_gc';
import { builtinResMgr } from '../3d/builtin/init';
import { RenderableComponent } from '../3d/framework/renderable-component';
import { GFXBindingType } from '../gfx/define';
import { GFXTexture } from '../gfx/texture';
import { IDefineMap, MaterialProperty } from '../renderer';
import { IPassInfoFull, Pass, PassOverrides } from '../renderer/core/pass';
import { samplerLib } from '../renderer/core/sampler-lib';
import { Asset } from './asset';
import { EffectAsset } from './effect-asset';
import { SpriteFrame } from './sprite-frame';
import { TextureBase } from './texture-base';
import { legacyCC } from '../global-exports';

/**
 * @en
 * The basic infos for material initialization.
 * @zh
 * 用来初始化材质的基本信息。
 */
interface IMaterialInfo {
    /**
     * @en
     * The EffectAsset to use. Must provide if `effectName` is not specified.
     * @zh
     * 这个材质将使用的 EffectAsset，直接提供资源引用，和 `effectName` 至少要指定一个。
     */
    effectAsset?: EffectAsset | null;
    /**
     * @en
     * The name of the EffectAsset to use. Must provide if `effectAsset` is not specified.
     * @zh
     * 这个材质将使用的 EffectAsset，通过 effect 名指定，和 `effectAsset` 至少要指定一个。
     */
    effectName?: string;
    /**
     * @en
     * The index of the technique to use.
     * @zh
     * 这个材质将使用第几个 technique，默认为 0。
     */
    technique?: number;
    /**
     * @en
     * The shader macro definitions. Default to 0 or the specified value in [[EffectAsset]].
     * @zh
     * 这个材质定义的预处理宏，默认全为 0，或 [[EffectAsset]] 中的指定值。
     */
    defines?: IDefineMap | IDefineMap[];
    /**
     * @en
     * The override values on top of the pipeline states specified in [[EffectAsset]].
     * @zh
     * 这个材质的自定义管线状态，将覆盖 effect 中的属性。<br>
     * 注意在可能的情况下请尽量少的自定义管线状态，以减小对渲染效率的影响。
     */
    states?: PassOverrides | PassOverrides[];
}

type MaterialPropertyFull = MaterialProperty | TextureBase | SpriteFrame | GFXTexture | null;

/**
 * @en
 * The material asset, specifies in details how a model is drawn on screen.
 * @zh
 * 材质资源类，包含模型绘制方式的全部细节描述。
 */
@ccclass('cc.Material')
export class Material extends Asset {

    public static getHash (material: Material) {
        let str = '';
        for (const pass of material.passes) {
            str += pass.hash;
        }
        return murmurhash2_32_gc(str, 666);
    }

    @property(EffectAsset)
    protected _effectAsset: EffectAsset | null = null;
    @property
    protected _techIdx = 0;
    @property
    protected _defines: IDefineMap[] = [];
    @property
    protected _states: PassOverrides[] = [];
    @property
    protected _props: Record<string, MaterialPropertyFull | MaterialPropertyFull[]>[] = [];

    protected _passes: Pass[] = [];
    protected _hash = 0;

    /**
     * @en The current [[EffectAsset]].
     * @zh 当前使用的 [[EffectAsset]] 资源。
     */
    get effectAsset () {
        return this._effectAsset;
    }

    /**
     * @en Name of the current [[EffectAsset]].
     * @zh 当前使用的 [[EffectAsset]] 资源名。
     */
    get effectName () {
        return this._effectAsset ? this._effectAsset.name : '';
    }

    /**
     * @en The current technique index.
     * @zh 当前的 technique 索引。
     */
    get technique () {
        return this._techIdx;
    }

    /**
     * @en The passes defined in this material.
     * @zh 当前正在使用的 pass 数组。
     */
    get passes () {
        return this._passes;
    }

    /**
     * @en The hash value of this material.
     * @zh 材质的 hash。
     */
    get hash () {
        return this._hash;
    }

    get parent (): Material | null {
        return null;
    }

    get owner (): RenderableComponent | null {
        return null;
    }

    constructor () {
        super();
        this.loaded = false;
    }

    /**
     * @en Initialize this material with the given information.
     * @zh 根据所给信息初始化这个材质，初始化正常结束后材质即可立即用于渲染。
     * @param info Material description info.
     */
    public initialize (info: IMaterialInfo) {
        if (!this._defines) { this._defines = []; }
        if (!this._states) { this._states = []; }
        if (!this._props) { this._props = []; }
        if (info.technique !== undefined) { this._techIdx = info.technique; }
        if (info.effectAsset) { this._effectAsset = info.effectAsset; }
        else if (info.effectName) { this._effectAsset = EffectAsset.get(info.effectName); }
        if (info.defines) { this._prepareInfo(info.defines, this._defines); }
        if (info.states) { this._prepareInfo(info.states, this._states); }
        this._update();
    }
    public reset (info: IMaterialInfo) { // consistency with other assets
        this.initialize(info);
    }

    /**
     * @en
     * Destroy the material definitively.<br>
     * Cannot re-initialize after destroy.<br>
     * For re-initialize purposes, call [[Material.initialize]] directly.
     * @zh
     * 彻底销毁材质，注意销毁后无法重新初始化。<br>
     * 如需重新初始化材质，不必先调用 destroy。
     */
    public destroy () {
        this._doDestroy();
        return super.destroy();
    }

    /**
     * @en Recompile the shader with the specified macro overrides. Allowed only on material instances.
     * @zh 使用指定预处理宏重新编译当前 pass（数组）中的 shader。只允许对材质实例执行。
     * @param overrides The shader macro override values.
     * @param passIdx The pass to apply to. Will apply to all passes if not specified.
     */
    public recompileShaders (overrides: IDefineMap, passIdx?: number) {
        console.warn('Shaders in material asset \'' + this.name + '\' cannot be modified at runtime, please instantiate the material first.');
    }

    /**
     * @en Override the passes with the specified pipeline states. Allowed only on material instances.
     * @zh 使用指定管线状态重载当前的 pass（数组）。只允许对材质实例执行。
     * @param overrides The pipeline state override values.
     * @param passIdx The pass to apply to. Will apply to all passes if not specified.
     */
    public overridePipelineStates (overrides: PassOverrides, passIdx?: number) {
        console.warn('Pipeline states in material asset \'' + this.name + '\' cannot be modified at runtime, please instantiate the material first.');
    }

    /**
     * @en Callback function after material is loaded in [[Loader]]. Initialize the resources automatically.
     * @zh 通过 [[Loader]] 加载完成时的回调，将自动初始化材质资源。
     */
    public onLoaded () {
        this._update();
        this.loaded = true;
        this.emit('load');
    }

    /**
     * @en Reset all the uniforms to the default value specified in [[EffectAsset]].
     * @zh 重置材质的所有 uniform 参数数据为 [[EffectAsset]] 中的默认初始值。
     * @param clearPasses Will the rendering data be cleared too?
     */
    public resetUniforms (clearPasses = true) {
        this._props.length = this._passes.length;
        for (let i = 0; i < this._props.length; i++) { this._props[i] = {}; }
        if (!clearPasses) { return; }
        for (const pass of this._passes) {
            pass.resetUBOs();
            pass.resetTextures();
        }
    }

    /**
     * @en
     * Convenient property setter provided for quick material setup.<br>
     * [[Pass.setUniform]] should be used instead if you need to do per-frame uniform update.
     * @zh
     * 设置材质 uniform 参数的统一入口。<br>
     * 注意如果需要每帧更新 uniform，建议使用 [[Pass.setUniform]] 以获得更好的性能。
     * @param name The target uniform name.
     * @param val The target value.
     * @param passIdx The pass to apply to. Will apply to all passes if not specified.
     */
    public setProperty (name: string, val: MaterialPropertyFull | MaterialPropertyFull[], passIdx?: number) {
        let success = false;
        if (passIdx === undefined) { // try set property for all applicable passes
            const passes = this._passes;
            const len = passes.length;
            for (let i = 0; i < len; i++) {
                const pass = passes[i];
                if (this._uploadProperty(pass, name, val)) {
                    this._props[i][name] = val;
                    success = true;
                }
            }
        } else {
            if (passIdx >= this._passes.length) { console.warn(`illegal pass index: ${passIdx}.`); return; }
            const pass = this._passes[passIdx];
            if (this._uploadProperty(pass, name, val)) {
                this._props[passIdx][name] = val;
                success = true;
            }
        }
        if (!success) {
            console.warn(`illegal property name: ${name}.`);
            return;
        }
    }

    /**
     * @en
     * Get the specified uniform value for this material.<br>
     * Note that only uniforms set through [[Material.setProperty]] can be acquired here.<br>
     * For the complete rendering data, use [[Pass.getUniform]] instead.
     * @zh
     * 获取当前材质的指定 uniform 参数的值。<br>
     * 注意只有通过 [[Material.setProperty]] 函数设置的参数才能从此函数取出，<br>
     * 如需取出完整的渲染数据，请使用 [[Pass.getUniform]]。
     * @param name The property or uniform name.
     * @param passIdx The target pass index. If not specified, return the first found value in all passes.
     */
    public getProperty (name: string, passIdx?: number) {
        if (passIdx === undefined) { // try get property in all possible passes
            const propsArray = this._props;
            const len = propsArray.length;
            for (let i = 0; i < len; i++) {
                const props = propsArray[i];
                for (const p in props) {
                    if (p === name) { return props[p]; }
                }
            }
        } else {
            if (passIdx >= this._props.length) { console.warn(`illegal pass index: ${passIdx}.`); return null; }
            const props = this._props[passIdx];
            for (const p in props) {
                if (p === name) { return props[p]; }
            }
        }
        return null;
    }

    /**
     * @en Copy the target material.
     * @zh 复制目标材质到当前实例。
     * @param mat The material to be copied.
     */
    public copy (mat: Material) {
        this._techIdx = mat._techIdx;
        this._props.length = mat._props.length;
        for (let i = 0; i < mat._props.length; i++) {
            this._props[i] = Object.assign({}, mat._props[i]);
        }
        this._defines.length = mat._defines.length;
        for (let i = 0; i < mat._defines.length; i++) {
            this._defines[i] = Object.assign({}, mat._defines[i]);
        }
        this._states.length = mat._states.length;
        for (let i = 0; i < mat._states.length; i++) {
            this._states[i] = Object.assign({}, mat._states[i]);
        }
        this._effectAsset = mat._effectAsset;
        this._update();
    }

    protected _prepareInfo (patch: object | object[], cur: object[]) {
        if (!Array.isArray(patch)) { // fill all the passes if not specified
            const len = this._effectAsset ? this._effectAsset.techniques[this._techIdx].passes.length : 1;
            patch = Array(len).fill(patch);
        }
        for (let i = 0; i < (patch as object[]).length; ++i) {
            Object.assign(cur[i] || (cur[i] = {}), patch[i]);
        }
    }

    protected _createPasses () {
        const tech = this._effectAsset!.techniques[this._techIdx || 0];
        if (!tech) { return []; }
        const passNum = tech.passes.length;
        const passes: Pass[] = [];
        for (let k = 0; k < passNum; ++k) {
            const passInfo = tech.passes[k] as IPassInfoFull;
            const defs = passInfo.defines = this._defines.length > k ? this._defines[k] : {};
            if (passInfo.switch && !defs[passInfo.switch]) { continue; }
            passInfo.stateOverrides = this._states.length > k ? this._states[k] : {};
            passInfo.idxInTech = passInfo.phase === 'forward-add' ? 0 : k;
            const pass = new Pass(legacyCC.director.root);
            pass.initialize(passInfo);
            passes.push(pass);
        }
        return passes;
    }

    protected _update (keepProps: boolean = true) {
        if (this._effectAsset) {
            if (this._passes && this._passes.length) {
                for (const pass of this._passes) {
                    pass.destroy();
                }
            }
            this._passes = this._createPasses();
            // handle property values
            const totalPasses = this._effectAsset.techniques[this._techIdx].passes.length;
            this._props.length = totalPasses;
            if (keepProps) {
                this._passes.forEach((pass, i) => {
                    let props = this._props[pass.idxInTech];
                    if (!props) { props = this._props[i] = {}; }
                    for (const p in props) {
                        this._uploadProperty(pass, p, props[p]);
                    }
                });
            } else {
                for (let i = 0; i < this._props.length; i++) { this._props[i] = {}; }
            }
        } else { // ugly yellow indicating missing effect
            const missing = builtinResMgr.get<Material>('missing-effect-material');
            if (missing) { this._passes = missing._passes.slice(); }
        }
        this._hash = Material.getHash(this);
    }

    protected _uploadProperty (pass: Pass, name: string, val: MaterialPropertyFull | MaterialPropertyFull[]) {
        const handle = pass.getHandle(name);
        if (handle === undefined) { return false; }
        const bindingType = Pass.getBindingTypeFromHandle(handle);
        if (bindingType === GFXBindingType.UNIFORM_BUFFER) {
            if (Array.isArray(val)) {
                pass.setUniformArray(handle, val as MaterialProperty[]);
            } else if (val !== null) {
                pass.setUniform(handle, val as MaterialProperty);
            } else {
                pass.resetUniform(name);
            }
        } else if (bindingType === GFXBindingType.SAMPLER) {
            const binding = Pass.getBindingFromHandle(handle);
            if (val instanceof GFXTexture) {
                pass.bindTexture(binding, val);
            } else if (val instanceof TextureBase || val instanceof SpriteFrame) {
                const texture: GFXTexture | null = val.getGFXTexture();
                if (!texture || !texture.width || !texture.height) {
                    // console.warn(`material '${this._uuid}' received incomplete texture asset '${val._uuid}'`);
                    return false;
                }
                pass.bindTexture(binding, texture);
                if (val instanceof TextureBase) {
                    pass.bindSampler(binding, samplerLib.getSampler(legacyCC.director.root.device, val.getSamplerHash()));
                }
            } else if (!val) {
                pass.resetTexture(name);
            }
        }
        return true;
    }

    protected _doDestroy () {
        if (this._passes && this._passes.length) {
            for (const pass of this._passes) {
                pass.destroy();
            }
        }
        this._effectAsset = null;
        this._passes.length = 0;
        this._props.length = 0;
        this._defines.length = 0;
        this._states.length = 0;
    }
}

legacyCC.Material = Material;
