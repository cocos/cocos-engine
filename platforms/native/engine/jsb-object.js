


const oldDestroy = jsb.CCObject.prototype.destroy;
const oldDestroyImmediate = jsb.CCObject.prototype._destroyImmediate;
const deferredDestroyObjects = [[],[]];
let deferredArrayIndex = 0;

jsb.CCObject.prototype.destroy = function() {
    deferredDestroyObjects[deferredArrayIndex].push(this);
    oldDestroy.call(this);
};


jsb.CCObject._deferredDestroyReleaseObjects = function() {
    deferredArrayIndex = (deferredArrayIndex + 1) % deferredDestroyObjects.length;
    deferredDestroyObjects[deferredArrayIndex].length = 0;
};

jsb.CCObject.prototype._destroyImmediate = function() {  
    deferredDestroyObjects[deferredArrayIndex].push(this);
    oldDestroyImmediate.call(this);
};