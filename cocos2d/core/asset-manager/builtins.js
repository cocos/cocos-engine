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
const Cache = require('./cache');
const releaseManager = require('./releaseManager');
const { BuiltinBundleName } = require('./shared'); 

/**
 * @module cc.AssetManager
 */
/**
 * !#en
 * This module contains the builtin asset, it's a singleton, all member can be accessed with `cc.assetManager.builtins` 
 * 
 * !#zh
 * 此模块包含内建资源，这是一个单例，所有成员能通过 `cc.assetManager.builtins` 访问
 * 
 * @class Builtins
 */
var builtins = {
    
    _assets: new Cache({ material: new Cache(), effect: new Cache() }), // builtin assets

    _loadBuiltins (name, cb) {
        let dirname = name  + 's';
        let builtin = this._assets.get(name);
        return cc.assetManager.internal.loadDir(dirname, null, null, (err, assets) => {
            if (err) {
                cc.error(err.message, err.stack);
            }
            else {
                for (let i = 0; i < assets.length; i++) {
                    var asset = assets[i];
                    builtin.add(asset.name, asset.addRef());
                }
            }

            cb();
        });
    },

    /**
     * !#en
     * Initialize
     * 
     * !#zh
     * 初始化 
     * 
     * @method init
     * @param {Function} cb - Callback when finish loading built-in assets
     * 
     * @typescript
     * init (cb: () => void): void
     */
    init (cb) {
        this.clear();
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS || !cc.assetManager.bundles.has(BuiltinBundleName.INTERNAL)) {
            return cb && cb();
        }

        this._loadBuiltins('effect', () => {
            this._loadBuiltins('material', cb);
        });
    },

    /**
     * !#en
     * Get the built-in asset using specific type and name.
     * 
     * !#zh
     * 通过特定的类型和名称获取内建资源
     * 
     * @method getBuiltin
     * @param {string} [type] - The type of asset, such as `effect`
     * @param {string} [name] - The name of asset, such as `phong`
     * @return {Asset|Cache} Builtin-assets
     * 
     * @example
     * cc.assetManaer.builtins.getBuiltin('effect', 'phone');
     * 
     * @typescript
     * getBuiltin(type?: string, name?: string): cc.Asset | Cache<cc.Asset>
     */
    getBuiltin (type, name) {
        if (arguments.length === 0) return this._assets;
        else if (arguments.length === 1) return this._assets.get(type);
        else return this._assets.get(type).get(name);
    },

    /**
     * !#en
     * Clear all builtin assets
     * 
     * !#zh
     * 清空所有内置资源
     * 
     * @method clear
     * 
     * @typescript
     * clear(): void
     */
    clear () {
        this._assets.forEach(function (assets) {
            assets.forEach(function (asset) {
                releaseManager.tryRelease(asset, true);
            });
            assets.clear();
        });
    }
}

module.exports = builtins;
