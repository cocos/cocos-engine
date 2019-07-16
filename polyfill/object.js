
// for IE11
if (!Object.assign) {
    Object.assign = function (target, source) {
        return cc.js.mixin(target, source);
    }
}

// for Baidu browser
// Implementation reference to: 
// http://2ality.com/2016/02/object-getownpropertydescriptors.html
// http://docs.w3cub.com/javascript/global_objects/reflect/ownkeys/
if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function (obj) {
        let descriptors = {};
        let ownKeys = Object.getOwnPropertyNames(obj);
        if (Object.getOwnPropertySymbols) { // for IE 11
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(obj));
        }
        for(let i = 0; i < ownKeys.length; ++i){
            let key = ownKeys[i];
            descriptors[key] = Object.getOwnPropertyDescriptor(obj, key);
        }
        return descriptors;
    }
}