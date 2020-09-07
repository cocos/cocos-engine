jsb.__obj_ref_id = 0;

jsb.registerNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        let targetID = target.__jsb_ref_id;
        if (targetID === undefined)
            targetID = target.__jsb_ref_id = jsb.__obj_ref_id++;

        let refs = owner.__nativeRefs;
        if (!refs) {
            refs = owner.__nativeRefs = {};
        }

        refs[targetID] = target;
    }
};

jsb.unregisterNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        let targetID = target.__jsb_ref_id;
        if (targetID === undefined)
            return;

        let refs = owner.__nativeRefs;
        if (!refs) {
            return;
        }

        delete refs[targetID];
    }
};

jsb.unregisterAllNativeRefs = function (owner) {
    if (!owner) return;
    delete owner.__nativeRefs;
};

jsb.unregisterChildRefsForNode = function (node, recursive) {
    recursive = !!recursive;
    let children = node.getChildren(), i, l, child;
    for (i = 0, l = children.length; i < l; ++i) {
        child = children[i];
        jsb.unregisterNativeRef(node, child);
        if (recursive) {
            jsb.unregisterChildRefsForNode(child, recursive);
        }
    }
};
