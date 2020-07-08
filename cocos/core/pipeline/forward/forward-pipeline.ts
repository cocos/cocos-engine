/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { intersect, sphere } from '../../geometry';
import { GFXBuffer } from '../../gfx/buffer';
import { Vec3 } from '../../math';
import { Light, Model } from '../../renderer';
import { DirectionalLight } from '../../renderer/scene/directional-light';
import { LightType } from '../../renderer/scene/light';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { SpotLight } from '../../renderer/scene/spot-light';
import { cullDirectionalLight, cullSphereLight, cullSpotLight } from '../culling';
import { UBOForwardLight } from '../define';
import { IRenderPipelineInfo, RenderPipeline } from '../render-pipeline';
import { RenderView } from '../render-view';
import { UIFlow } from '../ui/ui-flow';
import { ForwardFlow } from './forward-flow';
import { ToneMapFlow } from '../ppfx/tonemap-flow';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { PipelineGlobal } from '../global';

const _vec4Array = new Float32Array(4);
const _sphere = sphere.create(0, 0, 0, 1);
const _tempVec3 = new Vec3();

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {
    public static initInfo: IRenderPipelineInfo = {
    };

    /**
     * @en The uniform buffer for lights
     * @zh 光源的 UBO 缓冲。
     */
    public get lightsUBO (): GFXBuffer {
        return this._lightsUBO!;
    }

    /**
     * @en The lights participating the render process
     * @zh 参与渲染的灯光。
     */
    public get validLights () {
        return this._validLights;
    }

    /**
     * @en The index buffer offset of lights
     * @zh 灯光索引缓存偏移量数组。
     */
    public get lightIndexOffsets () {
        return this._lightIndexOffset;
    }

    /**
     * @en The indices of lights
     * @zh 灯光索引数组。
     */
    public get lightIndices () {
        return this._lightIndices;
    }

    /**
     * @en The buffer array of lights
     * @zh 灯光 buffer 数组。
     */
    public get lightBuffers () {
        return this._lightBuffers;
    }

    /**
     * @en The ubo layout for all forward lights 
     * @zh 全部前向光源的 UBO 结构描述。
     */
    protected _uboLight: UBOForwardLight = new UBOForwardLight();

    /**
     * @en The uniform buffer for lights
     * @zh 全部光源的 UBO 缓冲。
     */
    protected _lightsUBO: GFXBuffer | null = null;

    private _validLights: Light[];
    private _lightIndexOffset: number[];
    private _lightIndices: number[];
    private _lightBuffers: GFXBuffer[] = [];

    constructor () {
        super();
        this._validLights = [];
        this._lightIndexOffset = [];
        this._lightIndices = [];
        this._lightBuffers = [];
    }

    public initialize (info: IRenderPipelineInfo) {
        super.initialize(info);
        const forwardFlow = new ForwardFlow();
        forwardFlow.initialize(ForwardFlow.initInfo);
        this._flows.push(forwardFlow);
    }

    public activate (): boolean {
        if (!super.activate()) {
            return false;
        }

        if (this._usePostProcess) {
            if (this._useSMAA) {
                /*
                this.createFlow(SMAAEdgeFlow, {
                    name: PIPELINE_FLOW_SMAA,
                    priority: 0,
                });
                */
            }
            const tonemapFlow = new ToneMapFlow();
            tonemapFlow.initialize(ForwardFlow.initInfo);
            this._flows.push(tonemapFlow);
            tonemapFlow.activate(this);
        }

        const uiFlow = new UIFlow();
        uiFlow.initialize(UIFlow.initInfo);
        this._flows.push(uiFlow);
        uiFlow.activate(this);

        return true;
    }

    public destroy () {
        this._destroy();
    }

    public updateUBOs (view: RenderView) {
        super.updateUBOs(view);

        const exposure = view.camera.exposure;

        // Fill UBOForwardLight, And update LightGFXBuffer[light_index]
        for(let l = 0; l < this._validLights.length; ++l) {
            this._uboLight.view.fill(0);
            const light = this._validLights[l];
            if (light) {
                switch (light.type) {
                    case LightType.SPHERE:
                        const sphereLit = light as SphereLight;
                        Vec3.toArray(_vec4Array, sphereLit.position);
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_POS_OFFSET);

                        _vec4Array[0] = sphereLit.size;
                        _vec4Array[1] = sphereLit.range;
                        _vec4Array[2] = 0.0;
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                        Vec3.toArray(_vec4Array, light.color);
                        if (light.useColorTemperature) {
                            const tempRGB = light.colorTemperatureRGB;
                            _vec4Array[0] *= tempRGB.x;
                            _vec4Array[1] *= tempRGB.y;
                            _vec4Array[2] *= tempRGB.z;
                        }
                        if (this._isHDR) {
                            _vec4Array[3] = sphereLit.luminance * this._fpScale * this._lightMeterScale;
                        } else {
                            _vec4Array[3] = sphereLit.luminance * exposure * this._lightMeterScale;
                        }
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_COLOR_OFFSET);
                    break;
                    case LightType.SPOT:
                        const spotLit = light as SpotLight;

                        Vec3.toArray(_vec4Array, spotLit.position);
                        _vec4Array[3] = spotLit.size;
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_POS_OFFSET);

                        _vec4Array[0] = spotLit.size;
                        _vec4Array[1] = spotLit.range;
                        _vec4Array[2] = spotLit.spotAngle;
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                        Vec3.toArray(_vec4Array, spotLit.direction);
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_DIR_OFFSET);

                        Vec3.toArray(_vec4Array, light.color);
                        if (light.useColorTemperature) {
                            const tempRGB = light.colorTemperatureRGB;
                            _vec4Array[0] *= tempRGB.x;
                            _vec4Array[1] *= tempRGB.y;
                            _vec4Array[2] *= tempRGB.z;
                        }
                        if (this._isHDR) {
                            _vec4Array[3] = spotLit.luminance * this._fpScale * this._lightMeterScale;
                        } else {
                            _vec4Array[3] = spotLit.luminance * exposure * this._lightMeterScale;
                        }
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_COLOR_OFFSET);
                    break;
                }
            }
            // update lightBuffer
            this._lightBuffers[l].update(this._uboLight.view);
        }
    }

    public sceneCulling (view: RenderView) {
        super.sceneCulling(view);
        this._validLights.length = 0;
        const sphereLights = view.camera.scene!.sphereLights;

        for (let i = 0; i < sphereLights.length; i++) {
            const light = sphereLights[i];
            light.update();
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                this._validLights.push(light);
            }
        }
        const spotLights = view.camera.scene!.spotLights;
        for (let i = 0; i < spotLights.length; i++) {
            const light = spotLights[i];
            light.update();
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                this._validLights.push(light);
            }
        }

        if (this._validLights.length > this._lightBuffers.length) {
            for (let l = this._lightBuffers.length; l < this._validLights.length; ++l) {
                const lightBuffer: GFXBuffer = PipelineGlobal.device.createBuffer({
                    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: UBOForwardLight.SIZE,
                    stride: UBOForwardLight.SIZE,
                });
                this._lightBuffers.push(lightBuffer);
            }
        }

        this._lightIndexOffset.length = this._lightIndices.length = 0;
        if (this._validLights.length) {
            for (let i = 0; i < this._renderObjects.length; i++) {
                this._lightIndexOffset[i] = this._lightIndices.length;
                this.cullLightPerModel(this._renderObjects[i].model);
            }
        }
    }

    // Cull light for the model
    private cullLightPerModel (model: Model) {
        if (model.node) {
            model.node.getWorldPosition(_tempVec3);
        } else {
            _tempVec3.set(0.0, 0.0, 0.0);
        }
        for (let i = 0; i < this._validLights.length; i++) {
            let isCulled = false;
            switch (this._validLights[i].type) {
                case LightType.DIRECTIONAL:
                    isCulled = cullDirectionalLight(this._validLights[i] as DirectionalLight, model);
                    break;
                case LightType.SPHERE:
                    isCulled = cullSphereLight(this._validLights[i] as SphereLight, model);
                    break;
                case LightType.SPOT:
                    isCulled = cullSpotLight(this._validLights[i] as SpotLight, model);
                    break;
            }
            if (!isCulled) {
                this._lightIndices.push(i);
            }
        }
    }
}
