import murmurhash2 from '../../../renderer/murmurhash2_gc';
import utils from './utils';
import Pass from '../../../renderer/core/pass';
import Effect from './effect';
import EffectBase from './effect-base';

const gfx = cc.gfx;

export default class EffectVariant extends EffectBase {
    _effect: Effect;
    _passes: Pass[] = [];
    _stagePasses = {};
    _hash = 0;

    get effect () {
        return this._effect;
    }

    get name () {
        return this._effect && (this._effect.name + ' (variant)');
    }

    get passes () {
        return this._passes;
    }

    get stagePasses () {
        return this._stagePasses;
    }

    constructor (effect: Effect) {
        super();
        this.init(effect);
    }

    _onEffectChanged () {
    }

    init (effect: Effect) {
        if (effect instanceof EffectVariant) {
            effect = effect.effect;
        }

        this._effect = effect;
        this._dirty = true;
        
        if (effect) {
            let passes = effect.passes;
            let variantPasses = this._passes;
            variantPasses.length = 0;
            let stagePasses = this._stagePasses = {};
            for (let i = 0; i < passes.length; i++) {
                let variant = variantPasses[i] = Object.setPrototypeOf({}, passes[i]);
                variant._properties = Object.setPrototypeOf({}, passes[i]._properties);
                variant._defines = Object.setPrototypeOf({}, passes[i]._defines);

                if (!stagePasses[variant._stage]) {
                    stagePasses[variant._stage] = [];
                }
                stagePasses[variant._stage].push(variant);
            }
        }
    }

    updateHash (hash: number) {

    }

    getHash () {
        if (!this._dirty) return this._hash;
        this._dirty = false;

        let hash = '';
        hash += utils.serializePasses(this._passes);

        let effect = this._effect;
        if (effect) {
            hash += utils.serializePasses(effect.passes);
        }

        this._hash = murmurhash2(hash, 666);

        this.updateHash(this._hash);

        return this._hash;
    }
}

cc.EffectVariant = EffectVariant;
