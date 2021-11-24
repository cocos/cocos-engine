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

import { EDITOR } from 'internal:constants';
import { warnID, warn, debug } from '../../platform/debug';
import { macro } from '../../platform/macro';
import { WebGL2StateCache } from './webgl2-state-cache';
import { WebGL2Texture } from './webgl2-texture';
import { Format, TextureInfo, TextureFlagBit, TextureType,
    TextureUsageBit, BufferTextureCopy, SwapchainInfo, SurfaceTransform } from '../base/define';
import { Swapchain } from '../base/swapchain';
import { IWebGL2Extensions, WebGL2DeviceManager } from './webgl2-define';

const eventWebGLContextLost = 'webglcontextlost';

function initStates (gl: WebGL2RenderingContext) {
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
    gl.polygonOffset(0.0, 0.0);

    // depth stencil state
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.depthFunc(gl.LESS);

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

function getExtension (gl: WebGL2RenderingContext, ext: string): any {
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

export function getExtensions (gl: WebGL2RenderingContext) {
    const res: IWebGL2Extensions = {
        EXT_texture_filter_anisotropic: getExtension(gl, 'EXT_texture_filter_anisotropic'),
        EXT_color_buffer_half_float: getExtension(gl, 'EXT_color_buffer_half_float'),
        EXT_color_buffer_float: getExtension(gl, 'EXT_color_buffer_float'),
        WEBGL_multi_draw: getExtension(gl, 'WEBGL_multi_draw'),
        WEBGL_compressed_texture_etc1: getExtension(gl, 'WEBGL_compressed_texture_etc1'),
        WEBGL_compressed_texture_etc: getExtension(gl, 'WEBGL_compressed_texture_etc'),
        WEBGL_compressed_texture_pvrtc: getExtension(gl, 'WEBGL_compressed_texture_pvrtc'),
        WEBGL_compressed_texture_astc: getExtension(gl, 'WEBGL_compressed_texture_astc'),
        WEBGL_compressed_texture_s3tc: getExtension(gl, 'WEBGL_compressed_texture_s3tc'),
        WEBGL_compressed_texture_s3tc_srgb: getExtension(gl, 'WEBGL_compressed_texture_s3tc_srgb'),
        WEBGL_debug_shaders: getExtension(gl, 'WEBGL_debug_shaders'),
        WEBGL_lose_context: getExtension(gl, 'WEBGL_lose_context'),
        WEBGL_debug_renderer_info: getExtension(gl, 'WEBGL_debug_renderer_info'),
        OES_texture_half_float_linear: getExtension(gl, 'OES_texture_half_float_linear'),
        OES_texture_float_linear: getExtension(gl, 'OES_texture_float_linear'),
        useVAO: true,
    };

    return res;
}

export function getContext (canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
    let context: WebGL2RenderingContext | null = null;
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

        context = canvas.getContext('webgl2', webGLCtxAttribs);
    } catch (err) {
        return null;
    }

    return context;
}

export class WebGL2Swapchain extends Swapchain {
    get extensions () {
        return this._extensions as IWebGL2Extensions;
    }

    public stateCache: WebGL2StateCache = new WebGL2StateCache();
    public nullTex2D: WebGL2Texture = null!;
    public nullTexCube: WebGL2Texture = null!;

    private _canvas: HTMLCanvasElement | null = null;
    private _webGL2ContextLostHandler: ((event: Event) => void) | null = null;
    private _extensions: IWebGL2Extensions | null = null;

    public initialize (info: SwapchainInfo) {
        this._canvas = info.windowHandle;

        this._webGL2ContextLostHandler = this._onWebGLContextLost.bind(this);
        this._canvas.addEventListener(eventWebGLContextLost, this._onWebGLContextLost);

        const gl = WebGL2DeviceManager.instance.gl;

        this.stateCache.initialize(
            WebGL2DeviceManager.instance.capabilities.maxTextureUnits,
            WebGL2DeviceManager.instance.capabilities.maxUniformBufferBindings,
            WebGL2DeviceManager.instance.capabilities.maxVertexAttributes,
        );

        this._extensions = getExtensions(gl);

        // init states
        initStates(gl);

        const colorFmt = Format.RGBA8;
        let depthStencilFmt = Format.DEPTH_STENCIL;

        const depthBits = gl.getParameter(gl.DEPTH_BITS);
        const stencilBits = gl.getParameter(gl.STENCIL_BITS);

        if (depthBits && stencilBits) depthStencilFmt = Format.DEPTH_STENCIL;
        else if (depthBits) depthStencilFmt = Format.DEPTH;

        this._colorTexture = new WebGL2Texture();
        // @ts-expect-error(2445) private initializer
        this._colorTexture.initAsSwapchainTexture({
            swapchain: this,
            format: colorFmt,
            width: info.width,
            height: info.height,
        });

        this._depthStencilTexture = new WebGL2Texture();
        // @ts-expect-error(2445) private initializer
        this._depthStencilTexture.initAsSwapchainTexture({
            swapchain: this,
            format: depthStencilFmt,
            width: info.width,
            height: info.height,
        });

        // create default null texture
        this.nullTex2D = WebGL2DeviceManager.instance.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.SAMPLED,
            Format.RGBA8,
            2,
            2,
            TextureFlagBit.GEN_MIPMAP,
        )) as WebGL2Texture;

        this.nullTexCube = WebGL2DeviceManager.instance.createTexture(new TextureInfo(
            TextureType.CUBE,
            TextureUsageBit.SAMPLED,
            Format.RGBA8,
            2,
            2,
            TextureFlagBit.GEN_MIPMAP,
            6,
        )) as WebGL2Texture;

        const nullTexRegion = new BufferTextureCopy();
        nullTexRegion.texExtent.width = 2;
        nullTexRegion.texExtent.height = 2;

        const nullTexBuff = new Uint8Array(this.nullTex2D.size);
        nullTexBuff.fill(0);
        WebGL2DeviceManager.instance.copyBuffersToTexture([nullTexBuff], this.nullTex2D, [nullTexRegion]);

        nullTexRegion.texSubres.layerCount = 6;
        WebGL2DeviceManager.instance.copyBuffersToTexture(
            [nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff],
            this.nullTexCube, [nullTexRegion],
        );
    }

    public destroy (): void {
        if (this._canvas && this._webGL2ContextLostHandler) {
            this._canvas.removeEventListener(eventWebGLContextLost, this._webGL2ContextLostHandler);
            this._webGL2ContextLostHandler = null;
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
