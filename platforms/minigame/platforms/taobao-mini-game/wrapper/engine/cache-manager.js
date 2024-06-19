/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 const { deleteFile, rmdirSync, unzip, isOutOfStorage } = require('../fs-utils');
 (function(){
    var unzipSuffix = 0;
    if (!(cc && cc.assetManager && cc.assetManager.cacheManager)) {
        return;
    }
    
    const cacheManager = cc.assetManager.cacheManager;
    var cleaning = false;

    cacheManager.clearLRU = function() {
        if(cc.downloadFileNumForTest){
            cc.downloadFileNumForTest = 0;
        }
        if (cleaning) return;
        cleaning = true;
        var caches = [];
        var self = this;
        if(this.tempFiles && this.tempFiles.length > 0){
            this.tempFiles.forEach(function (val, key) {
                var time = Date.now().toString();
                caches.push({ originUrl: key, url: val, lastTime: time });
            });
        }
        if(this.tempFiles && this.tempFiles.length > 0){
            this.cachedFiles.forEach(function (val, key) {
                if (val.bundle === 'internal') return;
                if (self._isZipFile(key) && cc.assetManager.bundles.find(bundle => bundle.base.indexOf(val.url) !== -1)) return;
                caches.push({ originUrl: key, url: val.url, lastTime: val.lastTime });
            });
        }
        caches.sort(function (a, b) {
            return a.lastTime - b.lastTime;
        });
        caches.length = Math.floor(caches.length / 3);
        if (caches.length === 0) {
            cleaning = false;
            console.warn('can not get the file system!');
            return;
        }
        for (var i = 0, l = caches.length; i < l; i++) {
            this.cachedFiles.remove(caches[i].originUrl);
        }
        
        this.writeCacheFile(function () {
            function deferredDelete () {
                var item = caches.pop();
                if (self._isZipFile(item.originUrl)) {
                    deleteFile(item.url, self._deleteFileCB.bind(self));
                }
                else {
                    deleteFile(item.url, self._deleteFileCB.bind(self));
                }
                if (caches.length > 0) { 
                    setTimeout(deferredDelete, self.deleteInterval); 
                }
                else {
                    cleaning = false;
                }
            }
            setTimeout(deferredDelete, self.deleteInterval);
        });

    };
    cacheManager.unzipAndCacheBundle = function (id, zipFilePath, cacheBundleRoot, onComplete) {
        let time = Date.now().toString();
        let targetPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${unzipSuffix++}`;
        let self = this;
        unzip(zipFilePath, targetPath, function (err) {
            if (err) {
                rmdirSync(targetPath, true);
                if (isOutOfStorage(err.message)) {
                    self.outOfStorage = true;
                    self.autoClear && self.clearLRU();
                }
                onComplete && onComplete(err);
                return;
            }
            self.cachedFiles.add(id, { bundle: cacheBundleRoot, url: targetPath, lastTime: time });
            self.writeCacheFile();
            onComplete && onComplete(null, targetPath);
        });
    };

})();
 