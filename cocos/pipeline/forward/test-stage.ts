import { RenderStage, RenderStageInfo } from "../render-stage";
import { RenderFlow } from "../render-flow";
import { GFXCommandBuffer } from "../../gfx/command-buffer";
import { RenderView } from "../render-view";
import { GFXFramebuffer } from "../../gfx/framebuffer";
import { GFXCommandBufferType, GFXShaderType, GFXPrimitiveMode, GFXFormat, GFXTextureType, GFXTextureUsageBit, GFXTextureFlagBit, GFXTextureViewType, GFXBufferUsageBit, GFXMemoryUsageBit, GFXTextureLayout, GFXBufferTextureCopy, GFXAddress, GFXFilter, GFXBindingType, GFXType, GFXCullMode } from "../../gfx/define";
import { GFXPipelineState, GFXInputState, GFXRasterizerState, GFXDepthStencilState, GFXBlendState } from "../../gfx/pipeline-state";
import { GFXShader } from "../../gfx/shader";
import { GFXRenderPass } from "../../gfx/render-pass";
import { GFXPipelineLayout } from "../../gfx/pipeline-layout";
import { GFXBindingLayout } from "../../gfx/binding-layout";
import { GFXTexture } from "../../gfx/texture";
import { GFXTextureView } from "../../gfx/texture-view";
import { GFXSampler } from "../../gfx/sampler";
import { GFXBuffer } from "../../gfx/buffer";
import { UBOGlobal } from "../render-pipeline";

/*
declare module '*.png' {
    const value: any;
    export = value;
 }
*/
//declare function require(string): string;
//const image = require('../../../playground/cocos2d-x.png');

let _shader_vs = `#version 100
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_matViewProj;

varying vec2 v_texCoord;

void main() {
    //gl_Position = vec4(a_position, 0.0, 1.0);
    gl_Position = u_matViewProj * vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
}`;

let _shader_fs = `#version 100
precision highp float;
varying vec2 v_texCoord;

uniform vec4 u_color;

uniform sampler2D u_sampler;

void main() {
    //gl_FragColor = vec4(0.6, 0.3, 0.3, 1.0);
    gl_FragColor = texture2D(u_sampler, v_texCoord);
    gl_FragColor.r = u_color.r;
}`;

export class TestStage extends RenderStage {

    constructor(flow: RenderFlow) {
        super(flow);
    }

    public initialize(info: RenderStageInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;
        this._framebuffer = info.framebuffer;
        if (!this._framebuffer) {
            return false;
        }

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        // create shader
        let vsStage = {
            type: GFXShaderType.VERTEX,
            source: _shader_vs,
        };

        let fsStage = {
            type: GFXShaderType.FRAGMENT,
            source: _shader_fs,
        };

        this._shader = this._device.createShader({
            name: "test",
            stages: [vsStage, fsStage],
            blocks: [UBOGlobal.BLOCK, {
                binding: 5, name: "UBO", members: [
                    { name: "u_color", type: GFXType.FLOAT4, count: 1 },
                ]
            }],
            samplers: [
                { binding: 10, name: "u_sampler", type: GFXType.SAMPLER2D, count: 1 }
            ]
        });
        if (!this._shader) {
            return false;
        }

        this._bindingLayout = this._device.createBindingLayout({
            bindings: [
                { binding: 0, type: GFXBindingType.UNIFORM_BUFFER, name: "Global" },
                { binding: 5, type: GFXBindingType.UNIFORM_BUFFER, name: "UBO" },
                { binding: 10, type: GFXBindingType.SAMPLER, name: "u_sampler" },
            ],
        });
        if (!this._bindingLayout) {
            return false;
        }

        this._pipelineLayout = this._device.createPipelineLayout({
            layouts: [this._bindingLayout]
        });
        if (!this._pipelineLayout) {
            return false;
        }

        if (!this._pipeline.quadIA) {
            return false;
        }

        let is: GFXInputState = { attributes: this._pipeline.quadIA.attributes };

        this._rs.cullMode = GFXCullMode.BACK;

        this._pipelineState = this._device.createPipelineState({
            primitive: GFXPrimitiveMode.TRIANGLE_LIST,
            shader: this._shader,
            is: is,
            rs: this._rs,
            dss: this._dss,
            bs: this._bs,
            layout: this._pipelineLayout,
            renderPass: <GFXRenderPass>this._framebuffer.renderPass,
        });

        // create ubo
        let color = [1.0, 0.3, 0.3, 1.0];
        let uboStride = color.length * 4;
        this._ubo = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: uboStride,
            stride: uboStride,
        });

        if (!this._ubo) {
            return false;
        }

        let uboView = new Float32Array(4);
        uboView[0] = 1.0;
        uboView[1] = 0.3;
        uboView[2] = 0.3;
        uboView[3] = 1.0;
        this._ubo.update(uboView);

        // load texture
        let imgElms = this._device.canvas.getElementsByTagName("img");
        if (imgElms.length) {
            if (!this.loadTexture(<HTMLImageElement>imgElms[0])) {
                console.error("Load texture failed.");
                return false;
            }

            this.bindBindings();
        } else {
            console.error("Not found image, load texture failed.");
        }

        return true;
    }

    public destroy() {

        if (this._shader) {
            this._shader.destroy();
            this._shader = null;
        }

        if (this._ubo) {
            this._ubo.destroy();
            this._ubo = null;
        }

        if (this._texView) {
            this._texView.destroy();
            this._texView = null;
        }

        if (this._texture) {
            this._texture.destroy();
            this._texture = null;
        }

        if (this._bindingLayout) {
            this._bindingLayout.destroy();
            this._bindingLayout = null;
        }

        if (this._pipelineLayout) {
            this._pipelineLayout.destroy();
            this._pipelineLayout = null;
        }

        if (this._pipelineState) {
            this._pipelineState.destroy();
            this._pipelineState = null;
        }

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public render(view: RenderView) {
        let cmdBuff = <GFXCommandBuffer>this._cmdBuff;
        this._renderArea.width = view.width;
        this._renderArea.height = view.height;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(<GFXFramebuffer>this._framebuffer, this._renderArea, this._clearColors, this._clearDepth, this._clearStencil);
        cmdBuff.bindPipelineState(<GFXPipelineState>this._pipelineState);
        cmdBuff.bindBindingLayout(<GFXBindingLayout>this._bindingLayout);
        cmdBuff.bindInputAssembler(this._pipeline.quadIA);
        cmdBuff.draw(this._pipeline.quadIA);
        cmdBuff.endRenderPass();
        cmdBuff.end();

        this._device.queue.submit([cmdBuff]);
    }

    private loadTexture(image: HTMLImageElement): boolean {
        //let canvas2d = this._device.canvas.getContext("2d");
        /*
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        if (!context) {
            return false;
        }

        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        let imgData = context.getImageData(0, 0, image.width, image.height);
        let imgBuffer: ArrayBuffer = imgData.data;
        */

        this._texture = this._device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED | GFXTextureUsageBit.TRANSFER_DST,
            format: GFXFormat.RGBA8,
            width: image.width,
            height: image.height,
            flags: GFXTextureFlagBit.NONE,
        });

        if (!this._texture) {
            return false;
        }

        this._texView = this._device.createTextureView({
            texture: this._texture,
            type: GFXTextureViewType.TV2D,
            format: GFXFormat.RGBA8,
        });

        if (!this._texView) {
            return false;
        }

        let region: GFXBufferTextureCopy = {
            buffOffset: 0,
            buffStride: 0,
            buffTexHeight: 0,
            texOffset: { x: 0, y: 0, z: 0 },
            texExtent: { width: image.width, height: image.height, depth: 1 },
            texSubres: { baseMipLevel: 0, levelCount: 1, baseArrayLayer: 0, layerCount: 1 },
        };

        this._device.copyImageSourceToTexture(image, this._texture, [region]);
        //this._device.copyBufferToTexture(imgBuffer, this._texture, [region]);

        this._sampler = this._device.createSampler({
            minFilter: GFXFilter.LINEAR,
            magFilter: GFXFilter.LINEAR,
            mipFilter: GFXFilter.NONE,
            addressU: GFXAddress.WRAP,
            addressV: GFXAddress.WRAP,
        });

        return true;
    }

    private bindBindings(): boolean {

        if (!this._bindingLayout) {
            return false;
        }

        this._bindingLayout.bindBuffer(0, this.pipeline.globalUBO);
        this._bindingLayout.bindBuffer(5, <GFXBuffer>this._ubo);
        this._bindingLayout.bindTextureView(10, <GFXTextureView>this._texView);
        this._bindingLayout.bindSampler(10, <GFXSampler>this._sampler);
        this._bindingLayout.update();

        return true;
    }

    private _shader: GFXShader | null = null;
    private _bindingLayout: GFXBindingLayout | null = null;
    private _pipelineLayout: GFXPipelineLayout | null = null;
    private _pipelineState: GFXPipelineState | null = null;
    private _rs: GFXRasterizerState = new GFXRasterizerState;
    private _dss: GFXDepthStencilState = new GFXDepthStencilState;
    private _bs: GFXBlendState = new GFXBlendState;

    private _ubo: GFXBuffer | null = null;

    private _texture: GFXTexture | null = null;
    private _texView: GFXTextureView | null = null;
    private _sampler: GFXSampler | null = null;
};
