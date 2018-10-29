
// for IE11
if (!Object.assign) {
    Object.assign = function (target, source) {
        cc.js.mixin(target, source);
    }
}

// for Baidu browser
// Implementation reference to: 
// http://2ality.com/2016/02/object-getownpropertydescriptors.html
// http://docs.w3cub.com/javascript/global_objects/reflect/ownkeys/
if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function (obj) {
        let descriptors = {};
        let ownKeys = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));  // equals to Reflect.ownKeys(obj) in ES6
        for(let i = 0; i < ownKeys.length; ++i){
            let key = ownKeys[i];
            descriptors[key] = Object.getOwnPropertyDescriptor(obj, key);
        }
        return descriptors;
    }
}