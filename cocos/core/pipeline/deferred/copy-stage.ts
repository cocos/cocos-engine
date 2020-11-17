/**
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { SetIndex } from '../define';
import { Color, Rect } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { DeferredStagePriority } from './enum';
import { LightingFlow } from './lighting-flow';
import { DeferredPipeline } from './deferred-pipeline';
import { Material } from '../../assets/material';
import { ShaderPool } from '../../renderer/core/memory-pools';
import { PipelineStateManager } from '../pipeline-state-manager';
import { PipelineState } from '../../gfx/pipeline-state';

const colors: Color[] = [ new Color(0, 0, 0, 1) ];
const COPYPASS_INDEX = 0;

/**
 * @en The copy render stage
 * @zh 前向渲染阶段。
 */
@ccclass('CopyStage')
export class CopyStage extends RenderStage {

    private _renderArea = new Rect();

    public static initInfo: IRenderStageInfo = {
        name: 'CopyStage',
        priority: DeferredStagePriority.COPY,
        tag: 0
    };

    @type(Material)
    @serializable
    @displayOrder(3)
    private _copyMaterial: Material | null = null;

    set material (val) {
        if (this._copyMaterial === val) {
            return
        }

        this._copyMaterial = val;
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

        // Copy
        const pass = this._copyMaterial!.passes[COPYPASS_INDEX];
        const shader = ShaderPool.get(this._copyMaterial!.passes[COPYPASS_INDEX].getShaderVariant());

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
