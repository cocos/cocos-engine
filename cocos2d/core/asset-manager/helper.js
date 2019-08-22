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
const { bundles } = require('./shared');

/**
 * !#en
 * Provide some helpful function, it is a singleton.
 * 
 * !#zh
 * 提供一些辅助方法，helper 是一个单例
 * 
 * @static
 */
var helper = {
    /**
     * !#en
     * Decode uuid, returns the original uuid
     * 
     * !#zh
     * 解码 uuid，返回原始 uuid
     * 
     * @method decodeUuid
     * @param {String} base64 - the encoded uuid
     * @returns {String} the original uuid 
     * 
     * @example
     * var uuid = 'fcmR3XADNLgJ1ByKhqcC5Z';
     * var originalUuid = decodeUuid(uuid); // fc991dd7-0033-4b80-9d41-c8a86a702e59
     * 
     * @typescript
     * decodeUuid(base64: string): string
     */
    decodeUuid: require('../utils/decode-uuid'),

    /**
     * !#en
     * Extract uuid from url
     * 
     * !#zh
     * 从 url 中提取 uuid
     * 
     * @method getUuidFromURL
     * @param {String} url - url
     * @returns {String} the uuid parsed from url
     * 
     * @example
     * var url = 'res/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
     * var uuid = getUuidFromURL(url); // fc991dd7-0033-4b80-9d41-c8a86a702e59
     * 
     * @typescript
     * getUuidFromURL(url: string): string
     */
    getUuidFromURL: (function () {
        var _uuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;
        return function (url) {
            var matches = url.match(_uuidRegex);
            if (matches) {
                return matches[1];
            }
            return '';
        }
    })(),

    /**
     * !#en
     * Transform uuid to url
     * 
     * !#zh
     * 转换 uuid 为 url
     * 
     * @method getUrlWithUuid
     * @param {string} uuid - The uuid of asset
     * @param {Object} [options] - Some optional parameters
     * @returns {string} url
     * 
     * @example
     * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: false});
     * 
     * @typescript
     * getUrlWithUuid(uuid: string, options?: any): string
     */
    getUrlWithUuid: function (uuid, options) {
        options = options || Object.create(null);
        var bundle = bundles.find(function (bundle) {
            return bundle._config.getAssetInfo(uuid);
        });

        if (bundle) {
            options.bundle = bundle._config.name;
        }

        return cc.assetManager.transform(uuid, options);
    },

    /**
     * !#en
     * Check if the type of data is cc.Scene or cc.Prefab
     * 
     * !#zh
     * 检测数据的类型是否是 Scene 或者 Prefab
     * 
     * @method isSceneObj
     * @param {Object} json - serialized data
     * @returns {boolean} - whether or not the type is cc.Scene or cc.Prefab
     * 
     * @typescript
     * isSceneObj(json: any): boolean
     */
    isSceneObj: function (json) {
        var SCENE_ID = 'cc.Scene', PREFAB_ID = 'cc.Prefab';
        return json && (
                   (json[0] && json[0].__type__ === SCENE_ID) ||
                   (json[1] && json[1].__type__ === SCENE_ID) ||
                   (json[0] && json[0].__type__ === PREFAB_ID)
               );
    },

    /**
     * !#en
     * Check if the type of asset is scene
     * 
     * !#zh
     * 检查资源类型是否是场景
     * 
     * @method isScene
     * @param {Object} asset - asset
     * @returns {boolean} - whether or not type is cc.SceneAsset
     * 
     * @typescript
     * isScene(asset: any): boolean
     */
    isScene: function (asset) {
        return asset && (asset.constructor === cc.SceneAsset || asset instanceof cc.Scene);
    },

    /**
     * !#en
     * Normalize url, strip './' and '/'
     * 
     * !#zh
     * 标准化 url ，去除 './' 和 '/' 
     * 
     * @method normalize
     * @param {string} url - url
     * @returns {string} - The normalized url
     * 
     * @typescript
     * normalize(url: string): string
     */
    normalize: function (url) {
        if (url) {
            if (url.charCodeAt(0) === 46 && url.charCodeAt(1) === 47) {
                // strip './'
                url = url.slice(2);
            }
            else if (url.charCodeAt(0) === 47) {
                // strip '/'
                url = url.slice(1);
            }
        }
        return url;
    }
}

module.exports = helper;