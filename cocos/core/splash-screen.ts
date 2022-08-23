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

import { EDITOR, NATIVE, PREVIEW } from 'internal:constants';
import * as easing from './easing/easing';
import { Material } from './assets/material';
import { clamp01 } from './math/utils';
import {
    Sampler, SamplerInfo, Shader, Texture, TextureInfo, Device, InputAssembler, InputAssemblerInfo, Attribute, Buffer,
    BufferInfo, Rect, Color, BufferTextureCopy, Framebuffer, CommandBuffer, BufferUsageBit, Format,
    MemoryUsageBit, TextureType, TextureUsageBit, Address, SurfaceTransform, Swapchain,
} from './gfx';
import { PipelineStateManager } from './pipeline';
import { legacyCC } from './global-exports';
import { SetIndex } from './pipeline/define';
import { Mat4, Vec2 } from './math';
import { Settings, settings } from './settings';
import { sys } from './platform/sys';

const v2_0 = new Vec2();
type SplashEffectType = 'NONE' | 'FADE-INOUT';
interface ISplashSetting {
    enabled: boolean;
    totalTime: number;
    base64src: string;
    effect: SplashEffectType;
    clearColor: Color;
    displayRatio: number;
    displayWatermark: boolean;
}

type Writable<T> = { -readonly [K in keyof T]: T[K] };

export class SplashScreen {
    private settings!: ISplashSetting;
    private _curTime = 0;

    private device!: Device;
    private swapchain!: Swapchain;
    private shader!: Shader;
    private sampler!: Sampler;
    private cmdBuff!: CommandBuffer;
    private quadAssmebler!: InputAssembler;
    private vertexBuffers!: Buffer;
    private indicesBuffers!: Buffer;
    private framebuffer!: Framebuffer;
    private renderArea!: Rect;
    private clearColors!: Color[];
    private projection!: Mat4;

    private logoMat!: Material;
    private logoImage!: TexImageSource;
    private logoTexture!: Texture;

    private watermarkMat!: Material;
    private watermarkTexture!: Texture;

    public get isFinished () {
        return this._curTime >= this.settings.totalTime;
    }

    set curTime (val) {
        this._curTime = val;
    }

    get curTime () {
        return this._curTime;
    }

    public init (): Promise<void> | undefined {
        this.settings = {
            enabled: settings.querySettings<boolean>(Settings.Category.SPLASH_SCREEN, 'enabled') ?? true,
            totalTime: settings.querySettings<number>(Settings.Category.SPLASH_SCREEN, 'totalTime') ?? 3000,
            base64src: settings.querySettings<string>(Settings.Category.SPLASH_SCREEN, 'base64src') ?? '',
            effect: settings.querySettings<SplashEffectType>(Settings.Category.SPLASH_SCREEN, 'effect') ?? 'FADE-INOUT',
            clearColor: settings.querySettings<Color>(Settings.Category.SPLASH_SCREEN, 'clearColor') ?? new Color(0.88, 0.88, 0.88, 1),
            displayRatio: settings.querySettings<number>(Settings.Category.SPLASH_SCREEN, 'displayRatio') ?? 0.4,
            displayWatermark: settings.querySettings<boolean>(Settings.Category.SPLASH_SCREEN, 'displayWatermark') ?? true,
        };
        this._curTime = 0;

        if (EDITOR || PREVIEW || !this.settings.enabled || this.settings.base64src === '' || this.settings.totalTime <= 0) {
            this.settings.totalTime = 0;
        } else {
            this.device = legacyCC.director.root!.device;
            this.swapchain = legacyCC.director.root!.mainWindow!.swapchain;
            this.framebuffer = legacyCC.director.root!.mainWindow!.framebuffer;

            this.preInit();
            if (this.settings.displayWatermark) this.initWarterMark();
            return new Promise<void>((resolve, reject) => {
                this.logoImage = new Image();
                this.logoImage.onload = () => {
                    this.initLogo();
                    resolve();
                };
                this.logoImage.onerror = () => {
                    reject();
                };
                this.logoImage.src = this.settings.base64src;
            });
        }
        return Promise.resolve();
    }

    private preInit () {
        // this.setting.clearColor may not an instance of Color, so should create
        // Color manually, or will have problem on native.
        const clearColor = this.settings.clearColor;
        this.clearColors = [new Color(clearColor.x, clearColor.y, clearColor.z, clearColor.w)];
        const { device, swapchain } = this;
        this.renderArea = new Rect(0, 0, swapchain.width, swapchain.height);
        this.cmdBuff = device.commandBuffer;

        // create input assembler
        // create vertex buffer
        const verts = new Float32Array([0.5, 0.5, 1, 0, -0.5, 0.5, 0, 0, 0.5, -0.5, 1, 1, -0.5, -0.5, 0, 1]);
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;
        this.vertexBuffers = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE, vbSize, vbStride,
        ));
        this.vertexBuffers.update(verts);

        // create index buffer
        const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;
        this.indicesBuffers = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE, ibSize, ibStride,
        ));
        this.indicesBuffers.update(indices);

        const attributes: Attribute[] = [
            new Attribute('a_position', Format.RG32F),
            new Attribute('a_texCoord', Format.RG32F),
        ];
        const IAInfo = new InputAssemblerInfo(attributes, [this.vertexBuffers], this.indicesBuffers);
        this.quadAssmebler = device.createInputAssembler(IAInfo);

        this.projection = new Mat4();
        Mat4.ortho(this.projection, -1, 1, -1, 1, -1, 1, device.capabilities.clipSpaceMinZ,
            device.capabilities.clipSpaceSignY, swapchain.surfaceTransform);
    }

    public update (deltaTime: number) {
        const settings = this.settings;
        const { device, swapchain } = this;
        Mat4.ortho(this.projection, -1, 1, -1, 1, -1, 1, device.capabilities.clipSpaceMinZ,
            device.capabilities.clipSpaceSignY, swapchain.surfaceTransform);
        const dw = swapchain.width; const dh = swapchain.height;
        const refW = dw < dh ? dw : dh;
        // update logo uniform
        this._curTime += deltaTime * 1000;
        const percent = clamp01(this._curTime / settings.totalTime);
        let u_p = easing.cubicOut(percent);
        if (settings.effect === 'NONE') u_p = 1.0;
        const logoTW = this.logoTexture.width; const logoTH = this.logoTexture.height;
        const logoW = refW * settings.displayRatio;
        let scaleX = logoW * logoTW / logoTH;
        let scaleY = logoW;
        if (swapchain.surfaceTransform === SurfaceTransform.ROTATE_90
            || swapchain.surfaceTransform === SurfaceTransform.ROTATE_270) {
            scaleX = logoW * dw / dh;
            scaleY = logoW * logoTH / logoTW * dh / dw;
        }
        this.logoMat.setProperty('resolution', v2_0.set(dw, dh), 0);
        this.logoMat.setProperty('scale', v2_0.set(scaleX, scaleY), 0);
        this.logoMat.setProperty('translate', v2_0.set(dw * 0.5, dh * 0.5), 0);
        this.logoMat.setProperty('percent', u_p);
        this.logoMat.setProperty('u_projection', this.projection);
        this.logoMat.passes[0].update();

        // update wartermark uniform
        if (settings.displayWatermark && this.watermarkMat) {
            const wartermarkW = refW * 0.5;
            const wartermarkTW = this.watermarkTexture.width; const wartermarkTH = this.watermarkTexture.height;
            let scaleX = wartermarkW;
            let scaleY = wartermarkW * wartermarkTH / wartermarkTW;
            if (swapchain.surfaceTransform === SurfaceTransform.ROTATE_90
                || swapchain.surfaceTransform === SurfaceTransform.ROTATE_270) {
                scaleX = wartermarkW * 0.5;
                scaleY = wartermarkW * dw / dh * 0.5;
            }
            this.watermarkMat.setProperty('resolution', v2_0.set(dw, dh), 0);
            this.watermarkMat.setProperty('scale', v2_0.set(scaleX, scaleY), 0);
            this.watermarkMat.setProperty('translate', v2_0.set(dw * 0.5, dh * 0.1), 0);
            this.watermarkMat.setProperty('percent', u_p);
            this.watermarkMat.setProperty('u_projection', this.projection);
            this.watermarkMat.passes[0].update();
        }
        this.frame();
    }

    private initLogo () {
        const device = this.device;

        this.logoMat = new Material();
        this.logoMat.initialize({ effectName: 'util/splash-screen' });

        const samplerInfo = new SamplerInfo();
        samplerInfo.addressU = Address.CLAMP;
        samplerInfo.addressV = Address.CLAMP;
        samplerInfo.addressW = Address.CLAMP;
        this.sampler = device.getSampler(samplerInfo);

        this.logoTexture = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.SAMPLED | TextureUsageBit.TRANSFER_DST,
            Format.RGBA8,
            this.logoImage.width,
            this.logoImage.height,
        ));

        const pass = this.logoMat.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding, this.logoTexture);
        this.shader = pass.getShaderVariant()!;
        const descriptorSet = pass.descriptorSet;
        descriptorSet.bindSampler(binding, this.sampler);
        descriptorSet.update();

        const region = new BufferTextureCopy();
        region.texExtent.width = this.logoImage.width;
        region.texExtent.height = this.logoImage.height;
        region.texExtent.depth = 1;
        device.copyTexImagesToTexture([this.logoImage], this.logoTexture, [region]);
    }

    private initWarterMark () {
        // create texture from image
        const wartemarkImg = document.createElement('canvas');
        wartemarkImg.width = 330; wartemarkImg.height = 30;
        wartemarkImg.style.width = `${wartemarkImg.width}`;
        wartemarkImg.style.height = `${wartemarkImg.height}`;
        const ctx = wartemarkImg.getContext('2d')!;
        ctx.font = `${18}px Arial`; ctx.textBaseline = 'top'; ctx.textAlign = 'left'; ctx.fillStyle = '`#424242`';
        const text = 'Powered by Cocos Creator';
        const textMetrics = ctx.measureText(text);
        ctx.fillText(text, (330 - textMetrics.width) / 2, 6);
        const region = new BufferTextureCopy();
        region.texExtent.width = wartemarkImg.width;
        region.texExtent.height = wartemarkImg.height;
        region.texExtent.depth = 1;
        this.watermarkTexture = this.device.createTexture(new TextureInfo(
            TextureType.TEX2D, TextureUsageBit.SAMPLED | TextureUsageBit.TRANSFER_DST,
            Format.RGBA8, wartemarkImg.width, wartemarkImg.height,
        ));
        this.device.copyTexImagesToTexture([wartemarkImg], this.watermarkTexture, [region]);
        // create material
        this.watermarkMat = new Material();
        this.watermarkMat.initialize({ effectName: 'util/splash-screen' });
        const pass = this.watermarkMat.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding, this.watermarkTexture);
        pass.descriptorSet.update();
    }

    private frame () {
        const { device, swapchain } = this;

        if (!sys.isXR || xr.entry.isRenderAllowable()) {
            const renderSize = sys.isXR ? 2 : 1;
            for (let xrEye = 0; xrEye < renderSize; xrEye++) {
                if (sys.isXR) {
                    xr.entry.renderLoopStart(xrEye);
                }

                device.acquire([swapchain]);
                // record command
                const cmdBuff = this.cmdBuff;
                const framebuffer = this.framebuffer;
                const renderArea = this.renderArea;

                renderArea.width = swapchain.width;
                renderArea.height = swapchain.height;

                cmdBuff.begin();
                cmdBuff.beginRenderPass(framebuffer.renderPass, framebuffer, renderArea, this.clearColors, 1.0, 0);

                const logoPass = this.logoMat.passes[0];
                const logoPso = PipelineStateManager.getOrCreatePipelineState(device, logoPass, this.shader, framebuffer.renderPass, this.quadAssmebler);

                cmdBuff.bindPipelineState(logoPso);
                cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, logoPass.descriptorSet);
                cmdBuff.bindInputAssembler(this.quadAssmebler);
                cmdBuff.draw(this.quadAssmebler);

                if (this.settings.displayWatermark && this.watermarkMat) {
                    const wartermarkPass = this.watermarkMat.passes[0];
                    const watermarkPso = PipelineStateManager.getOrCreatePipelineState(device,
                        wartermarkPass, this.shader, framebuffer.renderPass, this.quadAssmebler);
                    cmdBuff.bindPipelineState(watermarkPso);
                    cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, wartermarkPass.descriptorSet);
                    cmdBuff.bindInputAssembler(this.quadAssmebler);
                    cmdBuff.draw(this.quadAssmebler);
                }

                cmdBuff.endRenderPass();
                cmdBuff.end();
                device.flushCommands([cmdBuff]);
                device.queue.submit([cmdBuff]);
                device.present();

                if (sys.isXR) {
                    xr.entry.renderLoopEnd(xrEye);
                }
            }
        }
    }

    private destroy () {
        this.device = null!;
        this.swapchain = null!;
        this.clearColors = null!;
        if ((this.logoImage as any).destroy) (this.logoImage as any).destroy();
        this.logoImage = null!;
        this.framebuffer = null!;
        this.renderArea = null!;
        this.cmdBuff = null!;
        this.shader = null!;
        this.logoMat.destroy();
        this.logoMat = null!;
        this.logoTexture.destroy();
        this.logoTexture = null!;
        this.quadAssmebler.destroy();
        this.quadAssmebler = null!;
        this.vertexBuffers.destroy();
        this.vertexBuffers = null!;
        this.indicesBuffers.destroy();
        this.indicesBuffers = null!;
        this.sampler = null!;

        /** text */
        if (this.watermarkTexture) {
            this.watermarkMat.destroy();
            this.watermarkMat = null!;
            this.watermarkTexture.destroy();
            this.watermarkTexture = null!;
        }

        this.settings = null!;
    }

    private static _ins?: SplashScreen;

    public static get instance () {
        if (!SplashScreen._ins) {
            SplashScreen._ins = new SplashScreen();
        }
        return SplashScreen._ins;
    }

    private constructor () { }
}

legacyCC.internal.SplashScreen = SplashScreen;
