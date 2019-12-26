// SameValue algorithm
if (!Object.is) {
    Object.is = function(x, y) {
        if (x === y) {
            return x !== 0 || 1 / x === 1 / y;
        } else {
            return x !== x && y !== y;
        }
    };
}

// Based on https://github.com/8696/ES5-Set-Map/blob/master/es5-map/es5-map.js
// datas = [[key, value],[key,value]]
function MapUtils (datas) {
    this.datas = [];
    let that = this;
    if (datas) {
        datas.forEach(function (data) {
            if (!that.has(data[0])) {
                that.datas.push({
                    key: data[0],
                    value: data[1]
                });
            }
        });
    }
};

MapUtils.prototype.size = function () {
    return this.datas.length;
};

MapUtils.prototype.set = function (key, value) {
    this.delete(key);
    this.datas.push({
        key: key,
        value: value
    });
};

MapUtils.prototype.get = function (key) {
    let value = undefined;
    let datas = this.datas;
    for (let i = 0, len = datas.length; i < len; i++) {
        if (Object.is(key, datas[i].key)) {
            value = datas[i].value;
            break;
        }
    }
    return value;
};

MapUtils.prototype.has = function (key) {
    let exist = false;
    let datas = this.datas;
    for (let i = 0, len = datas.length; i < len; i++) {
        if (Object.is(key, datas[i].key)) {
            exist = true;
            break;
        }
    }
    return exist;
};

MapUtils.prototype.clear = function () {
    this.datas.length = 0;
};

MapUtils.prototype.delete = function (key) {
    let exist = false;
    let datas = this.datas;
    for (let i = 0, len = datas.length; i < len; i++) {
        if (Object.is(key, datas[i].key)) {
            datas.splice(i, 1);
            exist = true;
            break;
        }
    }
    return exist;
};

MapUtils.prototype.keys = function () {
    let datas = this.datas;
    let keys = [];
    for (let i = 0, len = datas.length; i < len; i++) {
        keys.push(datas[i].key);
    }

    return keys;
};

MapUtils.prototype.values = function () {
    let index = 0;
    let datas = this.datas;
    return {
        next: function () {
            if (datas.length === 0 || datas[index] === undefined) {
                return {
                    value: undefined,
                    done: true
                };
            }
            return {
                value: datas[index++].value,
                done: false
            };
        }
    };
};

module.exports = {
    MapUtils: MapUtils
};