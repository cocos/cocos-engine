import murmurhash2 from '../../../renderer/murmurhash2_gc';
import utils from './utils';
import Effect from '../../../renderer/core/effect';

export default class CustomProperties {
    constructor (effect) {
        this._effect = effect;
        this._properties = {};
        this._defines = {};
        this._dirty = false;
    }

    get effect () {
        return this._effect;
    }
    set effect (v) {
        this._effect = v;
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
        let uniform = this._properties[name];
        if (!uniform) {
            uniform = this._createProp(name);
        }
        else if (uniform.value === value) return;
        
        this._dirty = true;
        Effect.prototype.setProperty.call(this, name, value);
    }

    getProperty(name) {
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

    extractProperties(out = []) {
        if (this._effect) {
            out.push(this._effect._properties);
        }
        out.push(this._properties);
        return out;
    }

    extractDefines(out = []) {
        if (this._effect) {
            out.push(this._effect._defines);
        }
        out.push(this._defines);
        return out;
    }

    getHash () {
        if (!this._dirty) return this._hash;
        this._dirty = false;
        
        let hash = '';
        hash += utils.serializeDefines(this._defines);
        hash += utils.serializeUniforms(this._properties);

        let effect = this._effect;
        if (effect) {
            hash += utils.serializeDefines(effect._defines);
            hash += utils.serializeTechniques(effect._techniques);
            hash += utils.serializeUniforms(effect._properties);
        }

        return this._hash = murmurhash2(hash, 666);
    }

    setCullMode (cullMode) {
    }

    setDepth (depthTest, depthWrite, depthFunc) {
    }

    setBlend (enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor) { 
        
    }

    setStencilEnabled (enabled) {
    }

    setStencil (enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask) {
    }

    getTechnique(stage) {
        return this._effect.getTechnique(stage);
    }
}

cc.CustomProperties = CustomProperties;
