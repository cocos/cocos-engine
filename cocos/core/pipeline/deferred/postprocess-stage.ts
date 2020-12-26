/**
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { SetIndex } from '../define';
import { Color, Rect, Shader } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { DeferredStagePriority } from './enum';
import { LightingFlow } from './lighting-flow';
import { DeferredPipeline } from './deferred-pipeline';
import { Material } from '../../assets/material';
import { ShaderPool } from '../../renderer/core/memory-pools';
import { PipelineStateManager } from '../pipeline-state-manager';
import { PipelineState } from '../../gfx/pipeline-state';
import { builtinResMgr } from '../../3d/builtin/init';
import { Pass } from '../../renderer';

const colors: Color[] = [ new Color(0, 0, 0, 1) ];
const POSTPROCESSPASS_INDEX = 0;

/**
 * @en The postprocess render stage
 * @zh 前向渲染阶段。
 */
@ccclass('PostprocessStage')
export class PostprocessStage extends RenderStage {

    private _renderArea = new Rect();

    public static initInfo: IRenderStageInfo = {
        name: 'PostprocessStage',
        priority: DeferredStagePriority.POSTPROCESS,
        tag: 0
    };

    @type(Material)
    @serializable
    @displayOrder(3)
    private _postprocessMaterial: Material | null = null;

    set material (val) {
        if (this._postprocessMaterial === val) {
            return
        }

        this._postprocessMaterial = val;
    }

    constructor () {
        super();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        return true;
    }

    public activate (pipeline: DeferredPipeline, flow: LightingFlow) {
        super.activate(pipeline, flow);
    }

    public destroy () {
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as DeferredPipeline;
        const device = pipeline.device;

        const cmdBuff = pipeline.commandBuffers[0];

        const camera = view.camera;
        pipeline.updateUBOs(view, false);
        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width * pipeline.shadingScale;
        this._renderArea!.height = vp.height * camera.height * pipeline.shadingScale;

        const framebuffer = view.window.framebuffer;
        const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);

        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        // Postprocess
        var pass: Pass;
        var shader: Shader;
        const builtinPostProcess = builtinResMgr.get<Material>('builtin-post-process-material');
        if (builtinPostProcess) {
            pass = builtinPostProcess.passes[0];
            shader = ShaderPool.get(pass.getShaderVariant());
        } else {
            pass = this._postprocessMaterial!.passes[POSTPROCESSPASS_INDEX];
            shader = ShaderPool.get(this._postprocessMaterial!.passes[POSTPROCESSPASS_INDEX].getShaderVariant());
        }

        const inputAssembler = pipeline.quadIA;
        var pso:PipelineState|null = null;
        if (pass != null && shader != null && inputAssembler != null)
        {
            pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);
        }

        if(pso != null)
        {
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }

        cmdBuff.endRenderPass();
    }
}
