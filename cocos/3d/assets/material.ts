/****************************************************************************
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
 ****************************************************************************/
import { Asset } from '../../assets/asset';
import { TextureBase } from '../../assets/texture-base';
import { ccclass, property } from '../../core/data/class-decorator';
import { murmurhash2_32_gc } from '../../core/utils/murmurhash2_gc';
import { GFXBindingType } from '../../gfx/define';
import { GFXTextureView } from '../../gfx/texture-view';
import { Effect } from '../../renderer/core/effect';
import { IDefineMap, Pass, PassOverrides } from '../../renderer/core/pass';
import { samplerLib } from '../../renderer/core/sampler-lib';
import { builtinResMgr } from '../builtin';
import { RenderableComponent } from '../framework/renderable-component';
import { EffectAsset } from './effect-asset';

export interface IMaterialInfo {
    technique?: number;
    defines?: IDefineMap | IDefineMap[];
    states?: PassOverrides | PassOverrides[];
    effectAsset?: EffectAsset | null;
    effectName?: string;
}

@ccclass('cc.Material')
export class Material extends Asset {
    public static getInstantiatedMaterial (mat: Material, rndCom: RenderableComponent, inEditor: boolean) {
        if (mat._owner === rndCom) {
            return mat;
        } else {
            const instance = new Material();
            instance.copy(mat);
            instance._native = mat._native + ' (Instance)';
            instance._owner = rndCom;
            if (inEditor) {
                instance._uuid = mat._uuid;
            }
            return instance;
        }
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
    protected _props: Array<Record<string, any>> = [];

    protected _passes: Pass[] = [];
    protected _owner: RenderableComponent | null = null;
    protected _hash = 0;

    get effectAsset () {
        return this._effectAsset;
    }

    get effectName () {
        return this._effectAsset ? this._effectAsset.name : '';
    }

    get technique () {
        return this._techIdx;
    }

    get passes () {
        return this._passes;
    }

    get hash () {
        return this._hash;
    }

    public initialize (info: IMaterialInfo) {
        if (info.technique) { this._techIdx = info.technique; }
        if (info.effectAsset) { this._effectAsset = info.effectAsset; }
        else if (info.effectName) { this._effectAsset = EffectAsset.get(info.effectName); }
        if (info.defines) { this._prepareInfo(info.defines, this._defines); }
        if (info.states) { this._prepareInfo(info.states, this._states); }
        this._update();
    }

    public destroy () {
        if (!this._effectAsset) { return; }
        if (this._passes) {
            for (const pass of this._passes) {
                pass.destroy();
            }
            this._passes.length = 0;
        }
        this._effectAsset = null;
    }

    /**
     * Convenient setter provided for quick material setup.
     * pass.setUniform should be used instead
     * if you need to do per-frame property update.
     */
    public setProperty (name: string, val: any, passIdx?: number) {
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

    public getProperty (name: string, passIdx?: number) {
        if (passIdx === undefined) { // try get property in all possible passes
            const propsArray = this._props;
            const len = propsArray.length;
            for (let i = 0; i < len; i++) {
                const props = propsArray[i];
                for (const p of Object.keys(props)) {
                    if (p === name) { return props[p]; }
                }
            }
        } else {
            if (passIdx >= this._props.length) { console.warn(`illegal pass index: ${passIdx}.`); return; }
            const props = this._props[passIdx];
            for (const p of Object.keys(props)) {
                if (p === name) { return props[p]; }
            }
        }
        return null;
    }

    public copy (mat: Material) {
        this._techIdx = mat._techIdx;
        this._props.length = mat._props.length;
        this._props.fill({});
        for (let i = 0; i < mat._props.length; i++) {
            Object.assign(this._props[i], mat._props[i]);
        }
        Object.assign(this._defines, mat._defines);
        Object.assign(this._states, mat._states);
        this._effectAsset = mat._effectAsset;
        this._update();
    }

    public overridePipelineStates (overrides: PassOverrides, passIdx?: number) {
        if (!this._passes || !this._effectAsset) { return; }
        const passInfos = Effect.getPassesInfo(this._effectAsset, this._techIdx);
        if (passIdx === undefined) {
            for (const pass of this._passes) {
                pass.overridePipelineStates(passInfos[pass.idxInTech], overrides);
            }
        } else {
            this._passes[passIdx].overridePipelineStates(passInfos[passIdx], overrides);
        }
        this._onPassesChange();
    }

    public onLoaded () {
        this._update();
    }

    protected _prepareInfo (patch: object | object[], cur: object[]) {
        if (!Array.isArray(patch)) { // fill all the passes if not specified
            const len = this._effectAsset ? Effect.getPassesInfo(this._effectAsset, this._techIdx).length : 1;
            patch = Array(len).fill(patch);
        }
        for (let i = 0; i < (patch as object[]).length; i++) {
            Object.assign(cur[i] || (cur[i] = {}), patch[i]);
        }
    }

    protected _update (keepProps: boolean = true) {
        const asset = this._effectAsset;
        // ugly yellow indicating missing effect
        if (!asset) { this._passes = builtinResMgr.get<Material>('missing-effect-material')._passes.slice(); return; }
        // create passes
        this._passes = Effect.parseEffect(asset, {
            techIdx: this._techIdx,
            defines: this._defines,
            states: this._states,
        });
        // handle property values
        this._props.length = this._passes.length;
        if (keepProps) {
            this._passes.forEach((pass, i) => {
                let props = this._props[i];
                if (!props) { props = this._props[i] = {}; }
                for (const p of Object.keys(props)) {
                    const val = props[p];
                    if (!val) { continue; }
                    this._uploadProperty(pass, p, props[p]);
                }
            });
        } else {
            this._props.fill({});
        }
        this._onPassesChange();
    }

    protected _uploadProperty (pass: Pass, name: string, val: any) {
        const handle = pass.getHandle(name);
        if (handle === undefined) { return false; }
        const bindingType = Pass.getBindingTypeFromHandle(handle);
        if (bindingType === GFXBindingType.UNIFORM_BUFFER) {
            if (Array.isArray(val)) {
                pass.setUniformArray(handle, val);
            } else {
                pass.setUniform(handle, val);
            }
        } else if (bindingType === GFXBindingType.SAMPLER) {
            const binding = Pass.getBindingFromHandle(handle);
            if (val instanceof GFXTextureView) {
                pass.bindTextureView(binding, val);
            } else if (val instanceof TextureBase) {
                const textureView: GFXTextureView | null = val.getGFXTextureView();
                if (!textureView || !textureView.texture.width || !textureView.texture.height) {
                    console.warn(`material '${this._uuid}' received incomplete texture asset '${val._uuid}'`); return false;
                }
                pass.bindTextureView(binding, textureView);
                pass.bindSampler(binding, samplerLib.getSampler(cc.game._gfxDevice, val.getGFXSamplerInfo()));
            }
        }
        return true;
    }

    protected _onPassesChange () {
        let str = '';
        for (const pass of this._passes) {
            str += pass.serializePipelineStates();
        }
        this._hash = murmurhash2_32_gc(str, 666);
        if (this._owner) {
            const comp = this._owner;
            const index = comp.sharedMaterials.findIndex((m) => m === this);
            // @ts-ignore
            if (index >= 0) { comp._onRebuildPSO(index, this); }
        }
    }
}

cc.Material = Material;
