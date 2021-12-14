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

/**
 * @packageDocumentation
 * @hidden
 */

/* eslint-disable no-restricted-globals */
import { JSB } from 'internal:constants';
import * as easing from './animation/easing';
import { Material } from './assets/material';
import { clamp01 } from './math/utils';
import {
    Sampler, SamplerInfo, Shader, Texture, TextureInfo, Device, InputAssembler, InputAssemblerInfo, Attribute, Buffer,
    BufferInfo, Rect, Color, BufferTextureCopy, Framebuffer, CommandBuffer, BufferUsageBit, Format,
    MemoryUsageBit, TextureType, TextureUsageBit, Address, SurfaceTransform,
} from './gfx';
import { PipelineStateManager } from './pipeline';
import { legacyCC } from './global-exports';
import { Root } from './root';
import { SetIndex } from './pipeline/define';
import { error } from './platform';
import { Mat4, Vec2 } from './math';

const v2_0 = new Vec2();
type SplashEffectType = 'NONE' | 'FADE-INOUT';
interface ISplashSetting {
    readonly totalTime: number;
    readonly base64src: string;
    readonly effect: SplashEffectType;
    readonly clearColor: Color;
    readonly displayRatio: number;
    readonly displayWatermark: boolean;
}

type Writable<T> = { -readonly [K in keyof T]: T[K] };

export class SplashScreen {
    private set splashFinish (v: boolean) {
        this._splashFinish = v;
        this._tryToStart();
    }
    public set loadFinish (v: boolean) {
        this._loadFinish = v;
        this._tryToStart();
    }

    private handle = 0;
    private settings!: ISplashSetting;
    private callBack: (() => void) | null = null;
    private cancelAnimate = false;
    private startTime = -1;
    private _splashFinish = false;
    private _loadFinish = false;
    private _directCall = false;

    private root!: Root;
    private device!: Device;
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

    public main (root: Root) {
        if (root == null) {
            error('RENDER ROOT IS NULL.');
            return;
        }

        if (window._CCSettings && window._CCSettings.splashScreen) {
            const setting: Writable<ISplashSetting> = this.settings = window._CCSettings.splashScreen;
            setting.totalTime = this.settings.totalTime != null ? this.settings.totalTime : 3000;
            setting.base64src = this.settings.base64src || '';
            setting.effect = this.settings.effect || 'FADE-INOUT';
            setting.clearColor = this.settings.clearColor || new Color(0.88, 0.88, 0.88, 1);
            setting.displayRatio = this.settings.displayRatio != null ? this.settings.displayRatio : 0.4;
            setting.displayWatermark = this.settings.displayWatermark != null ? this.settings.displayWatermark : true;
        } else {
            this.settings = {
                totalTime: 3000,
                base64src: '',
                effect: 'FADE-INOUT',
                clearColor: new Color(0.88, 0.88, 0.88, 1),
                displayRatio: 0.4,
                displayWatermark: true,
            };
        }

        if (this.settings.base64src === '' || this.settings.totalTime <= 0) {
            if (this.callBack) { this.callBack(); }
            this.callBack = null;
            (this.settings as any) = null;
            this._directCall = true;
        } else {
            legacyCC.view.enableRetina(true);
            legacyCC.view.resizeWithBrowserSize(true);
            const designRes = window._CCSettings.designResolution;
            if (designRes) {
                legacyCC.view.setDesignResolutionSize(designRes.width, designRes.height, designRes.policy);
            } else {
                legacyCC.view.setDesignResolutionSize(960, 640, 4);
            }
            this.root = root;
            this.device = root.device;
            legacyCC.game.once(legacyCC.Game.EVENT_GAME_INITED, () => {
                legacyCC.director._lateUpdate = performance.now();
            }, legacyCC.director);

            this.callBack = null;
            this.cancelAnimate = false;
            this.startTime = -1;

            this.preInit();
            this.logoImage = new Image();
            this.logoImage.onload = this.init.bind(this);
            this.logoImage.src = this.settings.base64src;
        }
    }

    public setOnFinish (cb: () => void) {
        if (this._directCall) {
            if (cb) {
                SplashScreen._ins = undefined;
                cb(); return;
            }
        }
        this.callBack = cb;
    }

    private _tryToStart () {
        if (this._splashFinish && this._loadFinish) {
            if (this.callBack) {
                this.callBack();
                this.hide();
                legacyCC.game.resume();
            }
        }
    }

    private preInit () {
        // this.setting.clearColor may not an instance of Color, so should create
        // Color manually, or will have problem on native.
        const clearColor = this.settings.clearColor;
        this.clearColors = [new Color(clearColor.x, clearColor.y, clearColor.z, clearColor.w)];
        const device = this.device;
        this.renderArea = new Rect(0, 0, device.width, device.height);
        this.framebuffer = this.root.mainWindow!.framebuffer;
        this.cmdBuff = device.commandBuffer;

        // create input assembler
        // create vertex buffer
        const verts = new Float32Array([0.5, 0.5, 1, 0, -0.5, 0.5, 0, 0, 0.5, -0.5, 1, 1, -0.5, -0.5, 0, 1]);
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;
        this.vertexBuffers = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE, vbSize, vbStride,
        ));
        this.vertexBuffers.update(verts);

        // create index buffer
        const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;
        this.indicesBuffers = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE, ibSize, ibStride,
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
            device.capabilities.clipSpaceSignY, device.surfaceTransform);
    }

    private init () {
        this.initLogo();
        if (this.settings.displayWatermark) this.initWarterMark();
        const animate = (time: number) => {
            if (this.cancelAnimate) return;
            const settings = this.settings;
            const device = this.device;
            Mat4.ortho(this.projection, -1, 1, -1, 1, -1, 1, device.capabilities.clipSpaceMinZ,
                device.capabilities.clipSpaceSignY, device.surfaceTransform);
            const dw = device.width; const dh = device.height;
            const refW = dw < dh ? dw : dh;
            // update logo uniform
            if (this.startTime < 0) this.startTime = time;
            const elapsedTime = time - this.startTime;
            const percent = clamp01(elapsedTime / settings.totalTime);
            let u_p = easing.cubicOut(percent);
            if (settings.effect === 'NONE') u_p = 1.0;
            const logoTW = this.logoTexture.width; const logoTH = this.logoTexture.height;
            const logoW = refW * settings.displayRatio;
            let scaleX = logoW * logoTW / logoTH;
            let scaleY = logoW;
            if (device.surfaceTransform === SurfaceTransform.ROTATE_90
                || device.surfaceTransform === SurfaceTransform.ROTATE_270) {
                scaleX = logoW * dw / dh;
                scaleY = logoW * logoTH / logoTW * dh / dw;
            }
            this.logoMat.setProperty('resolution', v2_0.set(dw, dh), 0);
            this.logoMat.setProperty('scale', v2_0.set(scaleX, scaleY), 0);
            this.logoMat.setProperty('translate', v2_0.set(dw * 0.5, dh * 0.5), 0);
            this.logoMat.setProperty('precent', u_p);
            this.logoMat.setProperty('u_projection', this.projection);
            this.logoMat.passes[0].update();

            // update wartermark uniform
            if (settings.displayWatermark && this.watermarkMat) {
                const wartermarkW = refW * 0.5;
                const wartermarkTW = this.watermarkTexture.width; const wartermarkTH = this.watermarkTexture.height;
                let scaleX = wartermarkW;
                let scaleY = wartermarkW * wartermarkTH / wartermarkTW;
                if (device.surfaceTransform === SurfaceTransform.ROTATE_90
                    || device.surfaceTransform === SurfaceTransform.ROTATE_270) {
                    scaleX = wartermarkW * 0.5;
                    scaleY = wartermarkW * dw / dh * 0.5;
                }
                this.watermarkMat.setProperty('resolution', v2_0.set(dw, dh), 0);
                this.watermarkMat.setProperty('scale', v2_0.set(scaleX, scaleY), 0);
                this.watermarkMat.setProperty('translate', v2_0.set(dw * 0.5, dh * 0.1), 0);
                this.watermarkMat.setProperty('precent', u_p);
                this.watermarkMat.setProperty('u_projection', this.projection);
                this.watermarkMat.passes[0].update();
            }

            this.frame();
            if (elapsedTime > settings.totalTime) this.splashFinish = true;
            requestAnimationFrame(animate);
        };
        legacyCC.game.pause();
        this.handle = requestAnimationFrame(animate);
    }

    private hide () {
        cancelAnimationFrame(this.handle);
        this.cancelAnimate = true;
        // The reason for delay destroy here is that immediate destroy input assmebler in ios will be crash
        setTimeout(this.destroy.bind(this));
    }

    private initLogo () {
        const device = this.device;

        this.logoMat = new Material();
        this.logoMat.initialize({ effectName: 'splash-screen' });

        const samplerInfo = new SamplerInfo();
        samplerInfo.addressU = Address.CLAMP;
        samplerInfo.addressV = Address.CLAMP;
        samplerInfo.addressW = Address.CLAMP;
        this.sampler = device.createSampler(samplerInfo);

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
        this.watermarkMat.initialize({ effectName: 'splash-screen' });
        const pass = this.watermarkMat.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding, this.watermarkTexture);
        pass.descriptorSet.update();
    }

    private frame () {
        const device = this.device;
        device.acquire();
        // record command
        const cmdBuff = this.cmdBuff;
        const framebuffer = this.framebuffer;
        const renderArea = this.renderArea;

        renderArea.width = device.width;
        renderArea.height = device.height;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer.renderPass, framebuffer, renderArea, this.clearColors, 1.0, 0);

        const logoPass = this.logoMat.passes[0];
        const logoPso = PipelineStateManager.getOrCreatePipelineState(device, logoPass, this.shader, framebuffer.renderPass, this.quadAssmebler);

        if (JSB) {
            // @ts-expect-error: prevent Pso from GC
            cmdBuff.__logoPso__ = logoPso;
        }

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
    }

    private destroy () {
        this.callBack = null;
        this.root = null!;
        this.device = null!;
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
        this.sampler.destroy();
        this.sampler = null!;

        /** text */
        if (this.watermarkTexture) {
            this.watermarkMat.destroy();
            this.watermarkMat = null!;
            this.watermarkTexture.destroy();
            this.watermarkTexture = null!;
        }

        this.settings = null!;
        SplashScreen._ins = undefined;
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
