/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.
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
window.jsb = window.jsb || {};
var fs = wuji.getFileSystemManager ? wuji.getFileSystemManager() : null;
var outOfStorageRegExp = /the maximum size of the file storage/;  // not exactly right

var fsUtils = {

    fs,

    isOutOfStorage (errMsg) {
        return outOfStorageRegExp.test(errMsg);
    },

    _subpackagesPath: '',

    getUserDataPath() {
        return jsb.env.USER_DATA_PATH;
    },

    checkFsValid() {
        if (!fs) {
            console.warn('can not get the file system!');
            return false;
        }
        return true;
    },

    deleteFile(filePath, onComplete) {
        fs.unlink({
            filePath: filePath,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Delete file failed: path: ${filePath} message: ${res.errMsg}`);
                onComplete && onComplete(new Error(res.errMsg));
            }
        });
    },

    downloadFile(remoteUrl, filePath, header, onProgress, onComplete) {
        var options = {
            url: remoteUrl,
            success: function (res) {
                if (res.statusCode === 200) {
                    if (!filePath) {
                        onComplete && onComplete(null, res.tempFilePath);
                    }
                    else {
                        fsUtils.copyFile(res.tempFilePath, filePath, function (err) {
                            if (err) {
                                onComplete && onComplete(err);
                            } else {
                                onComplete && onComplete(null, filePath);
                            }
                        });
                    }
                }
                else {
                    console.warn(`Download file failed: path: ${remoteUrl} message: ${res.statusCode}`);
                    onComplete && onComplete(new Error(res.statusCode), null);
                }
            },
            fail: function (data, code) {
                console.warn(`Download file failed: path: ${remoteUrl} code: ${code}`);
                onComplete && onComplete(new Error(`Download file failed: path: ${remoteUrl} , code: ${code}`), null);
            }
        }
        if (header) options.header = header;
        var task = jsb.downloadFile(options);
        onProgress && task.onProgressUpdate(onProgress);
    },

    saveFile(srcPath, destPath, onComplete) {
        fs.saveFile({
            tempFilePath: srcPath,
            filePath: destPath,
            success: function (res) {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Save file failed: path: ${srcPath} message: ${res.errMsg}`);
                onComplete && onComplete(new Error(res.errMsg));
            }
        });
    },

    copyFile(srcPath, destPath, onComplete) {
        fs.copyFile({
            srcPath: srcPath,
            destPath: destPath,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Copy file failed: path: ${srcPath} message: ${res.errMsg}`);
                onComplete && onComplete(new Error(res.errMsg));
            }
        });
    },

    writeFile(path, data, encoding, onComplete) {
        fs.writeFile({
            filePath: path,
            encoding: encoding,
            data: data,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Write file failed: path: ${path} message: ${res.errMsg}`);
                onComplete && onComplete(new Error(res.errMsg));
            }
        });
    },

    writeFileSync(path, data, encoding) {
        try {
            fs.writeFileSync(path, data, encoding);
            return null;
        }
        catch (e) {
            // NOTE: throw an undefined error
            console.warn(`Write file failed: path: ${path}`, e);
            return new Error(e);
        }
    },

    readFile(filePath, encoding, onComplete) {
        fs.readFile({
            filePath: filePath,
            encoding: encoding,
            success: function (res) {
                onComplete && onComplete(null, res.data);
            },
            fail: function (res) {
                console.warn(`Read file failed: path: ${filePath} message: ${res.errMsg}`);
                onComplete && onComplete(new Error(res.errMsg));
            }
        });
    },

    readDir(filePath, onComplete) {
        fs.readdir({
            dirPath: filePath,
            success: function (res) {
                onComplete && onComplete(null, res.files);
            },
            fail: function (res) {
                console.warn(`Read directory failed: path: ${filePath} message: ${res.errMsg}`);
                onComplete && onComplete(new Error(res.errMsg), null);
            }
        });
    },

    readText(filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', onComplete);
    },

    readArrayBuffer(filePath, onComplete) {
        fsUtils.readFile(filePath, 'binary', onComplete);
    },

    readArrayBufferSync(path) {
        try {
            var buffer = fs.readFileSync(path, 'binary');
            return buffer;
        }
        catch (e) {
            console.warn(`Read json failed: path: ${path} message: ${e.message}`);
            return new Error(e);
        }
    },

    readJson(filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', function (err, text) {
            var out = null;
            if (!err) {
                try {
                    out = JSON.parse(text);
                }
                catch (e) {
                    console.warn(`Read json failed: path: ${filePath} message: ${e.message}`);
                    err = new Error(e.message);
                }
            }
            onComplete && onComplete(err, out);
        });
    },

    readJsonSync(path) {
        try {
            var str = fs.readFileSync(path, 'utf8');
            return JSON.parse(str);
        }
        catch (e) {
            console.warn(`Read json failed: path: ${path} message: ${e.message}`);
            return new Error(e);
        }
    },

    makeDirSync(path, recursive) {
        try {
            fs.mkdirSync(path, recursive);
            return null;
        }
        catch (e) {
            console.warn(`Make directory failed: path: ${path} message: ${e.message}`);
            return new Error(e);
        }
    },

    rmdirSync(dirPath, recursive) {
        try {
            fs.rmdirSync(dirPath, recursive);
        }
        catch (e) {
            console.warn(`rm directory failed: path: ${dirPath} message: ${e.message}`);
            return new Error(e);
        }
    },

    exists(filePath, onComplete) {
        fs.access({
            path: filePath,
            success: function () {
                onComplete && onComplete(true);
            },
            fail: function () {
                onComplete && onComplete(false);
            }
        });
    },

    existsSync(filePath) {
        try {
            fs.accessSync(filePath);
            return true;
        } catch (error) {
            return false;
        }
    },

    loadSubpackage(name, onProgress, onComplete) {
        throw new Error('Not Implemented');
    },
    
    unzip(zipFilePath, targetPath, onComplete) {
        fs.unzip({
            zipFilePath,
            targetPath,
            success() {
                onComplete && onComplete(null);
            },
            fail(res) {
                console.warn(`unzip failed: path: ${zipFilePath} message: ${res.errMsg}`);
                onComplete && onComplete(new Error('unzip failed: ' + res.errMsg));
            },
        })
    },
};

jsb.fsUtils = window.fsUtils = module.exports = fsUtils;