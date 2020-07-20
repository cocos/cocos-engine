/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag } from '../../gfx/define';
import { UBOGlobal } from '../define';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { PipelineStateManager } from '../pipeline-state-manager';
import { RenderContext } from '../render-context';

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
    public activate (rctx: RenderContext, flow: RenderFlow) {

        super.activate(rctx, flow);

        this.createCmdBuffer(rctx);

        this.rebuild(rctx);
    }

    public destroy () {
        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public resize (width: number, height: number) {
    }

    public rebuild (rctx: RenderContext) {
        const pass = rctx.getMaterial(this._name)!.passes[0];
        this._hTexSampler = pass.getBinding('u_texSampler')!;

        const globalUBO = rctx.globalBindings.get(UBOGlobal.BLOCK.name);

        this._psoCreateInfo = pass.createPipelineStateCI();
        this._bindingLayout =  this._psoCreateInfo!.bindingLayout;

        pass.bindBuffer(UBOGlobal.BLOCK.binding, globalUBO!.buffer!);
        pass.bindTexture(this._hTexSampler, rctx.getTexture(rctx.currShading)!);

        if (rctx.useSMAA) {
            this._hBlendTexSampler = pass.getBinding('u_blendTexSampler')!;
            pass.bindTexture(this._hBlendTexSampler, rctx.getTexture('smaaBlend')!);
        }

        pass.update();
        this._bindingLayout.update();
    }

    public render (rctx: RenderContext, view: RenderView) {

        const camera = view.camera!;
        const device = rctx.device;

        if (this._cmdBuff) {
            this._renderArea!.width = camera.width;
            this._renderArea!.height = camera.height;
            const framebuffer = view.window!.framebuffer;

            this._cmdBuff.begin();
            this._cmdBuff.beginRenderPass(framebuffer, this._renderArea!,
                GFXClearFlag.ALL, [{ r: 0.0, g: 0.0, b: 0.0, a: 1.0 }], 1.0, 0);
            const pso =  PipelineStateManager.getOrCreatePipelineState(device, this._psoCreateInfo!, framebuffer.renderPass!, rctx.quadIA);
            this._cmdBuff.bindPipelineState(pso);
            this._cmdBuff.bindBindingLayout(this._psoCreateInfo!.bindingLayout);
            this._cmdBuff.bindInputAssembler(rctx.quadIA);
            this._cmdBuff.draw(rctx.quadIA);
            this._cmdBuff.endRenderPass();
            this._cmdBuff.end();
        }

        bufs[0] = this._cmdBuff!;
        device.queue.submit(bufs);

        // rctx.swapFBOs();
    }
}
