/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var AssetTable = require('./asset-table');

var RESOURCES_PROTOCOL = 'resources://';

var UrlResolver = module.exports = {
    id: 'UrlResolver',
    async: true,
    pipeline: null,
    
    handle: function (item, callback) {
        var url = item.url;
        if (typeof url === 'string' && url.startsWith(RESOURCES_PROTOCOL)) {
            url = url.slice(RESOURCES_PROTOCOL.length);
            var uuid = this.resources.getUuid(url);
            if (Array.isArray(uuid)) {
                cc.info('Wildcard NYI');
                if (uuid.length > 0) {
                    uuid = uuid[0];
                }
                else {
                    cc.info('TODO');
                }
            }
            if (uuid) {
                // load by uuid
                var pipeline = this.pipeline;
                pipeline.flowInDeps(
                    [{
                        id: uuid,
                        type: 'uuid'
                    }], 
                    function (items) {
                        var loaded = items[uuid];
                        if (loaded) {
                            item.content = loaded.content;
                            pipeline.flowOut(item);
                            
                            // skip other pipes
                            callback = null;
                        }
                        else {
                            callback(new Error('TODO - what\'s wrong?'), null);
                        }
                    }
                );
            }
            else {
                callback(new Error('Resources path "' + item.url + '" does not exist.'));
            }
        }
        else {
            callback(null);
        }
    },
    
    resources: new AssetTable(),
};
