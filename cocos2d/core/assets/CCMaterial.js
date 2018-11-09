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
// @ts-check

const Asset = require('./CCAsset');
const Texture = require('./CCTexture2D');
const effects = require('../../renderer/effects');
const Color = require('../value-types/color');
const renderEngine = require('../renderer/render-engine');
const RecyclePool = renderEngine.RecyclePool;
import Effect from '../../renderer/effect';

let Material = cc.Class({
    name: 'cc.Material',
    extends: Asset,

    ctor (effectName) {
        if (effectName) this.effectName = effectName;
    },

    properties: {
        _effect: null,
        _effectName: '',
        _defines: {
            default: {},
            type: Object
        },
        _props: {
            default: {},
            type: Object
        },

        effectName: {
            get () {
                return this._effectName;
            },
            set (val) {
                if (this._effectName !== val) {
                    this._effectName = val;
                    const effectAsset = effects[val];
                    if (!effectAsset) {
                        cc.warn(`no effect named '${val}' found`);
                        return;
                    }
                    this._effect = Effect.parseEffect(effectAsset);
                }
            }
        },

        effect: {
            get () {
                return this._effect;
            }
        }
    },

    statics: {
        getInstantiatedMaterial(mat, rndCom) {
            if (mat._owner === rndCom) {
                return mat;
            }
            else {
                let instance = new Material();
                instance.copy(mat);
                instance._native = mat._native + ' (Instance)';
                instance._owner = rndCom;
                return instance;
            }
        }
    },

    /**
     *
     * @param {Material} mat
     */
    copy(mat) {
        this.effectName = mat.effectName;

        for (let name in mat._defines) {
            this.define(name, mat._defines[name]);
        }

        for (let name in mat._props) {
            this.setProperty(name, mat._props[name]);
        }
    },

    /**
     *
     * @param {string} name
     * @param {*} val
     */
    setProperty(name, val) {
        this._props[name] = val;

        if (this._effect) {
            if (val instanceof Texture) {
                this._effect.setProperty(name, val._texture);
            }
            else {
                this._effect.setProperty(name, val);
            }
        }
    },

    getProperty(name) {
        return this._props[name];
    },

    /**
     *
     * @param {string} name
     * @param {*} val
     */
    define(name, val) {
        this._defines[name] = val;
        if (this._effect) {
            this._effect.define(name, val);
        }
    },

    getDefine(name) {
        return this._defines[name];
    },

    destroy() {
        // TODO: what should we do here ???
        return super.destroy();
    },

    updateHash (val) {
        if (val) {
            this._hash = val;
            return;
        }

        let str = this._effectName;
        let props = this._props;
        let defines = this._defines;
        for (let name in props) {
            let v = props[name];
            if (typeof v === 'function') continue;
            if (v) {
                if (v instanceof cc.Texture2D) {
                    v = v._id;
                }
                else {
                    v = v.toString();
                }
            }
            else {
                v = '';
            }
            
            str += ';' + name + ':' + v;
        }
        for (let name in defines) {
            let v = defines[name];
            if (typeof v === 'function') continue;
            str += ';' + name + ':' + (v ? v.toString() : '');
        }
        this._hash = str;
    },

    _serialize () {
        return {	
            effectName: this._effectName,
            props: Editor.serialize(this._props),
            defines: Editor.serialize(this._defines),
        };
    },

    _deserialize: (function () {
        let dependsPool = new RecyclePool(function () {
            return {
                target: null,
                propName: '',
                set asset (asset) {
                    this.target.setProperty(this.propName, asset);
                    this.target = null;
                    dependsPool.remove(dependsPool.data.indexOf(this));
                }
            };
        }, 1);

        function loadAsset (handle, target, propName, uuid) {
            let depend = dependsPool.add();
            depend.target = target;
            depend.propName = propName;

            handle.result.push(depend, 'asset', uuid);
        }

        return function (data, handle) {
            this.effectName = data.effectName;
    
            let props = cc.deserialize(data.props);
            let propNames = Object.keys(props);
            for (let i = 0; i < propNames.length; i++) {
                let name = propNames[i];
                let prop = props[name];
                
                if (prop.uuid) {
                    // load prop as an asset
                    loadAsset(handle, this, name, prop.uuid);
                    continue;
                }
                this.setProperty(name, props[name]);
            }
    
            let defines = cc.deserialize(data.defines);
            let defineNames = Object.keys(defines);
            for (let i = 0; i < defineNames.length; i++) {
                let name = defineNames[i];
                this.define(name, defines[name]);
            }
        };
    })()
});

module.exports = cc.Material = Material;
