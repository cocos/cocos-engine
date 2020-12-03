let _didAccelerate;

Object.defineProperty(cc.internal.inputManager, "didAccelerate", {
    get() {
        return _didAccelerate;
    },
    set(value) {
        _didAccelerate = (function (didAccelerate) {
            return function () {
                didAccelerate.apply(this, arguments);
                this._acceleration.x = -this._acceleration.x;
                this._acceleration.y = -this._acceleration.y;
            };
        })(value);
    }
});