/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { ALIPAY, RUNTIME_BASED, BYTEDANCE, WECHAT, LINKSURE, QTT, COCOSPLAY, HUAWEI, EDITOR } from 'internal:constants';
import { macro, warnID, warn, debug } from '../../platform';
import { sys } from '../../platform/sys';
import { WebGLCommandAllocator } from './webgl-command-allocator';
import { WebGLStateCache } from './webgl-state-cache';
import { WebGLTexture } from './webgl-texture';
import { Format, TextureInfo, TextureFlagBit, TextureType, TextureUsageBit,
    BufferTextureCopy, SwapchainInfo, SurfaceTransform } from '../base/define';
import { BrowserType, OS } from '../../../../pal/system-info/enum-type';
import { Swapchain } from '../base/swapchain';
import { IWebGLExtensions, WebGLDeviceManager } from './webgl-define';

const eventWebGLContextLost = 'webglcontextlost';

function initStates (gl: WebGLRenderingContext) {
    gl.activeTexture(gl.TEXTURE0);
    gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // rasterizer state
    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.0, 0.0);

    // depth stencil state
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.depthFunc(gl.LESS);
    gl.depthRange(0.0, 1.0);

    gl.stencilFuncSeparate(gl.FRONT, gl.ALWAYS, 1, 0xffff);
    gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilMaskSeparate(gl.FRONT, 0xffff);
    gl.stencilFuncSeparate(gl.BACK, gl.ALWAYS, 1, 0xffff);
    gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.KEEP);
    gl.stencilMaskSeparate(gl.BACK, 0xffff);

    gl.disable(gl.STENCIL_TEST);

    // blend state
    gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
    gl.disable(gl.BLEND);
    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
    gl.colorMask(true, true, true, true);
    gl.blendColor(0.0, 0.0, 0.0, 0.0);
}

function getExtension (gl: WebGLRenderingContext, ext: string): any {
    const prefixes = ['', 'WEBKIT_', 'MOZ_'];
    for (let i = 0; i < prefixes.length; ++i) {
        const _ext = gl.getExtension(prefixes[i] + ext);
        if (_ext) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return _ext;
        }
    }
    return null;
}

export function getExtensions (gl: WebGLRenderingContext) {
    const res: IWebGLExtensions = {
        EXT_texture_filter_anisotropic: getExtension(gl, 'EXT_texture_filter_anisotropic'),
        EXT_blend_minmax: getExtension(gl, 'EXT_blend_minmax'),
        EXT_frag_depth: getExtension(gl, 'EXT_frag_depth'),
        EXT_shader_texture_lod: getExtension(gl, 'EXT_shader_texture_lod'),
        EXT_sRGB: getExtension(gl, 'EXT_sRGB'),
        OES_vertex_array_object: getExtension(gl, 'OES_vertex_array_object'),
        EXT_color_buffer_half_float: getExtension(gl, 'EXT_color_buffer_half_float'),
        WEBGL_multi_draw: getExtension(gl, 'WEBGL_multi_draw'),
        WEBGL_color_buffer_float: getExtension(gl, 'WEBGL_color_buffer_float'),
        WEBGL_compressed_texture_etc1: getExtension(gl, 'WEBGL_compressed_texture_etc1'),
        WEBGL_compressed_texture_etc: getExtension(gl, 'WEBGL_compressed_texture_etc'),
        WEBGL_compressed_texture_pvrtc: getExtension(gl, 'WEBGL_compressed_texture_pvrtc'),
        WEBGL_compressed_texture_s3tc: getExtension(gl, 'WEBGL_compressed_texture_s3tc'),
        WEBGL_compressed_texture_s3tc_srgb: getExtension(gl, 'WEBGL_compressed_texture_s3tc_srgb'),
        WEBGL_debug_shaders: getExtension(gl, 'WEBGL_debug_shaders'),
        WEBGL_draw_buffers: getExtension(gl, 'WEBGL_draw_buffers'),
        WEBGL_lose_context: getExtension(gl, 'WEBGL_lose_context'),
        WEBGL_depth_texture: getExtension(gl, 'WEBGL_depth_texture'),
        OES_texture_half_float: getExtension(gl, 'OES_texture_half_float'),
        OES_texture_half_float_linear: getExtension(gl, 'OES_texture_half_float_linear'),
        OES_texture_float: getExtension(gl, 'OES_texture_float'),
        OES_texture_float_linear: getExtension(gl, 'OES_texture_float_linear'),
        OES_standard_derivatives: getExtension(gl, 'OES_standard_derivatives'),
        OES_element_index_uint: getExtension(gl, 'OES_element_index_uint'),
        ANGLE_instanced_arrays: getExtension(gl, 'ANGLE_instanced_arrays'),
        WEBGL_debug_renderer_info: getExtension(gl, 'WEBGL_debug_renderer_info'),
        WEBGL_compressed_texture_astc: null,
        destroyShadersImmediately: true,
        noCompressedTexSubImage2D: false,
        isLocationActive: (glLoc: unknown): glLoc is WebGLUniformLocation => !!glLoc,
        useVAO: false,
    };

    // platform-specific extension hacks
    // eslint-disable-next-line no-lone-blocks
    {
        // iOS 14 browsers crash on getExtension('WEBGL_compressed_texture_astc')
        if (sys.os !== OS.IOS || sys.osMainVersion !== 14 || !sys.isBrowser) {
            res.WEBGL_compressed_texture_astc = getExtension(gl, 'WEBGL_compressed_texture_astc');
        }

        // UC browser instancing implementation doesn't work
        if (sys.browserType === BrowserType.UC) {
            res.ANGLE_instanced_arrays = null;
        }

        // bytedance ios depth texture implementation doesn't work
        if (BYTEDANCE && sys.os === OS.IOS) {
            res.WEBGL_depth_texture = null;
        }

        if (RUNTIME_BASED) {
            // VAO implementations doesn't work well on some runtime platforms
            if (LINKSURE || QTT || COCOSPLAY || HUAWEI) {
                res.OES_vertex_array_object = null;
            }
        }

        // some earlier version of iOS and android wechat implement gl.detachShader incorrectly
        if ((sys.os === OS.IOS && sys.osMainVersion <= 10)
            || (WECHAT && sys.os === OS.ANDROID)) {
            res.destroyShadersImmediately = false;
        }

        // compressedTexSubImage2D has always been problematic because the
        // parameters differs slightly from GLES, and many platforms get it wrong
        if (WECHAT) {
            res.noCompressedTexSubImage2D = true;
        }

        // getUniformLocation too [eyerolling]
        if (WECHAT) {
            // wEcHaT just returns { id: -1 } for inactive names
            res.isLocationActive = (glLoc: unknown): glLoc is WebGLUniformLocation => !!glLoc && (glLoc as { id: number }).id !== -1;
        }
        if (ALIPAY) {
            // aLiPaY just returns the location number directly on actual devices, and WebGLUniformLocation objects in simulators
            res.isLocationActive = (glLoc: unknown): glLoc is WebGLUniformLocation => !!glLoc && glLoc !== -1 || glLoc === 0;
        }
    }

    if (res.OES_vertex_array_object) {
        res.useVAO = true;
    }

    return res;
}

export class WebGLSwapchain extends Swapchain {
    get gl () {
        return this._webGLRC as WebGLRenderingContext;
    }

    get extensions () {
        return this._extensions as IWebGLExtensions;
    }

    public stateCache: WebGLStateCache = new WebGLStateCache();
    public cmdAllocator: WebGLCommandAllocator = new WebGLCommandAllocator();
    public nullTex2D: WebGLTexture = null!;
    public nullTexCube: WebGLTexture = null!;

    private _canvas: HTMLCanvasElement | null = null;
    private _webGLRC: WebGLRenderingContext | null = null;
    private _webGLContextLostHandler: ((event: Event) => void) | null = null;
    private _extensions: IWebGLExtensions | null = null;

    public initialize (info: SwapchainInfo) {
        this._canvas = info.windowHandle;

        try {
            const webGLCtxAttribs: WebGLContextAttributes = {
                alpha: macro.ENABLE_TRANSPARENT_CANVAS,
                antialias: EDITOR || macro.ENABLE_WEBGL_ANTIALIAS,
                depth: true,
                stencil: true,
                premultipliedAlpha: false,
                preserveDrawingBuffer: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
            };

            this._webGLRC = this._canvas.getContext('webgl', webGLCtxAttribs);
        } catch (err) {
            return;
        }

        if (!this._webGLRC) {
            return;
        }

        this._webGLContextLostHandler = this._onWebGLContextLost.bind(this);
        this._canvas.addEventListener(eventWebGLContextLost, this._onWebGLContextLost);

        const gl = this.gl;

        this.stateCache.initialize(
            WebGLDeviceManager.instance.capabilities.maxTextureUnits,
            WebGLDeviceManager.instance.capabilities.maxVertexAttributes,
        );

        this._extensions = getExtensions(gl);

        // init states
        initStates(gl);

        const colorFmt = Format.RGBA8;
        let depthStencilFmt = Format.DEPTH_STENCIL;

        let depthBits = gl.getParameter(gl.DEPTH_BITS);
        const stencilBits = gl.getParameter(gl.STENCIL_BITS);

        if (ALIPAY) {
            depthBits = 24;
        }

        if (depthBits && stencilBits) depthStencilFmt = Format.DEPTH_STENCIL;
        else if (depthBits) depthStencilFmt = Format.DEPTH;

        this._colorTexture = new WebGLTexture();
        // @ts-expect-error(2445) private initializer
        this._colorTexture.initAsSwapchainTexture({
            swapchain: this,
            format: colorFmt,
            width: info.width,
            height: info.height,
        });

        this._depthStencilTexture = new WebGLTexture();
        // @ts-expect-error(2445) private initializer
        this._depthStencilTexture.initAsSwapchainTexture({
            swapchain: this,
            format: depthStencilFmt,
            width: info.width,
            height: info.height,
        });

        // create default null texture
        this.nullTex2D = WebGLDeviceManager.instance.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.SAMPLED,
            Format.RGBA8,
            2,
            2,
            TextureFlagBit.GEN_MIPMAP,
        )) as WebGLTexture;

        this.nullTexCube = WebGLDeviceManager.instance.createTexture(new TextureInfo(
            TextureType.CUBE,
            TextureUsageBit.SAMPLED,
            Format.RGBA8,
            2,
            2,
            TextureFlagBit.GEN_MIPMAP,
            6,
        )) as WebGLTexture;

        const nullTexRegion = new BufferTextureCopy();
        nullTexRegion.texExtent.width = 2;
        nullTexRegion.texExtent.height = 2;

        const nullTexBuff = new Uint8Array(this.nullTex2D.size);
        nullTexBuff.fill(0);
        WebGLDeviceManager.instance.copyBuffersToTexture([nullTexBuff], this.nullTex2D, [nullTexRegion]);

        nullTexRegion.texSubres.layerCount = 6;
        WebGLDeviceManager.instance.copyBuffersToTexture(
            [nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff],
            this.nullTexCube, [nullTexRegion],
        );
    }

    public destroy (): void {
        if (this._canvas && this._webGLContextLostHandler) {
            this._canvas.removeEventListener(eventWebGLContextLost, this._webGLContextLostHandler);
            this._webGLContextLostHandler = null;
        }

        if (this.nullTex2D) {
            this.nullTex2D.destroy();
            this.nullTex2D = null!;
        }

        if (this.nullTexCube) {
            this.nullTexCube.destroy();
            this.nullTexCube = null!;
        }

        this._extensions = null;
        this._webGLRC = null;
        this._canvas = null;
    }

    public resize (width: number, height: number, surfaceTransform: SurfaceTransform) {
        if (this._colorTexture.width !== width || this._colorTexture.height !== height) {
            debug(`Resizing swapchain: ${width}x${height}`);
            this._canvas!.width = width;
            this._canvas!.height = height;
            this._colorTexture.resize(width, height);
            this._depthStencilTexture.resize(width, height);
        }
    }

    private _onWebGLContextLost (event: Event) {
        warnID(11000);
        warn(event);
        // 2020.9.3: `preventDefault` is not available on some platforms
        // event.preventDefault();
    }
}
