import type { Node } from '../scene-graph';

export interface IArrayProxy {
    owner: any,
    arrPropertyName: string,
    arrElementType: string,
    setArrayElementCB: (index: number, val: any) => void,
    getArrayElementCB: (index: number) => any,
    setArraySizeCB: (size: number) => void,
    getArraySizeCB: () => number,
}

class ProxyHandler {
    private _options: IArrayProxy;
    constructor (options: IArrayProxy) {
        this._options = options;
    }

    get (target: any, property: string) {
        const i = parseInt(property);
        let result;
        if (!isNaN(i)) {
            result = this._options.getArrayElementCB.call(this._options.owner, i);
            if (undefined == result) {
                result = target[property];
                this._options.setArrayElementCB.call(this._options.owner, i, result);
            }
        } else if (property === 'length') {
            result = this._options.getArraySizeCB.call(this._options.owner);
        } else if (property === 'push') {
            const func = target[property];
            result = function () {
                for (let i = 0, len = arguments.length; i < len; ++i) {
                    this._options.setArrayElementCB(i, arguments[i]);
                }
                func.apply(target, arguments);
            };
        } else {
            console.error('dont go here....');
            result = target[property];
        }
        console.warn(`==> get [${property}], result: ${result}, for target: ${target}`);
        // property is index in this case
        return result;
    }

    set (target: any, property: string, value: any, receiver: any) {
        console.warn(`==> set [${property}]=${value}, for target: ${target}`);
        const i = parseInt(property);
        if (!isNaN(i)) {
            if (typeof value === this._options.arrElementType) {
                this._options.setArrayElementCB.call(this._options.owner, i, value);
            }
        } else if (property === 'length') {
            this._options.setArraySizeCB.call(this._options.owner, value);
        }

        target[property] = value;
        // you have to return true to accept the changes
        return true;
    }
}

export function defineArrayProxy (options: IArrayProxy) {
    const arrProxy = [new Proxy([], new ProxyHandler(options))];
    Object.defineProperty(options.owner, options.arrPropertyName, {
        enumerable: true,
        configurable: true,
        get () {
            // TODO: get children from native and sync to arrProxy
            return arrProxy[0];
        },
        set (v) {
            arrProxy[0] = new Proxy(v, new ProxyHandler(options));
            // TODO: resize native array
            options.setArraySizeCB.call(options.owner, v.length);
            for (let i = 0, len = v.length; i < len; ++i) {
                const e = v[i];
                if (typeof e === options.arrElementType) {
                    options.setArrayElementCB(i, e);
                }
            }
        },
    });
}

function syncNodeValue (node: Node) {
    const lpos = node._lpos;
    let x = lpos.x;
    let y = lpos.y;
    let z = lpos.z;
    if (x !== null || y !== null || z !== null) {
        node.setPositionForJS(x || 0, y || 0, z || 0);
    }

    const lscale = node._lscale;
    x = lscale.x;
    y = lscale.y;
    z = lscale.z;
    if (x !== null || y !== null || z !== null) {
        node.setScaleForJS(x || 0, y || 0, z || 0);
    }

    const lrot = node._lrot;
    x = lrot.x;
    y = lrot.y;
    z = lrot.z;
    const w = lrot.w;
    if (x !== null || y !== null || z !== null || w != null) {
        node.setRotationForJS(x || 0, y || 0, z || 0, w || 0);
    }

    if (node._layer !== null) {
        node.setLayerForJS(node._layer);
    }

    const euler = node._euler;
    x = euler.x;
    y = euler.y;
    z = euler.z;
    if (x !== null || y !== null || z !== null) {
        node.setRotationFromEulerForJS(x || 0, y || 0, z || 0);
    }
}

export function updateChildrenForDeserialize (node: Node) {
    if (!node) {
        return;
    }
    node._setChildren(node._children);
    syncNodeValue(node);
    for (let i = 0, len = node._children.length; i < len; ++i) {
        const child = node._children[i];
        jsb.registerNativeRef(node, child);
        updateChildrenForDeserialize(child);
    }
    Object.defineProperty(node, '_children', {
        enumerable: true,
        configurable: true,
        get () {
            return this.getChildren();
        },
        set (v) {
            this._setChildren(v);
        },
    });
    node._isChildrenRedefined = true;
}

export function updateChildren (node: Node) {
    if (!node) {
        return;
    }

    const children = node.getChildren(); // cjh OPTIMIZE:  children is a GC object
    for (let i = 0, len = children.length; i < len; ++i) {
        const child = children[i];
        updateChildren(child);
    }

    if (node._isChildrenRedefined) {
        return;
    }

    Object.defineProperty(node, '_children', {
        enumerable: true,
        configurable: true,
        get () {
            return this.getChildren();
        },
        set (v) {
            this._setChildren(v);
        },
    });
    node._isChildrenRedefined = true;
}
