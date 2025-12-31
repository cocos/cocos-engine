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

const path = globalThis.nodeEnv.require('path');
const fs = globalThis.nodeEnv.require('fs-extra');

const fsUtils = {

    fs,

    initJsbDownloader(jsbDownloaderMaxTasks, jsbDownloaderTimeout) {
        console.log("initJsbDownloader: nodejs does not support")
    },

    getUserDataPath() {
        return path.join(globalThis.nodeEnv.userDataPath, "writablePath");
    },

    checkFsValid() {
        if (!fs) {
            cc.warn('can not get the file system!');
            return false;
        }
        return true;
    },

    deleteFile(filePath, onComplete) {
        const fullFilePath = fsUtils.fullPathForFilename(filePath);
        fs.unlink(fullFilePath, (e) => {
            if (e) {
                const err = new Error(`Delete file failed: "${filePath}" (resolved: "${fullFilePath}") - ${e.message}`);
                console.warn(err.message);
                onComplete && onComplete(err);
            } else {
                onComplete && onComplete(null);
            }
        });
    },
    
    fullPathForFilename(filename, forceReturnFullpath = false) {
        if(filename.length <= 0){ 
            return "";
        }
        if(path.isAbsolute(filename)) {
            return filename;
        }
        const newFilename = path.normalize(filename);
        const projectPath = '';
        const fullpath = path.join(projectPath, newFilename);
        if(fs.pathExistsSync(fullpath) || forceReturnFullpath) {
            return fullpath;
        }
        return "";
    },

    saveFile(srcPath, destPath, onComplete) {
        const fullSrcPath = fsUtils.fullPathForFilename(srcPath);
        const fullDestPath = fsUtils.fullPathForFilename(destPath, true);
        fs.ensureDirSync(path.dirname(fullDestPath));
        fs.copyFile(fullSrcPath, fullDestPath, (e) => {
            if (e) {
                const err = new Error(`Save file failed: srcPath: "${srcPath}" (resolved: "${fullSrcPath}")  \
                                                         dstPath: "${destPath}" (resolved: "${fullDestPath}")  
                                                         ${e.message}`);
                console.warn(err.message);
                onComplete && onComplete(err);
            } else {
                fs.remove(srcPath);
                onComplete && onComplete(null);
            }
        });
    },

    copyFile(srcPath, destPath, onComplete) {
        const fullSrcPath = fsUtils.fullPathForFilename(srcPath);
        const fullDestPath = fsUtils.fullPathForFilename(destPath, true);
        fs.ensureDirSync(path.dirname(fullDestPath));
        fs.copyFile(fullSrcPath, fullDestPath, (e) => {
            if (e) {
                const err = new Error(`Copy file failed: srcPath: "${srcPath}" (resolved: "${fullSrcPath}")  \
                                                         dstPath: "${destPath}" (resolved: "${fullDestPath}")  
                                                         ${e.message}`);
                cc.warn(err.message);
                onComplete && onComplete(err);
            } else {
                onComplete && onComplete(null);
            }
        });
    },

    writeFile(filePath, data, encoding, onComplete) {
        const fullFilePath = fsUtils.fullPathForFilename(filePath, true);
        fs.writeFile(fullFilePath, data, encoding, (e) => {
            if (e) {
                const err = new Error(`Write file failed: "${filePath}" (resolved: "${fullFilePath}") - ${e.message}`);
                cc.warn(err.message);
                onComplete && onComplete(err);
            } else {
                onComplete && onComplete(null);
            }
        })
    },

    writeFileSync(filePath, data, encoding) {
        const fullFilePath = fsUtils.fullPathForFilename(filePath, true);
        try {
            fs.writeFile(fullFilePath, data, encoding);
            return null;
        } catch (e) {
            const err = new Error(`Failed to write file synchronously: "${filePath}" (resolved: "${fullFilePath}") - ${e.message}`);
            cc.warn(err.message);
            return err;
        }
    },

    readFile(filePath, encoding, onComplete) {
        const fullFilePath = fsUtils.fullPathForFilename(filePath);
        fs.readFile(fullFilePath, encoding, (e, data) => {
            if (e) {
                const err = new Error(`Read file failed: "${filePath}" (resolved: "${fullFilePath}") - ${e.message}`);
                cc.warn(err.message);
                onComplete && onComplete(err, null);
            } else {
                onComplete && onComplete(null, data);
            }
        })
    },

    readDir(dirPath, onComplete) {
        const fullDirPath = fsUtils.fullPathForFilename(dirPath);
        fs.readdir(fullDirPath, (e, files) => {
            if (e) {
                const err = new Error(`Read directory failed: "${dirPath}" (resolved: "${fullDirPath}") - ${e.message}`);
                cc.warn(err.message);
                onComplete && onComplete(err, null);
            } else {
                onComplete && onComplete(null, files);
            }
        })
    },

    readText(filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', onComplete);
    },

    readArrayBuffer(filePath, onComplete) {
        fsUtils.readFile(filePath, '', onComplete);
    },

    readJson(filePath, onComplete) {
        const fullFilePath = fsUtils.fullPathForFilename(filePath);
        fs.readJson(fullFilePath, (e, jsonObj) => {
            if (e) {
                const err = new Error(`Read json failed: "${filePath}" (resolved: "${fullFilePath}") - ${e.message}`);
                cc.warn(err.message);
                onComplete && onComplete(err, null);
            } else {
                onComplete && onComplete(null, jsonObj);
            }
        })
    },

    readJsonSync(filePath) {
        const fullFilePath = fsUtils.fullPathForFilename(filePath);
        try {
            return fs.readJsonSync(fullFilePath);
        } catch (e) {
            const err = new Error(`Failed to read JSON file synchronously: "${filePath}" (resolved: "${fullFilePath}") - ${e.message}`);
            cc.warn(err.message);
            return err;
        }
    },

    makeDirSync(dirPath, recursive) {
        const fullDirPath = fsUtils.fullPathForFilename(dirPath, true);
        try {
            fs.mkdirSync(fullDirPath, { recursive: recursive });
            return null;
        } catch (e) {
            const err = new Error(`Make directory failed: "${dirPath}" (resolved: "${fullDirPath}") - ${e.message}`);
            cc.warn(err.message);
            return err;
        }
    },

    rmdirSync(dirPath, recursive) {
        const fullDirPath = fsUtils.fullPathForFilename(dirPath);
        try {
            fs.rmSync(fullDirPath, { recursive: recursive });
            return null;
        } catch (e) {
            const err = new Error(`Remove directory failed: "${dirPath}" (resolved: "${fullDirPath}") - ${e.message}`);
            cc.warn(err.message);
            return err;
        }
    },

    exists(filePath, onComplete) {
        const fullFilePath = fsUtils.fullPathForFilename(filePath);
        fs.pathExists(fullFilePath, function (e, exists) {
            if(e) {
                const err = new Error(`File existence check failed: "${filePath}" (resolved: "${fullFilePath}") - ${e.message}`);
                cc.warn(err.message);
                return err;
            }
            onComplete && onComplete(exists);
        });
    },

    loadSubpackage(name, onProgress, onComplete) {
        throw new Error('nodejs not implement');
    },
};

globalThis.fsUtils = module.exports = fsUtils;
