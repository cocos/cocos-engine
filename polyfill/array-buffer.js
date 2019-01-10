if (!ArrayBuffer.isView) {
    const ArrayBufferView = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array)).constructor;
    ArrayBuffer.isView = function (view) {
        return view instanceof ArrayBufferView;
    };
}