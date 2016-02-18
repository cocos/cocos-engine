/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

module.exports = {
    isDomNode: typeof window === 'object' && function (obj) {
        return (
            typeof Node === "object" ? obj instanceof Node :
            obj && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string"
        );
    },

    callInNextTick: CC_EDITOR ?
        function (callback, p1, p2) {
            if (callback) {
                process.nextTick(function () {
                    callback(p1, p2);
                });
            }
        }
        :
        function (callback, p1, p2) {
            if (callback) {
                setTimeout(function () {
                    callback(p1, p2);
                }, 0);
            }
        }
};

if (CC_DEV) {
    cc.js.mixin(module.exports, {
        ///**
        // * @param {Object} obj
        // * @return {Boolean} is {} ?
        // */
        isPlainEmptyObj_DEV: function (obj) {
            if (!obj || obj.constructor !== Object) {
                return false;
            }
            // jshint ignore: start
            for (var k in obj) {
                return false;
            }
            // jshint ignore: end
            return true;
        },
        cloneable_DEV: function (obj) {
            return obj && typeof obj.clone === 'function' &&
                  (obj.constructor.prototype.hasOwnProperty('clone') || obj.hasOwnProperty('clone'));
        }
    });
}

if (CC_TEST) {
    // editor mocks using in unit tests
    if (typeof Editor === 'undefined') {
        Editor = {
            UuidUtils: {
                NonUuidMark: '.',
                uuid: function () {
                    return '' + ((new Date()).getTime() + Math.random());
                }
            }
        };
    }
}
