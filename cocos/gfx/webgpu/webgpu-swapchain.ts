import { BufferTextureCopy, Format, SurfaceTransform, SwapchainInfo, TextureFlagBit, TextureInfo, TextureType, TextureUsageBit } from '../base/define';
import { Texture } from '../base/texture';
import { Swapchain } from '../base/swapchain';
import { WebGPUTexture } from './webgpu-texture';
import { WebGPUStateCache } from './webgpu-state-cache';
import { debug, warn, warnID } from '../../core';
import { WebGPUDeviceManager } from './define';
import { WGPUFormatToGFXFormat } from './webgpu-commands';
import { IWebGPUBlitManager } from './webgpu-gpu-objects';
/**
 * @en GFX Swapchain implementation based on WebGPU.
 * @zh 基于 WebGPU 的 GFX 交换链实现。
 */
export class WebGPUSwapchain extends Swapchain {

    public stateCache: WebGPUStateCache = new WebGPUStateCache();
    public nullTex2D: WebGPUTexture = null!;
    public nullTexCube: WebGPUTexture = null!;
    private _canvas: HTMLCanvasElement | null = null;
    private _blitManager: IWebGPUBlitManager | null = null;
    
    get blitManager (): IWebGPUBlitManager | null {
        return this._blitManager;
    }
    private _webGPUDeviceLostHandler: ((info: GPUDeviceLostInfo) => void) | null = null; 
    public override initialize(info: Readonly<SwapchainInfo>): void {
        this._canvas = info.windowHandle;

        
        this._webGPUDeviceLostHandler = this._onWebGPUDeviceLost.bind(this);
        const device = WebGPUDeviceManager.instance;
        const nativeDevice = device.nativeDevice as GPUDevice;
        nativeDevice.lost.then(this._webGPUDeviceLostHandler);
        const capabilities = device.capabilities;
        this.stateCache.initialize(
            capabilities.maxTextureUnits,
            capabilities.maxUniformBufferBindings,
            capabilities.maxVertexAttributes
        );

        const { width, height } = info;
        
        this._colorTexture = this._createTexture(width, height);
        this._depthStencilTexture = this._createDepthStencilTexture(width, height);
        this.nullTex2D = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.SAMPLED,
            Format.RGBA8,
            2,
            2,
            TextureFlagBit.NONE
        ))  as WebGPUTexture;
        this.nullTexCube = device.createTexture(new TextureInfo(
            TextureType.CUBE,
            TextureUsageBit.SAMPLED,
            Format.RGBA8,
            2,
            2,
            TextureFlagBit.NONE,
            6,
        ))  as WebGPUTexture;
        
        const nullTexRegion = new BufferTextureCopy();
        nullTexRegion.texExtent.width = 2;
        nullTexRegion.texExtent.height = 2;

        const nullTexBuff = new Uint8Array(this.nullTex2D.size);
        nullTexBuff.fill(0);
        device.copyBuffersToTexture([nullTexBuff], this.nullTex2D, [nullTexRegion]);

        nullTexRegion.texSubres.layerCount = 6;
        device.copyBuffersToTexture(
            [nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff],
            this.nullTexCube,
            [nullTexRegion],
        );

        this._blitManager = new IWebGPUBlitManager();
    }

    public override resize(width: number, height: number, surfaceTransform: SurfaceTransform): void {
        if (this._colorTexture.width !== width || this._colorTexture.height !== height) {
            debug(`Resizing swapchain: ${width}x${height}`);
            this._canvas!.width = width;
            this._canvas!.height = height;
            this._colorTexture.resize(width, height);
            this._depthStencilTexture.resize(width, height);
        }
    }

    public override destroy(): void {
        if (this._canvas && this._webGPUDeviceLostHandler) {
            this._webGPUDeviceLostHandler = null;
        }

        if (this.nullTex2D) {
            this.nullTex2D.destroy();
            this.nullTex2D = null!;
        }

        if (this.nullTexCube) {
            this.nullTexCube.destroy();
            this.nullTexCube = null!;
        }

        if (this._blitManager) {
            this._blitManager.destroy();
            this._blitManager = null;
        }
        this._canvas = null;
    }

    public get colorTexture(): Texture {
        return this._colorTexture;
    }

    public get depthStencilTexture(): Texture {
        return this._depthStencilTexture!;
    }

    private _createTexture(width: number, height: number): WebGPUTexture {
        const device = WebGPUDeviceManager.instance;
        const swapchainFormat = navigator.gpu.getPreferredCanvasFormat();
        const nativeDevice = device.nativeDevice as GPUDevice;
        const gpuConfig: GPUCanvasConfiguration = {
            device: nativeDevice,
            format: swapchainFormat,
        };
        device.gpuConfig = gpuConfig;
        device.context.configure(gpuConfig);
        const colorTex = new WebGPUTexture();
        colorTex.initAsSwapchainTexture({
            swapchain: this,
            format: WGPUFormatToGFXFormat(swapchainFormat),
            width: width,
            height: height
        });
        colorTex.gpuTexture.glTexture = device.context.getCurrentTexture();
        return colorTex;
    }

    private _createDepthStencilTexture(width: number, height: number): WebGPUTexture {
        const device = WebGPUDeviceManager.instance;
        const depthInfo = new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.DEPTH_STENCIL_ATTACHMENT | TextureUsageBit.SAMPLED,
            Format.DEPTH_STENCIL,
            width, height)
        const depthTexture = device.createTexture(depthInfo);
        return depthTexture as WebGPUTexture;
    }

    private _onWebGPUDeviceLost (info: GPUDeviceLostInfo): void {
        warnID(11000);
        warn(event);
    }
}
