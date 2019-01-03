import { RenderStage, RenderStageInfo } from "../render-stage";
import { RenderFlow } from "../render-flow";
import { GFXCommandBuffer } from "../../gfx/command-buffer";
import { RenderView } from "../render-view";
import { GFXFramebuffer } from "../../gfx/framebuffer";
import { GFXCommandBufferType, GFXShaderType, GFXPrimitiveMode, GFXFormat } from "../../gfx/define";
import { GFXInputAssembler } from "../../gfx/input-assembler";
import { GFXPipelineState, GFXInputState, GFXRasterizerState, GFXDepthStencilState, GFXBlendState } from "../../gfx/pipeline-state";
import { GFXShader } from "../../gfx/shader";
import { GFXRenderPass } from "../../gfx/render-pass";
import { GFXPipelineLayout } from "../../gfx/pipeline-layout";
import { GFXBindingLayout } from "../../gfx/binding-layout";

let _shader_vs =
`#version 100
attribute vec2 a_position;
attribute vec2 a_texCoord;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

let _shader_fs =
`#version 100
void main() {
    gl_FragColor = vec4(0.6, 0.3, 0.3, 1.0);
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
            stages: [vsStage, fsStage]
        });
        if (!this._shader) {
            return false;
        }

        this._bindingLayout = this._device.createBindingLayout({
            bindings: [],
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
        cmdBuff.bindBindingLayout(<GFXBindingLayout>this._bindingLayout);
        cmdBuff.bindPipelineState(<GFXPipelineState>this._pipelineState);
        cmdBuff.bindInputAssembler(<GFXInputAssembler>this._pipeline.quadIA);
        cmdBuff.draw(<GFXInputAssembler>this._pipeline.quadIA);
        cmdBuff.endRenderPass();
        cmdBuff.end();

        this._device.queue.submit([cmdBuff]);
    }

    private _shader: GFXShader | null = null;
    private _bindingLayout: GFXBindingLayout | null = null;
    private _pipelineLayout: GFXPipelineLayout | null = null;
    private _pipelineState: GFXPipelineState | null = null;
    private _rs: GFXRasterizerState = new GFXRasterizerState;
    private _dss: GFXDepthStencilState = new GFXDepthStencilState;
    private _bs: GFXBlendState = new GFXBlendState;
};
