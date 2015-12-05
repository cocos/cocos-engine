
// Helps to maintain the actual scene graph for Entity-Component.

var SceneGraphUtils = {
    removeSgNode: function () {
        var node = this._sgNode;
        if (node) {
            if (node._parent) {
                node._parent.removeChild(node);
            }
            this._sgNode = null;
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
                    cc.error("%s's scene graph node not contains in the parent's children", firstChildEntity.name);
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
