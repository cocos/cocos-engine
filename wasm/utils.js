
var tmpGetSetDesc = {
    get: null,
    set: null,
    enumerable: false,
};

module.exports = {
    loadScript (src, cb) {
        var element = document.createElement('script');
        element.async = true;
        element.src = src

        var loaded = function () {
            document.body.removeChild(element);
            element.removeEventListener('load', loaded, false);
            cb();
        };
        element.addEventListener('load', loaded, false);
        document.body.appendChild(element);
    },

    getset: function (obj, prop, getter, setter, enumerable) {
        if (typeof setter !== 'function') {
            enumerable = setter;
            setter = undefined;
        }
        tmpGetSetDesc.get = getter;
        tmpGetSetDesc.set = setter;
        tmpGetSetDesc.enumerable = enumerable;
        Object.defineProperty(obj, prop, tmpGetSetDesc);
        tmpGetSetDesc.get = null;
        tmpGetSetDesc.set = null;
    }

};
