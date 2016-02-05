if (typeof CustomEvent === 'undefined') {
    CustomEvent = function () {

    }
}

if (typeof Set == 'undefined') {
    // very simple polyfill
    Set = function () {
        this.values = [];
    };
    Set.prototype.has = function (value) {
        return this.values.indexOf(value) !== -1;
    };
    Set.prototype.add = function (value) {
        this.values.push(value);
    };
}

// http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind.html
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        //return function () {};
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        // test this.prototype in case of native functions binding:
        //  - https://gist.github.com/jacomyal/4b7ae101a1cf6b985c60
        if (this.prototype)
            fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

var isPhantomJS = window.navigator.userAgent.indexOf('PhantomJS') !== -1;
if (isPhantomJS) {
    QUnit.config.notrycatch = true;
    window.onerror = function (msg, url, line, column, error) {
        if (error) {
            console.error(error.stack);
        }
        else {
            console.error(msg + '.\n' + url + ':' + line);
        }
    };
    // polyfill
    var video = document.createElement("video");
    video.constructor.prototype.canPlayType = function () { return ''; };
}
