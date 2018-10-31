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

/**
 * Finds a node by hierarchy path, the path is case-sensitive.
 * It will traverse the hierarchy by splitting the path using '/' character.
 * This function will still returns the node even if it is inactive.
 * It is recommended to not use this function every frame instead cache the result at startup.
 *
 * @method find
 * @static
 * @param {String} path
 * @param {Node} [referenceNode]
 * @return {Node|null} the node or null if not found
 */
cc.find = module.exports = function (path, referenceNode) {
    if (path == null) {
        cc.errorID(5600);
        return null;
    }
    if (!referenceNode) {
        var scene = cc.director.getScene();
        if (!scene) {
            if (CC_DEV) {
                cc.warnID(5601);
            }
            return null;
        }
        else if (CC_DEV && !scene.isValid) {
            cc.warnID(5602);
            return null;
        }
        referenceNode = scene;
    }
    else if (CC_DEV && !referenceNode.isValid) {
        cc.warnID(5603);
        return null;
    }

    var match = referenceNode;
    var startIndex = (path[0] !== '/') ? 0 : 1; // skip first '/'
    var nameList = path.split('/');

    // parse path
    for (var n = startIndex; n < nameList.length; n++) {
        var name = nameList[n];
        var children = match._children;
        match = null;
        for (var t = 0, len = children.length; t < len; ++t) {
            var subChild = children[t];
            if (subChild.name === name) {
                match = subChild;
                break;
            }
        }
        if (!match) {
            return null;
        }
    }

    return match;
};
