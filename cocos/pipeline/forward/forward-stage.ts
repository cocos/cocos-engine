import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag, GFXCommandBufferType, GFXFilter, IGFXColor } from '../../gfx/define';
import { Model } from '../../renderer';
import { cullSceneWithDirectionalLight } from '../culling';
import { getPhaseID } from '../pass-phase';
import { SRGBToLinear } from '../pipeline-funcs';
import { RenderFlow } from '../render-flow';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from '../render-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';

const colors: IGFXColor[] = [];
const bufs: GFXCommandBuffer[] = [];

export class ForwardStage extends RenderStage {

    private _opaqueQueue: RenderQueue;
    private _transparentQueue: RenderQueue;
    private _shadowQueue: RenderQueue;
    private _castShadowObjects: Model[] = [];

    constructor (flow: RenderFlow) {
        super(flow);

        this._opaqueQueue = new RenderQueue({
            isTransparent: false,
            phases: getPhaseID('default'),
            sortFunc: opaqueCompareFn,
        });
        this._transparentQueue = new RenderQueue({
            isTransparent: true,
            phases: getPhaseID('default'),
            sortFunc: transparentCompareFn,
        });
        this._shadowQueue = new RenderQueue({
            isTransparent: true,
            phases: getPhaseID('planarShadow'),
            sortFunc: transparentCompareFn,
        });
    }

    public initialize (info: IRenderStageInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

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

        this._opaqueQueue.clear();
        this._transparentQueue.clear();
        this._shadowQueue.clear();

        for (const ro of this._pipeline.renderObjects) {
            for (let i = 0; i < ro.model.subModelNum; i++) {
                for (let j = 0; j < ro.model.getSubModel(i).passes.length; j++) {
                    this._opaqueQueue.insertRenderPass(ro, i, j);
                    this._transparentQueue.insertRenderPass(ro, i, j);
                }
            }
        }
        this._opaqueQueue.sort();
        this._transparentQueue.sort();

        this._castShadowObjects.splice(0);
        const camera = view.camera;
        const scene = camera.scene;
        cullSceneWithDirectionalLight(this._castShadowObjects, scene.models, camera, scene.mainLight, camera.nearClip, camera.farClip, 10);
        for (const m of this._castShadowObjects) {
            for (let i = 0; i < m.subModelNum; i++) {
                for (let j = 0; j < m.getSubModel(i).passes.length; j++) {
                    this._shadowQueue.insertRenderPass({ model: m, depth: 0 }, i, j);
                }
            }
        }
        this._shadowQueue.sort();

        const cmdBuff = this._cmdBuff!;

        const vp = camera.viewport;
        this._renderArea.x = vp.x * camera.width;
        this._renderArea.y = vp.y * camera.height;
        this._renderArea.width = vp.width * camera.width * this.pipeline.shadingScale;
        this._renderArea.height = vp.height * camera.height * this.pipeline.shadingScale;

        if (camera.clearFlag & GFXClearFlag.COLOR) {
            colors[0] = camera.clearColor;
            if (this._pipeline.isHDR) {
                colors[0] = SRGBToLinear(colors[0]);
                const scale = this._pipeline.fpScale / camera.exposure;
                colors[0].r *= scale;
                colors[0].g *= scale;
                colors[0].b *= scale;
            }
            colors.length = 1;
        }

        if (this._pipeline.usePostProcess) {
            if (!this._pipeline.useMSAA) {
                this._framebuffer = this._pipeline.curShadingFBO;
            } else {
                this._framebuffer = this._pipeline.msaaShadingFBO;
            }
        } else {
            this._framebuffer = view.window!.framebuffer;
        }

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea,
            camera.clearFlag, colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.execute(this._opaqueQueue.cmdBuffs.array, this._opaqueQueue.cmdBuffCount);
        cmdBuff.execute(this._shadowQueue.cmdBuffs.array, this._shadowQueue.cmdBuffCount);
        cmdBuff.execute(this._transparentQueue.cmdBuffs.array, this._transparentQueue.cmdBuffCount);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device.queue.submit(bufs);

        if (this._pipeline.useMSAA) {
            this._device.blitFramebuffer(
                this._framebuffer,
                this._pipeline.curShadingFBO,
                this._renderArea,
                this._renderArea,
                GFXFilter.POINT);
        }
    }
}
