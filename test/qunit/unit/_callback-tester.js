var CallbackTester = cc.Class({
    extends: cc.Component,
    ctor: function () {
        this._expects = [];
        this._messages = [];
        this._unexpect = {};
        this._stopped = false;
    }
});

CallbackTester.OnLoad = 'onLoad';
CallbackTester.start = 'start';
CallbackTester.update = 'update';
CallbackTester.lateUpdate = 'lateUpdate';
CallbackTester.OnEnable = 'onEnable';
CallbackTester.OnDisable = 'onDisable';
CallbackTester.OnDestroy = 'onDestroy';

CallbackTester.prototype._expect = function (expect, message, append) {
    if (Array.isArray(expect) && expect.length > 0) {
        this.expect(expect[0]);
        for (var i = 1; i < expect.length; ++i) {
            this.expect(expect[i], null, true);
        }
        return this;
    }

    var error = !append && this._expects.length > 0;
    if (error) {
        ok(false, 'expecting a new callback but the last "' + this._expects[0].expect + '" have not being called');
        this._expects.length = 0;
    }
    else {
        delete this._unexpect[expect];
    }
    this._expects.push({
        expect: expect,
        message: message
    });
    return this;
};

CallbackTester.prototype.expect = function (expect, message, append) {
    //console.trace('CallbackTester.expect is obsoleted, use pushExpect or resetExpect instead please!');
    this._expect(expect, message, append);
    return this;
};

/**
 * @param {string} expect
 * @param {string} [message]
 */
CallbackTester.prototype.pushExpect = function (expect, message) {
    this._expect(expect, message, true);
    return this;
};

/**
 * @param {string} expect
 * @param {string} [message]
 */
CallbackTester.prototype.resetExpect = function (expect, message) {
    this._expect(expect, message, false);
    return this;
};

/**
 * @param {string} notExpect
 * @param {string} [message]
 */
CallbackTester.prototype.notExpect = function (notExpect, message) {
    if (this._expects.length > 0 && this._expects[0].expect === notExpect) {
        ok(false, 'notExpect: The not expected callback is still expecting, maybe the last callback is not yet called');
        return;
    }
    this._unexpect[notExpect] = message;
    return this;
};

/**
 * stop reporting errors
 */
CallbackTester.prototype.stopTest = function () {
    if (this._expects && this._expects.length > 0) {
        var last = this._expects.shift();
        var expect = last.expect;
        var message = last.message;
        ok(false, 'The last expected "' + expect + '" not called yet: ' + message);
    }
    this._stopped = true;
    this._expects = null;
    this._messages = null;
    this._unexpect = null;
};

CallbackTester.prototype._assert = function (actual) {
    if (this._stopped) {
        return;
    }
    if (this._expects.length > 0) {
        var current = this._expects.splice(0, 1)[0];
        var expect = current.expect;
        var message = current.message;
    }
    if (expect !== actual) {
        var error = this._unexpect[actual];
        if (!error) {
            if (expect) {
                error = 'Should invoke "' + expect + '" but the actual is "' + actual + '"';
            }
            else {
                error = 'not expect any callback but "' + actual + '" called';
            }
        }
    }
    strictEqual(actual, expect, error || message || '' + expect + ' called');
    this._unexpect = {};
    //cc.log('CallbackTester: ' + actual);
};

CallbackTester.prototype.onLoad = function () {
    this._assert(CallbackTester.OnLoad);
};

CallbackTester.prototype.start = function () {
    this._assert(CallbackTester.start);
};

CallbackTester.prototype.update = function () {
    this._assert(CallbackTester.update);
};

CallbackTester.prototype.lateUpdate = function () {
    this._assert(CallbackTester.lateUpdate);
};

CallbackTester.prototype.onEnable = function () {
    this._assert(CallbackTester.OnEnable);
};

CallbackTester.prototype.onDisable = function () {
    this._assert(CallbackTester.OnDisable);
};

CallbackTester.prototype.onDestroy = function () {
    this._assert(CallbackTester.OnDestroy);
};
