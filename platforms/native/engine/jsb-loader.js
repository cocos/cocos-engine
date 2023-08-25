/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
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

const jsbWindow = require('../jsbWindow');
const cacheManager = require('./jsb-cache-manager');
const { downloadFile, readText, readArrayBuffer, readJson, getUserDataPath, initJsbDownloader } = require('./jsb-fs-utils');

const REGEX = /^\w+:\/\/.*/;
const downloader = cc.assetManager.downloader;
const parser = cc.assetManager.parser;
const presets = cc.assetManager.presets;
downloader.maxConcurrency = 30;
downloader.maxRequestsPerFrame = 60;
presets.preload.maxConcurrency = 15;
presets.preload.maxRequestsPerFrame = 30;
presets.scene.maxConcurrency = 32;
presets.scene.maxRequestsPerFrame = 64;
presets.bundle.maxConcurrency = 32;
presets.bundle.maxRequestsPerFrame = 64;
let suffix = 0;

const failureMap = {};
const maxRetryCountFromBreakpoint = 5;
const loadedScripts = {};

function downloadScript (url, options, onComplete) {
    if (typeof options === 'function') {
        onComplete = options;
        options = null;
    }

    if (loadedScripts[url]) return onComplete && onComplete();

    download(url, (src, options, onComplete) => {
        if (window.oh && window.scriptEngineType === 'napi') {
            // TODO(qgh):OpenHarmony does not currently support dynamic require expressions
            window.oh.loadModule(src);
        } else if (__EDITOR__) {
            // in editor mode,require is from electron,__require is from engine
            globalThis.__require(src);
        } else {
            globalThis.require(src);
        }
        loadedScripts[url] = true;
        onComplete && onComplete(null);
    }, options, options.onFileProgress, onComplete);
}

function download (url, func, options, onFileProgress, onComplete) {
    const result = transformUrl(url, options);
    if (result.inLocal) {
        func(result.url, options, onComplete);
    } else if (result.inCache) {
        cacheManager.updateLastTime(url);
        func(result.url, options, (err, data) => {
            if (err) {
                cacheManager.removeCache(url);
            }
            onComplete(err, data);
        });
    } else {
        const time = Date.now();
        let storagePath = '';
        const failureRecord = failureMap[url];
        if (failureRecord) {
            storagePath = failureRecord.storagePath;
        } else if (options.__cacheBundleRoot__) {
            storagePath = `${options.__cacheBundleRoot__}/${time}${suffix++}${cc.path.extname(url)}`;
        } else {
            storagePath = `${time}${suffix++}${cc.path.extname(url)}`;
        }
        downloadFile(url, `${cacheManager.cacheDir}/${storagePath}`, options.header, onFileProgress, (err, path) => {
            if (err) {
                if (failureRecord) {
                    failureRecord.retryCount++;
                    if (failureRecord.retryCount >= maxRetryCountFromBreakpoint) {
                        delete failureMap[url];
                    }
                } else {
                    failureMap[url] = { retryCount: 0, storagePath };
                }
                onComplete(err, null);
                return;
            }
            delete failureMap[url];
            func(path, options, (err, data) => {
                if (!err) {
                    cacheManager.cacheFile(url, storagePath, options.__cacheBundleRoot__);
                }
                onComplete(err, data);
            });
        });
    }
}

function transformUrl (url, options) {
    let inLocal = false;
    let inCache = false;
    if (REGEX.test(url) && !url.startsWith('file://')) {
        if (options.reload) {
            return { url };
        } else {
            const cache = cacheManager.getCache(url);
            if (cache) {
                inCache = true;
                url = cache;
            }
        }
    } else {
        inLocal = true;
        if (url.startsWith('file://')) {
            url = url.replace(/^file:\/\//, '');
        }
    }
    return { url, inLocal, inCache };
}

function doNothing (content, options, onComplete) {
    onComplete(null, content);
}

function downloadAsset (url, options, onComplete) {
    download(url, doNothing, options, options.onFileProgress, onComplete);
}

function _getFontFamily (fontHandle) {
    const ttfIndex = fontHandle.lastIndexOf('.ttf');
    if (ttfIndex === -1) return fontHandle;

    const slashPos = fontHandle.lastIndexOf('/');
    let fontFamilyName;
    if (slashPos === -1) {
        fontFamilyName = `${fontHandle.substring(0, ttfIndex)}_LABEL`;
    } else {
        fontFamilyName = `${fontHandle.substring(slashPos + 1, ttfIndex)}_LABEL`;
    }
    if (fontFamilyName.indexOf(' ') !== -1) {
        fontFamilyName = `"${fontFamilyName}"`;
    }
    return fontFamilyName;
}

function parseText (url, options, onComplete) {
    readText(url, onComplete);
}

function parseJson (url, options, onComplete) {
    readJson(url, onComplete);
}

function downloadText (url, options, onComplete) {
    download(url, parseText, options, options.onFileProgress, onComplete);
}

function parseArrayBuffer (url, options, onComplete) {
    readArrayBuffer(url, onComplete);
}

function downloadJson (url, options, onComplete) {
    download(url, parseJson, options, options.onFileProgress, onComplete);
}

function downloadBundle (nameOrUrl, options, onComplete) {
    const bundleName = cc.path.basename(nameOrUrl);
    const version = options.version || downloader.bundleVers[bundleName];
    let url;
    if (REGEX.test(nameOrUrl) || nameOrUrl.startsWith(getUserDataPath())) {
        url = nameOrUrl;
        cacheManager.makeBundleFolder(bundleName);
    } else if (downloader.remoteBundles.indexOf(bundleName) !== -1) {
            url = `${downloader.remoteServerAddress}remote/${bundleName}`;
            cacheManager.makeBundleFolder(bundleName);
        } else {
            url = `assets/${bundleName}`;
        }
    const config = `${url}/cc.config.${version ? `${version}.` : ''}json`;
    options.__cacheBundleRoot__ = bundleName;
    downloadJson(config, options, (err, response) => {
        if (err) {
            return onComplete(err, null);
        }
        const out = response;
        out && (out.base = `${url}/`);

        if (out.hasPreloadScript) {
            const js = `${url}/index.${version ? `${version}.` : ''}${out.encrypted ? 'jsc' : `js`}`;
            downloadScript(js, options, (err) => {
                if (err) {
                    return onComplete(err, null);
                }
                onComplete(null, out);
            });
        } else {
            onComplete(null, out);
        }
    });
}

function downloadArrayBuffer (url, options, onComplete) {
    download(url, parseArrayBuffer, options, options.onFileProgress, onComplete);
}

function loadFont (url, options, onComplete) {
    const fontFamilyName = _getFontFamily(url);

    const fontFace = new jsbWindow.FontFace(fontFamilyName, `url('${url}')`);
    jsbWindow.document.fonts.add(fontFace);

    fontFace.load();
    fontFace.loaded.then(() => {
        onComplete(null, fontFamilyName);
    }, () => {
        cc.warnID(4933, fontFamilyName);
        onComplete(null, fontFamilyName);
    });
}

const originParsePlist = parser.parsePlist;
const parsePlist = function (url, options, onComplete) {
    readText(url, (err, file) => {
        if (err) return onComplete(err);
        originParsePlist(file, options, onComplete);
    });
};

parser.parsePVRTex = downloader.downloadDomImage;
parser.parsePKMTex = downloader.downloadDomImage;
parser.parseASTCTex = downloader.downloadDomImage;
parser.parsePlist = parsePlist;
downloader.downloadScript = downloadScript;
downloader._downloadArrayBuffer = downloadArrayBuffer;
downloader._downloadJson = downloadJson;

function loadAudioPlayer (url, options, onComplete) {
    cc.AudioPlayer.load(url).then((player) => {
        const audioMeta = {
            player,
            url,
            duration: player.duration,
            type: player.type,
        };
        onComplete(null, audioMeta);
    }).catch((err) => {
        onComplete(err);
    });
}

downloader.register({
    // JS
    '.js': downloadScript,
    '.jsc': downloadScript,

    // Images
    '.png': downloadAsset,
    '.jpg': downloadAsset,
    '.bmp': downloadAsset,
    '.jpeg': downloadAsset,
    '.gif': downloadAsset,
    '.ico': downloadAsset,
    '.tiff': downloadAsset,
    '.webp': downloadAsset,
    '.image': downloadAsset,
    '.pvr': downloadAsset,
    '.pkm': downloadAsset,
    '.astc': downloadAsset,

    // Audio
    '.mp3': downloadAsset,
    '.ogg': downloadAsset,
    '.wav': downloadAsset,
    '.m4a': downloadAsset,

    // Video
    '.mp4': downloadAsset,
    '.avi': downloadAsset,
    '.mov': downloadAsset,
    '.mpg': downloadAsset,
    '.mpeg': downloadAsset,
    '.rm': downloadAsset,
    '.rmvb': downloadAsset,
    // Text
    '.txt': downloadAsset,
    '.xml': downloadAsset,
    '.vsh': downloadAsset,
    '.fsh': downloadAsset,
    '.atlas': downloadAsset,

    '.tmx': downloadAsset,
    '.tsx': downloadAsset,
    '.fnt': downloadAsset,
    '.plist': downloadAsset,

    '.json': downloadJson,
    '.ExportJson': downloadAsset,

    '.binary': downloadAsset,
    '.bin': downloadAsset,
    '.dbbin': downloadAsset,
    '.skel': downloadAsset,

    // Font
    '.font': downloadAsset,
    '.eot': downloadAsset,
    '.ttf': downloadAsset,
    '.woff': downloadAsset,
    '.svg': downloadAsset,
    '.ttc': downloadAsset,

    bundle: downloadBundle,
    default: downloadText,
});

parser.register({

    // Images
    '.png': downloader.downloadDomImage,
    '.jpg': downloader.downloadDomImage,
    '.bmp': downloader.downloadDomImage,
    '.jpeg': downloader.downloadDomImage,
    '.gif': downloader.downloadDomImage,
    '.ico': downloader.downloadDomImage,
    '.tiff': downloader.downloadDomImage,
    '.webp': downloader.downloadDomImage,
    '.image': downloader.downloadDomImage,

    // Audio
    '.mp3': loadAudioPlayer,
    '.ogg': loadAudioPlayer,
    '.wav': loadAudioPlayer,
    '.m4a': loadAudioPlayer,

    // compressed texture
    '.pvr': downloader.downloadDomImage,
    '.pkm': downloader.downloadDomImage,
    '.astc': downloader.downloadDomImage,

    '.binary': parseArrayBuffer,
    '.bin': parseArrayBuffer,
    '.dbbin': parseArrayBuffer,
    '.skel': parseArrayBuffer,

    // Text
    '.txt': parseText,
    '.xml': parseText,
    '.vsh': parseText,
    '.fsh': parseText,
    '.atlas': parseText,
    '.tmx': parseText,
    '.tsx': parseText,
    '.fnt': parseText,

    '.plist': parsePlist,

    // Font
    '.font': loadFont,
    '.eot': loadFont,
    '.ttf': loadFont,
    '.woff': loadFont,
    '.svg': loadFont,
    '.ttc': loadFont,

    '.ExportJson': parseJson,
});
if (CC_BUILD) {
    cc.assetManager.transformPipeline.append((task) => {
        const input = task.output = task.input;
        for (let i = 0, l = input.length; i < l; i++) {
            const item = input[i];
            if (item.config) {
                item.options.__cacheBundleRoot__ = item.config.name;
            }
            if (item.ext === '.cconb') {
                item.url = item.url.replace(item.ext, '.bin');
            } else if (item.ext === '.ccon') {
                item.url = item.url.replace(item.ext, '.json');
            }
        }
    });
}

const originInit = cc.assetManager.init;
cc.assetManager.init = function (options) {
    originInit.call(cc.assetManager, options);
    const jsbDownloaderMaxTasks = cc.settings.querySettings('assets', 'jsbDownloaderMaxTasks');
    const jsbDownloaderTimeout = cc.settings.querySettings('assets', 'jsbDownloaderTimeout');
    initJsbDownloader(jsbDownloaderMaxTasks, jsbDownloaderTimeout);
    cacheManager.init();
};
