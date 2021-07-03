/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.
 https://www.cocos.com/
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of cache-manager software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.
 The software or tools in cache-manager License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const { getUserDataPath, readJsonSync, makeDirSync, writeFileSync, deleteFile, rmdirSync } = require('./jsb-fs-utils');

var writeCacheFileList = null;
var cleaning = false;
const REGEX = /^\w+:\/\/.*/;

var cacheManager = {

    cacheDir: 'gamecaches',

    cachedFileName: 'cacheList.json',

    deleteInterval: 500,

    writeFileInterval: 2000,

    cachedFiles: null,

    version: '1.1',

    getCache (url) {
        this.updateLastTime(url);
        return this.cachedFiles.has(url) ? `${this.cacheDir}/${this.cachedFiles.get(url).url}` : '';
    },

    getTemp (url) {
        return '';
    },

    init () {
        this.cacheDir = getUserDataPath() + '/' + this.cacheDir;
        var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
        var result = readJsonSync(cacheFilePath);
        if (result instanceof Error || !result.version || result.version !== this.version) {
            if (!(result instanceof Error)) rmdirSync(this.cacheDir, true);
            this.cachedFiles = new cc.AssetManager.Cache();
            makeDirSync(this.cacheDir, true);
            writeFileSync(cacheFilePath, JSON.stringify({ files: this.cachedFiles._map, version: this.version }), 'utf8');
        }
        else {
            this.cachedFiles = new cc.AssetManager.Cache(result.files);
        }
    },

    updateLastTime (url) {
        if (this.cachedFiles.has(url)) {
            var cache = this.cachedFiles.get(url);
            cache.lastTime = Date.now();
        }
    },

    _write () {
        writeCacheFileList = null;
        writeFileSync(this.cacheDir + '/' + this.cachedFileName, JSON.stringify({ files: this.cachedFiles._map, version: this.version }), 'utf8');
    },

    writeCacheFile () {
        if (!writeCacheFileList) {
            writeCacheFileList = setTimeout(this._write.bind(this), this.writeFileInterval);
        }
    },

    cacheFile (id, url, cacheBundleRoot) {
        this.cachedFiles.add(id, { bundle: cacheBundleRoot, url, lastTime: Date.now() });
        this.writeCacheFile();
    },

    clearCache () {
        rmdirSync(this.cacheDir, true);
        this.cachedFiles = new cc.AssetManager.Cache();
        makeDirSync(this.cacheDir, true);
        clearTimeout(writeCacheFileList);
        this._write();
        cc.assetManager.bundles.forEach(bundle => {
            if (REGEX.test(bundle.base)) this.makeBundleFolder(bundle.name);
        });
    },

    clearLRU () {
        if (cleaning) return;
        cleaning = true;
        var caches = [];
        var self = this;
        this.cachedFiles.forEach((val, key) => {
            if (val.bundle === 'internal') return;
            caches.push({ originUrl: key, url: this.getCache(key), lastTime: val.lastTime });
        });
        caches.sort(function (a, b) {
            return a.lastTime - b.lastTime;
        });
        caches.length = Math.floor(caches.length / 3);
        if (caches.length === 0) return;
        for (var i = 0, l = caches.length; i < l; i++) {
            this.cachedFiles.remove(caches[i].originUrl);
        }
        clearTimeout(writeCacheFileList);
        this._write();
        function deferredDelete () {
            var item = caches.pop();
            deleteFile(item.url);
            if (caches.length > 0) { 
                setTimeout(deferredDelete, self.deleteInterval); 
            }
            else {
                cleaning = false;
            }
        }
        setTimeout(deferredDelete, self.deleteInterval);
    },

    removeCache (url) {
        if (this.cachedFiles.has(url)) {
            var path = this.getCache(url);
            this.cachedFiles.remove(url);
            clearTimeout(writeCacheFileList);
            this._write();
            deleteFile(path);
        }
    },

    makeBundleFolder (bundleName) {
        makeDirSync(this.cacheDir + '/' + bundleName, true);
    }
}

cc.assetManager.cacheManager = module.exports = cacheManager; 