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
    node.setPositionForJS(lpos.x, lpos.y, lpos.z);

    const lscale = node._lscale;
    node.setScaleForJS(lscale.x, lscale.y, lscale.z);

    const lrot = node._lrot;
    node.setRotationForJS(lrot.x, lrot.y, lrot.z, lrot.w);

    node.setLayerForJS(node._layer);

    const euler = node._euler;
    node.setRotationFromEulerForJS(euler.x, euler.y, euler.z);
}

export function updateChildren (node: Node) {
    if (!node) {
        return;
    }
    node._setChildren(node._children);
    syncNodeValue(node);
    for (let i = 0, len = node._children.length; i < len; ++i) {
        const child = node._children[i];
        jsb.registerNativeRef(node, child);
        updateChildren(child);
        syncNodeValue(child);
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
}
