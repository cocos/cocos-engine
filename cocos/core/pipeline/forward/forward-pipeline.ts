/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { intersect, sphere } from '../../geometry';
import { GFXBuffer } from '../../gfx/buffer';
import { Vec3, Mat4, Quat, Vec2 } from '../../math';
import { Light, Model } from '../../renderer';
import { DirectionalLight } from '../../renderer/scene/directional-light';
import { LightType } from '../../renderer/scene/light';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { SpotLight } from '../../renderer/scene/spot-light';
import { cullDirectionalLight, cullSphereLight, cullSpotLight } from '../culling';
import { UBOForwardLight, UBOPCFShadow, UBOGlobal } from '../define';
import { IRenderPipelineInfo, RenderPipeline } from '../render-pipeline';
import { RenderView } from '../render-view';
import { UIFlow } from '../ui/ui-flow';
import { ForwardFlow } from './forward-flow';
import { ToneMapFlow } from '../ppfx/tonemap-flow';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { PipelineGlobal } from '../global';
import { ShadowFlow } from '../shadow/shadow-flow';
import { GFXFramebuffer } from '../../gfx/framebuffer';

const _vec4Array = new Float32Array(4);
const _sphere = sphere.create(0, 0, 0, 1);
const _tempVec3 = new Vec3();

const shadowCamera_W_P = new Vec3();
const shadowCamera_W_R = new Quat();
const shadowCamera_W_S = new Vec3();
const shadowCamera_W_T = new Mat4();

const shadowCamera_M_V = new Mat4();
const shadowCamera_M_P = new Mat4();
const shadowCamera_M_V_P = new Mat4();

// Define shadwoMapCamera
const shadowCamera_Near = 0.1;
const shadowCamera_Far = 1000.0;
const shadowCamera_Fov = 45.0;
const shadowCamera_Aspect = 1.0;
const shadowCamera_OrthoSize = 20.0;

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
     * @zh
     * 获取阴影UBO。
     */
    public  get shadowUBOBuffer (){
        return this._globalBindings.get(UBOPCFShadow.BLOCK.name)!.buffer!;
    }

    /**
     * @zh
     * 获取阴影的FBO
     */
    public get shadowFrameBuffer () {
        return this._shadowFrameBuffer!;
    }

    /**
     * @zh
     * 设置阴影的FBO
     */
    public setShadowFrameBuffer (val: GFXFramebuffer) {
        this._shadowFrameBuffer = val;
    }

    /**
     * @zh
     * 获取阴影贴图分辨率
     */
    public get shadowMapSize () {
        return this._shadowMapSize;
    }

    /**
     * @zh
     * 设置阴影贴图分辨率
     */
    public setShadowMapSize (x: number, y: number) {
        if (x > 0 && y > 0) {
            this._shadowMapSize.set(x, y);
        }
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
    private _uboPCFShadow: UBOPCFShadow = new UBOPCFShadow();
    private _shadowFrameBuffer: GFXFramebuffer|null = null;
    private _shadowMapSize: Vec2 = new Vec2(512, 512);

    constructor () {
        super();
        this._validLights = [];
        this._lightIndexOffset = [];
        this._lightIndices = [];
        this._lightBuffers = [];
    }

    public initialize (info: IRenderPipelineInfo) {
        super.initialize(info);

        const shadowFlow = new ShadowFlow();
        shadowFlow.initialize(ShadowFlow.initInfo);
        this._flows.push(shadowFlow);

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

        const camera = view.camera;
        const scene = camera.scene!;

        const mainLight = scene.mainLight;

        if (mainLight) {
            shadowCamera_W_P.set(mainLight!.node!.getWorldPosition());
            shadowCamera_W_R.set(mainLight!.node!.getWorldRotation());
            shadowCamera_W_S.set(mainLight!.node!.getWorldScale());

            // world Transfrom
            Mat4.fromRTS(shadowCamera_W_T, shadowCamera_W_R, shadowCamera_W_P, shadowCamera_W_S);

            // camera view
            Mat4.invert(shadowCamera_M_V, shadowCamera_W_T);

            // camera proj
            // Mat4.perspective(shadowCamera_M_P, shadowCamera_Fov, shadowCamera_Aspect, shadowCamera_Near, shadowCamera_Far);
             const x = shadowCamera_OrthoSize * shadowCamera_Aspect;
             const y = shadowCamera_OrthoSize;
             Mat4.ortho(shadowCamera_M_P, -x, x, -y, y, shadowCamera_Near, shadowCamera_Far,
                 PipelineGlobal.device.clipSpaceMinZ, PipelineGlobal.device.screenSpaceSignY);

            // camera viewProj
            Mat4.multiply(shadowCamera_M_V_P, shadowCamera_M_P, shadowCamera_M_V);

            Mat4.toArray(this._uboGlobal.view, shadowCamera_M_V_P, UBOGlobal.MAIN_SHADOW_MATRIX_OFFSET);
            // update ubos
            this._globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!.update(this._uboGlobal.view);
        }

        // Fill Shadow UBO
        // Fill cc_shadowMatViewProj
        Mat4.toArray(this._uboPCFShadow.view, shadowCamera_M_V_P, UBOPCFShadow.MAT_SHADOW_VIEW_PROJ_OFFSET);
        this._globalBindings.get(UBOPCFShadow.BLOCK.name)!.buffer!.update(this._uboPCFShadow.view);

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
