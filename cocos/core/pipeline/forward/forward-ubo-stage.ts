/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from '../forward/enum';
import { RenderContext } from '../render-context';
import { UBOForwardLight} from '../define';
import { Vec3 } from '../../math';
import { UBOStage } from '../common/ubo-stage';
import { LightType } from '../../renderer/scene/light';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { SpotLight } from '../../renderer/scene/spot-light';
import { ForwardRenderContext } from './forward-render-context';

const _vec4Array = new Float32Array(4);

/**
 * @en The forward ubo stage
 * @zh 前向渲染的 ubo 处理阶段。
 */
@ccclass('ForwardUBOStage')
export class ForwardUBOStage extends UBOStage {

    public static initInfo: IRenderStageInfo = {
        name: 'ForwardUBOStage',
        priority: ForwardStagePriority.UBO,
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
        const ctx = rctx as ForwardRenderContext;
        const exposure = view.camera.exposure;
        const lightMeterScale = ctx.lightMeterScale;

        // Fill UBOForwardLight, And update LightGFXBuffer[light_index]
        for(let l = 0; l < ctx.validLights.length; ++l) {
            ctx.uboLight.view.fill(0);
            const light = ctx.validLights[l];
            if (light) {
                switch (light.type) {
                    case LightType.SPHERE:
                        const sphereLit = light as SphereLight;
                        Vec3.toArray(_vec4Array, sphereLit.position);
                        ctx.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_POS_OFFSET);

                        _vec4Array[0] = sphereLit.size;
                        _vec4Array[1] = sphereLit.range;
                        _vec4Array[2] = 0.0;
                        ctx.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                        Vec3.toArray(_vec4Array, light.color);
                        if (light.useColorTemperature) {
                            const tempRGB = light.colorTemperatureRGB;
                            _vec4Array[0] *= tempRGB.x;
                            _vec4Array[1] *= tempRGB.y;
                            _vec4Array[2] *= tempRGB.z;
                        }
                        if (ctx.isHDR) {
                            _vec4Array[3] = sphereLit.luminance * ctx.fpScale * lightMeterScale;
                        } else {
                            _vec4Array[3] = sphereLit.luminance * exposure * lightMeterScale;
                        }
                        ctx.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_COLOR_OFFSET);
                    break;
                    case LightType.SPOT:
                        const spotLit = light as SpotLight;

                        Vec3.toArray(_vec4Array, spotLit.position);
                        _vec4Array[3] = spotLit.size;
                        ctx.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_POS_OFFSET);

                        _vec4Array[0] = spotLit.size;
                        _vec4Array[1] = spotLit.range;
                        _vec4Array[2] = spotLit.spotAngle;
                        ctx.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                        Vec3.toArray(_vec4Array, spotLit.direction);
                        ctx.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_DIR_OFFSET);

                        Vec3.toArray(_vec4Array, light.color);
                        if (light.useColorTemperature) {
                            const tempRGB = light.colorTemperatureRGB;
                            _vec4Array[0] *= tempRGB.x;
                            _vec4Array[1] *= tempRGB.y;
                            _vec4Array[2] *= tempRGB.z;
                        }
                        if (ctx.isHDR) {
                            _vec4Array[3] = spotLit.luminance * ctx.fpScale * lightMeterScale;
                        } else {
                            _vec4Array[3] = spotLit.luminance * exposure * lightMeterScale;
                        }
                        ctx.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_COLOR_OFFSET);
                    break;
                }
            }
            // update lightBuffer
            ctx.lightBuffers[l].update(ctx.uboLight.view);
        }
    }
}