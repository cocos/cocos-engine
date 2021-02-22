export function cloneObject (targetObject: Object, originObj: Object) {
    Object.keys(originObj).forEach(key => {
        if (typeof originObj[key] === 'function') {
            targetObject[key] = originObj[key].bind(originObj);
            return;
        }
        targetObject[key] = originObj[key];
    });
}