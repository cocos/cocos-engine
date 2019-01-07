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
import TextureBase from '../../assets/texture-base';
import { ccclass, property } from '../../core/data/class-decorator';
import { Effect } from '../../renderer/core/effect';
import { Pass } from '../../renderer/core/pass';
import { EffectAsset } from './effect-asset';

@ccclass('cc.Material')
export class Material extends Asset {
    public static getInstantiatedMaterial(mat: Material, rndCom: any) {
        if (mat._owner === rndCom) {
            return mat;
        } else {
            const instance = new Material();
            instance.copy(mat);
            instance._native = mat._native + ' (Instance)';
            instance._owner = rndCom;
            return instance;
        }
    }

    @property(EffectAsset)
    protected _effectAsset: EffectAsset | null = null;
    @property
    protected _techIdx = 0;
    @property
    protected _defines: Record<string, number | boolean> = {};
    @property
    protected _props: Array<Record<string, any>> = [];

    protected _passes: Pass[] = [];
    protected _owner: any = null;

    @property
    set effectAsset(val: EffectAsset | null) {
        if (!val || this.effectName !== val.name) { this.update(val, false); }
    }
    get effectAsset() {
        return this._effectAsset;
    }
    // helper setter
    @property
    set effectName(val) {
        if (this.effectName !== val) { this.update(val, false); }
    }
    get effectName() {
        return this._effectAsset ? this._effectAsset.name : '';
    }

    @property
    set technique(val: number) {
        this._techIdx = val;
    }
    get technique() {
        return this._techIdx;
    }

    get passes() {
        return this._passes;
    }

    public setDefines(defines: Record<string, number | boolean>) {
        this._defines = defines;
        this.update();
    }

    public setProperty(handle: number, val: any, passIdx = 0) {
        if (this._props.length <= passIdx) {
            console.warn('illegal pass index');
            return;
        }
        this._props[passIdx][name] = val;
        const pass = this._passes[passIdx];
        if (pass) {
            if (val instanceof TextureBase) {
                pass.setProperty(handle, val._texture);
            } else {
                pass.setProperty(handle, val);
            }
        }
    }

    public copy(mat: Material) {
        this._props.length = mat._props.length;
        for (let i = 0; i < mat._props.length; i++) {
            Object.assign(this._props[i], mat._props[i]);
        }
        Object.assign(this._defines, mat._defines);
        this.update(mat.effectAsset);
        this._uuid = mat._uuid;
    }

    public onLoaded() {
        this.update();
    }

    public update(val: EffectAsset | string | null = this._effectAsset, keepProps: boolean = true) {
        // get effect asset
        if (typeof val === 'string') {
            this._effectAsset = EffectAsset.get(val);
            if (!this._effectAsset) {
                console.warn(`no effect named '${val}' found`);
                return;
            }
        } else {
            this._effectAsset = val;
        }
        if (!this._effectAsset) { return; }
        // create passes
        this._passes = Effect.parseEffect(this._effectAsset, {
            techIdx: this._techIdx,
            defines: this._defines,
        });
        // handle property values
        this._props.length = this._passes.length;
        if (keepProps) {
            this._passes.forEach((pass, i) => {
                let props = this._props[i];
                if (!props) { props = this._props[i] = {}; }
                for (const p of Object.keys(props)) {
                    const handle = pass.getPropertyHandle(p);
                    pass.setProperty(handle, props[p]);
                }
            });
        } else {
            this._props.fill({});
        }
    }
}

cc.Material = Material;
