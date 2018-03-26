//require("src/jsb_prepare.js")
let {enums, glTextureFmt} = require("./enums");
let VertexFormat = require("./vertex-format-jsb");
//require("src/vmath.js");


window.device = gfx.Device.getInstance();
window.device._gl = window.gl;

//FIXME:
window.device._stats = { vb: 0 };
window.device._caps = {
    maxVextexTextures: 16,
    maxFragUniforms: 1024,
    maxTextureUints: 8,
    maxVertexAttributes: 16,
    maxDrawBuffers: 8,
    maxColorAttatchments: 8
};

device.setBlendColor32 = device.setBlendColor;

_p = gfx.Program.prototype;
_p._ctor = function(device, options) {
    this.init(device, options.vert, options.frag);
};

_p = gfx.VertexBuffer.prototype;
_p._ctor = function(device, format, usage, data, numVertices) {
    this.init(device, format, usage, data, numVertices);
};
cc.defineGetterSetter(_p, "count", _p.getCount);

_p = gfx.IndexBuffer.prototype;
_p._ctor = function(device, format, usage, data, numIndices) {
    this.init(device, format, usage, data, numIndices);
};
cc.defineGetterSetter(_p, "count", _p.getCount);

gfx.VertexFormat = VertexFormat;
Object.assign(gfx, enums);

_p = gfx.Texture2D.prototype;
_p._ctor = function(device, options) {
    this.init(device, options);
};
_p.destroy = function() {
    
}
cc.defineGetterSetter(_p, "_width", _p.getWidth);
cc.defineGetterSetter(_p, "_height", _p.getHeight);

_p = gfx.FrameBuffer.prototype;
_p._ctor = function(device, width, height, options) {
    this.init(device, width, height, options);
};

var TextHAlignment = {
    LEFT : 0,
    CENTER : 1,
    RIGHT : 2
};

var TextVAlignment = {
    TOP : 0,
    CENTER : 1,
    BOTTOM : 2
};

var DeviceTextAlign = {
    CENTER        : 0x33, /** Horizontal center and vertical center. */
    TOP           : 0x13, /** Horizontal center and vertical top. */
    TOP_RIGHT     : 0x12, /** Horizontal right and vertical top. */
    RIGHT         : 0x32, /** Horizontal right and vertical center. */
    BOTTOM_RIGHT  : 0x22, /** Horizontal right and vertical bottom. */
    BOTTOM        : 0x23, /** Horizontal center and vertical bottom. */
    BOTTOM_LEFT   : 0x21, /** Horizontal left and vertical bottom. */
    LEFT          : 0x31, /** Horizontal left and vertical center. */
    TOP_LEFT      : 0x11 /** Horizontal left and vertical top. */
}

gfx.RB_FMT_D16 = 0x81A5; // GL_DEPTH_COMPONENT16 hack for JSB
