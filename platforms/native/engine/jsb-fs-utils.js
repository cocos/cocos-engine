/****************************************************************************
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.
 https://www.cocos.com/
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of fsUtils software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.
 The software or tools in fsUtils License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var fs = jsb.fileUtils;
let jsb_downloader = null;
let downloading = new cc.AssetManager.Cache();
let tempDir = '';

jsb.Downloader.prototype._ctor = function () {
    this.__nativeRefs = {};
};

var fsUtils = {

    fs,

    initJsbDownloader (jsbDownloaderMaxTasks, jsbDownloaderTimeout) {

        jsb_downloader = new jsb.Downloader({
            countOfMaxProcessingTasks: jsbDownloaderMaxTasks || 32,
            timeoutInSeconds: jsbDownloaderTimeout || 30,
            tempFileNameSuffix: '.tmp'
        });

        tempDir = fsUtils.getUserDataPath() + '/temp';
        !fs.isDirectoryExist(tempDir) && fs.createDirectory(tempDir);

        jsb_downloader.setOnFileTaskSuccess(task => {
            if (!downloading.has(task.requestURL)) return;
            let { onComplete } = downloading.remove(task.requestURL);

            onComplete && onComplete(null, task.storagePath);
        });

        jsb_downloader.setOnTaskError((task, errorCode, errorCodeInternal, errorStr) => {
            if (!downloading.has(task.requestURL)) return;
            let { onComplete } = downloading.remove(task.requestURL);
            cc.error(`Download file failed: path: ${task.requestURL} message: ${errorStr}, ${errorCode}`);
            onComplete(new Error(errorStr), null);
        });

        jsb_downloader.setOnTaskProgress((task, bytesReceived, totalBytesReceived, totalBytesExpected) => {
            if (!downloading.has(task.requestURL)) return;
            let { onProgress } = downloading.get(task.requestURL);

            onProgress && onProgress(totalBytesReceived, totalBytesExpected);
        });
    },

    getUserDataPath () {
        return fs.getWritablePath().replace(/[\/\\]*$/, '');
    },

    checkFsValid () {
        if (!fs) {
            cc.warn('can not get the file system!');
            return false;
        }
        return true;
    },

    deleteFile (filePath, onComplete) {
        var result = fs.removeFile(filePath);
        if (result === true) {
            onComplete && onComplete(null);
        }
        else {
            cc.warn(`Delete file failed: path: ${filePath}`);
            onComplete && onComplete(new Error('delete file failed'));
        }
    },

    downloadFile (remoteUrl, filePath, header, onProgress, onComplete) {
        downloading.add(remoteUrl, { onProgress, onComplete });
        var storagePath = filePath;
        if (!storagePath) storagePath = tempDir + '/' + performance.now() + cc.path.extname(remoteUrl);
        jsb_downloader.createDownloadFileTask(remoteUrl, storagePath, header);
    },

    saveFile (srcPath, destPath, onComplete) {
        var err = null;
        let result = fs.writeDataToFile(fs.getDataFromFile(srcPath), destPath);
        fs.removeFile(srcPath);
        if (!result) {
            err = new Error(`Save file failed: path: ${srcPath}`);
            cc.warn(err.message);
        }
        onComplete && onComplete(err);
    },

    copyFile (srcPath, destPath, onComplete) {
        var err = null;
        let result = fs.writeDataToFile(fs.getDataFromFile(srcPath), destPath);
        if (!result) {
            err = new Error(`Copy file failed: path: ${srcPath}`);
            cc.warn(err.message);
        }
        onComplete && onComplete(err);
    },

    writeFile (path, data, encoding, onComplete) {
        var result = null;
        var err = null;
        if (encoding === 'utf-8' || encoding === 'utf8') {
            result = fs.writeStringToFile(data, path);
        }
        else {
            result = fs.writeDataToFile(data, path);
        }
        if (!result) {
            err = new Error(`Write file failed: path: ${path}`);
            cc.warn(err.message);
        }
        onComplete && onComplete(err);
    },

    writeFileSync (path, data, encoding) {
        var result = null;
        if (encoding === 'utf-8' || encoding === 'utf8') {
            result = fs.writeStringToFile(data, path);
        }
        else {
            result = fs.writeDataToFile(data, path);
        }

        if (!result) {
            cc.warn(`Write file failed: path: ${path}`);
            return new Error(`Write file failed: path: ${path}`);
        }
    },

    readFile (filePath, encoding, onComplete) {
        var content = null, err = null;
        if (encoding === 'utf-8' || encoding === 'utf8') {
            content = fs.getStringFromFile(filePath);
        }
        else {
            content = fs.getDataFromFile(filePath);
        }
        if (!content) {
            err = new Error(`Read file failed: path: ${filePath}`);
            cc.warn(err.message);
        }

        onComplete && onComplete (err, content);
    },

    readDir (filePath, onComplete) {
        var files = null, err = null;
        try {
            files = fs.listFiles(filePath);
        }
        catch (e) {
            cc.warn(`Read dir failed: path: ${filePath} message: ${e.message}`);
            err = new Error(e.message);
        }
        onComplete && onComplete(err, files);
    },

    readText (filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', onComplete);
    },

    readArrayBuffer (filePath, onComplete) {
        fsUtils.readFile(filePath, '', onComplete);
    },

    readJson (filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', function (err, text) {
            var out = null;
            if (!err) {
                try {
                    out = JSON.parse(text);
                }
                catch (e) {
                    cc.warn(`Read json failed: path: ${filePath} message: ${e.message}`);
                    err = new Error(e.message);
                }
            }
            onComplete && onComplete(err, out);
        });
    },

    readJsonSync (path) {
        try {
            var str = fs.getStringFromFile(path);
            return JSON.parse(str);
        }
        catch (e) {
            cc.warn(`Read json failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    makeDirSync (path, recursive) {
        let result = fs.createDirectory(path);
        if (!result) {
            cc.warn(`Make directory failed: path: ${path}`);
            return new Error(`Make directory failed: path: ${path}`);
        }
    },

    rmdirSync (dirPath, recursive) {
        let result = fs.removeDirectory(dirPath);
        if (!result) {
            cc.warn(`rm directory failed: path: ${dirPath}`);
            return new Error(`rm directory failed: path: ${dirPath}`);
        }
    },

    exists (filePath, onComplete) {
        var result = fs.isFileExist(filePath);
        onComplete && onComplete(result);
    },

    loadSubpackage (name, onProgress, onComplete) {
        throw new Error('not implement');
    }
};

window.fsUtils = module.exports = fsUtils;
