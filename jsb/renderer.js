// projection
renderer.PROJ_PERSPECTIVE = 0;
renderer.PROJ_ORTHO = 1;

// lights
renderer.LIGHT_DIRECTIONAL = 0;
renderer.LIGHT_POINT = 1;
renderer.LIGHT_SPOT = 2;

// shadows
renderer.SHADOW_NONE = 0;
renderer.SHADOW_HARD = 1;
renderer.SHADOW_SOFT = 2;

// parameter type
renderer.PARAM_INT = 0;
renderer.PARAM_INT2 = 1;
renderer.PARAM_INT3 = 2;
renderer.PARAM_INT4 = 3;
renderer.PARAM_FLOAT = 4;
renderer.PARAM_FLOAT2 = 5;
renderer.PARAM_FLOAT3 = 6;
renderer.PARAM_FLOAT4 = 7;
renderer.PARAM_COLOR3 = 8;
renderer.PARAM_COLOR4 = 9;
renderer.PARAM_MAT2 = 10;
renderer.PARAM_MAT3 = 11;
renderer.PARAM_MAT4 = 12;
renderer.PARAM_TEXTURE_2D = 13;
renderer.PARAM_TEXTURE_CUBE = 14;

// clear flags
renderer.CLEAR_COLOR = 1;
renderer.CLEAR_DEPTH = 2;
renderer.CLEAR_STENCIL = 4;

renderer.addStage = renderer.Config.addStage;

// ForwardRenderer adapter
var _p;

_p = renderer.ForwardRenderer.prototype;
_p._ctor = function(device, builtin) {
    this.init(device, builtin.programTemplates, builtin.defaultTexture, canvas.width, canvas.height);
};

// InputAssembler adapter
_p = renderer.InputAssembler.prototype;
_p._ctor = function(vb, ib, pt = gfx.PT_TRIANGLES) {
    this.init(vb, ib, pt);
};

cc.defineGetterSetter(_p, "_vertexBuffer", _p.getVertexBuffer, _p.setVertexBuffer);
cc.defineGetterSetter(_p, "_indexBuffer", _p.getIndexBuffer, _p.setIndexBuffer);
cc.defineGetterSetter(_p, "_primitiveType", _p.getPrimitiveType, _p.setPrimitiveType);
cc.defineGetterSetter(_p, "_start", _p.getStart, _p.setStart);
cc.defineGetterSetter(_p, "_count", _p.getCount, _p.setCount);


