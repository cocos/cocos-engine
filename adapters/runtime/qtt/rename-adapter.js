let rt = loadRuntime();

if (typeof jsb.garbageCollect === "undefined") {
    jsb.garbageCollect = function() {};
}

if (typeof __gl === "undefined") {
    __gl = rt.getWebGL();
}

if (typeof __canvas === "undefined" && __gl) {
    __canvas = __gl.canvas;
}