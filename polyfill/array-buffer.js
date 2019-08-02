if (!ArrayBuffer.isView) {
    const TypedArray = Object.getPrototypeOf(Int8Array);
    ArrayBuffer.isView = (typeof TypedArray === 'function') ? function (obj) {
        return obj instanceof TypedArray;
    } : function (obj) {
        // old JSC, phantom
        let ctor = obj.constructor;
        return ctor === Float32Array || ctor === Uint8Array || ctor === Uint32Array || ctor === Int8Array;
    };
}