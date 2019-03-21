import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXClearFlag, GFXCommandBufferType } from '../../gfx/define';
import { UBOGlobal } from '../define';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';

export class SMAAEdgeStage extends RenderStage {

    private _hTexSampler: number = 0;
    private _bindingLayout: GFXBindingLayout | null = null;

    constructor (flow: RenderFlow) {
        super(flow);
    }

    public initialize (info: IRenderStageInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        if (info.framebuffer !== undefined) {
            this._framebuffer = info.framebuffer ;
        }

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        this._pass = this._flow.material.passes[0];
        this._hTexSampler = this._pass.getBinding('u_texSampler');

        const globalUBO = this._pipeline.globalBindings.get(UBOGlobal.BLOCK.name);

        this._pso = this._pass.createPipelineState();
        this._bindingLayout =  this._pso!.pipelineLayout.layouts[0];

        this._pass.bindBuffer(UBOGlobal.BLOCK.binding, globalUBO!.buffer!);
        this._pass.bindTextureView(this._hTexSampler, this._pipeline.curShadingTexView);
        this._pass.update();
        this._bindingLayout.update();

        return true;
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
    }

    public render (view: RenderView) {

        const camera = view.camera!;

        if (this._cmdBuff) {

            this._renderArea.width = camera.width;
            this._renderArea.height = camera.height;

            this._cmdBuff.begin();
            this._cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea,
                GFXClearFlag.ALL, [{ r: 0.0, g: 0.0, b: 0.0, a: 1.0 }], 1.0, 0);
            this._cmdBuff.bindPipelineState(this._pso!);
            this._cmdBuff.bindBindingLayout(this._bindingLayout!);
            this._cmdBuff.bindInputAssembler(this._pipeline.quadIA);
            this._cmdBuff.draw(this._pipeline.quadIA);
            this._cmdBuff.endRenderPass();
            this._cmdBuff.end();
        }

        this._device.queue.submit([this._cmdBuff!]);
    }
}
