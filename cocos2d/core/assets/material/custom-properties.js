import murmurhash2 from '../../../renderer/murmurhash2_gc';
import utils from './utils';
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

    _onEffectChanged () {
    }

    switchTechnique (name) {
        let techniques = effect._techniques;
        for (let i = 0; i < techniques.length; i++) {
            if (techniques[i].name === name) {
                this._technique = techniques[i];
                return;
            }
        }

        cc.warn(`Can not find technique with name [${name}]`);
    }

    init (effect) {
        this._effect = effect;
        
        this._dirty = true;

        this._properties = Object.setPrototypeOf({}, effect._properties);
        this._defines = Object.setPrototypeOf({}, effect._defines);

        this._passes = [];
        if (effect) {
            this._technique = effect._techniques[0];
            let passes = this._technique.passes;
            for (let i = 0; i < passes.length; i++) {
                this._passes[i] = Object.setPrototypeOf({}, passes[i]);
            }
        }
    }

    _createProp (name) {
        let prop = this._effect._properties[name];
        if (!prop) {
            cc.warn(`${this._effect._name} : Failed to set property ${name}, property not found.`);
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
        this._properties[name] = uniform;
        
        return uniform;
    }

    setProperty (name, value) {
        let uniform =  this._properties.hasOwnProperty(name);
        if (!uniform) {
            uniform = this._createProp(name);
        }
        else if (uniform.value === value) return;
        
        this._dirty = true;
        Effect.prototype.setProperty.call(this, name, value);
    }

    getProperty (name) {
        let prop = this._properties[name];
        if (prop) return prop.value;
        return null;
    }

    define (name, value) {
        if (this._defines[name] === value) return;
        this._dirty = true;
        this._defines[name] = value;
    }

    getDefine (name) {
        return this._defines[name];
    }

    extractProperties (out = []) {
        // if (this._effect) {
        //     out.push(this._effect._properties);
        // }
        out.push(this._properties);
        return out;
    }

    extractDefines (out = []) {
        // if (this._effect) {
        //     out.push(this._effect._defines);
        // }
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
        hash += utils.serializeUniforms(this._properties);

        let effect = this._effect;
        if (this._effect) {
            hash += utils.serializeDefines(effect._defines);
            hash += utils.serializeTechniques(effect._techniques);
            hash += utils.serializeUniforms(effect._properties);
        }

        this._hash = murmurhash2(hash, 666);

        this.updateHash(this._hash);

        return this._hash;
    }

    setPassState (state, passIndex = -1) {
        let passes = this._passes;
        if (passIndex === -1) {
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

    setCullMode (cullMode = gfx.CULL_BACK) {
        this.setPassState({cullMode});
    }

    setDepth (
        depthTest = false,
        depthWrite = false,
        depthFunc = gfx.DS_FUNC_LESS
    ) {
        this.setPassState({depthTest, depthWrite, depthFunc});
    }

    setBlend (
        blend = false,
        blendEq = gfx.BLEND_FUNC_ADD,
        blendSrc = gfx.BLEND_SRC_ALPHA,
        blendDst = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendAlphaEq = gfx.BLEND_FUNC_ADD,
        blendSrcAlpha = gfx.BLEND_SRC_ALPHA,
        blendDstAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendColor = 0xffffffff
    ) { 
        this.setPassState({blend, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor});
    }

    setStencilEnabled (stencilTest = gfx.STENCIL_INHERIT) {
        this.setPassState({stencilTest});
    }

    setStencil (
        stencilTest = gfx.STENCIL_INHERIT,
        stencilFunc = gfx.DS_FUNC_ALWAYS,
        stencilRef = 0,
        stencilMask = 0xff,
        stencilFailOp = gfx.STENCIL_OP_KEEP,
        stencilZFailOp = gfx.STENCIL_OP_KEEP,
        stencilZPassOp = gfx.STENCIL_OP_KEEP,
        stencilWriteMask = 0xff
    ) {
        this.setPassState({
            stencilTest,
            stencilFuncFront: stencilFunc, stencilRefFront: stencilRef, stencilMaskFront: stencilMask, stencilFailOpFront: stencilFailOp, stencilZFailOpFront: stencilZFailOp, stencilZPassOpFront: stencilZPassOp, stencilWriteMaskFront: stencilWriteMask,
            stencilFuncBack: stencilFunc, stencilRefBack: stencilRef, stencilMaskBack: stencilMask, stencilFailOpBack: stencilFailOp, stencilZFailOpBack: stencilZFailOp, stencilZPassOpBack: stencilZPassOp, stencilWriteMaskBack: stencilWriteMask
        });
    }

    getTechnique () {
        return this._technique;
    }
}

cc.CustomProperties = CustomProperties;
