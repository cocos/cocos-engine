/**
 * @hidden
 */

import * as easing from './animation/easing';
import { EffectAsset } from './assets/effect-asset';
import { Material } from './assets/material';
import { GFXBuffer } from './gfx/buffer';
import { GFXCommandBuffer } from './gfx/command-buffer';
import {
    GFXBufferTextureCopy, GFXBufferUsageBit, GFXClearFlag, GFXCommandBufferType, GFXFormat,
    GFXMemoryUsageBit, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType, IGFXRect, IGFXColor
} from './gfx/define';
import { GFXDevice } from './gfx/device';
import { GFXFramebuffer } from './gfx/framebuffer';
import { GFXInputAssembler, IGFXAttribute } from './gfx/input-assembler';
import { GFXPipelineState } from './gfx/pipeline-state';
import { GFXTexture } from './gfx/texture';
import { GFXTextureView } from './gfx/texture-view';
import { clamp01 } from './math/utils';

export type SplashEffectType = 'none' | 'Fade-InOut';

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
    private cmdBuff!: GFXCommandBuffer;
    private assmebler!: GFXInputAssembler;
    private vertexBuffers!: GFXBuffer;
    private indicesBuffers!: GFXBuffer;
    private pso!: GFXPipelineState;
    private framebuffer!: GFXFramebuffer;
    private renderArea!: IGFXRect;
    private region!: GFXBufferTextureCopy;
    private material!: Material;
    private texture!: GFXTexture;
    private textureView!: GFXTextureView;
    private clearColors!: IGFXColor[];

    private _splashFinish: boolean = false;
    private _loadFinish: boolean = false;

    /** text */
    private textImg!: TexImageSource;
    private textRegion!: GFXBufferTextureCopy;
    private textTexture!: GFXTexture;
    private textTextureView!: GFXTextureView;
    private textVB!: GFXBuffer;
    private textIB!: GFXBuffer;
    private textAssmebler!: GFXInputAssembler;
    private textMaterial!: Material;
    private textPSO!: GFXPipelineState;

    /** shader */
    private program!: { name: string, techniques: any[], shaders: any[] };
    private effect!: EffectAsset;

    /** size */
    private screenWidth!: number;
    private screenHeight!: number;

    public main (device: GFXDevice) {
        if (window._CCSettings && window._CCSettings.splashScreen) {
            this.setting = window._CCSettings.splashScreen;
            (this.setting.totalTime as number) = this.setting.totalTime != null ? this.setting.totalTime : 3000;
            (this.setting.base64src as string) = this.setting.base64src != null ? this.setting.base64src : '';
            (this.setting.effect as SplashEffectType) = this.setting.effect != null ? this.setting.effect : 'Fade-InOut';
            (this.setting.clearColor as IGFXColor) = this.setting.clearColor != null ? this.setting.clearColor : { r: 0.88, g: 0.88, b: 0.88, a: 1.0 };
            (this.setting.displayRatio as number) = this.setting.displayRatio != null ? this.setting.displayRatio : 0.4;
            (this.setting.displayWatermark as boolean) = this.setting.displayWatermark != null ? this.setting.displayWatermark : true;
        } else {
            this.setting = {
                totalTime: 3000,
                base64src: '',
                effect: 'Fade-InOut',
                clearColor: { r: 0.88, g: 0.88, b: 0.88, a: 1.0 },
                displayRatio: 0.4,
                displayWatermark: true
            };
        }

        if (this.setting.base64src == '' || this.setting.totalTime <= 0) {
            if (this.callBack) { this.callBack(); }
            this.callBack = null;
            (this.setting as any) = null;
            delete SplashScreen._ins;
            return;
        } else {
            cc.game.once(cc.Game.EVENT_GAME_INITED, () => {
                cc.director._lateUpdate = performance.now();
            }, cc.director);

            // this.program = effects.find(function (element) {
            //     return element.name == 'util/splash-image';
            // });

            this.program = {
                name: 'util/splash-image',
                techniques: [
                    {
                        passes: [{
                            blendState: { targets: [{ blend: true, blendSrc: 2, blendDst: 4, blendDstAlpha: 4 }] },
                            program: 'util/splash-image|splash-vs:vert|splash-fs:frag',
                            depthStencilState: { depthTest: true, depthWrite: false },
                            properties: { mainTexture: { value: 'grey', type: 28 }, u_precent: { type: 13 } }
                        }],
                    },
                ],
                shaders: [
                    {
                        name: 'util/splash-image|splash-vs:vert|splash-fs:frag',
                        hash: 2381344969,
                        glsl3: {
                            // tslint:disable: max-line-length
                            vert: `\nprecision mediump float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_uv;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 0, 1);\n  v_uv = a_texCoord;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
                            frag: `\nprecision mediump float;\nin vec2 v_uv;\nuniform sampler2D mainTexture;\nuniform splashFrag {\n  float u_precent;\n};\nvec4 frag () {\n  vec4 color = texture(mainTexture, v_uv);\n  float precent = clamp(u_precent, 0.0, 1.0);\n  color.xyz *= precent;\n  return color;\n}\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }\n`,
                        },
                        glsl1: {
                            vert: `\nprecision mediump float;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_uv;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 0, 1);\n  v_uv = a_texCoord;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
                            frag: `\nprecision mediump float;\nvarying vec2 v_uv;\nuniform sampler2D mainTexture;\nuniform float u_precent;\nvec4 frag () {\n  vec4 color = texture2D(mainTexture, v_uv);\n  float precent = clamp(u_precent, 0.0, 1.0);\n  color.xyz *= precent;\n  return color;\n}\nvoid main() { gl_FragColor = frag(); }\n`,
                            // tslint:enable: max-line-length
                        },
                        builtins: { globals: { blocks: [], samplers: [] }, locals: { blocks: [], samplers: [] } },
                        defines: [],
                        blocks: [
                            {
                                name: 'splashFrag', defines: [], binding: 0, members: [
                                    { name: 'u_precent', type: 13, count: 1 },
                                ],
                            },
                        ],
                        samplers: [
                            { name: 'mainTexture', type: 28, count: 1, defines: [], binding: 30 },
                        ],
                        dependencies: {},
                    },
                ],
            };

            this.effect = new EffectAsset();
            this.effect.name = this.program.name;
            this.effect.techniques = this.program.techniques;
            this.effect.shaders = this.program.shaders;
            this.effect.onLoaded();


            this.callBack = null;
            this.cancelAnimate = false;
            this.startTime = -1;
            this.clearColors = [this.setting.clearColor];
            this.device = device;

            /** IOS adapt, use native size */
            this.screenWidth = this.device.width;
            this.screenHeight = this.device.height;
            if (this.device.nativeWidth < this.device.nativeHeight) {
                if (this.device.width > this.device.height) {
                    this.screenWidth = this.device.height;
                    this.screenHeight = this.device.width;
                }
            } else {
                if (this.device.width < this.device.height) {
                    this.screenWidth = this.device.height;
                    this.screenHeight = this.device.width;
                }
            }

            this.image = new Image();
            this.image.onload = this.init.bind(this);
            this.image.src = this.setting.base64src;
        }
    }

    public setOnFinish (cb: Function) {
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
            const precent = clamp01(elapsedTime / this.setting.totalTime);
            const u_p = easing.cubicOut(precent);
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
        const device = this.device;
        const cmdBuff = this.cmdBuff;
        const framebuffer = this.framebuffer;
        const renderArea = this.renderArea;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer, renderArea,
            GFXClearFlag.ALL, this.clearColors, 1.0, 0);

        cmdBuff.bindPipelineState(this.pso);
        cmdBuff.bindBindingLayout(this.pso.pipelineLayout.layouts[0]);
        cmdBuff.bindInputAssembler(this.assmebler);
        cmdBuff.draw(this.assmebler);

        if (this.setting.displayWatermark && this.textPSO && this.textAssmebler) {
            cmdBuff.bindPipelineState(this.textPSO);
            cmdBuff.bindBindingLayout(this.textPSO.pipelineLayout.layouts[0]);
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
        this.textImg.width = 300;
        this.textImg.height = 30;
        this.textImg.style.width = `${this.textImg.width}`;
        this.textImg.style.height = `${this.textImg.height}`;

        const ctx = this.textImg.getContext('2d')!;
        ctx.font = `${18}px Arial`
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = '`#424242`';
        ctx.fillText("Powered by Cocos Creator 3D", 30, 8);

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

        this.textTextureView = this.device.createTextureView({
            texture: this.textTexture,
            type: GFXTextureViewType.TV2D,
            format: GFXFormat.RGBA8,
        });

        this.device.copyTexImagesToTexture([this.textImg], this.textTexture, [this.textRegion]);


        /** PSO */
        this.textMaterial = new Material();
        this.textMaterial.initialize({
            effectAsset: this.effect,
        });

        const pass = this.textMaterial.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTextureView(binding!, this.textTextureView!);

        this.textPSO = pass.createPipelineState() as GFXPipelineState;
        this.textPSO.pipelineLayout.layouts[0].update();

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
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] = verts[i] / this.screenWidth * 2 - 1;
            verts[i + 1] = verts[i + 1] / this.screenHeight * 2 - 1;
        }

        this.textVB.update(verts);

        // create index buffer
        const ibStride = Uint8Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this.textIB = this.device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibSize,
            stride: ibStride,
        });

        const indices = new Uint8Array(6);
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
        verts[n++] = w; verts[n++] = -h; verts[n++] = 0.0; verts[n++] = 0.0;
        verts[n++] = -w; verts[n++] = -h; verts[n++] = 1.0; verts[n++] = 0.0;

        // translate to center
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] = verts[i] + this.screenWidth / 2;
            verts[i + 1] = verts[i + 1] + this.screenHeight / 2;
        }

        // transform to clipspace
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] = verts[i] / this.screenWidth * 2 - 1;
            verts[i + 1] = verts[i + 1] / this.screenHeight * 2 - 1;
        }

        this.vertexBuffers.update(verts);

        // create index buffer
        const ibStride = Uint8Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this.indicesBuffers = device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibSize,
            stride: ibStride,
        });

        const indices = new Uint8Array(6);
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
        this.material.initialize({
            effectAsset: this.effect,
        });

        this.texture = device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
            width: this.image.width,
            height: this.image.height,
            mipLevel: 1,
        });

        this.textureView = device.createTextureView({
            texture: this.texture,
            type: GFXTextureViewType.TV2D,
            format: GFXFormat.RGBA8,
        });

        const pass = this.material.passes[0];
        const binding = pass.getBinding('mainTexture');
        pass.bindTextureView(binding!, this.textureView!);

        this.pso = pass.createPipelineState() as GFXPipelineState;
        this.pso.pipelineLayout.layouts[0].update();

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
        (this.program as any) = null;

        this.effect.destroy();
        (this.effect as any) = null;

        this.cmdBuff.destroy();
        (this.cmdBuff as any) = null;

        this.pso.destroy();
        (this.pso as any) = null;

        this.material.destroy();
        (this.material as any) = null;

        this.textureView.destroy();
        (this.textureView as any) = null;

        this.texture.destroy();
        (this.texture as any) = null;

        this.assmebler.destroy();
        (this.assmebler as any) = null;

        this.vertexBuffers.destroy();
        (this.vertexBuffers as any) = null;

        this.indicesBuffers.destroy();
        (this.indicesBuffers as any) = null;

        /** text */
        if (this.setting.displayWatermark && this.textImg) {
            (this.textImg as any) = null;
            (this.textRegion as any) = null;

            this.textPSO.destroy();
            (this.textPSO as any) = null;

            this.textMaterial.destroy();
            (this.textMaterial as any) = null;

            this.textTextureView.destroy();
            (this.textTextureView as any) = null;

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
