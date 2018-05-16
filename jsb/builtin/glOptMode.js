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
var commandCount = 0;

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
    jsb.disableBatchGLCommandsToNative();
}

function flushCommands() {
    if (next_index > 0) {
        gl._flushCommands(next_index, buffer_data, commandCount);
        next_index = 0;
        commandCount = 0;
    }
}

function activeTextureOpt(texture) {
    // console.log('GLOpt: activeTexture');
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_ACTIVE_TEXTURE;
    buffer_data[next_index + 1] = texture;
    next_index += 2;
    ++commandCount;
}

function attachShaderOpt(program, shader) {
    // console.log('GLOpt: attachShader');
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_ATTACH_SHADER;
    buffer_data[next_index + 1] = program ? program._id : 0;
    buffer_data[next_index + 2] = shader ? shader._id : 0;
    next_index += 3;
    ++commandCount;
}

function bindAttribLocationOpt(program, index, name) {
    // console.log('GLOpt: bindAttribLocation');
    flushCommands();
    _gl.bindAttribLocation(program, index, name);
}

function bindBufferOpt(target, buffer) {
    // console.log('GLOpt: bindBuffer: ' + (buffer? buffer._id : null));
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = buffer ? buffer._id : 0;
    next_index += 3;
    ++commandCount;
}

function bindFramebufferOpt(target, framebuffer) {
    // console.log('GLOpt: bindFramebuffer');
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_FRAME_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = framebuffer ? framebuffer._id : 0;
    next_index += 3;
    ++commandCount;
}

function bindRenderbufferOpt(target, renderbuffer) {
    // console.log('GLOpt: bindRenderbuffer');
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_RENDER_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = renderbuffer ? renderbuffer._id : 0;
    next_index += 3;
    ++commandCount;
}

function bindTextureOpt(target, texture) {
    // console.log('GLOpt: bindTexture');
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_TEXTURE;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = texture ? texture._id : 0;
    next_index += 3;
    ++commandCount;
}

function blendColorOpt(red, green, blue, alpha) {
    // console.log('GLOpt: blendColor');
    if (next_index + 5 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_COLOR;
    buffer_data[next_index + 1] = red;
    buffer_data[next_index + 2] = green;
    buffer_data[next_index + 3] = blue;
    buffer_data[next_index + 4] = alpha;
    next_index += 5;
    ++commandCount;
}

function blendEquationOpt(mode) {
    // console.log('GLOpt: blendEquation');
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_EQUATION;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
    ++commandCount;
}

function blendEquationSeparateOpt(modeRGB, modeAlpha) {
    // console.log('GLOpt: blendEquationSeparate');
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_EQUATION_SEPARATE;
    buffer_data[next_index + 1] = modeRGB;
    buffer_data[next_index + 2] = modeAlpha;
    next_index += 3;
    ++commandCount;
}

function blendFuncOpt(sfactor, dfactor) {
    // console.log('GLOpt: blendFunc');
    if (next_index + 3 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_FUNC;
    buffer_data[next_index + 1] = sfactor;
    buffer_data[next_index + 2] = dfactor;
    next_index += 3;
    ++commandCount;
}

function blendFuncSeparateOpt(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    // console.log('GLOpt: blendFuncSeparate');
    if (next_index + 5 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_FUNC_SEPARATE;
    buffer_data[next_index + 1] = srcRGB;
    buffer_data[next_index + 2] = dstRGB;
    buffer_data[next_index + 3] = srcAlpha;
    buffer_data[next_index + 4] = dstAlpha;
    next_index += 5;
    ++commandCount;
}

function bufferDataOpt(target, data, usage) {
    flushCommands();
    // console.log('GLOpt: bufferData');
    _gl.bufferData(target, data, usage);
}

function bufferSubDataOpt(target, offset, data) {
    flushCommands();
    // console.log('GLOpt: bufferSubData');
    _gl.bufferSubData(target, offset, data);
}

function checkFramebufferStatusOpt(target) {
    flushCommands();
    // console.log('GLOpt: checkFramebufferStatus');
    return _gl.checkFramebufferStatus(target);
}

function clearOpt(mask) {
    // console.log('GLOpt: clear');
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR;
    buffer_data[next_index + 1] = mask;
    next_index += 2;
    ++commandCount;
}

function clearColorOpt(red, green, blue, alpha) {
    // console.log('GLOpt: clearColor');
    if (next_index + 5 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_COLOR;
    buffer_data[next_index + 1] = red;
    buffer_data[next_index + 2] = green;
    buffer_data[next_index + 3] = blue;
    buffer_data[next_index + 4] = alpha;
    next_index += 5;
    ++commandCount;
}

function clearDepthOpt(depth) {
    // console.log('GLOpt: clearDepth');
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_DEPTH;
    buffer_data[next_index + 1] = depth;
    next_index += 2;
    ++commandCount;
}

function clearStencilOpt(s) {
    // console.log('GLOpt: clearStencil');
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_STENCIL;
    buffer_data[next_index + 1] = s;
    next_index += 2;
    ++commandCount;
}

function colorMaskOpt(red, green, blue, alpha) {
    // console.log('GLOpt: colorMask');
    if (next_index + 5 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_COLOR_MASK;
    buffer_data[next_index + 1] = red ? 1 : 0;
    buffer_data[next_index + 2] = green ? 1 : 0;
    buffer_data[next_index + 3] = blue ? 1 : 0;
    buffer_data[next_index + 4] = alpha ? 1 : 0;
    next_index += 5;
    ++commandCount;
}

function compileShaderOpt(shader) {
    // console.log('GLOpt: compileShader');
    if (next_index + 2 > total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_COMPILE_SHADER;
    buffer_data[next_index + 1] = shader ? shader._id : 0;
    next_index += 2;
    ++commandCount;
}

function compressedTexImage2DOpt(target, level, internalformat, width, height, border, data) {
    // console.log('GLOpt: compressedTexImage2D');
    flushCommands();
    _gl.compressedTexImage2D(target, level, internalformat, width, height, border, data);
}

function compressedTexSubImage2DOpt(target, level, xoffset, yoffset, width, height, format, data) {
    // console.log('GLOpt: compressedTexSubImage2D');
    flushCommands();
    _gl.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data);
}

function copyTexImage2DOpt(target, level, internalformat, x, y, width, height, border) {
    // console.log('GLOpt: copyTexImage2D');
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
    ++commandCount;
}

function copyTexSubImage2DOpt(target, level, xoffset, yoffset, x, y, width, height) {
    // console.log('GLOpt: copyTexSubImage2D');
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
    ++commandCount;
}

function createBufferOpt() {
    flushCommands();

    var ret = _gl.createBuffer();
    // console.log('GLOpt: createBuffer: ' + ret._id);
    return ret;
}

function createFramebufferOpt() {
    flushCommands();
    // console.log('GLOpt: createFramebuffer');
    return _gl.createFramebuffer();
}

function createProgramOpt() {
    flushCommands();
    // console.log('GLOpt: createProgram');
    return _gl.createProgram();
}

function createRenderbufferOpt() {
    flushCommands();
    // console.log('GLOpt: createRenderbuffer');
    return _gl.createRenderbuffer();
}

function createShaderOpt(type) {
    // console.log('GLOpt: createShader');
    flushCommands();
    return _gl.createShader(type);
}

function createTextureOpt() {
    flushCommands();
    // console.log('GLOpt: createTexture');
    return _gl.createTexture();
}

function cullFaceOpt(mode) {
    // console.log('GLOpt: cullFace');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_CULL_FACE;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
    ++commandCount;
}

function deleteBufferOpt(buffer) {
    // console.log('GLOpt: deleteBuffer');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_BUFFER;
    buffer_data[next_index + 1] = buffer ? buffer._id : 0;
    next_index += 2;
    ++commandCount;
}

function deleteFramebufferOpt(framebuffer) {
    // console.log('GLOpt: deleteFramebuffer');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_FRAME_BUFFER;
    buffer_data[next_index + 1] = framebuffer ? framebuffer._id : 0;
    next_index += 2;
    ++commandCount;
}

function deleteProgramOpt(program) {
    // console.log('GLOpt: deleteProgram');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_PROGRAM;
    buffer_data[next_index + 1] = program ? program._id : 0;
    next_index += 2;
    ++commandCount;
}

function deleteRenderbufferOpt(renderbuffer) {
    // console.log('GLOpt: deleteRenderbuffer');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_RENDER_BUFFER;
    buffer_data[next_index + 1] = renderbuffer ? renderbuffer._id : 0;
    next_index += 2;
    ++commandCount;
}

function deleteShaderOpt(shader) {
    // console.log('GLOpt: deleteShader');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_SHADER;
    buffer_data[next_index + 1] = shader ? shader._id : 0;
    next_index += 2;
    ++commandCount;
}

function deleteTextureOpt(texture) {
    // console.log('GLOpt: deleteTexture');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_TEXTURE;
    buffer_data[next_index + 1] = texture ? texture._id : 0;
    next_index += 2;
    ++commandCount;
}

function depthFuncOpt(func) {
    // console.log('GLOpt: depthFunc');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_FUNC;
    buffer_data[next_index + 1] = func;
    next_index += 2;
    ++commandCount;
}

function depthMaskOpt(flag) {
    // console.log('GLOpt: depthMask');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_MASK;
    buffer_data[next_index + 1] = flag ? 1 : 0;
    next_index += 2;
    ++commandCount;
}

function depthRangeOpt(zNear, zFar) {
    // console.log('GLOpt: depthRange');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_RANGE;
    buffer_data[next_index + 1] = zNear;
    buffer_data[next_index + 1] = zFar;
    next_index += 3;
    ++commandCount;
}

function detachShaderOpt(program, shader) {
    // console.log('GLOpt: detachShader');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DETACH_SHADER;
    buffer_data[next_index + 1] = program ? program._id : 0;
    buffer_data[next_index + 1] = shader ? shader._id : 0;
    next_index += 3;
    ++commandCount;
}

function disableOpt(cap) {
    // console.log('GLOpt: disable');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DISABLE;
    buffer_data[next_index + 1] = cap;
    next_index += 2;
    ++commandCount;
}

function disableVertexAttribArrayOpt(index) {
    // console.log('GLOpt: disableVertexAttribArray');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY;
    buffer_data[next_index + 1] = index;
    next_index += 2;
    ++commandCount;
}

function drawArraysOpt(mode, first, count) {
    // console.log('GLOpt: drawArrays');
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DRAW_ARRAYS;
    buffer_data[next_index + 1] = mode;
    buffer_data[next_index + 2] = first;
    buffer_data[next_index + 3] = count;
    next_index += 4;
    ++commandCount;
}

function drawElementsOpt(mode, count, type, offset) {
    // console.log('GLOpt: drawElements');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_DRAW_ELEMENTS;
    buffer_data[next_index + 1] = mode;
    buffer_data[next_index + 2] = count;
    buffer_data[next_index + 3] = type;
    buffer_data[next_index + 4] = offset ? offset : 0;
    next_index += 5;
    ++commandCount;
}

function enableOpt(cap) {
    // console.log('GLOpt: enable');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_ENABLE;
    buffer_data[next_index + 1] = cap;
    next_index += 2;
    ++commandCount;
}

function enableVertexAttribArrayOpt(index) {
    // console.log('GLOpt: enableVertexAttribArray');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY;
    buffer_data[next_index + 1] = index;
    next_index += 2;
    ++commandCount;
}

function finishOpt() {
    // console.log('GLOpt: finish');
    if (next_index + 1 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FINISH;
    next_index += 1;
    ++commandCount;
}

function flushOpt() {
    // console.log('GLOpt: flush');
    if (next_index + 1 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FLUSH;
    next_index += 1;
    ++commandCount;
}

function framebufferRenderbufferOpt(target, attachment, renderbuffertarget, renderbuffer) {
    // console.log('GLOpt: framebufferRenderbuffer');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = attachment;
    buffer_data[next_index + 3] = renderbuffertarget;
    buffer_data[next_index + 4] = renderbuffer ? renderbuffer._id : 0;
    next_index += 5;
    ++commandCount;
}

function framebufferTexture2DOpt(target, attachment, textarget, texture, level) {
    // console.log('GLOpt: framebufferTexture2D');
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
    ++commandCount;
}

function frontFaceOpt(mode) {
    // console.log('GLOpt: frontFace');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_FRONT_FACE;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
    ++commandCount;
}

function generateMipmapOpt(target) {
    // console.log('GLOpt: generateMipmap');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_GENERATE_MIPMAP;
    buffer_data[next_index + 1] = target;
    next_index += 2;
    ++commandCount;
}

function getActiveAttribOpt(program, index) {
    // console.log('GLOpt: getActiveAttrib');
    flushCommands();
    return _gl.getActiveAttrib(program, index);
}

function getActiveUniformOpt(program, index) {
    // console.log('GLOpt: getActiveUniform');
    flushCommands();
    return _gl.getActiveUniform(program, index);
}

function getAttachedShadersOpt(program) {
    // console.log('GLOpt: getAttachedShaders');
    flushCommands();
    return _gl.getAttachedShaders(program);
}

function getAttribLocationOpt(program, name) {
    // console.log('GLOpt: getAttribLocation');
    flushCommands();
    return _gl.getAttribLocation(program, name);
}

function getBufferParameterOpt(target, pname) {
    // console.log('GLOpt: getBufferParameter');
    flushCommands();
    return _gl.getBufferParameter(target, pname);
}

function getParameterOpt(pname) {
    // console.log('GLOpt: getParameter');
    flushCommands();
    return _gl.getParameter(pname);
}

function getErrorOpt() {
    // console.log('GLOpt: getError');
    flushCommands();
    return _gl.getError();
}

function getFramebufferAttachmentParameterOpt(target, attachment, pname) {
    // console.log('GLOpt: getFramebufferAttachmentParameter');
    flushCommands();
    return _gl.getFramebufferAttachmentParameter(target, attachment, pname);
}

function getProgramParameterOpt(program, pname) {
    // console.log('GLOpt: getProgramParameter');
    flushCommands();
    return _gl.getProgramParameter(program, pname);
}

function getProgramInfoLogOpt(program) {
    // console.log('GLOpt: getProgramInfoLog');
    flushCommands();
    return _gl.getProgramInfoLog(program);
}

function getRenderbufferParameterOpt(target, pname) {
    // console.log('GLOpt: getRenderbufferParameter');
    flushCommands();
    return _gl.getRenderbufferParameter(target, pname);
}

function getShaderParameterOpt(shader, pname) {
    // console.log('GLOpt: getShaderParameter');
    flushCommands();
    return _gl.getShaderParameter(shader, pname);
}

function getShaderPrecisionFormatOpt(shadertype, precisiontype) {
    // console.log('GLOpt: getShaderPrecisionFormat');
    flushCommands();
    return _gl.getShaderPrecisionFormat(shadertype, precisiontype);
}

function getShaderInfoLogOpt(shader) {
    // console.log('GLOpt: getShaderInfoLog');
    flushCommands();
    return _gl.getShaderInfoLog(shader);
}

function getShaderSourceOpt(shader) {
    // console.log('GLOpt: getShaderSource');
    flushCommands();
    return _gl.getShaderSource(shader);
}

function getTexParameterOpt(target, pname) {
    // console.log('GLOpt: getTexParameter');
    flushCommands();
    return _gl.getTexParameter(target, pname);
}

function getUniformOpt(program, location) {
    // console.log('GLOpt: getUniform');
    flushCommands();
    return _gl.getUniform(program, location);
}

function getUniformLocationOpt(program, name) {
    // console.log('GLOpt: getUniformLocation');
    flushCommands();
    return _gl.getUniformLocation(program, name);
}

function getVertexAttribOpt(index, pname) {
    // console.log('GLOpt: getVertexAttrib');
    flushCommands();
    return _gl.getVertexAttrib(index, pname);
}

function getVertexAttribOffsetOpt(index, pname) {
    // console.log('GLOpt: getVertexAttribOffset');
    flushCommands();
    return _gl.getVertexAttribOffset(index, pname);
}

function hintOpt(target, mode) {
    // console.log('GLOpt: hint');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_HINT;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = mode;
    next_index += 3;
    ++commandCount;
}

function isBufferOpt(buffer) {
    // console.log('GLOpt: isBuffer');
    flushCommands();
    return _gl.isBuffer(buffer);
}

function isEnabledOpt(cap) {
    // console.log('GLOpt: isEnabled');
    flushCommands();
    return _gl.isEnabled(cap);
}

function isFramebufferOpt(framebuffer) {
    // console.log('GLOpt: isFramebuffer');
    flushCommands();
    return _gl.isFramebuffer(framebuffer);
}

function isProgramOpt(program) {
    // console.log('GLOpt: isProgram');
    flushCommands();
    return _gl.isProgram(program);
}

function isRenderbufferOpt(renderbuffer) {
    // console.log('GLOpt: isRenderbuffer');
    flushCommands();
    return _gl.isRenderbuffer(renderbuffer);
}

function isShaderOpt(shader) {
    // console.log('GLOpt: isShader');
    flushCommands();
    return _gl.isShader(shader);
}

function isTextureOpt(texture) {
    // console.log('GLOpt: isTexture');
    flushCommands();
    return _gl.isTexture(texture);
}

function lineWidthOpt(width) {
    // console.log('GLOpt: lineWidth');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_LINE_WIDTH;
    buffer_data[next_index + 1] = width;
    next_index += 2;
    ++commandCount;
}

function linkProgramOpt(program) {
    // console.log('GLOpt: linkProgram');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_LINK_PROGRAM;
    buffer_data[next_index + 1] = program ? program._id : 0;
    next_index += 2;
    ++commandCount;
}

function pixelStoreiOpt(pname, param) {
    // console.log('GLOpt: pixelStorei');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_PIXEL_STOREI;
    buffer_data[next_index + 1] = pname;
    buffer_data[next_index + 2] = param;
    next_index += 3;
    ++commandCount;
}

function polygonOffsetOpt(factor, units) {
    // console.log('GLOpt: polygonOffset');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_POLYGON_OFFSET;
    buffer_data[next_index + 1] = factor;
    buffer_data[next_index + 2] = units;
    next_index += 3;
    ++commandCount;
}

function readPixelsOpt(x, y, width, height, format, type, pixels) {
    // console.log('GLOpt: readPixels');
    flushCommands();
    _gl.readPixels(x, y, width, height, format, type, pixels);
}

function renderbufferStorageOpt(target, internalFormat, width, height) {
    // console.log('GLOpt: renderbufferStorage');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_RENDER_BUFFER_STORAGE;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = internalFormat;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
    ++commandCount;
}

function sampleCoverageOpt(value, invert) {
    // console.log('GLOpt: sampleCoverage');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_SAMPLE_COVERAGE;
    buffer_data[next_index + 1] = value;
    buffer_data[next_index + 2] = invert ? 1 : 0;
    next_index += 3;
    ++commandCount;
}

function scissorOpt(x, y, width, height) {
    // console.log('GLOpt: scissor');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_SCISSOR;
    buffer_data[next_index + 1] = x;
    buffer_data[next_index + 2] = y;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
    ++commandCount;
}

function shaderSourceOpt(shader, source) {
    // console.log('GLOpt: shaderSource');
    flushCommands();
    _gl.shaderSource(shader, source);
}

function stencilFuncOpt(func, ref, mask) {
    // console.log('GLOpt: stencilFunc');
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_FUNC;
    buffer_data[next_index + 1] = func;
    buffer_data[next_index + 2] = ref;
    buffer_data[next_index + 3] = mask;
    next_index += 4;
    ++commandCount;
}

function stencilFuncSeparateOpt(face, func, ref, mask) {
    // console.log('GLOpt: stencilFuncSeparate');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_FUNC_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = func;
    buffer_data[next_index + 3] = ref;
    buffer_data[next_index + 4] = mask;
    next_index += 5;
    ++commandCount;
}

function stencilMaskOpt(mask) {
    // console.log('GLOpt: stencilMask');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_MASK;
    buffer_data[next_index + 1] = mask;
    next_index += 2;
    ++commandCount;
}

function stencilMaskSeparateOpt(face, mask) {
    // console.log('GLOpt: stencilMaskSeparate');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_MASK_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = mask;
    next_index += 3;
    ++commandCount;
}

function stencilOpOpt(fail, zfail, zpass) {
    // console.log('GLOpt: stencilOp');
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_OP;
    buffer_data[next_index + 1] = fail;
    buffer_data[next_index + 2] = zfail;
    buffer_data[next_index + 3] = zpass;
    next_index += 4;
    ++commandCount;
}

function stencilOpSeparateOpt(face, fail, zfail, zpass) {
    // console.log('GLOpt: stencilOpSeparate');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_OP_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = fail;
    buffer_data[next_index + 3] = zfail;
    buffer_data[next_index + 4] = zpass;
    next_index += 5;
    ++commandCount;
}

function texImage2DOpt() {
    flushCommands();
    // console.log('GLOpt: texImage2D');
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
    // console.log('GLOpt: texParameterf');
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_TEX_PARAMETER_F;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = pname;
    buffer_data[next_index + 3] = param;
    next_index += 4;
    ++commandCount;
}

function texParameteriOpt(target, pname, param) {
    // console.log('GLOpt: texParameteri');
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_TEX_PARAMETER_I;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = pname;
    buffer_data[next_index + 3] = param;
    next_index += 4;
    ++commandCount;
}

function texSubImage2DOpt(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    flushCommands();
    // console.log('GLOpt: texSubImage2D');
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
    // console.log('GLOpt: uniform1f');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    next_index += 3;
    ++commandCount;
}

function uniform2fOpt(location, x, y) {
    // console.log('GLOpt: uniform2f');
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
    ++commandCount;
}

function uniform3fOpt(location, x, y, z) {
    // console.log('GLOpt: uniform3f');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
    ++commandCount;
}

function uniform4fOpt(location, x, y, z, w) {
    // console.log('GLOpt: uniform4f');
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
    ++commandCount;
}

function uniform1iOpt(location, x) {
    // console.log('GLOpt: uniform1i');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    next_index += 3;
    ++commandCount;
}

function uniform2iOpt(location, x, y) {
    // console.log('GLOpt: uniform2i');
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
    ++commandCount;
}

function uniform3iOpt(location, x, y, z) {
    // console.log('GLOpt: uniform3i');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
    ++commandCount;
}

function uniform4iOpt(location, x, y, z, w) {
    // console.log('GLOpt: uniform4i');
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
    ++commandCount;
}

function uniform1fvOpt(location, value) {
    // console.log('GLOpt: uniform1fv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function uniform2fvOpt(location, value) {
    // console.log('GLOpt: uniform2fv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function uniform3fvOpt(location, value) {
    // console.log('GLOpt: uniform3fv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function uniform4fvOpt(location, value) {
    // console.log('GLOpt: uniform4fv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function uniform1ivOpt(location, value) {
    // console.log('GLOpt: uniform1iv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function uniform2ivOpt(location, value) {
    // console.log('GLOpt: uniform2iv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function uniform3ivOpt(location, value) {
    // console.log('GLOpt: uniform3iv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function uniform4ivOpt(location, value) {
    // console.log('GLOpt: uniform4iv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function uniformMatrix2fvOpt(location, transpose, value) {
    // console.log('GLOpt: uniformMatrix2fv');
    if (next_index + 4 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_2FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
    ++commandCount;
}

function uniformMatrix3fvOpt(location, transpose, value) {
    // console.log('GLOpt: uniformMatrix3fv');
    if (next_index + 4 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_3FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
    ++commandCount;
}

function uniformMatrix4fvOpt(location, transpose, value) {
    // console.log('GLOpt: uniformMatrix4fv');
    if (next_index + 4 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_4FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
    ++commandCount;
}

function useProgramOpt(program) {
    // console.log('GLOpt: useProgram');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_USE_PROGRAM;
    buffer_data[next_index + 1] = program ? program._id : 0;
    next_index += 2;
    ++commandCount;
}

function validateProgramOpt(program) {
    // console.log('GLOpt: validateProgram');
    if (next_index + 2 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VALIDATE_PROGRAM;
    buffer_data[next_index + 1] = program ? program._id : 0;
    next_index += 2;
    ++commandCount;
}

function vertexAttrib1fOpt(index, x) {
    // console.log('GLOpt: vertexAttrib1f');
    if (next_index + 3 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_1F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    next_index += 3;
    ++commandCount;
}

function vertexAttrib2fOpt(index, x, y) {
    // console.log('GLOpt: vertexAttrib2f');
    if (next_index + 4 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_2F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
    ++commandCount;
}

function vertexAttrib3fOpt(index, x, y, z) {
    // console.log('GLOpt: vertexAttrib3f');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_3F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
    ++commandCount;
}

function vertexAttrib4fOpt(index, x, y, z, w) {
    // console.log('GLOpt: vertexAttrib4f');
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
    ++commandCount;
}

function vertexAttrib1fvOpt(index, value) {
    // console.log('GLOpt: vertexAttrib1fv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_1FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function vertexAttrib2fvOpt(index, value) {
    // console.log('GLOpt: vertexAttrib2fv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_2FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function vertexAttrib3fvOpt(index, value) {
    // console.log('GLOpt: vertexAttrib3fv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_3FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function vertexAttrib4fvOpt(index, value) {
    // console.log('GLOpt: vertexAttrib4fv');
    if (next_index + 3 + value.length >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_4FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
    ++commandCount;
}

function vertexAttribPointerOpt(index, size, type, normalized, stride, offset) {
    // console.log('GLOpt: vertexAttribPointer');
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
    ++commandCount;
}

function viewportOpt(x, y, width, height) {
    // console.log('GLOpt: viewport');
    if (next_index + 5 >= total_size) {
        flushCommands();
    }
    buffer_data[next_index] = GL_COMMAND_VIEW_PORT;
    buffer_data[next_index + 1] = x;
    buffer_data[next_index + 2] = y;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
    ++commandCount;
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