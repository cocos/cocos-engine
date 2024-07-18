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
 const { rmdirSync, unzip, isOutOfStorage } = require('../fs-utils');

 (function () {
    let unzipSuffix = 0;
    if (!(cc && cc.assetManager && cc.assetManager.cacheManager)) {
        return;
    }

    const cacheManager = cc.assetManager.cacheManager;
    cacheManager.unzipAndCacheBundle = function (id, zipFilePath, cacheBundleRoot, onComplete) {
        const time = Date.now().toString();
        const targetPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${unzipSuffix++}`;
        const self = this;
        unzip(zipFilePath, targetPath, (err) => {
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
}());
