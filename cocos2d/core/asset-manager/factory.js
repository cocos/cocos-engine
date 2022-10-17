/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
const Bundle = require('./bundle');
const Cache = require('./cache');
const { assets, bundles } = require('./shared');

const _creating = new Cache();

function createTexture (id, data, options, onComplete) {
    let out = null, err = null;
    try {
        out = new cc.Texture2D();
        out._nativeUrl = id;
        out._nativeAsset = data;
    }
    catch (e) {
        err = e;
    }
    onComplete && onComplete(err, out);
}

function createAudioClip (id, data, options, onComplete) {
    let out = new cc.AudioClip();
    out._nativeUrl = id;
    out._nativeAsset = data;
    out.duration = data.duration;
    onComplete && onComplete(null, out);
}

function createVideoClip (id, data, options, onComplete) {
    let out = new cc.VideoClip();
    out._nativeUrl = id;
    out._nativeAsset = data;
    onComplete && onComplete(null, out);
}

function createJsonAsset (id, data, options, onComplete) {
    let out = new cc.JsonAsset();
    out.json = data;
    onComplete && onComplete(null, out);
}

function createTextAsset (id, data, options, onComplete) {
    let out = new cc.TextAsset();
    out.text = data;
    onComplete && onComplete(null, out);
}

function createFont (id, data, options, onComplete) {
    let out = new cc.TTFFont();
    out._nativeUrl = id;
    out._nativeAsset = data;
    onComplete && onComplete(null, out);
}

function createBufferAsset (id, data, options, onComplete) {
    let out = new cc.BufferAsset();
    out._nativeUrl = id;
    out._nativeAsset = data;
    onComplete && onComplete(null, out);
}

function createAsset (id, data, options, onComplete) {
    let out = new cc.Asset();
    out._nativeUrl = id;
    out._nativeAsset = data;
    onComplete && onComplete(null, out);
}

function createBundle (id, data, options, onComplete) {
    let bundle = bundles.get(data.name);
    if (!bundle) {
        bundle = new Bundle();
        data.base = data.base || id + '/';
        bundle.init(data);
    }
    onComplete && onComplete(null, bundle);
}

const factory = {

    register (type, handler) {
        if (typeof type === 'object') {
            cc.js.mixin(producers, type);
        }
        else {
            producers[type] = handler;
        }
    },

    create (id, data, type, options, onComplete) {
        var func = producers[type] || producers['default'];
        let asset, creating;
        if (asset = assets.get(id)) {
            onComplete(null, asset);
        }
        else if (creating = _creating.get(id)) {
            creating.push(onComplete);
        }
        else {
            _creating.add(id, [onComplete]);
            func(id, data, options, function (err, data) {
                if (!err && data instanceof cc.Asset) {
                    data._uuid = id;
                    assets.add(id, data);
                }
                let callbacks = _creating.remove(id);
                for (let i = 0, l = callbacks.length; i < l; i++) {
                    callbacks[i](err, data);
                }
            });
        }
    }
};

const producers = {
    // Images
    '.png' : createTexture,
    '.jpg' : createTexture,
    '.bmp' : createTexture,
    '.jpeg' : createTexture,
    '.gif' : createTexture,
    '.ico' : createTexture,
    '.tiff' : createTexture,
    '.webp' : createTexture,
    '.image' : createTexture,
    '.pvr': createTexture,
    '.pkm': createTexture,
    '.astc': createTexture,

    // Audio
    '.mp3' : createAudioClip,
    '.ogg' : createAudioClip,
    '.wav' : createAudioClip,
    '.m4a' : createAudioClip,

    // Video
    '.mp4' : createVideoClip,
    '.avi' : createVideoClip,
    '.mov' : createVideoClip,
    '.mpg' : createVideoClip,
    '.mpeg': createVideoClip,
    '.rm'  : createVideoClip,
    '.rmvb': createVideoClip,

    // Txt
    '.txt' : createTextAsset,
    '.xml' : createTextAsset,
    '.vsh' : createTextAsset,
    '.fsh' : createTextAsset,
    '.atlas' : createTextAsset,

    '.tmx' : createTextAsset,
    '.tsx' : createTextAsset,
    '.fnt' : createTextAsset,

    '.json' : createJsonAsset,
    '.ExportJson' : createJsonAsset,

    // font
    '.font' : createFont,
    '.eot' : createFont,
    '.ttf' : createFont,
    '.woff' : createFont,
    '.svg' : createFont,
    '.ttc' : createFont,

    // Binary
    '.binary': createBufferAsset,
    '.bin': createBufferAsset,
    '.dbbin': createBufferAsset,
    '.skel': createBufferAsset,

    'bundle': createBundle,

    'default': createAsset

};

module.exports = factory;
