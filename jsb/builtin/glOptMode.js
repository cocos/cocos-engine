var GL_COMMAND_ACTIVE_TEXTURE = 0;
var GL_COMMAND_ATTACH_SHADER = 1;
var GL_COMMAND_BIND_ATTRIB_LOCATION = 2;
var GL_COMMAND_BIND_BUFFER = 3;
var GL_COMMAND_BIND_FRAME_BUFFER = 4;
var GL_COMMAND_BIND_RENDER_BUFFER = 5;
var GL_COMMAND_BIND_TEXTURE = 6;
var GL_COMMAND_BLEND_COLOR = 7;
var GL_COMMAND_BLEND_EQUATION = 8;
var GL_COMMAND_BLEND_EQUATION_SEPARATE = 9;
var GL_COMMAND_BLEND_FUNC = 10;
var GL_COMMAND_BLEND_FUNC_SEPARATE = 11;
var GL_COMMAND_BUFFER_DATA = 12;
var GL_COMMAND_BUFFER_SUB_DATA = 13;
var GL_COMMAND_CLEAR = 14;
var GL_COMMAND_CLEAR_COLOR = 15;
var GL_COMMAND_CLEAR_DEPTH = 16;
var GL_COMMAND_CLEAR_STENCIL = 17;
var GL_COMMAND_COLOR_MASK = 18;
var GL_COMMAND_COMMIT = 19;
var GL_COMMAND_COMPILE_SHADER = 20;
var GL_COMMAND_COMPRESSED_TEX_IMAGE_2D = 21;
var GL_COMMAND_COMPRESSED_TEX_SUB_IMAGE_2D = 22;
var GL_COMMAND_COPY_TEX_IMAGE_2D = 23;
var GL_COMMAND_COPY_TEX_SUB_IMAGE_2D = 24;
var GL_COMMAND_CULL_FACE = 25;
var GL_COMMAND_DELETE_BUFFER = 26;
var GL_COMMAND_DELETE_FRAME_BUFFER = 27;
var GL_COMMAND_DELETE_PROGRAM = 28;
var GL_COMMAND_DELETE_RENDER_BUFFER = 29;
var GL_COMMAND_DELETE_SHADER = 30;
var GL_COMMAND_DELETE_TEXTURE = 31;
var GL_COMMAND_DEPTH_FUNC = 32;
var GL_COMMAND_DEPTH_MASK = 33;
var GL_COMMAND_DEPTH_RANGE = 34;
var GL_COMMAND_DETACH_SHADER = 35;
var GL_COMMAND_DISABLE = 36;
var GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY = 37;
var GL_COMMAND_DRAW_ARRAYS = 38;
var GL_COMMAND_DRAW_ELEMENTS = 39;
var GL_COMMAND_ENABLE = 40;
var GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY = 41;
var GL_COMMAND_FINISH = 42;
var GL_COMMAND_FLUSH = 43;
var GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER = 44;
var GL_COMMAND_FRAME_BUFFER_TEXTURE_2D = 45;
var GL_COMMAND_FRONT_FACE = 46;
var GL_COMMAND_GENERATE_MIPMAP = 47;
var GL_COMMAND_HINT = 48;
var GL_COMMAND_LINE_WIDTH = 49;
var GL_COMMAND_LINK_PROGRAM = 50;
var GL_COMMAND_PIXEL_STOREI = 51;
var GL_COMMAND_POLYGON_OFFSET = 52;
var GL_COMMAND_RENDER_BUFFER_STORAGE = 53;
var GL_COMMAND_SAMPLE_COVERAGE = 54;
var GL_COMMAND_SCISSOR = 55;
var GL_COMMAND_SHADER_SOURCE = 56;
var GL_COMMAND_STENCIL_FUNC = 57;
var GL_COMMAND_STENCIL_FUNC_SEPARATE = 58;
var GL_COMMAND_STENCIL_MASK = 59;
var GL_COMMAND_STENCIL_MASK_SEPARATE = 60;
var GL_COMMAND_STENCIL_OP = 61;
var GL_COMMAND_STENCIL_OP_SEPARATE = 62;
var GL_COMMAND_TEX_IMAGE_2D = 63;
var GL_COMMAND_TEX_PARAMETER_F = 64;
var GL_COMMAND_TEX_PARAMETER_I = 65;
var GL_COMMAND_TEX_SUB_IMAGE_2D = 66;
var GL_COMMAND_UNIFORM_1F = 67;
var GL_COMMAND_UNIFORM_1FV = 68;
var GL_COMMAND_UNIFORM_1I = 69;
var GL_COMMAND_UNIFORM_1IV = 70;
var GL_COMMAND_UNIFORM_2F = 71;
var GL_COMMAND_UNIFORM_2FV = 72;
var GL_COMMAND_UNIFORM_2I = 73;
var GL_COMMAND_UNIFORM_2IV = 74;
var GL_COMMAND_UNIFORM_3F = 75;
var GL_COMMAND_UNIFORM_3FV = 76;
var GL_COMMAND_UNIFORM_3I = 77;
var GL_COMMAND_UNIFORM_3IV = 78;
var GL_COMMAND_UNIFORM_4F = 79;
var GL_COMMAND_UNIFORM_4FV = 80;
var GL_COMMAND_UNIFORM_4I = 81;
var GL_COMMAND_UNIFORM_4IV = 82;
var GL_COMMAND_UNIFORM_MATRIX_2FV = 83;
var GL_COMMAND_UNIFORM_MATRIX_3FV = 84;
var GL_COMMAND_UNIFORM_MATRIX_4FV = 85;
var GL_COMMAND_USE_PROGRAM = 86;
var GL_COMMAND_VALIDATE_PROGRAM = 87;
var GL_COMMAND_VERTEX_ATTRIB_1F = 88;
var GL_COMMAND_VERTEX_ATTRIB_2F = 89;
var GL_COMMAND_VERTEX_ATTRIB_3F = 90;
var GL_COMMAND_VERTEX_ATTRIB_4F = 91;
var GL_COMMAND_VERTEX_ATTRIB_1FV = 92;
var GL_COMMAND_VERTEX_ATTRIB_2FV = 93;
var GL_COMMAND_VERTEX_ATTRIB_3FV = 94;
var GL_COMMAND_VERTEX_ATTRIB_4FV = 95;
var GL_COMMAND_VERTEX_ATTRIB_POINTER = 96;
var GL_COMMAND_VIEW_PORT = 97;

const gl = __ccgl;

// _gl save the orignal gl functions.
var _gl = {};
for (var k in gl) {
    _gl[k] = gl[k];
}

var total_size = 100000;
var next_index = 0;
var buffer_data;

// Batch GL commands is enabled by default.
function batchGLCommandsToNative() {
    if (gl._flushCommands) {
        if (isSupportTypeArray()) {
            console.log('Enable batch GL commands optimization!');
            attachMethodOpt();
            buffer_data = new Float32Array(total_size);
        }
        else {
            console.log(`Disable batch GL commands, TypedArray Native API isn't supported!`);
        }
    }
    else {
        console.log(`Disable batch GL commands, _flushCommands isn't binded!`);
    }
}

function disableBatchGLCommandsToNative() {
    // Reset __ccgl variable to the default one.
    flushCommands();
    for (var k in _gl) {
        __ccgl[k] = _gl[k];
    }
    console.log('Disable batch GL commands optimization！');
}

function flushCommands() {
    if (next_index > 0) {
        gl._flushCommands(next_index, buffer_data);
        next_index = 0;
    }
}

function activeTextureOpt(texture) {
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_ACTIVE_TEXTURE;
    buffer_data[next_index + 1] = texture;
    next_index += 2;
}

function attachShaderOpt(program, shader) {
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_ATTACH_SHADER;
    buffer_data[next_index + 1] = program ? program._id : 0;
    buffer_data[next_index + 2] = shader ? shader._id : 0;
    next_index += 3;
}

function bindAttribLocationOpt(program, index, name) {
    flushCommands();
    _gl.bindAttribLocation(program, index, name);
}

function bindBufferOpt(target, buffer) {
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = buffer ? buffer._id : 0;
    next_index += 3;
}

function bindFramebufferOpt(target, framebuffer) {
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_FRAME_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = framebuffer ? framebuffer._id : 0;
    next_index += 3;
}

function bindRenderbufferOpt(target, renderbuffer) {
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_RENDER_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = renderbuffer ? renderbuffer._id : 0;
    next_index += 3;
}

function bindTextureOpt(target, texture) {
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_TEXTURE;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = texture ? texture._id : 0;
    next_index += 3;
}

function blendColorOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_COLOR;
    buffer_data[next_index + 1] = red;
    buffer_data[next_index + 2] = green;
    buffer_data[next_index + 3] = blue;
    buffer_data[next_index + 4] = alpha;
    next_index += 5;
}

function blendEquationOpt(mode) {
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_EQUATION;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}

function blendEquationSeparateOpt(modeRGB, modeAlpha) {
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_EQUATION_SEPARATE;
    buffer_data[next_index + 1] = modeRGB;
    buffer_data[next_index + 2] = modeAlpha;
    next_index += 3;
}

function blendFuncOpt(sfactor, dfactor) {
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_FUNC;
    buffer_data[next_index + 1] = sfactor;
    buffer_data[next_index + 2] = dfactor;
    next_index += 3;
}

function blendFuncSeparateOpt(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    if (next_index + 5 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_FUNC_SEPARATE;
    buffer_data[next_index + 1] = srcRGB;
    buffer_data[next_index + 2] = dstRGB;
    buffer_data[next_index + 3] = srcAlpha;
    buffer_data[next_index + 4] = dstAlpha;
    next_index += 5;
}

function bufferDataOpt(target, data, usage) {
    flushCommands();
    _gl.bufferData(target, data, usage);
}

function bufferSubDataOpt(target, offset, data) {
    flushCommands();
    _gl.bufferSubData(target, offset, data);
}

function checkFramebufferStatusOpt(target) {
    flushCommands();
    return _gl.checkFramebufferStatus(target);
}

function clearOpt(mask) {
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR;
    buffer_data[next_index + 1] = mask;
    next_index += 2;
}

function clearColorOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_COLOR;
    buffer_data[next_index + 1] = red;
    buffer_data[next_index + 2] = green;
    buffer_data[next_index + 3] = blue;
    buffer_data[next_index + 4] = alpha;
    next_index += 5;
}

function clearDepthOpt(depth) {
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_DEPTH;
    buffer_data[next_index + 1] = depth;
    next_index += 2;
}

function clearStencilOpt(s) {
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_STENCIL;
    buffer_data[next_index + 1] = s;
    next_index += 2;
}

function colorMaskOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_COLOR_MASK;
    buffer_data[next_index + 1] = red ? 1 : 0;
    buffer_data[next_index + 2] = green ? 1 : 0;
    buffer_data[next_index + 3] = blue ? 1 : 0;
    buffer_data[next_index + 4] = alpha ? 1 : 0;
    next_index += 5;
}

function compileShaderOpt(shader) {
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_COMPILE_SHADER;
    buffer_data[next_index + 1] = shader ? shader._id : 0;
    next_index += 2;
}

function compressedTexImage2DOpt(target, level, internalformat, width, height, border, data) {
    flushCommands();
    _gl.compressedTexImage2D(target, level, internalformat, width, height, border, data);
}

function compressedTexSubImage2DOpt(target, level, xoffset, yoffset, width, height, format, data) {
    flushCommands();
    _gl.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data);
}

function copyTexImage2DOpt(target, level, internalformat, x, y, width, height, border) {
    if (next_index + 9 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_COPY_TEX_IMAGE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = level;
    buffer_data[next_index + 3] = internalformat;
    buffer_data[next_index + 4] = x;
    buffer_data[next_index + 5] = y;
    buffer_data[next_index + 6] = width;
    buffer_data[next_index + 7] = height;
    buffer_data[next_index + 8] = border;
    next_index += 9;
}

function copyTexSubImage2DOpt(target, level, xoffset, yoffset, x, y, width, height) {
    if (next_index + 9 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_COPY_TEX_SUB_IMAGE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = level;
    buffer_data[next_index + 3] = xoffset;
    buffer_data[next_index + 4] = yoffset;
    buffer_data[next_index + 5] = x;
    buffer_data[next_index + 6] = y;
    buffer_data[next_index + 7] = width;
    buffer_data[next_index + 8] = height;
    next_index += 9;
}

function createBufferOpt() {
    flushCommands();
    return _gl.createBuffer();
}

function createFramebufferOpt() {
    flushCommands();
    return _gl.createFramebuffer();
}

function createProgramOpt() {
    flushCommands();
    return _gl.createProgram();
}

function createRenderbufferOpt() {
    flushCommands();
    return _gl.createRenderbuffer();
}

function createShaderOpt(type) {
    flushCommands();
    return _gl.createShader(type);
}

function createTextureOpt() {
    flushCommands();
    return _gl.createTexture();
}

function cullFaceOpt(mode) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CULL_FACE;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}

function deleteBufferOpt(buffer) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_BUFFER;
    buffer_data[next_index + 1] = buffer ? buffer._id : 0;
    next_index += 2;
}

function deleteFramebufferOpt(framebuffer) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_FRAME_BUFFER;
    buffer_data[next_index + 1] = framebuffer ? framebuffer._id : 0;
    next_index += 2;
}

function deleteProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_PROGRAM;
    buffer_data[next_index + 1] = program ? program._id : 0;
    next_index += 2;
}

function deleteRenderbufferOpt(renderbuffer) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_RENDER_BUFFER;
    buffer_data[next_index + 1] = renderbuffer ? renderbuffer._id : 0;
    next_index += 2;
}

function deleteShaderOpt(shader) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_SHADER;
    buffer_data[next_index + 1] = shader ? shader._id : 0;
    next_index += 2;
}

function deleteTextureOpt(texture) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_TEXTURE;
    buffer_data[next_index + 1] = texture ? texture._id : 0;
    next_index += 2;
}

function depthFuncOpt(func) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_FUNC;
    buffer_data[next_index + 1] = func;
    next_index += 2;
}

function depthMaskOpt(flag) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_MASK;
    buffer_data[next_index + 1] = flag ? 1 : 0;
    next_index += 2;
}

function depthRangeOpt(zNear, zFar) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_RANGE;
    buffer_data[next_index + 1] = zNear;
    buffer_data[next_index + 1] = zFar;
    next_index += 3;
}

function detachShaderOpt(program, shader) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DETACH_SHADER;
    buffer_data[next_index + 1] = program ? program._id : 0;
    buffer_data[next_index + 1] = shader ? shader._id : 0;
    next_index += 3;
}

function disableOpt(cap) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DISABLE;
    buffer_data[next_index + 1] = cap;
    next_index += 2;
}

function disableVertexAttribArrayOpt(index) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY;
    buffer_data[next_index + 1] = index;
    next_index += 2;
}

function drawArraysOpt(mode, first, count) {
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DRAW_ARRAYS;
    buffer_data[next_index + 1] = mode;
    buffer_data[next_index + 2] = first;
    buffer_data[next_index + 3] = count;
    next_index += 4;
}

function drawElementsOpt(mode, count, type, offset) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DRAW_ELEMENTS;
    buffer_data[next_index + 1] = mode;
    buffer_data[next_index + 2] = count;
    buffer_data[next_index + 3] = type;
    buffer_data[next_index + 4] = offset ? offset : 0;
    next_index += 5;
}

function enableOpt(cap) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_ENABLE;
    buffer_data[next_index + 1] = cap;
    next_index += 2;
}

function enableVertexAttribArrayOpt(index) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY;
    buffer_data[next_index + 1] = index;
    next_index += 2;
}

function finishOpt() {
    if (next_index + 1 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FINISH;
    next_index += 1;
}

function flushOpt() {
    if (next_index + 1 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FLUSH;
    next_index += 1;
}

function framebufferRenderbufferOpt(target, attachment, renderbuffertarget, renderbuffer) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = attachment;
    buffer_data[next_index + 3] = renderbuffertarget;
    buffer_data[next_index + 4] = renderbuffer ? renderbuffer._id : 0;
    next_index += 5;
}

function framebufferTexture2DOpt(target, attachment, textarget, texture, level) {
    if (next_index + 6 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FRAME_BUFFER_TEXTURE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = attachment;
    buffer_data[next_index + 3] = textarget;
    buffer_data[next_index + 4] = texture ? texture._id : 0;
    buffer_data[next_index + 5] = level;
    next_index += 6;
}

function frontFaceOpt(mode) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FRONT_FACE;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}

function generateMipmapOpt(target) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_GENERATE_MIPMAP;
    buffer_data[next_index + 1] = target;
    next_index += 2;
}

function getActiveAttribOpt(program, index) {
    flushCommands();
    return _gl.getActiveAttrib(program, index);
}

function getActiveUniformOpt(program, index) {
    flushCommands();
    return _gl.getActiveUniform(program, index);
}

function getAttachedShadersOpt(program) {
    flushCommands();
    return _gl.getAttachedShaders(program);
}

function getAttribLocationOpt(program, name) {
    flushCommands();
    return _gl.getAttribLocation(program, name);
}

function getBufferParameterOpt(target, pname) {
    flushCommands();
    return _gl.getBufferParameter(target, pname);
}

function getParameterOpt(pname) {
    flushCommands();
    return _gl.getParameter(pname);
}

function getErrorOpt() {
    flushCommands();
    return _gl.getError();
}

function getFramebufferAttachmentParameterOpt(target, attachment, pname) {
    flushCommands();
    return _gl.getFramebufferAttachmentParameter(target, attachment, pname);
}

function getProgramParameterOpt(program, pname) {
    flushCommands();
    return _gl.getProgramParameter(program, pname);
}

function getProgramInfoLogOpt(program) {
    flushCommands();
    return _gl.getProgramInfoLog(program);
}

function getRenderbufferParameterOpt(target, pname) {
    flushCommands();
    return _gl.getRenderbufferParameter(target, pname);
}

function getShaderParameterOpt(shader, pname) {
    flushCommands();
    return _gl.getShaderParameter(shader, pname);
}

function getShaderPrecisionFormatOpt(shadertype, precisiontype) {
    flushCommands();
    return _gl.getShaderPrecisionFormat(shadertype, precisiontype);
}

function getShaderInfoLogOpt(shader) {
    flushCommands();
    return _gl.getShaderInfoLog(shader);
}

function getShaderSourceOpt(shader) {
    flushCommands();
    return _gl.getShaderSource(shader);
}

function getTexParameterOpt(target, pname) {
    flushCommands();
    return _gl.getTexParameter(target, pname);
}

function getUniformOpt(program, location) {
    flushCommands();
    return _gl.getUniform(program, location);
}

function getUniformLocationOpt(program, name) {
    flushCommands();
    return _gl.getUniformLocation(program, name);
}

function getVertexAttribOpt(index, pname) {
    flushCommands();
    return _gl.getVertexAttrib(index, pname);
}

function getVertexAttribOffsetOpt(index, pname) {
    flushCommands();
    return _gl.getVertexAttribOffset(index, pname);
}

function hintOpt(target, mode) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_HINT;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = mode;
    next_index += 3;
}

function isBufferOpt(buffer) {
    flushCommands();
    return _gl.isBuffer(buffer);
}

function isEnabledOpt(cap) {
    flushCommands();
    return _gl.isEnabled(cap);
}

function isFramebufferOpt(framebuffer) {
    flushCommands();
    return _gl.isFramebuffer(framebuffer);
}

function isProgramOpt(program) {
    flushCommands();
    return _gl.isProgram(program);
}

function isRenderbufferOpt(renderbuffer) {
    flushCommands();
    return _gl.isRenderbuffer(renderbuffer);
}

function isShaderOpt(shader) {
    flushCommands();
    return _gl.isShader(shader);
}

function isTextureOpt(texture) {
    flushCommands();
    return _gl.isTexture(texture);
}

function lineWidthOpt(width) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_LINE_WIDTH;
    buffer_data[next_index + 1] = width;
    next_index += 2;
}

function linkProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_LINK_PROGRAM;
    buffer_data[next_index + 1] = program ? program._id : 0;
    next_index += 2;
}

function pixelStoreiOpt(pname, param) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_PIXEL_STOREI;
    buffer_data[next_index + 1] = pname;
    buffer_data[next_index + 2] = param;
    next_index += 3;
}

function polygonOffsetOpt(factor, units) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_POLYGON_OFFSET;
    buffer_data[next_index + 1] = factor;
    buffer_data[next_index + 2] = units;
    next_index += 3;
}

function readPixelsOpt(x, y, width, height, format, type, pixels) {
    flushCommands();
    _gl.readPixels(x, y, width, height, format, type, pixels);
}

function renderbufferStorageOpt(target, internalFormat, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_RENDER_BUFFER_STORAGE;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = internalFormat;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}

function sampleCoverageOpt(value, invert) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_SAMPLE_COVERAGE;
    buffer_data[next_index + 1] = value;
    buffer_data[next_index + 2] = invert ? 1 : 0;
    next_index += 3;
}

function scissorOpt(x, y, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_SCISSOR;
    buffer_data[next_index + 1] = x;
    buffer_data[next_index + 2] = y;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}

function shaderSourceOpt(shader, source) {
    flushCommands();
    _gl.shaderSource(shader, source);
}

function stencilFuncOpt(func, ref, mask) {
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_FUNC;
    buffer_data[next_index + 1] = func;
    buffer_data[next_index + 2] = ref;
    buffer_data[next_index + 3] = mask;
    next_index += 4;
}

function stencilFuncSeparateOpt(face, func, ref, mask) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_FUNC_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = func;
    buffer_data[next_index + 3] = ref;
    buffer_data[next_index + 4] = mask;
    next_index += 5;
}

function stencilMaskOpt(mask) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_MASK;
    buffer_data[next_index + 1] = mask;
    next_index += 2;
}

function stencilMaskSeparateOpt(face, mask) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_MASK_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = mask;
    next_index += 3;
}

function stencilOpOpt(fail, zfail, zpass) {
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_OP;
    buffer_data[next_index + 1] = fail;
    buffer_data[next_index + 2] = zfail;
    buffer_data[next_index + 3] = zpass;
    next_index += 4;
}

function stencilOpSeparateOpt(face, fail, zfail, zpass) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_OP_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = fail;
    buffer_data[next_index + 3] = zfail;
    buffer_data[next_index + 4] = zpass;
    next_index += 5;
}

function texImage2DOpt() {
    flushCommands();
    var argCount = arguments.length;
    if (argCount === 6) {
        _gl.texImage2D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    }
    else if (argCount === 9) {
        _gl.texImage2D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
    }
    else {
        console.log(`texImage2DOpt: Wrong number of arguments, expected 6 or 9 but got ${argCount}`);
    }
}

function texParameterfOpt(target, pname, param) {
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_TEX_PARAMETER_F;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = pname;
    buffer_data[next_index + 3] = param;
    next_index += 4;
}

function texParameteriOpt(target, pname, param) {
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_TEX_PARAMETER_I;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = pname;
    buffer_data[next_index + 3] = param;
    next_index += 4;
}

function texSubImage2DOpt(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    flushCommands();
    var argCount = arguments.length;
    if (argCount === 7) {
        _gl.texSubImage2D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
    }
    else if (argCount === 9) {
        _gl.texSubImage2D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
    }
    else {
        console.log(`texSubImage2DOpt: Wrong number of arguments, expected 7 or 9 but got ${argCount}`);
    }
}

function uniform1fOpt(location, x) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}

function uniform2fOpt(location, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}

function uniform3fOpt(location, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}

function uniform4fOpt(location, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}

function uniform1iOpt(location, x) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}

function uniform2iOpt(location, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}

function uniform3iOpt(location, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}

function uniform4iOpt(location, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}

function uniform1fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function uniform2fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function uniform3fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function uniform4fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function uniform1ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function uniform2ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function uniform3ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function uniform4ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function uniformMatrix2fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_2FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}

function uniformMatrix3fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_3FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}

function uniformMatrix4fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_4FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}

function useProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_USE_PROGRAM;
    buffer_data[next_index + 1] = program ? program._id : 0;
    next_index += 2;
}

function validateProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VALIDATE_PROGRAM;
    buffer_data[next_index + 1] = program ? program._id : 0;
    next_index += 2;
}

function vertexAttrib1fOpt(index, x) {
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_1F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}

function vertexAttrib2fOpt(index, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_2F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}

function vertexAttrib3fOpt(index, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_3F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}

function vertexAttrib4fOpt(index, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_4F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}

function vertexAttrib1fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_1FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function vertexAttrib2fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_2FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function vertexAttrib3fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_3FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function vertexAttrib4fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_4FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}

function vertexAttribPointerOpt(index, size, type, normalized, stride, offset) {
    if (next_index + 7 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_POINTER;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = size;
    buffer_data[next_index + 3] = type;
    buffer_data[next_index + 4] = normalized ? 1 : 0;
    buffer_data[next_index + 5] = stride;
    buffer_data[next_index + 6] = offset;
    next_index += 7;
}

function viewportOpt(x, y, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VIEW_PORT;
    buffer_data[next_index + 1] = x;
    buffer_data[next_index + 2] = y;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}

function isSupportTypeArray() {
    //FIXME:
    // if (GameStatusInfo.platform == 'android') {
        return true;
    // }
    // var info = BK.Director.queryDeviceInfo();
    // var vers = info.version.split('.');
    // if (info.platform == 'ios' && Number(vers[0]) >= 10) {
    //     return true;
    // }
    // return false;
}

function attachMethodOpt() {
    gl.activeTexture = activeTextureOpt;
    gl.attachShader = attachShaderOpt;
    gl.bindAttribLocation = bindAttribLocationOpt;
    gl.bindBuffer = bindBufferOpt;
    gl.bindFramebuffer = bindFramebufferOpt;
    gl.bindRenderbuffer = bindRenderbufferOpt;
    gl.bindTexture = bindTextureOpt;
    gl.blendColor = blendColorOpt;
    gl.blendEquation = blendEquationOpt;
    gl.blendEquationSeparate = blendEquationSeparateOpt;
    gl.blendFunc = blendFuncOpt;
    gl.blendFuncSeparate = blendFuncSeparateOpt;
    gl.bufferData = bufferDataOpt;
    gl.bufferSubData = bufferSubDataOpt;
    gl.checkFramebufferStatus = checkFramebufferStatusOpt;
    gl.clear = clearOpt;
    gl.clearColor = clearColorOpt;
    gl.clearDepth = clearDepthOpt;
    gl.clearStencil = clearStencilOpt;
    gl.colorMask = colorMaskOpt;
    gl.compileShader = compileShaderOpt;
    gl.compressedTexImage2D = compressedTexImage2DOpt;
    gl.compressedTexSubImage2D = compressedTexSubImage2DOpt;
    gl.copyTexImage2D = copyTexImage2DOpt;
    gl.copyTexSubImage2D = copyTexSubImage2DOpt;
    gl.createBuffer = createBufferOpt;
    gl.createFramebuffer = createFramebufferOpt;
    gl.createProgram = createProgramOpt;
    gl.createRenderbuffer = createRenderbufferOpt;
    gl.createShader = createShaderOpt;
    gl.createTexture = createTextureOpt;
    gl.cullFace = cullFaceOpt;
    gl.deleteBuffer = deleteBufferOpt;
    gl.deleteFramebuffer = deleteFramebufferOpt;
    gl.deleteProgram = deleteProgramOpt;
    gl.deleteRenderbuffer = deleteRenderbufferOpt;
    gl.deleteShader = deleteShaderOpt;
    gl.deleteTexture = deleteTextureOpt;
    gl.depthFunc = depthFuncOpt;
    gl.depthMask = depthMaskOpt;
    gl.depthRange = depthRangeOpt;
    gl.detachShader = detachShaderOpt;
    gl.disable = disableOpt;
    gl.disableVertexAttribArray = disableVertexAttribArrayOpt;
    gl.drawArrays = drawArraysOpt;
    gl.drawElements = drawElementsOpt;
    gl.enable = enableOpt;
    gl.enableVertexAttribArray = enableVertexAttribArrayOpt;
    gl.finish = finishOpt;
    gl.flush = flushOpt;
    gl.framebufferRenderbuffer = framebufferRenderbufferOpt;
    gl.framebufferTexture2D = framebufferTexture2DOpt;
    gl.frontFace = frontFaceOpt;
    gl.generateMipmap = generateMipmapOpt;
    gl.getActiveAttrib = getActiveAttribOpt;
    gl.getActiveUniform = getActiveUniformOpt;
    gl.getAttachedShaders = getAttachedShadersOpt;
    gl.getAttribLocation = getAttribLocationOpt;
    gl.getBufferParameter = getBufferParameterOpt;
    gl.getParameter = getParameterOpt;
    gl.getError = getErrorOpt;
    gl.getFramebufferAttachmentParameter = getFramebufferAttachmentParameterOpt;
    gl.getProgramParameter = getProgramParameterOpt;
    gl.getProgramInfoLog = getProgramInfoLogOpt;
    gl.getRenderbufferParameter = getRenderbufferParameterOpt;
    gl.getShaderParameter = getShaderParameterOpt;
    gl.getShaderPrecisionFormat = getShaderPrecisionFormatOpt;
    gl.getShaderInfoLog = getShaderInfoLogOpt;
    gl.getShaderSource = getShaderSourceOpt;
    gl.getTexParameter = getTexParameterOpt;
    gl.getUniform = getUniformOpt;
    gl.getUniformLocation = getUniformLocationOpt;
    gl.getVertexAttrib = getVertexAttribOpt;
    gl.getVertexAttribOffset = getVertexAttribOffsetOpt;
    gl.hint = hintOpt;
    gl.isBuffer = isBufferOpt;
    gl.isEnabled = isEnabledOpt;
    gl.isFramebuffer = isFramebufferOpt;
    gl.isProgram = isProgramOpt;
    gl.isRenderbuffer = isRenderbufferOpt;
    gl.isShader = isShaderOpt;
    gl.isTexture = isTextureOpt;
    gl.lineWidth = lineWidthOpt;
    gl.linkProgram = linkProgramOpt;
    gl.pixelStorei = pixelStoreiOpt;
    gl.polygonOffset = polygonOffsetOpt;
    gl.readPixels = readPixelsOpt;
    gl.renderbufferStorage = renderbufferStorageOpt;
    gl.sampleCoverage = sampleCoverageOpt;
    gl.scissor = scissorOpt;
    gl.shaderSource = shaderSourceOpt;
    gl.stencilFunc = stencilFuncOpt;
    gl.stencilFuncSeparate = stencilFuncSeparateOpt;
    gl.stencilMask = stencilMaskOpt;
    gl.stencilMaskSeparate = stencilMaskSeparateOpt;
    gl.stencilOp = stencilOpOpt;
    gl.stencilOpSeparate = stencilOpSeparateOpt;
    gl.texImage2D = texImage2DOpt;
    gl.texParameterf = texParameterfOpt;
    gl.texParameteri = texParameteriOpt;
    gl.texSubImage2D = texSubImage2DOpt;
    gl.uniform1f = uniform1fOpt;
    gl.uniform2f = uniform2fOpt;
    gl.uniform3f = uniform3fOpt;
    gl.uniform4f = uniform4fOpt;
    gl.uniform1i = uniform1iOpt;
    gl.uniform2i = uniform2iOpt;
    gl.uniform3i = uniform3iOpt;
    gl.uniform4i = uniform4iOpt;
    gl.uniform1fv = uniform1fvOpt;
    gl.uniform2fv = uniform2fvOpt;
    gl.uniform3fv = uniform3fvOpt;
    gl.uniform4fv = uniform4fvOpt;
    gl.uniform1iv = uniform1ivOpt;
    gl.uniform2iv = uniform2ivOpt;
    gl.uniform3iv = uniform3ivOpt;
    gl.uniform4iv = uniform4ivOpt;
    gl.uniformMatrix2fv = uniformMatrix2fvOpt;
    gl.uniformMatrix3fv = uniformMatrix3fvOpt;
    gl.uniformMatrix4fv = uniformMatrix4fvOpt;
    gl.useProgram = useProgramOpt;
    gl.validateProgram = validateProgramOpt;
    gl.vertexAttrib1f = vertexAttrib1fOpt;
    gl.vertexAttrib2f = vertexAttrib2fOpt;
    gl.vertexAttrib3f = vertexAttrib3fOpt;
    gl.vertexAttrib4f = vertexAttrib4fOpt;
    gl.vertexAttrib1fv = vertexAttrib1fvOpt;
    gl.vertexAttrib2fv = vertexAttrib2fvOpt;
    gl.vertexAttrib3fv = vertexAttrib3fvOpt;
    gl.vertexAttrib4fv = vertexAttrib4fvOpt;
    gl.vertexAttribPointer = vertexAttribPointerOpt;
    gl.viewport = viewportOpt;
}

batchGLCommandsToNative();

module.exports = {
    disableBatchGLCommandsToNative: disableBatchGLCommandsToNative,
    flushCommands: flushCommands
}