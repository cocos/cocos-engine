let utils = {
    /**
     * @param {Object} target 
     * @param {Object} origin 
     * @param {String} methodName 
     * @param {String} targetMethodName 
     */
    cloneMethod (target, origin, methodName, targetMethodName) {
        if (origin[methodName]) {
            targetMethodName = targetMethodName || methodName;
            target[targetMethodName] = origin[methodName].bind(origin);
        }
    }
};

module.exports = utils;