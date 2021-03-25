export function cloneObject (targetObject: any, originObj: any) {
    Object.keys(originObj).forEach((key) => {
        if (typeof originObj[key] === 'function') {
            targetObject[key] = originObj[key].bind(originObj);
            return;
        }
        targetObject[key] = originObj[key];
    });
}
