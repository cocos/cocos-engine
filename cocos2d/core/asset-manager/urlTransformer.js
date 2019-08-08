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
            item[options.requestType || RequestType.UUID] = input[i];
        }
        if (typeof item === 'object') {
            // local options will overlap glabal options
            for (var op in options) {
                if (op in item) continue;
                item[op] = options[op];
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
                    case 'requestType':
                    case 'ext': 
                    case 'bundle':
                    case 'type': break;
                    case RequestType.DIR: 
                        if (bundles.has(item.bundle)) {
                            var infos = [];
                            bundles.get(item.bundle)._config.getDirWithPath(item.dir, item.type, infos);
                            for (let i = 0, l = infos.length; i < l; i++) {
                                var info = infos[i];
                                input.push({uuid: info.uuid, isNative: false, ext: '.json', bundle: item.bundle});
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
                            out.config = config; 
                            out.uuid = info.uuid;
                            out.info = info;
                        }
                        out.ext = item.ext || '.json';
                        if (!info) {
                            out.recycle();
                            throw new Error(`this bundle ${item.bundle} does not contain ${item.path}`);
                        }
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
                            out.config = config; 
                            out.uuid = info.uuid;
                            out.info = info;
                        }
                        if (!info) {
                            out.recycle();
                            throw new Error(`this bundle ${item.bundle} does not contain scene ${item.scene}`);
                        }
                        break;
                    case 'isNative': 
                        out[key] = item[key];
                        break;
                    case RequestType.URL: 
                        out.url = item.url;
                        out.uuid = item.uuid || item.url;
                        out.ext = item.ext || cc.path.extname(item.url);
                        out.isNative = item.isNative !== undefined ? item.isNative : true;
                        break;
                    default: out.options[key] = item[key];
                }
                if (!out) break;
            }
        }
        if (!out) continue;
        task.output.push(out);
        if (!out.uuid && !out.url) throw new Error('unknown input:' + item.toString());
    }
    return null;
}

function combine (task) {
    var input = task.output = task.input;
    for (var i = 0; i < input.length; i++) {
        var item = input[i];
        if (item.url) continue;

        var url = '', base = '';
    
        if (item.isNative) {
            base = item.config ? (item.config.base + item.config.nativeBase) : cc.assetManager.generalNativeBase;
        } 
        else {
            base = item.config ? (item.config.base + item.config.importBase) : cc.assetManager.generalImportBase;
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

        // ugly hack
        if (item.ext === '.ttf') {
            url = `${base}/${uuid.slice(0, 2)}/${uuid}${ver}/${item.options.name}`;
        }
        else {
            url = `${base}/${uuid.slice(0, 2)}/${uuid}${ver}${item.ext}`;
        }
        
        item.url = url;
    }
    return null;
}

module.exports = { parse, combine };