/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
const js = require('../platform/js');

var builtinResMgr = {

    _builtins: {
        effect: js.createMap(true),
        material: js.createMap(true)
    },

    allDeps: {},

    init (cb) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            return cb && cb();
        }
    
        this.loadBuiltins('effect', cc.EffectAsset, () => {
            this.loadBuiltins('material', cc.Material, cb);
        });
    },

    loadBuiltins (name, type, cb) {
        let dirname = name  + 's';
        let builtin = this._builtins[name] = {};
        let internalMountPath = 'internal';
        // internal path will be changed when run simulator
        if (CC_PREVIEW && CC_JSB) {
            internalMountPath = 'temp/internal';
        }
        cc.loader.loadResDir(dirname, type, internalMountPath, null, (err, assets) => {
            if (err) {
                cc.error(err);
            }
            else {
                for (let i = 0; i < assets.length; i++) {
                    var asset = assets[i];
                    var deps = cc.loader.getDependsRecursively(asset);
                    deps.forEach(uuid => this.allDeps[uuid] = true);
                    builtin[`${asset.name}`] = asset;
                }
            }
    
            cb();
        });
    },

    getBuiltin (type, name) {
        return this._builtins[type][name];
    },

    getBuiltins (type) {
        if (!type) return this._builtins;
        return this._builtins[type];
    },

    clear () {
        this._builtins = {
            effect: {},
            material: {}
        };
        this.allDeps = {};
    }

};

module.exports = cc.builtinResMgr = builtinResMgr;