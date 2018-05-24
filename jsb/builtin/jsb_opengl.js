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

var gl = __ccgl;

gl.drawingBufferWidth = window.innerWidth;
gl.drawingBufferHeight = window.innerHeight;

//
// Extensions
//

const WebGLCompressedTextureS3TC = {
    COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83F0, // A DXT1-compressed image in an RGB image format.
    COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83F1,// A DXT1-compressed image in an RGB image format with a simple on/off alpha value.
    COMPRESSED_RGBA_S3TC_DXT3_EXT: 0x83F2,// A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression.
    COMPRESSED_RGBA_S3TC_DXT5_EXT: 0x83F3 // A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done.
};

const WebGLCompressedTextureETC1 = {
    COMPRESSED_RGB_ETC1_WEBGL: 0x8D64 // Compresses 24-bit RGB data with no alpha channel.
};

const WebGLCompressedTexturePVRTC = {
    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8C00, //  RGB compression in 4-bit mode. One block for each 4×4 pixels.
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8C02,//  RGBA compression in 4-bit mode. One block for each 4×4 pixels.
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8C01, //  RGB compression in 2-bit mode. One block for each 8×4 pixels.
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8C03 //  RGBA compression in 2-bit mode. One block for each 8×4 pixe
};

var extensionPrefixArr = ['MOZ_', 'WEBKIT_'];

var extensionMap = {
    WEBGL_compressed_texture_s3tc: WebGLCompressedTextureS3TC,
    WEBGL_compressed_texture_pvrtc: WebGLCompressedTexturePVRTC,
    WEBGL_compressed_texture_etc1: WebGLCompressedTextureETC1
};

// From the WebGL spec:
// Returns an object if, and only if, name is an ASCII case-insensitive match [HTML] for one of the names returned from getSupportedExtensions;
// otherwise, returns null. The object returned from getExtension contains any constants or functions provided by the extension.
// A returned object may have no constants or functions if the extension does not define any, but a unique object must still be returned.
// That object is used to indicate that the extension has been enabled.
// XXX: The returned object must return the functions and constants.

var supportedExtensions = gl.getSupportedExtensions();

gl.getExtension = function(extension) {
    var prefix;
    for (var i = 0, len = extensionPrefixArr.length; i < len; ++i) {
        prefix = extensionPrefixArr[i];
        if (extension.startsWith(prefix)) {
            extension = extension.substring(prefix.length);
            break;
        }
    }

    if (supportedExtensions.indexOf(extension) > -1) {
        if (extension in extensionMap) {
            return extensionMap[extension];
        }
    }

    return null;
};

const HTMLCanvasElement = require('./jsb-adapter/HTMLCanvasElement');
const HTMLImageElement = require('./jsb-adapter/HTMLImageElement');
const ImageData = require('./jsb-adapter/ImageData');

const _glTexImage2D = gl.texImage2D;

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
            _glTexImage2D(target, level, image._glInternalFormat, image.width, image.height, 0, image._glFormat, image._glType, image._data, image._alignment);
        }
        else if (image instanceof HTMLCanvasElement) {
            var data = null;
            if (image._data) {
                data = image._data._data;
            }
            _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, data, image._alignment);
        }
        else if (image instanceof ImageData) {
            _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image._data, 0);
        }
        else {
            console.error("Invalid pixel argument passed to gl.texImage2D!");
        } 
    }
    else if (argCount == 9) {
        _glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels, 0);
    }
    else {
        console.error("gl.texImage2D: invalid argument count!");
    }
}


const _glTexSubImage2D = gl.texSubImage2D;
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

        if (image instanceof HTMLImageElement) {
            _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, image._glFormat, image._glType, image._data, image._alignment);
        }
        else if (image instanceof HTMLCanvasElement) {
            var data = null;
            if (image._data) {
                data = image._data._data;
            }
            _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, data, image._alignment);
        }
        else if (image instanceof ImageData) {
            _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image._data, 0);
        }
        else {
            console.error("Invalid pixel argument passed to gl.texImage2D!");
        }
    }
    else if (argCount == 9) {
        _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels, 0);
    }
    else {
        console.error((new Error("gl.texImage2D: invalid argument count!").stack));
    }
}

//TODO:cjh get the real value
gl.getContextAttributes = function() {
    return {
      alpha: true, 
      antialias: false, 
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
