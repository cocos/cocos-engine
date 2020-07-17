/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { UBOGlobal } from '../define';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { PipelineStateManager } from '../pipeline-state-manager';
import { PipelineGlobal } from '../global';

const bufs: GFXCommandBuffer[] = [];

/**
 * @en The tone mapping render stage
 * @zh 色调映射渲染阶段。
 */
@ccclass('ToneMapStage')
export class ToneMapStage extends RenderStage {

    public static initInfo: IRenderStageInfo = {
        name: 'ToneMapStage',
        priority: 0,
        framebuffer: 'window',
    };

    private _hTexSampler: number = 0;
    private _hBlendTexSampler: number = 0;
    private _bindingLayout: GFXBindingLayout | null = null;

    public activate (flow: RenderFlow) {

        super.activate(flow);

        this.rebuild();
    }

    public destroy () {
    }

    public resize (width: number, height: number) {
    }

    public rebuild () {
        this._pass = this._flow!.material!.passes[0];
        this._hTexSampler = this._pass.getBinding('u_texSampler')!;

        const globalUBO = this._pipeline!.globalBindings.get(UBOGlobal.BLOCK.name);

        this._psoCreateInfo = this._pass.createPipelineStateCI();
        this._bindingLayout =  this._psoCreateInfo!.bindingLayout;

        this._pass.bindBuffer(UBOGlobal.BLOCK.binding, globalUBO!.buffer!);
        this._pass.bindTexture(this._hTexSampler, this._pipeline!.getTexture(this._pipeline!.currShading)!);

        if (this._pipeline!.useSMAA) {
            this._hBlendTexSampler = this._pass.getBinding('u_blendTexSampler')!;
            this._pass.bindTexture(this._hBlendTexSampler, this._pipeline!.getTexture('smaaBlend')!);
        }

        this._pass.update();
        this._bindingLayout.update();
    }

    public render (view: RenderView) {

        const camera = view.camera!;
        const cmdBuff = this._pipeline.commandBuffers[0];

        this._renderArea!.width = camera.width;
        this._renderArea!.height = camera.height;

        const framebuffer = view.window.framebuffer;
        const renderPass = framebuffer.renderPass;

        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!, [{ r: 0.0, g: 0.0, b: 0.0, a: 1.0 }], 1.0, 0);
        const pso =  PipelineStateManager.getOrCreatePipelineState(PipelineGlobal.device,
            this._psoCreateInfo!, framebuffer.renderPass!, this._pipeline!.quadIA);
        cmdBuff.bindPipelineState(pso);
        cmdBuff.bindBindingLayout(this._psoCreateInfo!.bindingLayout);
        cmdBuff.bindInputAssembler(this._pipeline!.quadIA);
        cmdBuff.draw(this._pipeline!.quadIA);
        cmdBuff.endRenderPass();

        // this._pipeline.swapFBOs();
    }
}
