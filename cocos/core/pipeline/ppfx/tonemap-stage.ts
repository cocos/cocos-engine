/**
 * @category pipeline.ppfx
 */

import { ccclass } from '../../data/class-decorator';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag, GFXCommandBufferType } from '../../gfx/define';
import { UBOGlobal } from '../define';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { PipelineStateManager } from '../pipeline-state-manager';

const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * 色调映射渲染阶段。
 *
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

    constructor () {
        super();
    }

    public activate (flow: RenderFlow) {

        super.activate(flow);

        this._createCmdBuffer();

        this.rebuild();
    }

    public destroy () {
        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
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

        if (this._cmdBuff) {

            this._renderArea!.width = camera.width;
            this._renderArea!.height = camera.height;
            const framebuffer = view.window!.framebuffer;

            this._cmdBuff.begin();
            this._cmdBuff.beginRenderPass(framebuffer, this._renderArea!,
                GFXClearFlag.ALL, [{ r: 0.0, g: 0.0, b: 0.0, a: 1.0 }], 1.0, 0);
            const pso =  PipelineStateManager.getOrCreatePipelineState(this._device!, this._psoCreateInfo!, framebuffer.renderPass!, this._pipeline!.quadIA);
            this._cmdBuff.bindPipelineState(pso);
            this._cmdBuff.bindBindingLayout(this._psoCreateInfo!.bindingLayout);
            this._cmdBuff.bindInputAssembler(this._pipeline!.quadIA);
            this._cmdBuff.draw(this._pipeline!.quadIA);
            this._cmdBuff.endRenderPass();
            this._cmdBuff.end();
        }

        bufs[0] = this._cmdBuff!;
        this._device!.queue.submit(bufs);

        // this._pipeline.swapFBOs();
    }

    private _createCmdBuffer () {
        this._cmdBuff = this._device!.createCommandBuffer({
            allocator: this._device!.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });
    }
}
