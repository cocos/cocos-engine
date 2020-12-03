import _weakMap from "./util/WeakMap"

export default class NodeList {
    constructor() {
        _weakMap.set(this, {
            array: []
        });

        return new Proxy(this, {
            get(target, key) {
                if (typeof key === "symbol") {
                    return function () { return "" };
                }

                if(/^[0-9]*$/.test(key)) {
                    return _weakMap.get(target).array[key];
                }

                let result = target[key];
                if(typeof result === "function") {
                    result = result.bind(target);
                }

                return result;
            }
        });
    }

    push(element) {
        _weakMap.get(this).array.push(element);
    }

    item(index) {
        return _weakMap.get(this).array[index];
    }

    get length() {
        return _weakMap.get(this).array.length;
    }

    concat() {
        let array = _weakMap.get(this).array;
        return array.concat.apply(array, arguments);
    }
}