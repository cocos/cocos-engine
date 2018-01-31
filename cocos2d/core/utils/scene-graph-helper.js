/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// Helps to maintain the actual scene graph for Entity-Component.

var SceneGraphUtils = {
    removeSgNode: function () {
        var sgNode = this._sgNode;
        if (sgNode) {
            var parent = sgNode._parent;
            if (parent) {
                parent.removeChild(sgNode);
            }
            else {
                // cleanup was skipped when its node was detaching
                if (CC_JSB) {
                    sgNode.cleanup();
                }
                else {
                    sgNode.performRecursive(_ccsg.Node.performType.cleanup);
                }
            }
            if (sgNode._entity) {
                sgNode._entity = null;
            }
        }
    },
};

if (CC_DEV) {
    SceneGraphUtils._getChildrenOffset = function (entityParent) {
        if (entityParent) {
            var sgParent = entityParent._sgNode;
            var firstChildEntity = entityParent._children[0];
            if (firstChildEntity) {
                var firstChildSg = firstChildEntity._sgNode;
                var offset = sgParent._children.indexOf(firstChildSg);
                if (offset !== -1) {
                    return offset;
                }
                else {
                    cc.errorID(3510, firstChildEntity.name);
                    return -1;
                }
            }
            else {
                return sgParent._children.length;
            }
        }
        else {
            return 0;   // the root of hierarchy
        }
    };
    SceneGraphUtils.checkMatchCurrentScene = function () {
        var scene = cc.director.getScene();
        var sgScene = cc.director.getRunningScene();
        function checkMatch (ent, sgNode) {
            if (ent._sgNode !== sgNode) {
                throw new Error('scene graph node not equal: ' + ent.name);
            }

            var childCount = ent._children.length;
            var childrenOffset = SceneGraphUtils._getChildrenOffset(ent);
            if (sgNode._children.length !== childCount + childrenOffset) {
                throw new Error('Mismatched child scene graphs: ' + ent.name);
            }
            for (var i = 0; i < childCount; i++) {
                checkMatch(ent._children[i], sgNode._children[childrenOffset + i]);
            }
        }

        checkMatch(scene, sgScene);
    };
    cc._Test.SceneGraphUtils = SceneGraphUtils;
}

module.exports = SceneGraphUtils;
