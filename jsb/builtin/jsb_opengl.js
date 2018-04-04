/*
 * OpenGL ES 2.0 / WebGL helper functions
 *
 * According to the WebGL specification ( For further info see:s http://www.khronos.org/registry/webgl/specs/latest/webgl.idl ),
 * the API should work with objects like WebGLTexture, WebGLBuffer, WebGLRenderBuffer, WebGLFramebuffer, WebGLProgram, WebGLShader.
 * OpenGL ES 2.0 doesn't have "objects" concepts: Instead it uses ids (GLints). So, these objects are emulated in this thin wrapper.
 *
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

require('./jsb_opengl_constants');
window.gl = window.gl || {};

gl.drawingBufferWidth = window.innerWidth;
gl.drawingBufferHeight = window.innerHeight;

//
// Create functions
//
gl.createTexture = function() {
    // Returns a "WebGLTexture" object
    var ret = gl._createTexture();
    return { texture_id:ret };
};

gl.createBuffer = function() {
    // Returns a "WebGLBuffer" object
    var ret = gl._createBuffer();
    return { buffer_id:ret };
};

gl.createRenderbuffer = function() {
    // Returns a "WebGLRenderBuffer" object
    var ret = gl._createRenderbuffer();
    return { renderbuffer_id:ret};
};

gl.createFramebuffer = function() {
    // Returns a "WebGLFramebuffer" object
    var ret = gl._createFramebuffer();
    return {framebuffer_id:ret};
};

gl.createProgram = function() {
    // Returns a "WebGLProgram" object
    var ret = gl._createProgram();
    return {program_id:ret};
};

gl.createShader = function(shaderType) {
    // Returns a "WebGLShader" object
    var ret = gl._createShader(shaderType);
    return {shader_id:ret};
};

//
// Delete Functions
//
gl.deleteTexture = function(texture) {
    var texture_id = texture.texture_id;
    // Accept numbers too. eg: gl.deleteTexture(0)
    if (typeof texture === 'number')
        texture_id = texture;

    gl._deleteTexture(texture_id);
};

gl.deleteBuffer = function(buffer) {
    var buffer_id = buffer.buffer_id;
    // Accept numbers too. eg: gl.deleteBuffer(0)
    if( typeof buffer === 'number' )
        buffer_id = buffer;

    gl._deleteBuffer(buffer_id);
};

gl.deleteRenderbuffer = function(buffer) {
    var buffer_id = buffer.renderbuffer_id;
    // Accept numbers too. eg: gl.deleteRenderbuffer(0)
    if (typeof buffer === 'number')
        buffer_id = buffer;

    gl._deleteRenderbuffer(renderbuffer_id);
};

gl.deleteFramebuffer = function(buffer) {
    var buffer_id;
    if (buffer)
        buffer_id = buffer.framebuffer_id;
    else
        buffer_id = null;
    gl._deleteFramebuffer(buffer_id);
};

gl.deleteProgram = function(program) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.deleteShader(0)
    if (typeof program === 'number')
        program_id = program;

    gl._deleteProgram(program_id);
};

gl.deleteShader = function(shader) {
    var shader_id = shader.shader_id;
    // Accept numbers too. eg: gl.deleteShader(0)
    if (typeof shader === 'number')
        shader_id = shader;

    gl._deleteShader(shader_id);
};

//
// Bind Related
//
// void bindTexture(GLenum target, WebGLTexture? texture);
gl.bindTexture = function(target, texture) {

    var texture_id;
    // Accept numbers too. eg: gl.bindTexture(0)
    if (typeof texture === 'number')
        texture_id = texture;
    else if( texture === null )
        texture_id = 0;
    else
        texture_id = texture.texture_id;

    gl._bindTexture( target, texture_id );
};

// void bindBuffer(GLenum target, WebGLBuffer? buffer);
gl.bindBuffer = function(target, buffer) {
    var buffer_id;
    // Accept numbers too. eg: gl.bindBuffer(0)
    if (typeof buffer === 'number')
        buffer_id = buffer;
    else if (buffer === null)
        buffer_id = 0;
    else
        buffer_id = buffer.buffer_id;

    gl._bindBuffer(target, buffer_id);
};

// void bindRenderbuffer(GLenum target, WebGLRenderbuffer? renderbuffer);
gl.bindRenderbuffer = function(target, buffer) {
    var buffer_id;

    // Accept numbers too. eg: gl.bindRenderbuffer(0)
    if (typeof buffer === 'number')
        buffer_id = buffer;
    else if (buffer === null)
        buffer_id = 0;
    else
        buffer_id = buffer.renderbuffer_id;

    gl._bindRenderbuffer(target, buffer_id);
};

// void bindFramebuffer(GLenum target, WebGLFramebuffer? framebuffer);
gl.bindFramebuffer = function(target, buffer) {
    var buffer_id;

    // Accept numbers too. eg: gl.bindFramebuffer(0)
    if (typeof buffer === 'number')
        buffer_id = buffer;
    else if( buffer === null )
        buffer_id = null;
    else
        buffer_id = buffer.framebuffer_id;

    gl._bindFramebuffer(target, buffer_id);
};

gl.framebufferRenderbuffer = function(target, attachment, renderbuffertarget, renderbuffer) {
    gl._framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer.renderbuffer_id);
};

gl.framebufferTexture2D = function(target, attachment, textarget, texture, level) {
    gl._framebufferTexture2D(target, attachment, textarget, texture.texture_id, level);
};

gl.isFramebuffer = function(buffer) {
    if (buffer && buffer.framebuffer_id) {
        return gl._isFramebuffer(buffer.framebuffer_id);
    }
    return false;
};

gl.isProgram = function(program) {
    if (program && program.program_id) {
        return gl._isProgram(program.program_id);
    }
    return false;
};

gl.isRenderbuffer = function(buffer) {
    if (buffer && buffer.renderbuffer_id) {
        return gl._isRenderbuffer(buffer.renderbuffer_id);
    }
    return false;
};

gl.isShader = function(shader) {
    if (shader && shader.shader_id) {
        return gl._isShader(shader.shader_id);
    }
    return false;
};

gl.isTexture = function(texture) {
    if (texture && texture.texture_id) {
        return gl._isTexture(texture.texture_id);
    }
    return false;
};

//
// Uniform related
//
// any getUniform(WebGLProgram? program, WebGLUniformLocation? location);
gl.getUniform = function(program, location) {
    var program_id;
    var location_id;

    // Accept numbers too. eg: gl.bindFramebuffer(0)
    if (typeof program === 'number')
        program_id = program;
    else
        program_id = program.program_id;

    if (typeof location === 'number')
        location_id = location;
    else
        location_id = location.location_id;

    return gl._getUniform(program_id, location_id);
};

// gl.uniformMatrix2fv = function(location, bool, matrix) {
//  gl._uniformMatrix2fv(program.program_id, bool, matrix);
// };

// gl.uniformMatrix3fv = function(program, bool, matrix) {
//  gl._uniformMatrix3fv(program.program_id, bool, matrix);
// };

// gl.uniformMatrix4fv = function(program, bool, matrix) {
//  gl._uniformMatrix4fv(program.program_id, bool, matrix);
// };


//
// Shader related
//
// void compileShader(WebGLShader? shader);
gl.compileShader = function(shader) {
    gl._compileShader( shader.shader_id);
};

// void shaderSource(WebGLShader? shader, DOMString source);
gl.shaderSource = function(shader, source) {
    gl._shaderSource(shader.shader_id, source);
};

// any getShaderParameter(WebGLShader? shader, GLenum pname);
gl.getShaderParameter = function(shader, e) {
    return gl._getShaderParameter(shader.shader_id,e);
};

// DOMString? getShaderInfoLog(WebGLShader? shader);
gl.getShaderInfoLog = function(shader) {
    return gl._getShaderInfoLog(shader.shader_id);
};

// DOMString gl.getShaderSource(shader);
gl.getShaderSource = function(shader) {
    return gl._getShaderSource(shader.shader_id);
};

//
// program related
//
// void attachShader(WebGLProgram? program, WebGLShader? shader);
gl.attachShader = function(program, shader) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.attachShader(17)
    if( typeof program === 'number' )
        program_id = program;

    gl._attachShader(program_id, shader.shader_id);
};

// void linkProgram(WebGLProgram? program);
gl.linkProgram = function(program) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.linkProgram(17)
    if( typeof program === 'number' )
        program_id = program;

    gl._linkProgram(program_id);
};

gl.bindAttribLocation = function(program, index, name) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.linkProgram(17)
    if( typeof program === 'number' )
        program_id = program;

    gl._bindAttribLocation(program_id, index, name);
};

// any getProgramParameter(WebGLProgram? program, GLenum pname);
gl.getProgramParameter = function(program, e) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getProgramParameter(17)
    if (typeof program === 'number')
        program_id = program;

    return gl._getProgramParameter(program_id, e);
};

gl.getProgramInfoLog = function(program) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getProgramParameter(17)
    if (typeof program === 'number')
        program_id = program;

    return gl._getProgramInfoLog(program_id);
};

// void useProgram(WebGLProgram? program);
gl.useProgram = function(program) {
    var program_id;
    // Accept numbers too. eg: gl.useProgram(17)
    if (typeof program === 'number')
        program_id = program;
    else
        program_id = program.program_id;

    gl._useProgram (program_id);
};


// [WebGLHandlesContextLoss] GLint getAttribLocation(WebGLProgram? program, DOMString name);
gl.getAttribLocation = function(program, name) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getAttribLocation(17)
    if (typeof program === 'number')
        program_id = program;

    return gl._getAttribLocation(program_id, name);
};

// WebGLUniformLocation? getUniformLocation(WebGLProgram? program, DOMString name);
gl.getUniformLocation = function(program, name) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getUniformLocation(17)
    if (typeof program === 'number')
        program_id = program;

    // XXX: it should return an object, not an integer
    return gl._getUniformLocation(program_id,name);
};


// WebGLActiveInfo? getActiveAttrib(WebGLProgram? program, GLuint index);
gl.getActiveAttrib = function(program, index) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getActiveAttrib(17)
    if (typeof program === 'number')
        program_id = program;

    return gl._getActiveAttrib(program_id, index);
};

// WebGLActiveInfo? getActiveUniform(WebGLProgram? program, GLuint index);
gl.getActiveUniform = function(program, index) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getActiveUniform(17)
    if (typeof program === 'number')
        program_id = program;

    return gl._getActiveUniform(program_id, index);
};

// sequence<WebGLShader>? getAttachedShaders(WebGLProgram? program);
gl.getAttachedShaders = function(program) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getAttachedShaders(17)
    if (typeof program === 'number')
        program_id = program;

    return gl._getAttachedShaders(program_id);
};

//
// Extensions
//
// From the WebGL spec:
// Returns an object if, and only if, name is an ASCII case-insensitive match [HTML] for one of the names returned from getSupportedExtensions;
// otherwise, returns null. The object returned from getExtension contains any constants or functions provided by the extension.
// A returned object may have no constants or functions if the extension does not define any, but a unique object must still be returned.
// That object is used to indicate that the extension has been enabled.
// XXX: The returned object must return the functions and constants.
gl.getExtension = function(extension) {
    var extensions = gl.getSupportedExtensions();
    if (extensions.indexOf(extension) > -1)
        return {};
    return null;
};

let HTMLCanvasElement = require('./jsb-adapter/HTMLCanvasElement');
let HTMLImageElement = require('./jsb-adapter/HTMLImageElement');
let ImageData = require('./jsb-adapter/ImageData');

let _glTexImage2D = gl.texImage2D;

/*
// WebGL1:
void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
void gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLCanvasElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, ImageBitmap? pixels);
*/
gl.texImage2D = function(target, level, internalformat, width, height, border, format, type, pixels) {
    let argCount = arguments.length;
    if (argCount == 6) {
        var image = border;
        type = height;
        format = width;

        if (image instanceof HTMLImageElement) {
            // console.log(`==> texImage2D HTMLImageElement internalformat: ${image._glInternalFormat}, format: ${image._glFormat}, image: w:${image.width}, h:${image.height}, dataLen:${image._data.length}`);
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, image._alignment);
       
            _glTexImage2D(target, level, image._glInternalFormat, image.width, image.height, 0, image._glFormat, image._glType, image._data);
        }
        else if (image instanceof HTMLCanvasElement) {
            // console.log(`==> texImage2D HTMLCanvasElement internalformat: ${internalformat}, format: ${format}, image: w:${image.width}, h:${image.height}`);//, dataLen:${image._data.length}`);
            if (image._data) {
                _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image._data._data);
            }
        }
        else if (image instanceof ImageData) {
            // console.log(`==> texImage2D ImageData internalformat: ${internalformat}, format: ${format}, image: w:${image.width}, h:${image.height}`);
            _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image._data);
        }
        else {
            console.error("Invalid pixel argument passed to gl.texImage2D!");
        } 
    }
    else if (argCount == 9) {
        _glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
    } else {
        console.error("gl.texImage2D: invalid argument count!");
    }
}


let _glTexSubImage2D = gl.texSubImage2D;
/*
 // WebGL 1:
 void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, ArrayBufferView? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, ImageData? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLImageElement? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLCanvasElement? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLVideoElement? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, ImageBitmap? pixels);
 */
gl.texSubImage2D = function(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    let argCount = arguments.length;
    if (argCount == 7) {
        var image = format;
        type = height;
        format = width;

        //TODO: ImageData
        if (image instanceof HTMLImageElement) {
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, image._alignment);
            _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, image._glFormat, image._glType, image._data);
        }
        else if (image instanceof HTMLCanvasElement) {
            if (image._data) {
                _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image._data._data);
            }
        }
        else if (image instanceof ImageData) {
            _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image._data);
        }
        else {
            console.error("Invalid pixel argument passed to gl.texImage2D!");
        }
    }
    else if (argCount == 9) {
        _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
    } else {
        console.error((new Error("gl.texImage2D: invalid argument count!").stack));
    }
}

//TODO:cjh get the real value
gl.getContextAttributes = function() {
    return {
      alpha: true, 
      antialias: true, 
      depth: true, 
      failIfMajorPerformanceCaveat: false, 
      premultipliedAlpha: true, 
      preserveDrawingBuffer: false, 
      stencil: true 
    }
}

gl.isContextLost = function() {
    return false;
}
