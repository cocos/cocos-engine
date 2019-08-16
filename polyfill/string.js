if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.lastIndexOf(searchString, position) === position;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        if (typeof position === 'undefined' || position > this.length) {
            position = this.length;
        }
        position -= searchString.length;
        var lastIndex = this.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

if (!String.prototype.trimLeft) {
    String.prototype.trimLeft = function () {
        return this.replace(/^\s+/, '');
    };
}
