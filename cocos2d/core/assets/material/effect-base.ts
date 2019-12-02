import Pass from '../../../renderer/core/pass';

const gfx = cc.gfx;

export default class EffectBase {
    _dirty = true;
    
    _name = '';
    get name () {
        return this._name;
    }

    _technique = null;
    get technique () {
        return this._technique;
    }

    get passes (): Pass[] {
        return [];
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
        let success = false;
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            if (this._setPassProperty(name, value, passes[i])) {
                success = true;
            }
        }
        if (!success) {
            cc.warn(`${this.name} : Failed to set property ${name}, property not found.`);
        }
    }

    getProperty (name, passIdx) {
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            let value = passes[i].getProperty(name);
            if (value !== undefined) {
                return value;
            }
        }
    }

    define (name, value, passIdx, force) {
        let success = false;
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            if (passes[i].define(name, value, force)) {
                success = true;
            }
        }
        if (!success) {
            cc.warn(`${this.name} : Failed to define ${name}, define not found.`);
        }
    }

    getDefine (name, passIdx) {
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            let value = passes[i].getDefine(name);
            if (value !== undefined) {
                return value;
            }
        }
    }

    setCullMode (cullMode = gfx.CULL_BACK, passIdx) {
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            passes[i].setCullMode(cullMode);
        }
        this._dirty = true;
    }

    setDepth (
        depthTest = false,
        depthWrite = false,
        depthFunc = gfx.DS_FUNC_LESS,
        passIdx
    ) {
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            passes[i].setDepth(depthTest, depthWrite, depthFunc);
        }
        this._dirty = true;
    }

    setBlend (
        enabled = false,
        blendEq = gfx.BLEND_FUNC_ADD,
        blendSrc = gfx.BLEND_SRC_ALPHA,
        blendDst = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendAlphaEq = gfx.BLEND_FUNC_ADD,
        blendSrcAlpha = gfx.BLEND_SRC_ALPHA,
        blendDstAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendColor = 0xffffffff,
        passIdx
    ) {
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            passes[i].setBlend(
                enabled,
                blendEq,
                blendSrc, blendDst,
                blendAlphaEq,
                blendSrcAlpha, blendDstAlpha, blendColor
            );
        }
        this._dirty = true;
    }

    setStencilEnabled (enabled = gfx.STENCIL_INHERIT, passIdx) {
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            passes[i].setStencilEnabled(enabled);
        }
        this._dirty = true;
    }

    setStencil (
        enabled = gfx.STENCIL_INHERIT,
        stencilFunc = gfx.DS_FUNC_ALWAYS,
        stencilRef = 0,
        stencilMask = 0xff,
        stencilFailOp = gfx.STENCIL_OP_KEEP,
        stencilZFailOp = gfx.STENCIL_OP_KEEP,
        stencilZPassOp = gfx.STENCIL_OP_KEEP,
        stencilWriteMask = 0xff,
        passIdx
    ) {
        let passes = this.passes;
        let start = 0, end = passes.length;
        if (passIdx !== undefined) {
            start = passIdx, end = passIdx + 1;
        }
        for (let i = start; i < end; i++) {
            let pass = passes[i];
            pass.setStencilFront(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
            pass.setStencilBack(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
        }
        this._dirty = true;
    }
}

cc.EffectBase = EffectBase;
