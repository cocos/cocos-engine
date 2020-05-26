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
import { Root } from '../../root';
import { cullDirectionalLight, cullSphereLight, cullSpotLight } from '../culling';
import { UBOForwardLight } from '../define';
import { IRenderPipelineInfo, RenderPipeline } from '../render-pipeline';
import { RenderView } from '../render-view';
import { UIFlow } from '../ui/ui-flow';
import { ForwardFlow } from './forward-flow';
import { ToneMapFlow } from '../ppfx/tonemap-flow';

const _vec4Array = new Float32Array(4);
const _sphere = sphere.create(0, 0, 0, 1);
const _tempLightIndex = [] as number[];
const _tempLightDist = [] as number[];
const _tempVec3 = new Vec3();

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {
    /**
     * @en The uniform buffer for lights
     * @zh 光源的 UBO 缓冲。
     */
    public get lightsUBO (): GFXBuffer {
        return this._lightsUBO!;
    }

    public static initInfo: IRenderPipelineInfo = {
    };

    /**
     * @en The ubo layout for all forward lights 
     * @zh 全部前向光源的 UBO 结构描述。
     */
    protected _uboLights: UBOForwardLight = new UBOForwardLight();

    /**
     * @en The uniform buffer for lights
     * @zh 全部光源的 UBO 缓冲。
     */
    protected _lightsUBO: GFXBuffer | null = null;

    /**
     * @en The lights participating the render process
     * @zh 参与渲染的灯光。
     */
    private _validLights: Light[];

    /**
     * @en The index buffer offset of lights
     * @zh 灯光索引缓存偏移量数组。
     */
    private _lightIndexOffset: number[];

    /**
     * @en The indices of lights
     * @zh 灯光索引数组。
     */
    private _lightIndices: number[];

    constructor () {
        super();
        this._validLights = [];
        this._lightIndexOffset = [];
        this._lightIndices = [];
    }

    public initialize (info: IRenderPipelineInfo) {
        super.initialize(info);
        const forwardFlow = new ForwardFlow();
        forwardFlow.initialize(ForwardFlow.initInfo);
        this._flows.push(forwardFlow);
    }

    public activate (root: Root): boolean {
        if (!super.activate(root)) {
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

    public rebuild () {
        super.rebuild();
        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].rebuild();
        }
    }

    public updateUBOs (view: RenderView) {
        super.updateUBOs(view);

        const exposure = view.camera.exposure;

        for (let i = 0; i < this._renderObjects.length; i++) {
            this._uboLights.view.fill(0);
            const nextLightIndex = i + 1 < this._renderObjects.length ? this._lightIndexOffset[i + 1] : this._lightIndices.length;
            if (!this._renderObjects[i].model.lightBuffer || this._renderObjects[i].model.isDynamicBatching) {
                continue;
            }
            let sphereNum = 0;
            let spotNum = 0;
            for (let l = this._lightIndexOffset[i]; l < nextLightIndex; l++) {
                const light = this._validLights[this._lightIndices[l]];
                if (light) {
                    switch (light.type) {
                        case LightType.SPHERE:
                            if (sphereNum >= UBOForwardLight.MAX_SPHERE_LIGHTS) {
                                continue;
                            }

                            const sphereLit = light as SphereLight;
                            Vec3.toArray(_vec4Array, sphereLit.position);
                            this._uboLights.view.set(_vec4Array, UBOForwardLight.SPHERE_LIGHT_POS_OFFSET + sphereNum * 4);

                            _vec4Array[0] = sphereLit.size;
                            _vec4Array[1] = sphereLit.range;
                            _vec4Array[2] = 0.0;
                            this._uboLights.view.set(_vec4Array, UBOForwardLight.SPHERE_LIGHT_SIZE_RANGE_OFFSET + sphereNum * 4);

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
                            this._uboLights.view.set(_vec4Array, UBOForwardLight.SPHERE_LIGHT_COLOR_OFFSET + sphereNum * 4);
                            sphereNum++;
                            break;
                        case LightType.SPOT:
                            if (spotNum >= UBOForwardLight.MAX_SPOT_LIGHTS) {
                                continue;
                            }

                            const spotLit = light as SpotLight;

                            Vec3.toArray(_vec4Array, spotLit.position);
                            _vec4Array[3] = spotLit.size;
                            this._uboLights.view.set(_vec4Array, UBOForwardLight.SPOT_LIGHT_POS_OFFSET + spotNum * 4);

                            _vec4Array[0] = spotLit.size;
                            _vec4Array[1] = spotLit.range;
                            _vec4Array[2] = spotLit.spotAngle;
                            this._uboLights.view.set(_vec4Array, UBOForwardLight.SPOT_LIGHT_SIZE_RANGE_ANGLE_OFFSET + spotNum * 4);

                            Vec3.toArray(_vec4Array, spotLit.direction);
                            this._uboLights.view.set(_vec4Array, UBOForwardLight.SPOT_LIGHT_DIR_OFFSET + spotNum * 4);

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
                            this._uboLights.view.set(_vec4Array, UBOForwardLight.SPOT_LIGHT_COLOR_OFFSET + spotNum * 4);
                            spotNum++;
                            break;
                    }
                }
            }
            this._renderObjects[i].model.lightBuffer!.update(this._uboLights.view);
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

        this._lightIndexOffset.length = this._lightIndices.length = 0;
        if (this._validLights.length) {
            for (let i = 0; i < this._renderObjects.length; i++) {
                this._lightIndexOffset[i] = this._lightIndices.length;
                if (this._renderObjects[i].model.lightBuffer) {
                    this.cullLightPerModel(this._renderObjects[i].model);
                }
            }
        }
    }

    // Cull light for the model
    private cullLightPerModel (model: Model) {
        _tempLightIndex.length = 0;
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
                _tempLightIndex.push(i);
                if (this._validLights[i].type === LightType.DIRECTIONAL) {
                    _tempLightDist[i] = 0;
                } else {
                    _tempLightDist[i] = Vec3.distance((this._validLights[i] as SphereLight | SpotLight).position, model.node.getWorldPosition(_tempVec3));
                }
            }
        }
        _tempLightIndex.sort(this.sortLight);
        Array.prototype.push.apply(this._lightIndices, _tempLightIndex);
    }

    private sortLight (a: number, b: number) {
        return _tempLightDist[a] - _tempLightDist[b];
    }
}
