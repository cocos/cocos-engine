import { RenderContext } from '../render-context';
import { Light } from '../../renderer';
import { GFXBuffer } from '../../gfx/buffer';
import { RenderView } from '../render-view';
import { UBOForwardLight} from '../define';
import { Vec3 } from '../../math';
import { LightType } from '../../renderer/scene/light';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { SpotLight } from '../../renderer/scene/spot-light';
import { director } from '../../director';
import { intersect, sphere } from '../../geometry';
import { Model, Camera } from '../../renderer';
import { Layers } from '../../scene-graph';
import { SKYBOX_FLAG } from '../../renderer/scene/camera';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { DirectionalLight } from '../../renderer/scene/directional-light';
import { cullDirectionalLight, cullSphereLight, cullSpotLight } from '../culling';

const _vec4Array = new Float32Array(4);
const _tempVec3 = new Vec3();
const _sphere = sphere.create(0, 0, 0, 1);

export class ForwardRenderContext extends RenderContext{
    /**
     * @en The lights participating the render process
     * @zh 参与渲染的灯光。
     */
    public validLights: Light[] = [];

    /**
     * @en The buffer array of lights
     * @zh 灯光 buffer 数组。
     */
    public lightBuffers: GFXBuffer[] = [];

    /**
     * @en The index buffer offset of lights
     * @zh 灯光索引缓存偏移量数组。
     */
    public lightIndexOffsets: number[] = [];

    /**
     * @en The indices of lights
     * @zh 灯光索引数组。
     */
    public lightIndices: number[] = [];

    public updateUBO (view: RenderView) {
        super.updateUBO(view);
        const exposure = view.camera.exposure;
        const lightMeterScale = this.lightMeterScale;

        // Fill UBOForwardLight, And update LightGFXBuffer[light_index]
        for(let l = 0; l < this.validLights.length; ++l) {
            this.uboLight.view.fill(0);
            const light = this.validLights[l];
            if (light) {
                switch (light.type) {
                    case LightType.SPHERE:
                        const sphereLit = light as SphereLight;
                        Vec3.toArray(_vec4Array, sphereLit.position);
                        this.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_POS_OFFSET);

                        _vec4Array[0] = sphereLit.size;
                        _vec4Array[1] = sphereLit.range;
                        _vec4Array[2] = 0.0;
                        this.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                        Vec3.toArray(_vec4Array, light.color);
                        if (light.useColorTemperature) {
                            const tempRGB = light.colorTemperatureRGB;
                            _vec4Array[0] *= tempRGB.x;
                            _vec4Array[1] *= tempRGB.y;
                            _vec4Array[2] *= tempRGB.z;
                        }
                        if (this.isHDR) {
                            _vec4Array[3] = sphereLit.luminance * this.fpScale * lightMeterScale;
                        } else {
                            _vec4Array[3] = sphereLit.luminance * exposure * lightMeterScale;
                        }
                        this.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_COLOR_OFFSET);
                    break;
                    case LightType.SPOT:
                        const spotLit = light as SpotLight;

                        Vec3.toArray(_vec4Array, spotLit.position);
                        _vec4Array[3] = spotLit.size;
                        this.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_POS_OFFSET);

                        _vec4Array[0] = spotLit.size;
                        _vec4Array[1] = spotLit.range;
                        _vec4Array[2] = spotLit.spotAngle;
                        this.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                        Vec3.toArray(_vec4Array, spotLit.direction);
                        this.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_DIR_OFFSET);

                        Vec3.toArray(_vec4Array, light.color);
                        if (light.useColorTemperature) {
                            const tempRGB = light.colorTemperatureRGB;
                            _vec4Array[0] *= tempRGB.x;
                            _vec4Array[1] *= tempRGB.y;
                            _vec4Array[2] *= tempRGB.z;
                        }
                        if (this.isHDR) {
                            _vec4Array[3] = spotLit.luminance * this.fpScale * lightMeterScale;
                        } else {
                            _vec4Array[3] = spotLit.luminance * exposure * lightMeterScale;
                        }
                        this.uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_COLOR_OFFSET);
                    break;
                }
            }
            // update lightBuffer
            this.lightBuffers[l].update(this.uboLight.view);
        }
    }

    public sceneCulling (view: RenderView) {
        const camera = view.camera;
        const scene = camera.scene!;

        this.renderObjects.length = 0;

        const mainLight = scene.mainLight;
        const planarShadows = scene.planarShadows;
        if (mainLight) {
            mainLight.update();
            if (planarShadows.enabled && mainLight.node!.hasChangedFlags) {
                planarShadows.updateDirLight(mainLight);
            }
        }

        if (scene.skybox.enabled && (camera.clearFlag & SKYBOX_FLAG)) {
            this.addVisibleModel(scene.skybox, camera);
        }

        const models = scene.models;
        const stamp = director.getTotalFrames();

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
                        this.addVisibleModel(model, camera);
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
                        this.addVisibleModel(model, camera);
                    }
                }
            }
        }

        if (planarShadows.enabled) {
            planarShadows.updateShadowList(camera.frustum, stamp, (camera.visibility & Layers.BitMask.DEFAULT) !== 0);
        }

        const validLights = this.validLights;
        const lightBuffers = this.lightBuffers;
        const lightIndexOffsets = this.lightIndexOffsets;
        const lightIndices = this.lightIndices;

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
                const lightBuffer: GFXBuffer = this.device!.createBuffer({
                    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: UBOForwardLight.SIZE,
                    stride: UBOForwardLight.SIZE,
                });
                lightBuffers.push(lightBuffer);
            }
        }

        if (validLights.length > 0) {
            for (let i = 0; i < this.renderObjects.length; i++) {
                lightIndexOffsets[i] = lightIndices.length;
                this.cullLightPerModel(this.renderObjects[i].model);
            }
        }
    }

    /**
     * @en Add a visible model in the given camera as a render object in the pipeline
     * @zh 向当前管线添加指定摄像机中的可见对象。
     * @param model The visible model
     * @param camera The camera from which the model can be seen
     */
    protected addVisibleModel (model: Model, camera: Camera) {
        let depth = 0;
        if (model.node) {
            Vec3.subtract(_tempVec3, model.node.worldPosition, camera.position);
            depth = Vec3.dot(_tempVec3, camera.forward);
        }
        this.renderObjects.push({
            model,
            depth,
        });
    }

    // Cull light for the model
    private cullLightPerModel (model: Model) {
        const validLights = this.validLights;
        const lightIndices = this.lightIndices;

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
};
