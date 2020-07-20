/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from './enum';
import { RenderContext } from '../render-context';
import { Vec3} from '../../math';
import { intersect, sphere } from '../../geometry';
import { Model} from '../../renderer';
import { CullingStage } from '../common/culling-stage';
import { cullDirectionalLight, cullSphereLight, cullSpotLight } from '../culling';
import { ForwardRenderContext } from './forward-render-context';
import { UBOForwardLight } from '../define';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { LightType } from '../../renderer/scene/light';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { SpotLight } from '../../renderer/scene/spot-light';
import { DirectionalLight } from '../../renderer/scene/directional-light';

const _sphere = sphere.create(0, 0, 0, 1);
const _tempVec3 = new Vec3();

/**
 * @en The forward render stage
 * @zh 前向渲染阶段。
 */
@ccclass('ForwardCullingStage')
export class ForwardCullingStage extends CullingStage {

    public static initInfo: IRenderStageInfo = {
        name: 'ForwardCullingStage',
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
        super.render(rctx, view);

        const ctx = (rctx as ForwardRenderContext);
        const validLights = ctx.validLights;
        const lightBuffers = ctx.lightBuffers;
        const lightIndexOffsets = ctx.lightIndexOffsets;
        const lightIndices = ctx.lightIndices;

        validLights.length = lightIndexOffsets.length = lightIndices.length = 0;
        const sphereLights = view.camera.scene!.sphereLights;

        for (let i = 0; i < sphereLights.length; i++) {
            const light = sphereLights[i];
            light.update();
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
            }
        }
        const spotLights = view.camera.scene!.spotLights;
        for (let i = 0; i < spotLights.length; i++) {
            const light = spotLights[i];
            light.update();
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
            }
        }

        if (validLights.length > lightBuffers.length) {
            for (let l = lightBuffers.length; l < validLights.length; ++l) {
                const lightBuffer: GFXBuffer = ctx.device.createBuffer({
                    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: UBOForwardLight.SIZE,
                    stride: UBOForwardLight.SIZE,
                });
                lightBuffers.push(lightBuffer);
            }
        }

        if (validLights.length > 0) {
            for (let i = 0; i < ctx.renderObjects.length; i++) {
                lightIndexOffsets[i] = lightIndices.length;
                this.cullLightPerModel(ctx, ctx.renderObjects[i].model);
            }
        }
    }

    // Cull light for the model
    private cullLightPerModel (ctx: ForwardRenderContext, model: Model) {
        const validLights = ctx.validLights;
        const lightIndices = ctx.lightIndices;

        if (model.node) {
            model.node.getWorldPosition(_tempVec3);
        } else {
            _tempVec3.set(0.0, 0.0, 0.0);
        }
        for (let i = 0; i < validLights.length; i++) {
            let isCulled = false;
            switch (validLights[i].type) {
                case LightType.DIRECTIONAL:
                    isCulled = cullDirectionalLight(validLights[i] as DirectionalLight, model);
                    break;
                case LightType.SPHERE:
                    isCulled = cullSphereLight(validLights[i] as SphereLight, model);
                    break;
                case LightType.SPOT:
                    isCulled = cullSpotLight(validLights[i] as SpotLight, model);
                    break;
            }
            if (!isCulled) {
                lightIndices.push(i);
            }
        }
    }
}