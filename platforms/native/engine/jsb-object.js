


const oldDestroy = jsb.CCObject.prototype.destroy;
const oldDestroyImmediate = jsb.CCObject.prototype._destroyImmediate;
const deferredDestroyObjects = [];

jsb.CCObject.prototype.destroy = function() {
    deferredDestroyObjects.push(this);
    oldDestroy.call(this);
};


jsb.CCObject._deferredDestroyReleaseObjects = function() {
    jsb.CCObject.deferredDestroy();
    deferredDestroyObjects.length = 0;
};

jsb.CCObject.prototype._destroyImmediate = function() {  
    deferredDestroyObjects.push(this);
    oldDestroyImmediate.call(this);
};