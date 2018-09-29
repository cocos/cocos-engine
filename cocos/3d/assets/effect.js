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
import { ccclass, property } from "../../core/data/class-decorator";
import Asset from "../../assets/CCAsset";
import renderer from "../../renderer";

@ccclass('cc.Effect.Technique.Param')
class Param {
    @property
    name = '';
    @property
    type = renderer.PARAM_FLOAT;
    @property
    value = 0;

    constructor(param) {
        this.name = param.name;
        this.type = param.type;
        this.value = param.value;
    }
}

@ccclass('cc.Effect.Technique.Pass')
class Pass {
    @property
    program = '';
    @property
    cullMode = '';
    @property
    depthTest = true;
    @property
    depthWrite = true;
    @property
    blend = true;
    @property
    blendEq = '';
    @property
    blendSrc = '';
    @property
    blendDst = '';
    @property
    blendAlphaEq = '';
    @property
    blendSrcAlpha = '';
    @property
    blendDstAlpha = '';

    constructor(pass) {
        this.program = pass.program;
        this.cullMode = pass.cullMode;
        this.depthTest = pass.depthTest;
        this.depthWrite = pass.depthWrite;
        this.blend = pass.blend;
        this.blendEq = pass.blendEq;
        this.blendSrc = pass.blendSrc;
        this.blendDst = pass.blendDst;
        this.blendAlphaEq = pass.blendAlphaEq;
        this.blendSrcAlpha = pass.blendSrcAlpha;
        this.blendDstAlpha = pass.blendDstAlpha;
    }
}

@ccclass('cc.Effect.Technique')
class Technique {
    @property(String)
    stages = [];
    @property('cc.Effect.Technique.Param')
    params = [];
    @property('cc.Effect.Technique.Pass')
    passes = [];
    @property
    layer = 0;

    constructor(tech) {
        this.stages = tech.stages;
        tech.params.forEach(v => { this.params.push(new Param(v)); });
        tech.passes.forEach(v => { this.passes.push(new Pass(v)); });
        this.layer = tech.layer;
    }
}

@ccclass('cc.Effect.Define')
class Define {
    @property(String)
    name = [];
    @property
    value = false;

    constructor(def) {
        this.name = def.name;
        this.value = def.value;
    }
}

@ccclass('cc.Effect.Dependency')
class Dependency {
    @property
    define = '';
    @property
    extension = '';

    constructor(dep) {
        this.define = dep.define;
        this.extension = dep.extension;
    }
}

@ccclass('cc.Effect')
export default class Effect extends Asset {
    @property('cc.Effect.Technique')
    _techniques = [];

    @property
    _properties = {};

    @property('cc.Effect.Define')
    _defines = [];

    @property('cc.Effect.Dependency')
    _dependencies = [];

    /**
     * @param {Object[]}
     */
    set techniques(val) {
        val.forEach(v => { this._techniques.push(new Technique(v)); });
    }

    /**
     * @return {Object[]}
     */
    get techniques() {
        return this._techniques;
    }

    /**
     * @param {Object} val
     */
    set properties(val) {
        this._properties = val;
    }

    /**
     * @return {Object}
     */
    get properties() {
        return this._properties;
    }

    /**
     * @param {Object[]}}
     */
    set defines(val) {
        val.forEach(v => { this._defines.push(new Define(v)); });
    }

    /**
     * @return {Object[]}}
     */
    get defines() {
        return this._defines;
    }

    /**
     * @param {Object[]} val
     */
    set dependencies(val) {
        val.forEach(v => { this._dependencies.push(new Dependency(v)); });
    }

    /**
     * @return {Object[]}
     */
    get dependencies() {
        return this._dependencies;
    }

    destroy() {
        // TODO: what should we do here ???
        return super.destroy();
    }
}

cc.Effect = Effect;
