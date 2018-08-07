
// for IE11
if (!Object.assign) {
    Object.assign = function (target, source) {
        cc.js.mixin(target, source);
    }
}