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
const { decodeUuid } = require('./helper');
const RequestItem = require('./request-item');
const { RequestType, bundles } = require('./shared');

function parse (task) {

    var input = task.input, options = task.options;
    input = Array.isArray(input) ? input : [ input ];

    task.output = [];
    for (var i = 0; i < input.length; i ++ ) {
        var item = input[i];
        var out = RequestItem.create();
        if (typeof item === 'string') {
            item = Object.create(null);
            item[options.__requestType__ || RequestType.UUID] = input[i];
        }
        if (typeof item === 'object') {
            // local options will overlap glabal options
            cc.js.addon(item, options);
            if (item.preset) {
                cc.js.addon(item, cc.assetManager.presets[item.preset]);
            }
            for (var key in item) {
                switch (key) {
                    case RequestType.UUID: 
                        var uuid = out.uuid = decodeUuid(item.uuid);
                        if (bundles.has(item.bundle)) {
                            var config = bundles.get(item.bundle)._config;
                            var info = config.getAssetInfo(uuid);
                            if (info && info.redirect) {
                                if (!bundles.has(info.redirect)) throw new Error(`Please load bundle ${info.redirect} first`);
                                config = bundles.get(info.redirect)._config;
                                info = config.getAssetInfo(uuid);
                            }
                            out.config = config;
                            out.info = info;
                        }
                        out.ext = item.ext || '.json';
                        break;
                    case '__requestType__':
                    case 'ext': 
                    case 'bundle':
                    case 'preset':
                    case 'type': break;
                    case RequestType.DIR: 
                        if (bundles.has(item.bundle)) {
                            var infos = [];
                            bundles.get(item.bundle)._config.getDirWithPath(item.dir, item.type, infos);
                            for (let i = 0, l = infos.length; i < l; i++) {
                                var info = infos[i];
                                input.push({uuid: info.uuid, __isNative__: false, ext: '.json', bundle: item.bundle});
                            }
                        }
                        out.recycle();
                        out = null;
                        break;
                    case RequestType.PATH: 
                        if (bundles.has(item.bundle)) {
                            var config = bundles.get(item.bundle)._config;
                            var info = config.getInfoWithPath(item.path, item.type);
                            
                            if (info && info.redirect) {
                                if (!bundles.has(info.redirect)) throw new Error(`you need to load bundle ${info.redirect} first`);
                                config = bundles.get(info.redirect)._config;
                                info = config.getAssetInfo(info.uuid);
                            }

                            if (!info) {
                                out.recycle();
                                throw new Error(`Bundle ${item.bundle} doesn't contain ${item.path}`);
                            }
                            out.config = config; 
                            out.uuid = info.uuid;
                            out.info = info;
                        }
                        out.ext = item.ext || '.json';
                        break;
                    case RequestType.SCENE:
                        if (bundles.has(item.bundle)) {
                            var config = bundles.get(item.bundle)._config;
                            var info = config.getSceneInfo(item.scene);
                            
                            if (info && info.redirect) {
                                if (!bundles.has(info.redirect)) throw new Error(`you need to load bundle ${info.redirect} first`);
                                config = bundles.get(info.redirect)._config;
                                info = config.getAssetInfo(info.uuid);
                            }
                            if (!info) {
                                out.recycle();
                                throw new Error(`Bundle ${config.name} doesn't contain scene ${item.scene}`);
                            }
                            out.config = config; 
                            out.uuid = info.uuid;
                            out.info = info;
                        }
                        break;
                    case '__isNative__': 
                        out.isNative = item.__isNative__;
                        break;
                    case RequestType.URL: 
                        out.url = item.url;
                        out.uuid = item.uuid || item.url;
                        out.ext = item.ext || cc.path.extname(item.url);
                        out.isNative = item.__isNative__ !== undefined ? item.__isNative__ : true;
                        break;
                    default: out.options[key] = item[key];
                }
                if (!out) break;
            }
        }
        if (!out) continue;
        task.output.push(out);
        if (!out.uuid && !out.url) throw new Error('Can not parse this input:' + JSON.stringify(item));
    }
    return null;
}

function combine (task) {
    var input = task.output = task.input;
    for (var i = 0; i < input.length; i++) {
        var item = input[i];
        if (item.url) continue;

        var url = '', base = '';
        var config = item.config;
        if (item.isNative) {
            base = (config && config.nativeBase) ? (config.base + config.nativeBase) : cc.assetManager.generalNativeBase;
        } 
        else {
            base = (config && config.importBase) ? (config.base + config.importBase) : cc.assetManager.generalImportBase;
        }

        let uuid = item.uuid;
            
        var ver = '';
        if (item.info) {
            if (item.isNative) {
                ver = item.info.nativeVer ? ('.' + item.info.nativeVer) : '';
            }
            else {
                ver = item.info.ver ? ('.' + item.info.ver) : '';
            }
        }

        // ugly hack, WeChat does not support loading font likes 'myfont.dw213.ttf'. So append hash to directory
        if (item.ext === '.ttf') {
            url = `${base}/${uuid.slice(0, 2)}/${uuid}${ver}/${item.options.__nativeName__}`;
        }
        else {
            url = `${base}/${uuid.slice(0, 2)}/${uuid}${ver}${item.ext}`;
        }
        
        item.url = url;
    }
    return null;
}

module.exports = { parse, combine };