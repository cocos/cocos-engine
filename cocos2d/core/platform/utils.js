/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// TODO - merge with misc.js

module.exports = {
    contains: function (refNode, otherNode) {
        if(typeof refNode.contains == 'function'){
            return refNode.contains(otherNode);
        }else if(typeof refNode.compareDocumentPosition == 'function' ) {
            return !!(refNode.compareDocumentPosition(otherNode) & 16);
        }else {
            var node = otherNode.parentNode;
            do {
                if(node === refNode){
                    return true;
                }else{
                    node = node.parentNode;
                }
            }while(node !==null);
            return false;
        }
    },

    isDomNode: typeof window === 'object' && (typeof Node === 'function' ?
        function (obj) {
            // If "TypeError: Right-hand side of 'instanceof' is not callback" is thrown,
            // it should because window.Node was overwritten.
            return obj instanceof Node;
        } :
        function (obj) {
            return obj &&
                   typeof obj === 'object' &&
                   typeof obj.nodeType === 'number' &&
                   typeof obj.nodeName === 'string';
        }
    ),

    callInNextTick: CC_EDITOR ?
        function (callback, p1, p2) {
            if (callback) {
                process.nextTick(function () {
                    callback(p1, p2);
                });
            }
        }
        :
        (
            CC_JSB ?
                function (callback, p1, p2) {
                    if (callback) {
                        cc.director.once(cc.Director._EVENT_NEXT_TICK, function () {
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
        )
};

if (CC_DEV) {
    ///**
    // * @param {Object} obj
    // * @return {Boolean} is {} ?
    // */
    module.exports.isPlainEmptyObj_DEV = function (obj) {
        if (!obj || obj.constructor !== Object) {
            return false;
        }
        // jshint ignore: start
        for (var k in obj) {
            return false;
        }
        // jshint ignore: end
        return true;
    };
    module.exports.cloneable_DEV = function (obj) {
        return obj && typeof obj.clone === 'function' &&
              (obj.constructor.prototype.hasOwnProperty('clone') || obj.hasOwnProperty('clone'));
    };
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
