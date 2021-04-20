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
import { system } from 'pal/system';
import { COCOSPLAY, XIAOMI, JSB } from 'internal:constants';
import * as easing from './animation/easing';
import { Material } from './assets/material';
import { preTransforms } from './math/mat4';
import { clamp01 } from './math/utils';
import { sys } from './platform/sys';
import {
    Sampler, SamplerInfo, Shader, Texture, TextureInfo, Device, InputAssembler, InputAssemblerInfo, Attribute, Buffer,
    BufferInfo, Rect, Color, BufferTextureCopy, Framebuffer, CommandBuffer, BufferUsageBit, Format,
    MemoryUsageBit, TextureType, TextureUsageBit, Address,
} from './gfx';
import { PipelineStateManager } from './pipeline';
import { legacyCC } from './global-exports';
import { Root } from './root';
import { DSPool, ShaderPool, PassPool, PassView } from './renderer/core/memory-pools';
import { SetIndex } from './pipeline/define';
import { error } from './platform';
import { OS } from '../../pal/system/enum-type';

export type SplashEffectType = 'NONE' | 'FADE-INOUT';

export interface ISplashSetting {
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
    private callBack: (() => void) | null = null;
    private cancelAnimate = false;
    private startTime = -1;
    private setting!: ISplashSetting;
    private image!: TexImageSource;
    private root!: Root;
    private device!: Device;
    private sampler!: Sampler;
    private cmdBuff!: CommandBuffer;
    private assmebler!: InputAssembler;
    private vertexBuffers!: Buffer;
    private indicesBuffers!: Buffer;
    private shader!: Shader;
    private framebuffer!: Framebuffer;
    private renderArea!: Rect;
    private region!: BufferTextureCopy;
    private material!: Material;
    private texture!: Texture;
    private clearColors!: Color[];

    private _splashFinish = false;
    private _loadFinish = false;
    private _directCall = false;

    /** text */
    private textImg!: TexImageSource;
    private textRegion!: BufferTextureCopy;
    private textTexture!: Texture;
    private textVB!: Buffer;
    private textIB!: Buffer;
    private textAssmebler!: InputAssembler;
    private textMaterial!: Material;
    private textShader!: Shader;

    private screenWidth!: number;
    private screenHeight!: number;

    public main (root: Root) {
        if (root == null) {
            error('RENDER ROOT IS NULL.');
            return;
        }

        if (window._CCSettings && window._CCSettings.splashScreen) {
            const setting: Writable<ISplashSetting> = this.setting = window._CCSettings.splashScreen;
            setting.totalTime = this.setting.totalTime != null ? this.setting.totalTime : 3000;
            setting.base64src = this.setting.base64src || '';
            setting.effect = this.setting.effect || 'FADE-INOUT';
            setting.clearColor = this.setting.clearColor || new Color(0.88, 0.88, 0.88, 1);
            setting.displayRatio = this.setting.displayRatio != null ? this.setting.displayRatio : 0.4;
            setting.displayWatermark = this.setting.displayWatermark != null ? this.setting.displayWatermark : true;
        } else {
            this.setting = {
                totalTime: 3000,
                base64src: '',
                effect: 'FADE-INOUT',
                clearColor: new Color(0.88, 0.88, 0.88, 1),
                displayRatio: 0.4,
                displayWatermark: true,
            };
        }

        if (this.setting.base64src === '' || this.setting.totalTime <= 0) {
            if (this.callBack) { this.callBack(); }
            this.callBack = null;
            (this.setting as any) = null;
            this._directCall = true;
        } else {
            legacyCC.view.enableRetina(true);
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

            // this.setting.clearColor may not an instance of Color, so should create
            // Color manually, or will have problem on native.
            const clearColor = this.setting.clearColor;
            this.clearColors = [new Color(clearColor.x, clearColor.y, clearColor.z, clearColor.w)];

            const { width, height, surfaceTransform } = this.device;
            this.screenWidth = surfaceTransform % 2 ? height : width;
            this.screenHeight = surfaceTransform % 2 ? width : height;

            this.image = new Image();
            this.image.onload = this.init.bind(this);
            this.image.src = this.setting.base64src;
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

    private init () {
        // adapt for native mac & ios
        if (JSB) {
            if (system.os === OS.OSX || system.os === OS.IOS) {
                const width = screen.width * devicePixelRatio;
                const height = screen.height * devicePixelRatio;
                this.device.resize(width, height);
                this.screenWidth = this.device.width;
                this.screenHeight = this.device.height;
            }
        }

        // TODO: hack for cocosPlay & XIAOMI cause on landscape canvas value is wrong
        if (COCOSPLAY || XIAOMI) {
            if (window._CCSettings.orientation === 'landscape' && this.device.width < this.device.height) {
                const width = this.device.height;
                const height = this.device.width;
                this.device.resize(width, height);
                this.screenWidth = this.device.width;
                this.screenHeight = this.device.height;
            }
        }

        this.initCMD();
        this.initIA();
        this.initPSO();

        if (this.setting.displayWatermark) {
            this.initText();
        }

        const animate = (time: number) => {
            if (this.cancelAnimate) {
                return;
            }

            if (this.startTime < 0) {
                this.startTime = time;
            }
            const elapsedTime = time - this.startTime;

            /** update uniform */
            const PERCENT = clamp01(elapsedTime / this.setting.totalTime);
            let u_p = easing.cubicOut(PERCENT);
            if (this.setting.effect === 'NONE') u_p = 1.0;
            this.material.setProperty('u_precent', u_p);
            this.material.passes[0].update();

            if (this.setting.displayWatermark && this.textMaterial) {
                this.textMaterial.setProperty('u_precent', u_p);
                this.textMaterial.passes[0].update();
            }

            this.frame(time);

            if (elapsedTime > this.setting.totalTime) {
                this.splashFinish = true;
            }

            requestAnimationFrame(animate);
        };
        legacyCC.game.pause();
        this.handle = requestAnimationFrame(animate);
    }

    private hide () {
        cancelAnimationFrame(this.handle);
        this.cancelAnimate = true;
        // here delay destroy：because ios immediately destroy input assmebler will crash & native renderer will mess.
        setTimeout(this.destroy.bind(this));
    }

    private frame (time: number) {
        if (this.cancelAnimate) return;

        // TODO: hack for cocosPlay & XIAOMI cause on landscape canvas value is wrong
        if (COCOSPLAY || XIAOMI) {
            if (window._CCSettings.orientation === 'landscape' && this.device.width < this.device.height) {
                const width = this.device.height;
                const height = this.device.width;
                this.device.resize(width, height);
                this.screenWidth = this.device.width;
                this.screenHeight = this.device.height;
            }
        }

        const device = this.device;
        device.acquire();

        // record command
        const cmdBuff = this.cmdBuff;
        const framebuffer = this.framebuffer;
        const renderArea = this.renderArea;

        if (JSB && (system.os === OS.OSX || system.os === OS.IOS)) {
            renderArea.height = device.nativeHeight;
            renderArea.width = device.nativeWidth;
        } else {
            renderArea.height = device.height;
            renderArea.width = device.width;
        }

        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer.renderPass, framebuffer, renderArea,
            this.clearColors, 1.0, 0);

        const pass = this.material.passes[0];
        const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, this.shader, framebuffer.renderPass, this.assmebler);
        cmdBuff.bindPipelineState(pso);
        cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
        cmdBuff.bindInputAssembler(this.assmebler);
        cmdBuff.draw(this.assmebler);

        if (this.setting.displayWatermark && this.textShader && this.textAssmebler) {
            const passText = this.textMaterial.passes[0];
            const psoWatermark = PipelineStateManager.getOrCreatePipelineState(device,
                passText, this.textShader, framebuffer.renderPass, this.textAssmebler);
            cmdBuff.bindPipelineState(psoWatermark);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, passText.descriptorSet);
            cmdBuff.bindInputAssembler(this.textAssmebler);
            cmdBuff.draw(this.textAssmebler);
        }

        cmdBuff.endRenderPass();
        cmdBuff.end();

        device.flushCommands([cmdBuff]);
        device.queue.submit([cmdBuff]);
        device.present();
    }

    private initText () {
        /** texure */
        this.textImg = document.createElement('canvas');
        this.textImg.width = 330;
        this.textImg.height = 30;
        this.textImg.style.width = `${this.textImg.width}`;
        this.textImg.style.height = `${this.textImg.height}`;

        const ctx = this.textImg.getContext('2d')!;
        ctx.font = `${18}px Arial`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = '`#424242`';
        const text = 'Powered by Cocos Creator';
        const textMetrics = ctx.measureText(text);
        ctx.fillText(text, (330 - textMetrics.width) / 2, 6);

        this.textRegion = new BufferTextureCopy();
        this.textRegion.texExtent.width = this.textImg.width;
        this.textRegion.texExtent.height = this.textImg.height;
        this.textRegion.texExtent.depth = 1;

        this.textTexture = this.device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.SAMPLED | TextureUsageBit.TRANSFER_DST,
            Format.RGBA8,
            this.textImg.width,
            this.textImg.height,
        ));

        this.device.copyTexImagesToTexture([this.textImg], this.textTexture, [this.textRegion]);

        /** PSO */
        this.textMaterial = new Material();
        this.textMaterial.initialize({ effectName: 'splash-screen' });

        const pass = this.textMaterial.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding, this.textTexture);

        this.textShader = ShaderPool.get(pass.getShaderVariant());
        DSPool.get(PassPool.get(pass.handle, PassView.DESCRIPTOR_SET)).update();

        /** Assembler */
        // create vertex buffer
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;
        this.textVB = this.device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            vbSize,
            vbStride,
        ));

        const verts = new Float32Array(4 * 4);
        let w = -this.textImg.width / 2;
        let h = -this.textImg.height / 2;
        if (this.screenWidth < this.screenHeight) {
            w = -this.screenWidth / 2 * 0.5;
            h = w / (this.textImg.width / this.textImg.height);
        } else {
            w = -this.screenHeight / 2 * 0.5;
            h = w / (this.textImg.width / this.textImg.height);
        }
        let n = 0;
        verts[n++] = w; verts[n++] = h; verts[n++] = 0.0; verts[n++] = 1.0;
        verts[n++] = -w; verts[n++] = h; verts[n++] = 1.0; verts[n++] = 1.0;
        verts[n++] = w; verts[n++] = -h; verts[n++] = 0.0; verts[n++] = 0.0;
        verts[n++] = -w; verts[n++] = -h; verts[n++] = 1.0; verts[n++] = 0.0;

        // translate to bottom
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] += this.screenWidth / 2;
            verts[i + 1] += this.screenHeight * 0.1;
        }

        // doing the screen adaptation here will not support dynamic screen orientation changes
        const ySign = this.device.capabilities.clipSpaceSignY;
        const preTransform = preTransforms[this.device.surfaceTransform];
        for (let i = 0; i < verts.length; i += 4) {
            const x = verts[i] / this.screenWidth * 2 - 1;
            const y = (verts[i + 1] / this.screenHeight * 2 - 1) * ySign;
            verts[i] = preTransform[0] * x + preTransform[2] * y;
            verts[i + 1] = preTransform[1] * x + preTransform[3] * y;
        }

        this.textVB.update(verts);

        // create index buffer
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this.textIB = this.device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            ibSize,
            ibStride,
        ));

        const indices = new Uint16Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;
        this.textIB.update(indices);

        const attributes: Attribute[] = [
            new Attribute('a_position', Format.RG32F),
            new Attribute('a_texCoord', Format.RG32F),
        ];

        const textIAInfo = new InputAssemblerInfo(attributes, [this.textVB], this.textIB);
        this.textAssmebler = this.device.createInputAssembler(textIAInfo);
    }

    private initCMD () {
        const device = this.device;
        if (JSB && (system.os === OS.OSX || system.os === OS.IOS)) {
            this.renderArea = new Rect(0, 0, device.nativeWidth, device.nativeHeight);
        } else {
            this.renderArea = new Rect(0, 0, device.width, device.height);
        }
        this.framebuffer = this.root.mainWindow!.framebuffer;

        this.cmdBuff = device.commandBuffer;
    }

    private initIA () {
        const device = this.device;

        // create vertex buffer
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;
        this.vertexBuffers = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            vbSize,
            vbStride,
        ));

        const verts = new Float32Array(4 * 4);
        let w = -this.image.width / 2;
        let h = -this.image.height / 2;
        if (this.screenWidth < this.screenHeight) {
            w = -this.screenWidth / 2 * this.setting.displayRatio;
            h = w / (this.image.width / this.image.height);
        } else {
            w = -this.screenHeight / 2 * this.setting.displayRatio;
            h = w / (this.image.width / this.image.height);
        }
        let n = 0;
        verts[n++] = w; verts[n++] = h; verts[n++] = 0.0; verts[n++] = 1.0;
        verts[n++] = -w; verts[n++] = h; verts[n++] = 1.0; verts[n++] = 1.0;
        verts[n++] = w; verts[n++] = -h; verts[n++] = 0.0; verts[n++] = 0;
        verts[n++] = -w; verts[n++] = -h; verts[n++] = 1.0; verts[n++] = 0;

        // translate to center
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] += this.screenWidth / 2;
            verts[i + 1] += this.screenHeight / 2;
        }

        // doing the screen adaptation here will not support dynamic screen orientation changes
        const ySign = this.device.capabilities.clipSpaceSignY;
        const preTransform = preTransforms[this.device.surfaceTransform];
        for (let i = 0; i < verts.length; i += 4) {
            const x = verts[i] / this.screenWidth * 2 - 1;
            const y = (verts[i + 1] / this.screenHeight * 2 - 1) * ySign;
            verts[i] = preTransform[0] * x + preTransform[2] * y;
            verts[i + 1] = preTransform[1] * x + preTransform[3] * y;
        }

        this.vertexBuffers.update(verts);

        // create index buffer
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this.indicesBuffers = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            ibSize,
            ibStride,
        ));

        const indices = new Uint16Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;
        this.indicesBuffers.update(indices);

        const attributes: Attribute[] = [
            new Attribute('a_position', Format.RG32F),
            new Attribute('a_texCoord', Format.RG32F),
        ];

        const IAInfo = new InputAssemblerInfo(attributes, [this.vertexBuffers], this.indicesBuffers);
        this.assmebler = device.createInputAssembler(IAInfo);
    }

    private initPSO () {
        const device = this.device;

        this.material = new Material();
        this.material.initialize({ effectName: 'splash-screen' });

        const samplerInfo = new SamplerInfo();
        samplerInfo.addressU = Address.CLAMP;
        samplerInfo.addressV = Address.CLAMP;
        samplerInfo.addressW = Address.CLAMP;
        this.sampler = device.createSampler(samplerInfo);

        this.texture = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.SAMPLED | TextureUsageBit.TRANSFER_DST,
            Format.RGBA8,
            this.image.width,
            this.image.height,
        ));

        const pass = this.material.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding, this.texture);

        this.shader = ShaderPool.get(pass.getShaderVariant());
        const descriptorSet = DSPool.get(PassPool.get(pass.handle, PassView.DESCRIPTOR_SET));
        descriptorSet.bindSampler(binding, this.sampler);
        descriptorSet.update();

        this.region = new BufferTextureCopy();
        this.region.texExtent.width = this.image.width;
        this.region.texExtent.height = this.image.height;
        this.region.texExtent.depth = 1;
        device.copyTexImagesToTexture([this.image], this.texture, [this.region]);
    }

    private destroy () {
        this.callBack = null;
        this.clearColors = null!;
        this.device = null!;
        if (JSB) (this.image as any).destroy();
        this.image = null!;
        this.framebuffer = null!;
        this.renderArea = null!;
        this.region = null!;
        this.cmdBuff = null!;
        this.shader = null!;
        this.material.destroy();
        this.material = null!;
        this.texture.destroy();
        this.texture = null!;
        this.assmebler.destroy();
        this.assmebler = null!;
        this.vertexBuffers.destroy();
        this.vertexBuffers = null!;
        this.indicesBuffers.destroy();
        this.indicesBuffers = null!;
        this.sampler.destroy();
        this.sampler = null!;

        /** text */
        if (this.textImg) {
            this.textImg = null!;
            this.textRegion = null!;
            this.textShader = null!;
            this.textMaterial.destroy();
            this.textMaterial = null!;
            this.textTexture.destroy();
            this.textTexture = null!;
            this.textAssmebler.destroy();
            this.textAssmebler = null!;
            this.textVB.destroy();
            this.textVB = null!;
            this.textIB.destroy();
            this.textIB = null!;
        }

        this.setting = null!;
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
