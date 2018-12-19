import { WebGLGPUBuffer, WebGLGPUTexture, WebGLGPUInputState, WebGLGPUFramebuffer, WebGLGPUShader, WebGLGPUInput, WebGLGPUUniform } from "./webgl-gpu-objects";
import { WebGLGFXDevice } from "./webgl-gfx-device";
import { GFXBufferUsageBit, GFXMemoryUsageBit } from "../gfx-buffer";
import { GFXTextureViewType } from "../gfx-texture-view";
import { GFXFormatInfos, GFXFormat, WebGLEXT, GFXType } from "../gfx-define";
import { GFXShaderType } from "../gfx-shader";

function GFXFormatToWebGLType(format : GFXFormat) : GLenum {
    switch(format) {
        case GFXFormat.R8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.R8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.R8UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.R8I: return WebGLRenderingContext.INT;
        case GFXFormat.R16F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.R16UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.R16I: return WebGLRenderingContext.INT;
        case GFXFormat.R32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.R32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.R32I: return WebGLRenderingContext.INT;

        case GFXFormat.RG8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RG8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RG8UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RG8I: return WebGLRenderingContext.INT;
        case GFXFormat.RG16F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RG16UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RG16I: return WebGLRenderingContext.INT;
        case GFXFormat.RG32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RG32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RG32I: return WebGLRenderingContext.INT;

        case GFXFormat.RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RGB8UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB8I: return WebGLRenderingContext.INT;
        case GFXFormat.RGB16F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB16UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB16I: return WebGLRenderingContext.INT;
        case GFXFormat.RGB32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB32I: return WebGLRenderingContext.INT;

        case GFXFormat.RGBA8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.SRGB8_A8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGBA8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RGBA8UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGBA8I: return WebGLRenderingContext.INT;
        case GFXFormat.RGBA16F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGBA16UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGBA16I: return WebGLRenderingContext.INT;
        case GFXFormat.RGBA32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGBA32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGBA32I: return WebGLRenderingContext.INT;

        case GFXFormat.R5G6B5: return WebGLRenderingContext.UNSIGNED_SHORT_5_6_5;
        case GFXFormat.R11G11B10F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1;
        case GFXFormat.RGBA4: return WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4;
        case GFXFormat.RGB10A2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB10A2UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB9E5: return WebGLRenderingContext.UNSIGNED_BYTE;

        case GFXFormat.D16: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.D24: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.D24S8: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.D32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.FLOAT;

        case GFXFormat.BC1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC1_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC2_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC3: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC3_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC4_SNORM: return WebGLRenderingContext.BYTE;
        case GFXFormat.BC5: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC5_SNORM: return WebGLRenderingContext.BYTE;
        case GFXFormat.BC6H_SF16: return WebGLRenderingContext.FLOAT;
        case GFXFormat.BC6H_UF16: return WebGLRenderingContext.FLOAT;
        case GFXFormat.BC7: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC7_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;

        case GFXFormat.ETC_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8_A1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8_A1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.EAC_RG11: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_RG11SN: return WebGLRenderingContext.BYTE;

        case GFXFormat.PVRTC_RGB2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGB4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_2BPP: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_4BPP: return WebGLRenderingContext.UNSIGNED_BYTE;

        default: {
            return WebGLRenderingContext.UNSIGNED_BYTE;
        }
    }
}

function GFXFormatToWebGLInternalFormat(format : GFXFormat) : GLenum {
    switch(format) {
        case GFXFormat.A8: return WebGLRenderingContext.ALPHA;
        case GFXFormat.L8: return WebGLRenderingContext.LUMINANCE;
        case GFXFormat.LA8: return WebGLRenderingContext.LUMINANCE_ALPHA;
        case GFXFormat.RGB8: return WebGLRenderingContext.RGB;
        case GFXFormat.RGBA8: return WebGLRenderingContext.RGBA;
        case GFXFormat.R5G6B5: return WebGLRenderingContext.RGB565;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.RGB5_A1;
        case GFXFormat.RGBA4: return WebGLRenderingContext.RGBA4;
        case GFXFormat.D16: return WebGLRenderingContext.DEPTH_COMPONENT16;
        case GFXFormat.D24: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D32F: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.DEPTH_STENCIL;
        
        case GFXFormat.BC1: return WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_ALPHA: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB: return WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB_ALPHA: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case GFXFormat.BC2: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case GFXFormat.BC2_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case GFXFormat.BC3: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case GFXFormat.BC3_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case GFXFormat.ETC_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;

        case GFXFormat.PVRTC_RGB2: return WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA2: return WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGB4: return WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA4: return WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            console.error("Unsupported GFXFormat, convert to WebGL internal format failed.");
            return WebGLRenderingContext.RGBA;
        }
    }
}

function GFXFormatToWebGLFormat(format : GFXFormat) : GLenum {
    switch(format) {
        case GFXFormat.A8: return WebGLRenderingContext.ALPHA;
        case GFXFormat.L8: return WebGLRenderingContext.LUMINANCE;
        case GFXFormat.LA8: return WebGLRenderingContext.LUMINANCE_ALPHA;
        case GFXFormat.RGB8: return WebGLRenderingContext.RGB;
        case GFXFormat.RGBA8: return WebGLRenderingContext.RGBA;
        case GFXFormat.R5G6B5: return WebGLRenderingContext.RGB;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.RGBA;
        case GFXFormat.RGBA4: return WebGLRenderingContext.RGBA;
        case GFXFormat.D16: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D24: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D32F: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.DEPTH_STENCIL;

        case GFXFormat.BC1: return WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_ALPHA: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB: return WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB_ALPHA: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case GFXFormat.BC2: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case GFXFormat.BC2_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case GFXFormat.BC3: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case GFXFormat.BC3_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case GFXFormat.ETC_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;
        
        case GFXFormat.PVRTC_RGB2: return WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA2: return WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGB4: return WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA4: return WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            console.error("Unsupported GFXFormat, convert to WebGL format failed.");
            return WebGLRenderingContext.RGBA;
        }
    }
}

function WebGLTypeToGFXType(glType : GLenum) : GFXType {
    switch(glType) {
        case WebGLRenderingContext.BOOL: return GFXType.BOOL;
        case WebGLRenderingContext.BOOL_VEC2: return GFXType.BOOL2;
        case WebGLRenderingContext.BOOL_VEC3: return GFXType.BOOL3;
        case WebGLRenderingContext.BOOL_VEC4: return GFXType.BOOL4;
        case WebGLRenderingContext.INT: return GFXType.INT;
        case WebGLRenderingContext.INT_VEC2: return GFXType.INT2;
        case WebGLRenderingContext.INT_VEC3: return GFXType.INT3;
        case WebGLRenderingContext.INT_VEC4: return GFXType.INT4;
        case WebGLRenderingContext.UNSIGNED_INT: return GFXType.UINT;
        case WebGLRenderingContext.FLOAT: return GFXType.FLOAT;
        case WebGLRenderingContext.FLOAT_VEC2: return GFXType.FLOAT2;
        case WebGLRenderingContext.FLOAT_VEC3: return GFXType.FLOAT3;
        case WebGLRenderingContext.FLOAT_VEC4: return GFXType.FLOAT4;
        case WebGLRenderingContext.FLOAT_MAT2: return GFXType.MAT2;
        case WebGLRenderingContext.FLOAT_MAT3: return GFXType.MAT3;
        case WebGLRenderingContext.FLOAT_MAT4: return GFXType.MAT4;
        case WebGLRenderingContext.SAMPLER_2D: return GFXType.SAMPLER2D;
        case WebGLRenderingContext.SAMPLER_CUBE: return GFXType.SAMPLER_CUBE;
        default: {
            console.error("Unsupported GLType, convert to GFXType failed.");
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLGetTypeSize(glType : GLenum) : GFXType {
    switch(glType) {
        case WebGLRenderingContext.BOOL: return 4;
        case WebGLRenderingContext.BOOL_VEC2: return 8;
        case WebGLRenderingContext.BOOL_VEC3: return 12;
        case WebGLRenderingContext.BOOL_VEC4: return 16;
        case WebGLRenderingContext.INT: return 4;
        case WebGLRenderingContext.INT_VEC2: return 8;
        case WebGLRenderingContext.INT_VEC3: return 12;
        case WebGLRenderingContext.INT_VEC4: return 16;
        case WebGLRenderingContext.UNSIGNED_INT: return 4;
        case WebGLRenderingContext.FLOAT: return 4;
        case WebGLRenderingContext.FLOAT_VEC2: return 8;
        case WebGLRenderingContext.FLOAT_VEC3: return 12;
        case WebGLRenderingContext.FLOAT_VEC4: return 16;
        case WebGLRenderingContext.FLOAT_MAT2: return 16;
        case WebGLRenderingContext.FLOAT_MAT3: return 36;
        case WebGLRenderingContext.FLOAT_MAT4: return 64;
        case WebGLRenderingContext.SAMPLER_2D: return 4;
        case WebGLRenderingContext.SAMPLER_CUBE: return 4;
        default: {
            console.error("Unsupported GLType, get type failed.");
            return 0;
        }
    }
}

export const enum WebGLCmdType {
    UNKNOWN,
    CREATE_BUFFER,
    DESTROY_BUFFER,
};

export class WebGLCmd {
    type : WebGLCmdType = WebGLCmdType.UNKNOWN;
    obj : any;
    isFree : boolean = false;
};

export function WebGLCmdFuncCreateBuffer(device : WebGLGFXDevice, gpuBuffer : WebGLGPUBuffer) {

    let gl : WebGLRenderingContext = <WebGLRenderingContext>device.gl;

    if (gpuBuffer.usage & GFXBufferUsageBit.VERTEX) {
       
        gpuBuffer.glTarget = WebGLRenderingContext.ARRAY_BUFFER;
        let glBuffer = gl.createBuffer();
        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;

            if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
            }
    
            let glUsage : GLenum = gpuBuffer.usage & GFXMemoryUsageBit.DEVICE ? WebGLRenderingContext.STATIC_DRAW : WebGLRenderingContext.DYNAMIC_DRAW;
            gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.size, glUsage);
    
            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, null);
            device.stateCache.glArrayBuffer = null;
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDEX) {
       
        gpuBuffer.glTarget = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER;
        let glBuffer = gl.createBuffer();
        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;

            if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
            }
    
            let glUsage : GLenum = gpuBuffer.usage & GFXMemoryUsageBit.DEVICE ? WebGLRenderingContext.STATIC_DRAW : WebGLRenderingContext.DYNAMIC_DRAW;
            gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
    
            gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, null);
            device.stateCache.glElementArrayBuffer = null;
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        console.error("WebGL 1.0 doesn't support uniform buffer.");
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else if (gpuBuffer.usage === GFXBufferUsageBit.TRANSFER_DST) {
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else if (gpuBuffer.usage === GFXBufferUsageBit.TRANSFER_SRC) {
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else {
        console.error("Unsupported GFXBufferType, create buffer failed.");
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    }
}

export function WebGLCmdFuncDestroyBuffer(device : WebGLGFXDevice, gpuBuffer : WebGLGPUBuffer) {
    if(gpuBuffer.glBuffer > 0) {
        device.gl.deleteBuffer(gpuBuffer.glBuffer);
        gpuBuffer.glBuffer = 0;
    }
}

export function WebGLCmdFuncUpdateBuffer(device : WebGLGFXDevice, gpuBuffer : WebGLGPUBuffer, offset : number, data : ArrayBuffer) {

    let gl : WebGLRenderingContext = <WebGLRenderingContext>device.gl;

    switch (gpuBuffer.glTarget) {
        case WebGLRenderingContext.ARRAY_BUFFER : {

            if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
            }

            gl.bufferSubData(WebGLRenderingContext.ARRAY_BUFFER, offset, data);

            break;
        }
        case WebGLRenderingContext.ELEMENT_ARRAY_BUFFER : {
            
            if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
            }

            gl.bufferSubData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, offset, data);

            break;
        }
        default : {
            console.error("Unsupported GFXBufferType, update buffer failed.");
        }
    }
}

export function WebGLCmdFuncCreateInputState(device : WebGLGFXDevice, gpuInputState : WebGLGPUInputState) {
}

export function WebGLCmdFuncDestroyInputState(device : WebGLGFXDevice, gpuInputState : WebGLGPUInputState) {
    /*if(gpuInputState.glVAO > 0) {
        gpuInputState.glVAO = 0;
    }*/
}

export function WebGLCmdFuncCreateTexture(device : WebGLGFXDevice, gpuTexture : WebGLGPUTexture) {

    let gl : WebGLRenderingContext = <WebGLRenderingContext>device.gl;

    gpuTexture.glInternelFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format);

    switch (gpuTexture.viewType) {
        case GFXTextureViewType.TV2D : {

            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_2D;

            let glTexture = gl.createTexture();
            if(glTexture) {
                gpuTexture.glTexture = glTexture;

                if (device.stateCache.glTex2DUnits[device.stateCache.texUnit] !== gpuTexture.glTexture) {
                    gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                    device.stateCache.glTex2DUnits[device.stateCache.texUnit] = gpuTexture.glTexture;
                }
    
                let w = gpuTexture.width;
                let h = gpuTexture.height;
    
                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for(let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                } else {
                    let view : ArrayBufferView = { buffer : new ArrayBuffer(0), byteLength : 0, byteOffset : 0 };
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.compressedTexImage2D(WebGLRenderingContext.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, view);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                }
            }

            break;
        }
        case GFXTextureViewType.CUBE : {

            gpuTexture.viewType = GFXTextureViewType.CUBE;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_CUBE_MAP;

            let glTexture = gl.createTexture();
            if (glTexture) {
                gpuTexture.glTexture = glTexture;

                if (device.stateCache.glTexCubeUnits[device.stateCache.texUnit] !== gpuTexture.glTexture) {
                    gl.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                    device.stateCache.glTexCubeUnits[device.stateCache.texUnit] = gpuTexture.glTexture;
                }

                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.texImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                } else {
                    let view : ArrayBufferView = { buffer : new ArrayBuffer(0), byteLength : 0, byteOffset : 0 };

                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for(let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.compressedTexImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, view);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                }
            }

            break;
        }
        default : {
            console.error("Unsupported GFXTextureType, create texture failed.");
            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_2D;
        }
    }
}

export function WebGLCmdFuncDestroyTexture(device : WebGLGFXDevice, gpuTexture : WebGLGPUTexture) {
    if (gpuTexture.glTexture > 0) {
        device.gl.deleteTexture(gpuTexture.glTexture);
        gpuTexture.glTexture = 0;
    }
}

export function WebGLCmdFuncCreateFramebuffer(device : WebGLGFXDevice, gpuFramebuffer : WebGLGPUFramebuffer) {

    if(!gpuFramebuffer.isOffscreen) {
        
        let gl : WebGLRenderingContext = <WebGLRenderingContext>device.gl;
        
        let glFramebuffer = gl.createFramebuffer();
        if (glFramebuffer) {
            gpuFramebuffer.glFramebuffer = glFramebuffer;

            if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
                gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
                device.stateCache.glFramebuffer = gpuFramebuffer.glFramebuffer;
            }
    
            for (let i = 0; i < gpuFramebuffer.gpuColorViews.length; ++i) {
                
                let gpuColorView = gpuFramebuffer.gpuColorViews[i];
                if (gpuColorView) {
                    gl.framebufferTexture2D(
                        WebGLRenderingContext.FRAMEBUFFER, 
                        WebGLRenderingContext.COLOR_ATTACHMENT0 + i, 
                        gpuColorView.gpuTexture.glTarget,
                        gpuColorView.gpuTexture.glTexture,
                        gpuColorView.baseLevel);
                }
            }
    
            if(gpuFramebuffer.gpuDepthStencilView) {
    
                let glAttachment = GFXFormatInfos[gpuFramebuffer.gpuDepthStencilView.format].hasStencil? 
                                    WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT : WebGLRenderingContext.DEPTH_ATTACHMENT;
    
                gl.framebufferTexture2D(
                    WebGLRenderingContext.FRAMEBUFFER, 
                    glAttachment, 
                    gpuFramebuffer.gpuDepthStencilView.gpuTexture.glTarget,
                    gpuFramebuffer.gpuDepthStencilView.gpuTexture.glTexture,
                    gpuFramebuffer.gpuDepthStencilView.baseLevel);
            }
        }
    }
}

export function WebGLCmdFuncDestroyFramebuffer(device : WebGLGFXDevice, gpuFramebuffer : WebGLGPUFramebuffer) {
    if (gpuFramebuffer.glFramebuffer > 0) {
        device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
        gpuFramebuffer.glFramebuffer = 0;
    }
}

export function WebGLCmdFuncCreateShader(device : WebGLGFXDevice, gpuShader : WebGLGPUShader) {
    let gl : WebGLRenderingContext = <WebGLRenderingContext>device.gl;

    for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
        let gpuStage = gpuShader.gpuStages[i];

        let glShaderType : GLenum = 0;
        let shaderTypeStr = "";

        switch (gpuStage.type) {
            case GFXShaderType.VERTEX: {
                shaderTypeStr = "VertexShader";
                glShaderType = WebGLRenderingContext.VERTEX_SHADER;
                break;
            }
            case GFXShaderType.FRAGMENT: {
                shaderTypeStr = "FragmentShader";
                glShaderType = WebGLRenderingContext.FRAGMENT_SHADER;
                break;
            }
            default: {
                console.error("Unsupported GFXShaderType.");
                return ;
            }
        }

        let glShader = gl.createShader(glShaderType);
        if (glShader) {
            gpuStage.glShader = glShader;
            gl.shaderSource(gpuStage.glShader, gpuStage.source);
            gl.compileShader(gpuStage.glShader);
    
            var isSuccess = gl.getShaderParameter(gpuStage.glShader, gl.COMPILE_STATUS);
            if (!isSuccess) {
                console.error(shaderTypeStr + " in '" + gpuShader.name + "' compilation failed.");
                console.error(gl.getShaderInfoLog(gpuStage.glShader));
            } else {
                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = 0;
            }
        }
    }

    let glProgram = gl.createProgram();
    if (glProgram) {
        gpuShader.glProgram = glProgram;

        // link program
        for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
            let gpuStage = gpuShader.gpuStages[i];
    
            gl.attachShader(gpuShader.glProgram, gpuStage.glShader);
        }
    }

    gl.linkProgram(gpuShader.glProgram);
    var isSuccess = gl.getProgramParameter(gpuShader.glProgram, gl.LINK_STATUS);
    if(!isSuccess) {
        console.error("Failed to link shader '" + gpuShader.name + "'.");
        console.error(gl.getProgramInfoLog(gpuShader.glProgram));
        
        for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
            let gpuStage = gpuShader.gpuStages[i];
            if(gpuStage.glShader > 0) {
                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = 0;
            }
        }
    }

    // parse inputs
    let activeAttribCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_ATTRIBUTES);
    gpuShader.glInputs = new Array<WebGLGPUInput>(activeAttribCount);

    for (let i = 0; i < activeAttribCount; ++i) {
        let info = gl.getActiveAttrib(gpuShader.glProgram, i);
        if(info) {
            let glLoc = gl.getAttribLocation(gpuShader.glProgram, info.name);
            
            let varName : string;
            let nameOffset = info.name.search('[');
            if (nameOffset !== -1) {
                varName = info.name.substr(0, nameOffset);
            } else {
                varName = info.name;
            }

            let type = WebGLTypeToGFXType(info.type);
            let stride = WebGLGetTypeSize(info.type);

            gpuShader.glInputs[i] = {
                binding : -1,
                name : varName,
                type : type,
                stride : stride,
                count : info.size,
                size : stride * info.size,
                
                glType : info.type,
                glLoc : glLoc,
            };
        }
    }

    // parse uniforms
    let activeUniformCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_UNIFORMS);
    let unitIdx = 0;

    for (let i = 0; i < activeAttribCount; ++i) {
        let info = gl.getActiveUniform(gpuShader.glProgram, i);
        if(info) {
            let glLoc = gl.getUniformLocation(gpuShader.glProgram, info.name);
            if(glLoc) {
                let varName : string;
                let nameOffset = info.name.search('[');
                if (nameOffset !== -1) {
                    varName = info.name.substr(0, nameOffset);
                } else {
                    varName = info.name;
                }
    
                let type = WebGLTypeToGFXType(info.type);

                let isSampler = (type === WebGLRenderingContext.SAMPLER_2D) ||
                                (type === WebGLRenderingContext.SAMPLER_CUBE);

                if(!isSampler) {
                    let stride = WebGLGetTypeSize(info.type);
    
                    gpuShader.glUniforms.push({
                        binding : -1,
                        name : varName,
                        type : type,
                        stride : stride,
                        count : info.size,
                        size : stride * info.size,
                        offset : 0,
                        
                        glType : info.type,
                        glLoc : glLoc,
                    });
                } else {

                    let units = new Array<number>(info.size);
                    for(let u = 0; u < info.size; ++u) {
                        units[u] = unitIdx + u;
                    }

                    gpuShader.glSamplers.push({
                        binding : -1,
                        name : varName,
                        type : type,
                        units : units,
                        
                        glType : info.type,
                        glLoc : glLoc,
                    });

                    unitIdx += info.size;
                }
            }
        }
    }
}

export function WebGLCmdFuncDestroyShader(device : WebGLGFXDevice, gpuShader : WebGLGPUShader) {

    for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
        let gpuStage = gpuShader.gpuStages[i];

        if (gpuStage.glShader > 0) {
            device.gl.deleteShader(gpuStage.glShader);
            gpuStage.glShader = 0;
        }
    }
    
    if (gpuShader.glProgram > 0) {
        device.gl.deleteProgram(gpuShader.glProgram);
        gpuShader.glProgram = 0;
    }
}