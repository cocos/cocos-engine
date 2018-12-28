/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

require('../platform/CCSys');

var EXTNAME_RE = /(\.[^\.\/\?\\]*)(\?.*)?$/;
var DIRNAME_RE = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/;
var NORMALIZE_RE = /[^\.\/]+\/\.\.\//;

/**
 * !#en The module provides utilities for working with file and directory paths
 * !#zh 用于处理文件与目录的路径的模块
 * @class path
 * @static
 */
cc.path = /** @lends cc.path# */{
    /**
     * !#en Join strings to be a path.
     * !#zh 拼接字符串为 Path
     * @method join
     * @example {@link cocos2d/core/utils/CCPath/join.js}
     * @returns {String}
     */
    join: function () {
        var l = arguments.length;
        var result = "";
        for (var i = 0; i < l; i++) {
            result = (result + (result === "" ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
        }
        return result;
    },

    /**
     * !#en Get the ext name of a path including '.', like '.png'.
     * !#zh 返回 Path 的扩展名，包括 '.'，例如 '.png'。
     * @method extname
     * @example {@link cocos2d/core/utils/CCPath/extname.js}
     * @param {String} pathStr
     * @returns {*}
     */
    extname: function (pathStr) {
        var temp = EXTNAME_RE.exec(pathStr);
        return temp ? temp[1] : '';
    },

    /**
     * !#en Get the main name of a file name
     * !#zh 获取文件名的主名称
     * @method mainFileName
     * @param {String} fileName
     * @returns {String}
     * @deprecated
     */
    mainFileName: function (fileName) {
        if (fileName) {
            var idx = fileName.lastIndexOf(".");
            if (idx !== -1)
                return fileName.substring(0, idx);
        }
        return fileName;
    },

    /**
     * !#en Get the file name of a file path.
     * !#zh 获取文件路径的文件名。
     * @method basename
     * @example {@link cocos2d/core/utils/CCPath/basename.js}
     * @param {String} pathStr
     * @param {String} [extname]
     * @returns {*}
     */
    basename: function (pathStr, extname) {
        var index = pathStr.indexOf("?");
        if (index > 0) pathStr = pathStr.substring(0, index);
        var reg = /(\/|\\)([^\/\\]+)$/g;
        var result = reg.exec(pathStr.replace(/(\/|\\)$/, ""));
        if (!result) return null;
        var baseName = result[2];
        if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() === extname.toLowerCase())
            return baseName.substring(0, baseName.length - extname.length);
        return baseName;
    },

    /**
     * !#en Get dirname of a file path.
     * !#zh 获取文件路径的目录名。
     * @method dirname
     * @example {@link cocos2d/core/utils/CCPath/dirname.js}
     * @param {String} pathStr
     * @returns {*}
     */
    dirname: function (pathStr) {
        var temp = DIRNAME_RE.exec(pathStr);
        return temp ? temp[2] : '';
    },

    /**
     * !#en Change extname of a file path.
     * !#zh 更改文件路径的扩展名。
     * @method changeExtname
     * @example {@link cocos2d/core/utils/CCPath/changeExtname.js}
     * @param {String} pathStr
     * @param {String} [extname]
     * @returns {String}
     */
    changeExtname: function (pathStr, extname) {
        extname = extname || "";
        var index = pathStr.indexOf("?");
        var tempStr = "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        index = pathStr.lastIndexOf(".");
        if (index < 0) return pathStr + extname + tempStr;
        return pathStr.substring(0, index) + extname + tempStr;
    },
    /**
     * !#en Change file name of a file path.
     * !#zh 更改文件路径的文件名。
     * @example {@link cocos2d/core/utils/CCPath/changeBasename.js}
     * @param {String} pathStr
     * @param {String} basename
     * @param {Boolean} [isSameExt]
     * @returns {String}
     */
    changeBasename: function (pathStr, basename, isSameExt) {
        if (basename.indexOf(".") === 0) return this.changeExtname(pathStr, basename);
        var index = pathStr.indexOf("?");
        var tempStr = "";
        var ext = isSameExt ? this.extname(pathStr) : "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        index = pathStr.lastIndexOf("/");
        index = index <= 0 ? 0 : index + 1;
        return pathStr.substring(0, index) + basename + ext + tempStr;
    },
    //todo make public after verification
    _normalize: function (url) {
        var oldUrl = url = String(url);

        //removing all ../
        do {
            oldUrl = url;
            url = url.replace(NORMALIZE_RE, "");
        } while (oldUrl.length !== url.length);
        return url;
    },

    // The platform-specific file separator. '\\' or '/'.
    sep: (cc.sys.os === cc.sys.OS_WINDOWS ? '\\' : '/'),

    // @param {string} path
    stripSep (path) {
        return path.replace(/[\/\\]$/, '');
    }
};

module.exports = cc.path;