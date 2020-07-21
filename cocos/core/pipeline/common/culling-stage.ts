/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from '../forward/enum';
import { RenderContext } from '../render-context';
import { legacyCC } from '../../global-exports';
import { Vec3} from '../../math';
import { SKYBOX_FLAG } from '../../renderer/scene/camera';
import { Layers } from '../../scene-graph';
import { intersect } from '../../geometry';
import { Camera, Model } from '../../renderer';

const v3_1 = new Vec3();

/**
 * @en The culling stage
 * @zh 裁剪阶段。
 */
@ccclass('CullingStage')
export class CullingStage extends RenderStage {

    public static initInfo: IRenderStageInfo = {
        name: 'CullingStage',
        priority: ForwardStagePriority.CULLING,
        renderQueues: [],
    };

    constructor () {
        super();
    }

    public activate (rctx: RenderContext, flow: RenderFlow) {
        super.activate(rctx, flow);
    }

    public destroy () {
    }

    public resize (width: number, height: number) {
    }

    public rebuild () {
    }

    public render (rctx: RenderContext, view: RenderView) {
        const camera = view.camera;
        const scene = camera.scene!;

        rctx.renderObjects.length = 0;

        const mainLight = scene.mainLight;
        const planarShadows = scene.planarShadows;
        if (mainLight) {
            mainLight.update();
            if (planarShadows.enabled && mainLight.node!.hasChangedFlags) {
                planarShadows.updateDirLight(mainLight);
            }
        }

        if (scene.skybox.enabled && (camera.clearFlag & SKYBOX_FLAG)) {
            this.addVisibleModel(rctx, scene.skybox, camera);
        }

        const models = scene.models;
        const stamp = legacyCC.director.getTotalFrames();

        for (let i = 0; i < models.length; i++) {
            const model = models[i];

            // filter model by view visibility
            if (model.enabled) {
                const vis = view.visibility & Layers.BitMask.UI_2D;
                if (vis) {
                    if ((model.node && (view.visibility === model.node.layer)) ||
                        view.visibility === model.visFlags) {
                        model.updateTransform(stamp);
                        model.updateUBOs(stamp);
                        this.addVisibleModel(rctx, model, camera);
                    }
                } else {
                    if (model.node && ((view.visibility & model.node.layer) === model.node.layer) ||
                        (view.visibility & model.visFlags)) {
                        model.updateTransform(stamp);

                        // frustum culling
                        if (model.worldBounds && !intersect.aabb_frustum(model.worldBounds, camera.frustum)) {
                            continue;
                        }

                        model.updateUBOs(stamp);
                        this.addVisibleModel(rctx, model, camera);
                    }
                }
            }
        }

        if (planarShadows.enabled) {
            planarShadows.updateShadowList(camera.frustum, stamp, (camera.visibility & Layers.BitMask.DEFAULT) !== 0);
        }
    }

    /**
     * @en Add a visible model in the given camera as a render object in the pipeline
     * @zh 向当前管线添加指定摄像机中的可见对象。
     * @param model The visible model
     * @param camera The camera from which the model can be seen
     */
    protected addVisibleModel (rctx: RenderContext, model: Model, camera: Camera) {
        let depth = 0;
        if (model.node) {
            Vec3.subtract(v3_1, model.node.worldPosition, camera.position);
            depth = Vec3.dot(v3_1, camera.forward);
        }
        rctx.renderObjects.push({
            model,
            depth,
        });
    }
}