
var cc3d = {

    version: "__CURRENT_SDK_VERSION__",

    revision: "__REVISION__",

    config: {},

    common: {},

    apps: {},

    data: {},

    unpack: function () {
        console.warn("cc3d.unpack has been deprecated and will be removed shortly. Please update your code.");
    },

    makeArray: function (arr) {
        var i,
            ret = [],
            length = arr.length;

        for (i = 0; i < length; ++i) {
            ret.push(arr[i]);
        }

        return ret;
    },

    type: function (obj) {
        if (obj === null) {
            return "null";
        }

        var type = typeof(obj);

        if (type == "undefined" || type == "number" || type == "string" || type == "boolean") {
            return type;
        }

        return _typeLookup[Object.prototype.toString.call(obj)];
    },

    extend: function (target, ex) {
        var prop,
            copy;

        for (prop in ex) {
            copy = ex[prop];
            if (cc3d.type(copy) == "object") {
                target[prop] = cc3d.extend({}, copy);
            } else if (cc3d.type(copy) == "array") {
                target[prop] = cc3d.extend([], copy);
            } else {
                target[prop] = copy;
            }
        }

        return target;
    },

    isDefined: function (o) {
        var a;
        return (o !== a);
    }
};

var _typeLookup = function () {
    var result = {},
        index,
        names = ["Array", "Object", "Function", "Date", "RegExp", "Float32Array"];

    for (index = 0; index < names.length; ++index) {
        result["[object " + names[index] + "]"] = names[index].toLowerCase();
    }

    return result;
}();

if (typeof (exports) !== 'undefined') {
    exports.cc3d = cc3d;
}
