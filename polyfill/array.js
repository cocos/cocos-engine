if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

if (!Array.prototype.find) {
    Array.prototype.find = function (callback) {
        var length = this.length;
        for (var i = 0; i < length; i++) {
            var element = this[i];
            if (callback.call(this, element, i, this)) {
                return element;
            }
        }

        return undefined;
    };
}

// for ie 11
if (!Array.prototype.includes) {
    Array.prototype.includes = function (value) {
        return this.indexOf(value) !== -1;
    };
}
