/**
 * Finds a node by hierarchy path, the path is case-sensitive.
 * It will traverse the hierarchy by splitting the path using '/' character.
 * This function will still returns the node even if it is inactive.
 * It is recommended to not use this function every frame instead cache the result at startup.
 *
 * @method find
 * @static
 * @param {String} path
 * @param {ENode} [referenceNode]
 * @return {ENode} the node or null if not found
 */
cc.find = module.exports = function (path, referenceNode) {
    if (path == null) {
        cc.error('Argument must be non-nil');
        return null;
    }
    if (!referenceNode) {
        var scene = cc.director.getScene();
        if (!scene) {
            cc.warn('Can not get current scene.');
            return null;
        }
        referenceNode = scene;
    }

    var match = referenceNode;
    var startIndex = (path[0] !== '/') ? 0 : 1; // skip first '/'
    var nameList = path.split('/');

    // parse path
    for (var n = startIndex; n < nameList.length; n++) {
        var name = nameList[n];
        var findByComp = name[0] === '<' && name[name.length - 1] === '>';
        var Comp;
        if (findByComp) {
            var compName = name.slice(1, -1);
            Comp = cc.js.getClassByName(compName);
            if (!Comp) {
                cc.warn('Failed to find component ' + compName);
                return null;
            }
        }
        // visit sub nodes
        var children = match._children;
        match = null;
        for (var t = 0, len = children.length; t < len; ++t) {
            var subChild = children[t];
            if (findByComp) {
                if (subChild.getComponent(Comp)) {
                    match = subChild;
                    break;
                }
            }
            else if (subChild.name === name) {
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
