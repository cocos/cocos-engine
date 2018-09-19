/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

const EXTNAME_RE = /(\.[^\.\/\?\\]*)(\?.*)?$/;
const DIRNAME_RE = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/;
const NORMALIZE_RE = /[^\.\/]+\/\.\.\//;

/**
 * !#en The module provides utilities for working with file and directory paths
 * !#zh 用于处理文件与目录的路径的模块
 * @class path
 * @static
 */

/**
 * !#en Join strings to be a path.
 * !#zh 拼接字符串为 Path
 * @method join
 * @example {@link cocos2d/core/utils/CCPath/join.js}
 * @returns {String}
 */
export function join () {
    let l = arguments.length;
    let result = "";
    for (let i = 0; i < l; i++) {
        result = (result + (result === "" ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
    }
    return result;
}

/**
 * !#en Get the ext name of a path including '.', like '.png'.
 * !#zh 返回 Path 的扩展名，包括 '.'，例如 '.png'。
 * @method extname
 * @example {@link cocos2d/core/utils/CCPath/extname.js}
 * @param {String} pathStr
 * @returns {*}
 */
export function extname (pathStr) {
    let temp = EXTNAME_RE.exec(pathStr);
    return temp ? temp[1] : '';
}

/**
 * !#en Get the main name of a file name
 * !#zh 获取文件名的主名称
 * @method mainFileName
 * @param {String} fileName
 * @returns {String}
 * @deprecated
 */
export function mainFileName (fileName) {
    if (fileName) {
        let idx = fileName.lastIndexOf(".");
        if (idx !== -1)
            return fileName.substring(0, idx);
    }
    return fileName;
}

/**
 * !#en Get the file name of a file path.
 * !#zh 获取文件路径的文件名。
 * @method basename
 * @example {@link cocos2d/core/utils/CCPath/basename.js}
 * @param {String} pathStr
 * @param {String} [extname]
 * @returns {*}
 */
export function basename (pathStr, extname) {
    let index = pathStr.indexOf("?");
    if (index > 0) pathStr = pathStr.substring(0, index);
    let reg = /(\/|\\)([^\/\\]+)$/g;
    let result = reg.exec(pathStr.replace(/(\/|\\)$/, ""));
    if (!result) return null;
    let baseName = result[2];
    if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() === extname.toLowerCase())
        return baseName.substring(0, baseName.length - extname.length);
    return baseName;
}

/**
 * !#en Get dirname of a file path.
 * !#zh 获取文件路径的目录名。
 * @method dirname
 * @example {@link cocos2d/core/utils/CCPath/dirname.js}
 * @param {String} pathStr
 * @returns {*}
 */
export function dirname (pathStr) {
    let temp = DIRNAME_RE.exec(pathStr);
    return temp ? temp[2] : '';
}

/**
 * !#en Change extname of a file path.
 * !#zh 更改文件路径的扩展名。
 * @method changeExtname
 * @example {@link cocos2d/core/utils/CCPath/changeExtname.js}
 * @param {String} pathStr
 * @param {String} [extname]
 * @returns {String}
 */
export function changeExtname (pathStr, extname) {
    extname = extname || "";
    let index = pathStr.indexOf("?");
    let tempStr = "";
    if (index > 0) {
        tempStr = pathStr.substring(index);
        pathStr = pathStr.substring(0, index);
    }
    index = pathStr.lastIndexOf(".");
    if (index < 0) return pathStr + extname + tempStr;
    return pathStr.substring(0, index) + extname + tempStr;
}

/**
 * !#en Change file name of a file path.
 * !#zh 更改文件路径的文件名。
 * @example {@link cocos2d/core/utils/CCPath/changeBasename.js}
 * @param {String} pathStr
 * @param {String} basename
 * @param {Boolean} [isSameExt]
 * @returns {String}
 */
export function changeBasename (pathStr, basename, isSameExt) {
    if (basename.indexOf(".") === 0) return this.changeExtname(pathStr, basename);
    let index = pathStr.indexOf("?");
    let tempStr = "";
    let ext = isSameExt ? this.extname(pathStr) : "";
    if (index > 0) {
        tempStr = pathStr.substring(index);
        pathStr = pathStr.substring(0, index);
    }
    index = pathStr.lastIndexOf("/");
    index = index <= 0 ? 0 : index + 1;
    return pathStr.substring(0, index) + basename + ext + tempStr;
}

//todo make public after verification
export function _normalize (url) {
    let oldUrl = url = String(url);

    //removing all ../
    do {
        oldUrl = url;
        url = url.replace(NORMALIZE_RE, "");
    } while (oldUrl.length !== url.length);
    return url;
}

// @param {string} path
export function stripSep (path) {
    return path.replace(/[\/\\]$/, '');
}

cc.path = {
    join,
    extname,
    mainFileName,
    basename,
    dirname,
    changeExtname,
    changeBasename,
    _normalize,
    stripSep,
    get sep () {
        return (cc.sys.os === cc.sys.OS_WINDOWS ? '\\' : '/');
    }
};