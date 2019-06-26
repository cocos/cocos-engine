if (!Math.sign) {
    Math.sign = function (x) {
        x = +x; // convert to a number
        if (x === 0 || isNaN(x)) {
            return x;
        }
        return x > 0 ? 1 : -1;
    };
}

if (!Math.log2) {
    Math.log2 = function (x) {
        return Math.log(x) * Math.LOG2E;
    };
}

if (!Number.isInteger) {
    Number.isInteger = function (value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    };
}

if (CC_JSB || CC_RUNTIME || !console.time) {
    var Timer = window.performance || Date;
    var _timerTable = Object.create(null);
    console.time = function (label) {
        _timerTable[label] = Timer.now();
    };
    console.timeEnd = function (label) {
        var startTime = _timerTable[label];
        var duration = Timer.now() - startTime;
        console.log(`${label}: ${duration}ms`);
    };
}
