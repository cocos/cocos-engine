import type { Node } from '../scene-graph';

// export interface IArrayProxy {
//     owner: any,
//     arrPropertyName: string,
//     arrElementType: string,
//     setArrayElementCB: (index: number, val: any) => void,
//     getArrayElementCB: (index: number) => any,
//     setArraySizeCB: (size: number) => void,
//     getArraySizeCB: () => number,
// }
//
// class ProxyHandler {
//     private _options: IArrayProxy;
//     constructor (options: IArrayProxy) {
//         this._options = options;
//     }
//
//     get (target: any, property: string) {
//         const i = parseInt(property);
//         let result;
//         if (!isNaN(i)) {
//             result = this._options.getArrayElementCB.call(this._options.owner, i);
//             if (undefined == result) {
//                 result = target[property];
//                 this._options.setArrayElementCB.call(this._options.owner, i, result);
//             }
//         } else if (property === 'length') {
//             result = this._options.getArraySizeCB.call(this._options.owner);
//         } else if (property === 'push') {
//             const func = target[property];
//             result = function () {
//                 for (let i = 0, len = arguments.length; i < len; ++i) {
//                     this._options.setArrayElementCB(i, arguments[i]);
//                 }
//                 func.apply(target, arguments);
//             };
//         } else {
//             console.error('dont go here....');
//             result = target[property];
//         }
//         console.warn(`==> get [${property}], result: ${result}, for target: ${target}`);
//         // property is index in this case
//         return result;
//     }
//
//     set (target: any, property: string, value: any, receiver: any) {
//         console.warn(`==> set [${property}]=${value}, for target: ${target}`);
//         const i = parseInt(property);
//         if (!isNaN(i)) {
//             if (typeof value === this._options.arrElementType) {
//                 this._options.setArrayElementCB.call(this._options.owner, i, value);
//             }
//         } else if (property === 'length') {
//             this._options.setArraySizeCB.call(this._options.owner, value);
//         }
//
//         target[property] = value;
//         // you have to return true to accept the changes
//         return true;
//     }
// }
//
// export function defineArrayProxy (options: IArrayProxy) {
//     const arrProxy = [new Proxy([], new ProxyHandler(options))];
//     Object.defineProperty(options.owner, options.arrPropertyName, {
//         enumerable: true,
//         configurable: true,
//         get () {
//             // TODO: get children from native and sync to arrProxy
//             return arrProxy[0];
//         },
//         set (v) {
//             arrProxy[0] = new Proxy(v, new ProxyHandler(options));
//             // TODO: resize native array
//             options.setArraySizeCB.call(options.owner, v.length);
//             for (let i = 0, len = v.length; i < len; ++i) {
//                 const e = v[i];
//                 if (typeof e === options.arrElementType) {
//                     options.setArrayElementCB(i, e);
//                 }
//             }
//         },
//     });
// }

export function syncNodeValues (node: Node) {
    // @ts-expect-error: jsb related codes.
    const lpos = node._lpos;
    let x = lpos.x;
    let y = lpos.y;
    let z = lpos.z;
    if (x !== null || y !== null || z !== null) {
        lpos.x = x = x || 0;
        lpos.y = y = y || 0;
        lpos.z = z = z || 0;
        // @ts-expect-error: jsb related codes.
        node.setPositionForJS(x, y, z);
    } else {
        lpos.x = lpos.y = lpos.z = 0;
    }

    // @ts-expect-error: jsb related codes.
    const lscale = node._lscale;
    x = lscale.x;
    y = lscale.y;
    z = lscale.z;
    if (x !== null || y !== null || z !== null) {
        lscale.x = x = x || 1;
        lscale.y = y = y || 1;
        lscale.z = z = z || 1;
        // @ts-expect-error: jsb related codes.
        node.setScaleForJS(x, y, z);
    } else {
        lscale.x = lscale.y = lscale.z = 1;
    }

    // @ts-expect-error: jsb related codes.
    const lrot = node._lrot;
    x = lrot.x;
    y = lrot.y;
    z = lrot.z;
    let w = lrot.w;
    if (x !== null || y !== null || z !== null || w != null) {
        lrot.x = x = x || 0;
        lrot.y = y = y || 0;
        lrot.z = z = z || 0;
        lrot.w = w = w || 1;
        // @ts-expect-error: jsb related codes.
        node.setRotationForJS(x, y, z, w);
    } else {
        lrot.x = lrot.y = lrot.z = 0;
        lrot.w = 1;
    }

    // @ts-expect-error: jsb related codes.
    const euler = node._euler;
    x = euler.x;
    y = euler.y;
    z = euler.z;
    if (x !== null || y !== null || z !== null) {
        euler.x = x = x || 0;
        euler.y = y = y || 0;
        euler.z = z = z || 0;
        // @ts-expect-error: jsb related codes.
        node.setRotationFromEulerForJS(x, y, z);
    } else {
        euler.x = euler.y = euler.z = 0;
    }
}

export function updateChildrenForDeserialize (node: Node) {
    if (!node) {
        return;
    }
    // @ts-expect-error: jsb related codes.
    node._setChildren(node._children);
    // @ts-expect-error: jsb related codes.
    for (let i = 0, len = node._children.length; i < len; ++i) {
        // @ts-expect-error: jsb related codes.
        const child = node._children[i];
        // jsb.registerNativeRef(node, child);
        updateChildrenForDeserialize(child);
    }
    // Object.defineProperty(node, '_children', {
    //     enumerable: true,
    //     configurable: true,
    //     get () {
    //         return this.getChildren();
    //     },
    //     set (v) {
    //         this._setChildren(v);
    //     },
    // });
    // node._isChildrenRedefined = true;
}

// export function updateChildren (node: Node) {
//     if (!node) {
//         return;
//     }
//
//     const children = node.getChildren(); // cjh OPTIMIZE:  children is a GC object
//     for (let i = 0, len = children.length; i < len; ++i) {
//         const child = children[i];
//         updateChildren(child);
//     }
//
//     if (node._isChildrenRedefined) {
//         return;
//     }
//
//     Object.defineProperty(node, '_children', {
//         enumerable: true,
//         configurable: true,
//         get () {
//             return this.getChildren();
//         },
//         set (v) {
//             this._setChildren(v);
//         },
//     });
//     node._isChildrenRedefined = true;
// }
