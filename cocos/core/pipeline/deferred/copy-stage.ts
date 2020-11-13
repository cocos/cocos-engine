/**
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { IRenderPass, localDescriptorSetLayout, UBODeferredLight, SetIndex } from '../define';
import { getPhaseID } from '../pass-phase';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from '../render-queue';
import { GFXClearFlag, GFXColor, GFXRect } from '../../gfx/define';
import { SRGBToLinear } from '../pipeline-funcs';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { DeferredStagePriority } from './enum';
import { RenderAdditiveLightQueue } from '../render-additive-light-queue';
import { LightingFlow } from './lighting-flow';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderQueueDesc, RenderQueueSortMode } from '../pipeline-serialization';
import { PlanarShadowQueue } from './planar-shadow-queue';
import { Material } from '../../assets/material';
import { ShaderPool } from '../../renderer/core/memory-pools';
import { PipelineStateManager } from '../pipeline-state-manager';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Light } from "../../renderer/scene/light";
import { sphere, intersect } from '../../geometry';
import { color, Vec2, Vec3, Vec4 } from '../../math';
import { LightComponent } from '../../3d';
import { GFXDevice, GFXRenderPass, GFXBuffer, GFXBufferUsageBit, GFXMemoryUsageBit, GFXBufferInfo, GFXBufferViewInfo, GFXDescriptorSet, GFXDescriptorSetLayoutInfo, GFXDescriptorSetLayout, GFXDescriptorSetInfo } from '../../gfx';
import { RenderPipeline } from '../render-pipeline';
import { IRenderObject, UBOForwardLight } from '../define';

const colors: GFXColor[] = [ new GFXColor(0, 0, 0, 1) ];
const COPYPASS_INDEX = 0;

/**
 * @en The copy render stage
 * @zh 前向渲染阶段。
 */
@ccclass('CopyStage')
export class CopyStage extends RenderStage {

    public static initInfo: IRenderStageInfo = {
        name: 'CopyStage',
        priority: DeferredStagePriority.COPY,
        tag: 0,
        renderQueues: [
            {
                isTransparent: false,
                sortMode: RenderQueueSortMode.FRONT_TO_BACK,
                stages: ['default'],
            },
            {
                isTransparent: true,
                sortMode: RenderQueueSortMode.BACK_TO_FRONT,
                stages: ['default', 'planarShadow'],
            },
        ]
    };

    private _renderArea = new GFXRect();
    private _PhaseID = getPhaseID('copy');

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

        // Lighting
        const hPass = this._copyMaterial!.passes[COPYPASS_INDEX].handle;
        const shader = ShaderPool.get(this._copyMaterial!.passes[COPYPASS_INDEX].getShaderVariant());

        const inputAssembler = pipeline.quadIA;
        var pso:GFXPipelineState|null = null;
        if (hPass != null && shader != null && inputAssembler != null)
        {
            pso = PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, inputAssembler);
        }

        if(pso != null)
        {
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }

        cmdBuff.endRenderPass();
    }

    /**
     * @en Clear the given render queue
     * @zh 清空指定的渲染队列
     * @param rq The render queue
     */
    protected renderQueueClearFunc (rq: RenderQueue) {
        rq.clear();
    }

    /**
     * @en Sort the given render queue
     * @zh 对指定的渲染队列执行排序
     * @param rq The render queue
     */
    protected renderQueueSortFunc (rq: RenderQueue) {
        rq.sort();
    }
}
