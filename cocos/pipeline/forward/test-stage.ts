import { RenderStage, RenderStageInfo } from "../render-stage";
import { RenderFlow } from "../render-flow";
import { GFXCommandBuffer } from "../../gfx/command-buffer";
import { RenderView } from "../render-view";
import { GFXFramebuffer } from "../../gfx/framebuffer";
import { GFXCommandBufferType, GFXShaderType, GFXPrimitiveMode, GFXFormat, GFXTextureType, GFXTextureUsageBit, GFXTextureFlagBit, GFXTextureViewType, GFXBufferUsageBit, GFXMemoryUsageBit, GFXTextureLayout, GFXBufferTextureCopy, GFXAddress, GFXFilter, GFXBindingType, GFXType } from "../../gfx/define";
import { GFXInputAssembler } from "../../gfx/input-assembler";
import { GFXPipelineState, GFXInputState, GFXRasterizerState, GFXDepthStencilState, GFXBlendState } from "../../gfx/pipeline-state";
import { GFXShader } from "../../gfx/shader";
import { GFXRenderPass } from "../../gfx/render-pass";
import { GFXPipelineLayout } from "../../gfx/pipeline-layout";
import { GFXBindingLayout } from "../../gfx/binding-layout";
import { GFXTexture } from "../../gfx/texture";
import { GFXTextureView } from "../../gfx/texture-view";
import { GFXSampler } from "../../gfx/sampler";

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

varying vec2 v_texCoord;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
}`;

let _shader_fs = `#version 100
precision highp float;
varying vec2 v_texCoord;

uniform sampler2D u_sampler;

void main() {
    //gl_FragColor = vec4(0.6, 0.3, 0.3, 1.0);
    gl_FragColor = texture2D(u_sampler, v_texCoord);
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
            samplers: [
                {binding: 10, name: "u_sampler", type: GFXType.SAMPLER2D, count: 1 }
            ]
        });
        if (!this._shader) {
            return false;
        }

        this._bindingLayout = this._device.createBindingLayout({
            bindings: [
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
        cmdBuff.bindInputAssembler(<GFXInputAssembler>this._pipeline.quadIA);
        cmdBuff.draw(<GFXInputAssembler>this._pipeline.quadIA);
        cmdBuff.endRenderPass();
        cmdBuff.end();

        this._device.queue.submit([cmdBuff]);
    }

    private loadTexture(image: HTMLImageElement): boolean {
        //let canvas2d = this._device.canvas.getContext("2d");
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
        //var buffer = image.currentSrc;//arraybuffer object

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

        this._device.copyBufferToTexture2D(imgBuffer, this._texture);

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

    private _texture: GFXTexture | null = null;
    private _texView: GFXTextureView | null = null;
    private _sampler: GFXSampler | null = null;

};
