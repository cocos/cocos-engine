/**
 * @hidden
 */

import * as easing from './animation/easing';
import { Material } from './assets/material';
import { GFXBuffer } from './gfx/buffer';
import { GFXCommandBuffer } from './gfx/command-buffer';
import {
    GFXBufferTextureCopy, GFXBufferUsageBit, GFXClearFlag, GFXCommandBufferType, GFXFormat,
    GFXMemoryUsageBit, GFXTextureType, GFXTextureUsageBit, IGFXRect, IGFXColor, GFXAddress
} from './gfx/define';
import { GFXDevice } from './gfx/device';
import { GFXFramebuffer } from './gfx/framebuffer';
import { GFXInputAssembler, IGFXAttribute } from './gfx/input-assembler';
import { GFXTexture } from './gfx/texture';
import { clamp01 } from './math/utils';
import { COCOSPLAY, XIAOMI, JSB } from 'internal:constants';
import { sys } from './platform/sys';
import { GFXSampler } from './gfx';
import { IPSOCreateInfo } from './renderer';
import { PipelineStateManager } from './pipeline/pipeline-state-manager';
import { legacyCC } from './global-exports';

export type SplashEffectType = 'NONE' | 'FADE-INOUT';

export interface ISplashSetting {
    readonly totalTime: number;
    readonly base64src: string;
    readonly effect: SplashEffectType;
    readonly clearColor: IGFXColor;
    readonly displayRatio: number;
    readonly displayWatermark: boolean;
}

export class SplashScreen {
    private set splashFinish (v: boolean) {
        this._splashFinish = v;
        this._tryToStart();
    }
    public set loadFinish (v: boolean) {
        this._loadFinish = v;
        this._tryToStart();
    }

    private handle: number = 0;
    private callBack: Function | null = null;
    private cancelAnimate: boolean = false;
    private startTime: number = -1;
    private setting!: ISplashSetting;
    private image!: TexImageSource;
    private device!: GFXDevice;
    private sampler!: GFXSampler;
    private cmdBuff!: GFXCommandBuffer;
    private assmebler!: GFXInputAssembler;
    private vertexBuffers!: GFXBuffer;
    private indicesBuffers!: GFXBuffer;
    private psoCreateInfo!: IPSOCreateInfo;
    private framebuffer!: GFXFramebuffer;
    private renderArea!: IGFXRect;
    private region!: GFXBufferTextureCopy;
    private material!: Material;
    private texture!: GFXTexture;
    private clearColors!: IGFXColor[];

    private _splashFinish: boolean = false;
    private _loadFinish: boolean = false;
    private _directCall: boolean = false;

    /** text */
    private textImg!: TexImageSource;
    private textRegion!: GFXBufferTextureCopy;
    private textTexture!: GFXTexture;
    private textVB!: GFXBuffer;
    private textIB!: GFXBuffer;
    private textAssmebler!: GFXInputAssembler;
    private textMaterial!: Material;
    private textPSOCreateInfo!: IPSOCreateInfo;

    private screenWidth!: number;
    private screenHeight!: number;

    public main (device: GFXDevice) {
        if (device == null) return console.error('GFX DEVICE IS NULL.');

        if (window._CCSettings && window._CCSettings.splashScreen) {
            this.setting = window._CCSettings.splashScreen;
            (this.setting.totalTime as number) = this.setting.totalTime != null ? this.setting.totalTime : 3000;
            (this.setting.base64src as string) = this.setting.base64src || '';
            (this.setting.effect as SplashEffectType) = this.setting.effect || 'FADE-INOUT';
            (this.setting.clearColor as IGFXColor) = this.setting.clearColor || { r: 0.88, g: 0.88, b: 0.88, a: 1.0 };
            (this.setting.displayRatio as number) = this.setting.displayRatio != null ? this.setting.displayRatio : 0.4;
            (this.setting.displayWatermark as boolean) = this.setting.displayWatermark != null ? this.setting.displayWatermark : true;
        } else {
            this.setting = {
                totalTime: 3000,
                base64src: '',
                effect: 'FADE-INOUT',
                clearColor: { r: 0.88, g: 0.88, b: 0.88, a: 1.0 },
                displayRatio: 0.4,
                displayWatermark: true
            };
        }

        if (this.setting.base64src === '' || this.setting.totalTime <= 0) {
            if (this.callBack) { this.callBack(); }
            this.callBack = null;
            (this.setting as any) = null;
            this._directCall = true;
            return;
        } else {
            legacyCC.view.enableRetina(true);
            const designRes = window._CCSettings.designResolution;
            if (designRes) {
                legacyCC.view.setDesignResolutionSize(designRes.width, designRes.height, designRes.policy);
            } else {
                legacyCC.view.setDesignResolutionSize(960, 640, 4);
            }
            this.device = device;
            legacyCC.game.once(legacyCC.Game.EVENT_GAME_INITED, () => {
                legacyCC.director._lateUpdate = performance.now();
            }, legacyCC.director);

            this.callBack = null;
            this.cancelAnimate = false;
            this.startTime = -1;
            this.clearColors = [this.setting.clearColor];
            this.screenWidth = this.device.width;
            this.screenHeight = this.device.height;

            this.image = new Image();
            this.image.onload = this.init.bind(this);
            this.image.src = this.setting.base64src;
        }
    }

    public setOnFinish (cb: Function) {
        if (this._directCall) {
            if (cb) {
                delete SplashScreen._ins;
                return cb();
            }
        }
        this.callBack = cb;
    }

    private _tryToStart () {
        if (this._splashFinish && this._loadFinish) {
            if (this.callBack) {
                this.callBack();
                this.hide();
            }
        }
    }

    private init () {
        // adapt for native mac & ios
        if (JSB) {
            if (sys.os === legacyCC.sys.OS_OSX || sys.os === legacyCC.sys.OS_IOS) {
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
        this.handle = requestAnimationFrame(animate);
    }

    private hide () {
        cancelAnimationFrame(this.handle);
        this.cancelAnimate = true;
        this.destoy();
    }

    private frame (time: number) {
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

        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer, renderArea,
            GFXClearFlag.ALL, this.clearColors, 1.0, 0);

        const pso = PipelineStateManager.getOrCreatePipelineState(device, this.psoCreateInfo, framebuffer.renderPass!, this.assmebler);
        cmdBuff.bindPipelineState(pso);
        cmdBuff.bindBindingLayout(this.psoCreateInfo.bindingLayout);
        cmdBuff.bindInputAssembler(this.assmebler);
        cmdBuff.draw(this.assmebler);

        if (this.setting.displayWatermark && this.textPSOCreateInfo && this.textAssmebler) {
            const psoWatermark = PipelineStateManager.getOrCreatePipelineState(device, this.textPSOCreateInfo, framebuffer.renderPass!, this.textAssmebler);
            cmdBuff.bindPipelineState(psoWatermark);
            cmdBuff.bindBindingLayout(this.textPSOCreateInfo.bindingLayout);
            cmdBuff.bindInputAssembler(this.textAssmebler);
            cmdBuff.draw(this.textAssmebler);
        }

        cmdBuff.endRenderPass();
        cmdBuff.end();

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
        ctx.font = `${18}px Arial`
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = '`#424242`';
        const text = 'Powered by Cocos Creator 3D';
        const textMetrics = ctx.measureText(text);
        ctx.fillText(text, (330 - textMetrics.width) / 2, 6);

        this.textRegion = new GFXBufferTextureCopy();
        this.textRegion.texExtent.width = this.textImg.width;
        this.textRegion.texExtent.height = this.textImg.height;
        this.textRegion.texExtent.depth = 1;

        this.textTexture = this.device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
            width: this.textImg.width,
            height: this.textImg.height,
            mipLevel: 1,
        });

        this.device.copyTexImagesToTexture([this.textImg], this.textTexture, [this.textRegion]);


        /** PSO */
        this.textMaterial = new Material();
        this.textMaterial.initialize({ effectName: 'util/splash-screen' });

        const pass = this.textMaterial.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding!, this.textTexture!);

        this.textPSOCreateInfo = pass.createPipelineStateCI() as IPSOCreateInfo;
        this.textPSOCreateInfo.bindingLayout.update();

        /** Assembler */
        // create vertex buffer
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;
        this.textVB = this.device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbSize,
            stride: vbStride,
        });

        const verts = new Float32Array(4 * 4);
        let w = -this.textImg.width / 2;
        let h = -this.textImg!.height / 2;
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
            verts[i] = verts[i] + this.screenWidth / 2;
            verts[i + 1] = verts[i + 1] + this.screenHeight * 0.1;
        }

        // transform to clipspace
        const ySign = this.device.projectionSignY;
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] = verts[i] / this.screenWidth * 2 - 1;
            verts[i + 1] = (verts[i + 1] / this.screenHeight * 2 - 1) * ySign;
        }

        this.textVB.update(verts);

        // create index buffer
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this.textIB = this.device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibSize,
            stride: ibStride,
        });

        const indices = new Uint16Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;
        this.textIB.update(indices);

        const attributes: IGFXAttribute[] = [
            { name: 'a_position', format: GFXFormat.RG32F },
            { name: 'a_texCoord', format: GFXFormat.RG32F },
        ];

        this.textAssmebler = this.device.createInputAssembler({
            attributes,
            vertexBuffers: [this.textVB],
            indexBuffer: this.textIB,
        });
    }

    private initCMD () {
        const device = this.device as GFXDevice;
        this.renderArea = { x: 0, y: 0, width: device.width, height: device.height };
        this.framebuffer = device.mainWindow.framebuffer;

        this.cmdBuff = device.createCommandBuffer({
            allocator: device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

    }

    private initIA () {
        const device = this.device as GFXDevice;

        // create vertex buffer
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;
        this.vertexBuffers = device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbSize,
            stride: vbStride,
        });

        const verts = new Float32Array(4 * 4);
        let w = -this.image.width / 2;
        let h = -this.image!.height / 2;
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
            verts[i] = verts[i] + this.screenWidth / 2;
            verts[i + 1] = verts[i + 1] + this.screenHeight / 2;
        }

        // transform to clipspace
        const ySign = device.projectionSignY;
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] = verts[i] / this.screenWidth * 2 - 1;
            verts[i + 1] = (verts[i + 1] / this.screenHeight * 2 - 1) * ySign;
        }

        this.vertexBuffers.update(verts);

        // create index buffer
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this.indicesBuffers = device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibSize,
            stride: ibStride,
        });

        const indices = new Uint16Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;
        this.indicesBuffers.update(indices);

        const attributes: IGFXAttribute[] = [
            { name: 'a_position', format: GFXFormat.RG32F },
            { name: 'a_texCoord', format: GFXFormat.RG32F },
        ];

        this.assmebler = device.createInputAssembler({
            attributes,
            vertexBuffers: [this.vertexBuffers],
            indexBuffer: this.indicesBuffers,
        });
    }

    private initPSO () {

        const device = this.device as GFXDevice;

        this.material = new Material();
        this.material.initialize({ effectName: 'util/splash-screen' });

        this.sampler = device.createSampler({
            'addressU': GFXAddress.CLAMP,
            'addressV': GFXAddress.CLAMP,
        });

        this.texture = device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
            width: this.image.width,
            height: this.image.height,
            mipLevel: 1,
        });

        const pass = this.material.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding!, this.texture!);

        this.psoCreateInfo = pass.createPipelineStateCI() as IPSOCreateInfo;
        this.psoCreateInfo.bindingLayout.bindSampler(binding!, this.sampler);
        this.psoCreateInfo.bindingLayout.update();

        this.region = new GFXBufferTextureCopy();
        this.region.texExtent.width = this.image.width;
        this.region.texExtent.height = this.image.height;
        this.region.texExtent.depth = 1;
        device.copyTexImagesToTexture([this.image!], this.texture, [this.region]);
    }

    private destoy () {
        this.callBack = null;
        (this.clearColors as any) = null;
        (this.device as any) = null;
        (this.image as any) = null;
        (this.framebuffer as any) = null;
        (this.renderArea as any) = null;
        (this.region as any) = null;

        this.cmdBuff.destroy();
        (this.cmdBuff as any) = null;

        this.psoCreateInfo.bindingLayout.destroy();
        (this.psoCreateInfo as any) = null;

        this.material.destroy();
        (this.material as any) = null;

        this.texture.destroy();
        (this.texture as any) = null;

        this.assmebler.destroy();
        (this.assmebler as any) = null;

        this.vertexBuffers.destroy();
        (this.vertexBuffers as any) = null;

        this.indicesBuffers.destroy();
        (this.indicesBuffers as any) = null;

        this.sampler.destroy();
        (this.sampler as any) = null;

        /** text */
        if (this.setting.displayWatermark && this.textImg) {
            (this.textImg as any) = null;
            (this.textRegion as any) = null;

            this.textPSOCreateInfo.bindingLayout.destroy();
            (this.textPSOCreateInfo as any) = null;

            this.textMaterial.destroy();
            (this.textMaterial as any) = null;

            this.textTexture.destroy();
            (this.textTexture as any) = null;

            this.textAssmebler.destroy();
            (this.textAssmebler as any) = null;

            this.textVB.destroy();
            (this.textVB as any) = null;

            this.textIB.destroy();
            (this.textIB as any) = null;
        }

        (this.setting as any) = null;
        delete SplashScreen._ins;
    }

    private static _ins: SplashScreen;

    public static get instance () {
        if (SplashScreen._ins == null) {
            SplashScreen._ins = new SplashScreen();
        }
        return SplashScreen._ins;
    }

    private constructor () { };
}

legacyCC.internal.SplashScreen = SplashScreen;
