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

/**
 * !#en
 * Helper class for ES5 Map.
 * !#zh
 * ES5 Map 辅助类。
 * @class MapUtils
 */
export default class MapUtils {
    datas = [];
    
    constructor (data) {
        !data && (data = []);

        this.datas = [];
        
        let that = this;

        data.forEach(function (item) {
            if (!that.has(item[0])) {
                that.datas.push({
                    key: item[0],
                    value: item[1]
                });
            }
        });
    }

    size () {
        return this.datas.length;
    }

    set (key, value) {
        this.delete(key);
        this.datas.push({
            key: key,
            value: value
        });
    }

    get (key) {
        let value = undefined;
        let datas = this.datas;
        for (let i = 0, len = datas.length; i < len; i++) {
            if (Object.is(key, datas[i].key)) {
                value = datas[i].value;
                break;
            }
        }
        return value;
    }

    has (key) {
        let res = false;
        let datas = this.datas;
        for (let i = 0, len = datas.length; i < len; i++) {
            if (Object.is(key, datas[i].key)) {
                res = true;
                break;
            }
        }
        return res;
    }

    clear () {
        this.datas.length = 0;
    }

    delete (key) {
        let res = false;
        let datas = this.datas;
        for (let i = 0, len = datas.length; i < len; i++) {
            if (Object.is(key, datas[i].key)) {
                datas.splice(i, 1);
                res = true;
                break;
            }
        }
        return res;
    }

    keys () {
        let datas = this.datas;
        let keys = [];
        for (let i = 0, len = datas.length; i < len; i++) {
            keys.push(datas[i].key);
        }
    
        return keys;
    }

    values () {
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
};