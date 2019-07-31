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

// 
if (!Array.prototype.includes) {
    Array.prototype.includes = function () {       
        var length = this.length, i = 0;
        if (arguments.length >= 2) {
            i = arguments[1];
        }
        for(; i < length; i++) {
            if(this[i] === arguments[0]) {
                return true;
            }
        }
        return false;
    };
}
