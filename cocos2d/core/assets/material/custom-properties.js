import murmurhash2 from '../../../renderer/murmurhash2_gc';
import utils from './utils';
import Pass from '../../../renderer/core/pass';
import Effect from '../../../renderer/core/effect';

const gfx = cc.gfx;

export default class CustomProperties {
    constructor(effect) {
        if (effect instanceof CustomProperties) {
            effect = effect.effect;
        }
        this.init(effect);
    }

    get effect () {
        return this._effect;
    }
    set effect (v) {
        this._effect = v;
        this._onEffectChanged();
    }

    get name () {
        return this._effect.name + ' (variant)';
    }

    get passes () {
        return this._passes;
    }

    _onEffectChanged () {
    }

    init (effect) {
        this._effect = effect;
        this._dirty = true;
        this._passes = [];
        if (effect) {
            this._technique = effect._technique;
            let passes = this._technique.passes;
            for (let i = 0; i < passes.length; i++) {
                this._passes[i] = Object.setPrototypeOf({}, passes[i]);
                this._passes[i]._properties = Object.setPrototypeOf({}, passes[i]._properties);
                this._passes[i]._defines = Object.setPrototypeOf({}, passes[i]._defines);
            }
        }
    }

    _createPassProp (name, pass) {
        let prop = pass._properties[name];
        if (!prop) {
            return;
        }

        let uniform = Object.create(null);
        uniform.name = name;
        uniform.type = prop.type;
        if (prop.value instanceof Float32Array) {
            uniform.value = new Float32Array(prop.value);
        }
        else {
            uniform.value = prop.value;
        }
        pass._properties[name] = uniform;
        
        return uniform;
    }

    _setPassProperty (name, value, pass) {
        let properties = pass._properties;
        let uniform = properties.hasOwnProperty(name);
        if (!uniform) {
            uniform = this._createPassProp(name, pass);
        }
        else if (uniform.value === value) return;
        
        this._dirty = true;
        return Pass.prototype.setProperty.call(pass, name, value);
    }

    setProperty (name, value, passIdx) {
        let passes = this._passes;

        let succuss = false;
        if (passIdx === undefined) {
            for (let i = 0; i < passes.length; i++) {
                if (this._setPassProperty(name, value, passes[i])) {
                    succuss = true;
                }
            }
        }
        else {
            let pass = passes[passIdx];
            if (pass) {
                succuss = this._setPassProperty(name, value, pass);
            }
        }
        if (!succuss) {
            cc.warn(`${this._effect._name} : Failed to set property ${name}, property not found.`);
        }
    }

    getProperty (name, passIdx) {
        let passes = this._passes;
        if (passIdx === undefined) {
            for (let i = 0, l = passes.length; i < l; i++) {
                let prop = passes[i].getProperty(name);
                if (prop !== undefined) {
                    return prop;
                }
            }
        }
        else {
            let pass = this._passes[passIdx];
            return pass && pass.getProperty(name);
        }
    }

    define (name, value, passIdx, force) {
        Effect.prototype.define.call(this, name, value, passIdx, force);
    }

    getDefine (name, passIdx) {
        let passes = this._passes;
        if (passIdx === undefined) {
            for (let i = 0, l = passes.length; i < l; i++) {
                let define = passes[i].getDefine(name);
                if (define !== undefined) {
                    return define;
                }
            }
        }
        else {
            let pass = this._passes[passIdx];
            return pass && pass.getDefine(name);
        }
    }

    extractDefines (out = []) {
        out.push(this._defines);
        return out;
    }

    updateHash () {

    }

    getHash () {
        if (!this._dirty) return this._hash;
        this._dirty = false;
        
        let hash = '';
        hash += utils.serializeDefines(this._defines);
        hash += utils.serializePasses(this._passes);

        let effect = this._effect;
        if (this._effect) {
            hash += utils.serializeDefines(effect._defines);
            hash += utils.serializePasses(effect._technique.passes);
        }

        this._hash = murmurhash2(hash, 666);

        this.updateHash(this._hash);

        return this._hash;
    }

    setPassState (state, passIndex) {
        let passes = this._passes;
        if (passIndex === undefined) {
            for (let i = 0; i < passes.length; i++) {
                let pass = passes[i];
                for (let name in state) {
                    pass['_' + name] = state[name];
                }
            }
        }
        else {
            let pass = passes[passIndex];
            if (!pass) return;
            for (let name in state) {
                pass['_' + name] = state[name];
            }
        }

        this._dirty = true;
    }

    setCullMode (cullMode = gfx.CULL_BACK, passIdx) {
        this.setPassState({cullMode}, passIdx);
    }

    setDepth (
        depthTest = false,
        depthWrite = false,
        depthFunc = gfx.DS_FUNC_LESS, 
        passIdx
    ) {
        this.setPassState({depthTest, depthWrite, depthFunc}, passIdx);
    }

    setBlend (
        blend = false,
        blendEq = gfx.BLEND_FUNC_ADD,
        blendSrc = gfx.BLEND_SRC_ALPHA,
        blendDst = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendAlphaEq = gfx.BLEND_FUNC_ADD,
        blendSrcAlpha = gfx.BLEND_SRC_ALPHA,
        blendDstAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendColor = 0xffffffff, 
        passIdx
    ) { 
        this.setPassState({blend, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor}, passIdx);
    }

    setStencilEnabled (stencilTest = gfx.STENCIL_INHERIT, passIdx) {
        this.setPassState({stencilTest}, passIdx);
    }

    setStencil (
        stencilTest = gfx.STENCIL_INHERIT,
        stencilFunc = gfx.DS_FUNC_ALWAYS,
        stencilRef = 0,
        stencilMask = 0xff,
        stencilFailOp = gfx.STENCIL_OP_KEEP,
        stencilZFailOp = gfx.STENCIL_OP_KEEP,
        stencilZPassOp = gfx.STENCIL_OP_KEEP,
        stencilWriteMask = 0xff,
        passIdx
    ) {
        this.setPassState({
            stencilTest,
            stencilFuncFront: stencilFunc, stencilRefFront: stencilRef, stencilMaskFront: stencilMask, stencilFailOpFront: stencilFailOp, stencilZFailOpFront: stencilZFailOp, stencilZPassOpFront: stencilZPassOp, stencilWriteMaskFront: stencilWriteMask,
            stencilFuncBack: stencilFunc, stencilRefBack: stencilRef, stencilMaskBack: stencilMask, stencilFailOpBack: stencilFailOp, stencilZFailOpBack: stencilZFailOp, stencilZPassOpBack: stencilZPassOp, stencilWriteMaskBack: stencilWriteMask, 
            passIdx
        });
    }
}

cc.CustomProperties = CustomProperties;
