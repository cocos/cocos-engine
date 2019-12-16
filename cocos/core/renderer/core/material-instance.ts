import { RenderableComponent } from '../../3d';
import { EffectAsset, Material } from '../../assets';
import { _uploadProperty, IMaterial } from '../../utils/material-interface';
import { murmurhash2_32_gc } from '../../utils/murmurhash2_gc';
import { IPass } from '../../utils/pass-interface';
import { IDefineMap, PassOverrides } from './pass';
import { PassInstance } from './pass-instance';

export class MaterialInstance implements IMaterial {

    get effectAsset (): EffectAsset | null {
        return this._parent.effectAsset;
    }

    get effectName (): string {
        return this._parent.effectName;
    }

    get technique (): number {
        return this._parent.technique;
    }

    get passes (): IPass[] {
        return this._passes;
    }

    get hash (): number {
        return this._hash;
    }

    get parent (): IMaterial {
        return this._parent;
    }

    get owner (): RenderableComponent {
        return this._owner;
    }

    private _parent: IMaterial;
    private _owner: RenderableComponent;
    // data overwritten in material instance
    private _passes: IPass[] = [];
    private _hash: number = -1;
    private _props: Array<Record<string, any>> = [];
    private _states: PassOverrides[] = [];

    constructor (parent: Material, owner: RenderableComponent) {
        this._parent = parent;
        this._owner = owner;
        // @ts-ignore
        const parentProps = parent._props;
        for (let i = 0; i < parentProps.length; i++) {
            const passProp = {};
            Object.assign(passProp, parentProps[i]);
            this._props[i] = passProp;
        }

        for (let i = 0; i < parent.passes.length; i++) {
            this._passes[i] = new PassInstance(parent.passes[i], this, i);
        }
    }

    public resetUniforms (clearPasses?: boolean): void {
        this._props.length = this._passes.length;
        for (let i = 0; i < this._props.length; i++) { this._props[i] = {}; }
        if (!clearPasses) { return; }
        for (const pass of this._passes) {
            pass.resetUBOs();
            pass.resetTextures();
        }
    }

    public recompileShaders (overrides: IDefineMap, passIdx?: number): void {
        if (!this._passes || !this.effectAsset) {
            return;
        }
        if (passIdx === undefined) {
            for (const pass of this._passes) {
                pass.tryCompile(overrides);
            }
        } else {
            this._passes[passIdx].tryCompile(overrides);
        }
    }

    public overridePipelineStates (overrides: any, passIdx?: number): void {
        if (!this._passes || !this.effectAsset) { return; }
        const passInfos = this.effectAsset.techniques[this.technique].passes;
        if (passIdx === undefined) {
            for (let i = 0; i < this._passes.length; i++) {
                const pass = this._passes[i];
                this._states[i] = overrides;
                pass.overridePipelineStates(passInfos[pass.idxInTech], overrides);
            }
        } else {
            this._states[passIdx] = overrides;
            this._passes[passIdx].overridePipelineStates(passInfos[passIdx], overrides);
        }
    }

    public setProperty (name: string, val: any, passIdx?: number): void {
        let success = false;
        if (passIdx === undefined) { // try set property for all applicable passes
            const passes = this._passes;
            const len = passes.length;
            for (let i = 0; i < len; i++) {
                const pass = passes[i];
                if (_uploadProperty(pass, name, val)) {
                    this._props[i][name] = val;
                    success = true;
                }
            }
        } else {
            if (passIdx >= this._passes.length) { console.warn(`illegal pass index: ${passIdx}.`); return; }
            const pass = this._passes[passIdx];
            if (_uploadProperty(pass, name, val)) {
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

    public destroy (): void {
        for (let i = 0; i < this._passes.length; i++) {
            this._passes[i].destroy();
        }
        this._passes.length = 0;
        this._props.length = 0;
    }

    public _onPassStateChanged (idx: number) {
        let str = '';
        for (const pass of this._passes) {
            str += pass.psoHash;
        }
        this._hash = murmurhash2_32_gc(str, 666);
    }
}
