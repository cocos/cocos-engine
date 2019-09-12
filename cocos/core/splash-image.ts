import { GFXDevice } from "./gfx/device";
import { GFXCommandBuffer } from "./gfx/command-buffer";
import { GFXCommandBufferType, GFXBufferUsageBit, GFXClearFlag, IGFXRect, GFXTextureType, GFXTextureUsageBit, GFXFormat, GFXTextureViewType, GFXMemoryUsageBit, GFXBufferTextureCopy } from "./gfx/define";
import { GFXInputAssembler, IGFXAttribute } from "./gfx/input-assembler";
import { GFXBuffer } from "./gfx/buffer";
import { GFXPipelineState } from "./gfx/pipeline-state";
import { GFXFramebuffer } from "./gfx/framebuffer";
import { Material } from "./assets/material";
import { EffectAsset } from "./assets/effect-asset";
import { GFXTexture } from "./gfx/texture";
import { GFXTextureView } from "./gfx/texture-view";
import { clamp01 } from "./math/utils";
import * as easing from "./animation/easing";

export type SplashEffectType = "none" | "Fade-in-out";

export interface SplashSetting {
    readonly totalTime: number;
    readonly base64src: string;
    readonly effect: SplashEffectType;
    // readonly clearColor: any;
}

const defaultSrcBase64 = 'data:image/png;base64,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';


export class SplashImage {
    private handle: number = 0;
    private callBack: Function | null = null;
    private cancelAnimate: boolean = false;
    private startTime: number = -1;
    private setting!: SplashSetting;
    private image!: HTMLImageElement;
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

    private _splashFinish: boolean = false;
    public set splashFinish (v: boolean) {
        this._splashFinish = v;
        this._tryToStart();
    }

    private _loadFinish: boolean = false;
    public set loadFinish (v: boolean) {
        this._loadFinish = v;
        this._tryToStart();
    }

    private _tryToStart () {
        if (this._splashFinish && this._loadFinish) {
            if (this.callBack) {
                this.callBack();
                this.hide();
            }
        }
    }

    public main (device: GFXDevice) {
        if (window._CCSettings && window._CCSettings.PreviewSetting) {
            this.setting = window._CCSettings.PreviewSetting;
            (this.setting.totalTime as number) = this.setting.totalTime != null ? this.setting.totalTime : 3000;
            (this.setting.base64src as string) = this.setting.base64src != null ? this.setting.base64src : defaultSrcBase64;
            (this.setting.effect as SplashEffectType) = this.setting.effect != null ? this.setting.effect : "none";
        } else {
            this.setting = {
                totalTime: 3000,
                base64src: defaultSrcBase64,
                effect: 'none'
            }
        }

        if (this.setting.totalTime <= 0) {
            if (this.callBack) this.callBack();
            this.callBack = null;
            (this.setting as any) = null;
            delete SplashImage._ins;
            return;
        } else {
            this.callBack = null;
            this.cancelAnimate = false;
            this.startTime = -1;

            this.device = device;
            this.image = new Image();
            this.image.onload = this.init.bind(this);
            this.image.src = this.setting.base64src;
        }
    }

    public setOnFinish (cb: Function) {
        this.callBack = cb;
    }

    private init () {
        this.initCMD();
        this.initIA();
        this.initPSO();

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
            this.material.setProperty('u_precent', easing.cubicOut(precent));
            this.material.passes[0].update();

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
        delete SplashImage._ins;
    }

    private frame (time: number) {
        const device = this.device;
        const pso = this.pso;
        const cmdBuff = this.cmdBuff;
        const framebuffer = this.framebuffer;
        const renderArea = this.renderArea;
        const assmebler = this.assmebler;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer, renderArea,
            GFXClearFlag.ALL, [{ r: 0.88, g: 0.88, b: 0.88, a: 1 }], 1.0, 0);
        cmdBuff.bindPipelineState(pso);
        cmdBuff.bindBindingLayout(pso.pipelineLayout.layouts[0]);
        cmdBuff.bindInputAssembler(assmebler);
        cmdBuff.draw(assmebler);
        cmdBuff.endRenderPass();
        cmdBuff.end();

        device.queue.submit([cmdBuff]);
        device.present();
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
        const w = -this.image.width / 2;
        const h = -this.image!.height / 2;
        let n = 0;
        verts[n++] = w; verts[n++] = h; verts[n++] = 0.0; verts[n++] = 1.0;
        verts[n++] = -w; verts[n++] = h; verts[n++] = 1.0; verts[n++] = 1.0;
        verts[n++] = w; verts[n++] = -h; verts[n++] = 0.0; verts[n++] = 0.0;
        verts[n++] = -w; verts[n++] = -h; verts[n++] = 1.0; verts[n++] = 0.0;

        // translate to center
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] = verts[i] + device.width / 2;
            verts[i + 1] = verts[i + 1] + device.height / 2;
        }

        // transform to clipspace
        for (let i = 0; i < verts.length; i += 4) {
            verts[i] = verts[i] / device.width * 2 - 1;
            verts[i + 1] = verts[i + 1] / device.height * 2 - 1;
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

        // const program = effects.find(function (element) {
        //     return element.name == 'util/splash-image';
        // });

        const program = {
            "name": "util/splash-image",
            "techniques": [
                { "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "util/splash-image|splash-vs:vert|splash-fs:frag", "depthStencilState": { "depthTest": true, "depthWrite": false }, "properties": { "mainTexture": { "value": "grey", "type": 28 }, "u_precent": { "type": 13 } } }] }
            ],
            "shaders": [
                {
                    "name": "util/splash-image|splash-vs:vert|splash-fs:frag",
                    "hash": 2381344969,
                    "glsl3": {
                        "vert": `\nprecision mediump float;\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_uv;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 0, 1);\n  v_uv = a_texCoord;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
                        "frag": `\nprecision mediump float;\nin vec2 v_uv;\nuniform sampler2D mainTexture;\nuniform splashFrag {\n  float u_precent;\n};\nvec4 frag () {\n  vec4 color = texture(mainTexture, v_uv);\n  float precent = clamp(u_precent, 0.0, 1.0);\n  color.xyz *= precent;\n  return color;\n}\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }\n`
                    },
                    "glsl1": {
                        "vert": `\nprecision mediump float;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_uv;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 0, 1);\n  v_uv = a_texCoord;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
                        "frag": `\nprecision mediump float;\nvarying vec2 v_uv;\nuniform sampler2D mainTexture;\nuniform float u_precent;\nvec4 frag () {\n  vec4 color = texture2D(mainTexture, v_uv);\n  float precent = clamp(u_precent, 0.0, 1.0);\n  color.xyz *= precent;\n  return color;\n}\nvoid main() { gl_FragColor = frag(); }\n`
                    },
                    "builtins": { "globals": { "blocks": [], "samplers": [] }, "locals": { "blocks": [], "samplers": [] } },
                    "defines": [],
                    "blocks": [
                        {
                            "name": "splashFrag", "defines": [], "binding": 0, "members": [
                                { "name": "u_precent", "type": 13, "count": 1 }
                            ]
                        }
                    ],
                    "samplers": [
                        { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "binding": 30 }
                    ],
                    "dependencies": {}
                }
            ]
        };

        const effect = new EffectAsset();
        effect.name = program!.name;
        effect.techniques = program!.techniques as any;
        effect.shaders = program!.shaders;
        effect.onLoaded();

        this.material = new Material();
        this.material.initialize({
            effectAsset: effect,
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
        (this.setting as any) = null;
        (this.device as any) = null;
        (this.image as any) = null;
        (this.framebuffer as any) = null;
        (this.renderArea as any) = null;
        (this.region as any) = null;

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
    }

    private static _ins: SplashImage;

    public static get instance () {
        if (SplashImage._ins == null) {
            SplashImage._ins = new SplashImage();
        }
        return SplashImage._ins;
    }

    private constructor () { };
}