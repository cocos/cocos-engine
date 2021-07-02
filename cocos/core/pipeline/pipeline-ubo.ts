/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { UBOGlobal, UBOShadow, UBOCamera, UNIFORM_SHADOWMAP_BINDING, supportsHalfFloatTexture } from './define';
import { Device, BufferInfo, BufferUsageBit, MemoryUsageBit, Feature } from '../gfx';
import { Camera } from '../renderer/scene/camera';
import { Mat4, Vec3, Vec4, Color } from '../math';
import { RenderPipeline } from './render-pipeline';
import { legacyCC } from '../global-exports';
import { PCFType, Shadows, ShadowType } from '../renderer/scene/shadows';
import { getShadowWorldMatrix, updatePlanarPROJ } from './scene-culling';
import { Light, LightType } from '../renderer/scene/light';
import { SpotLight } from '../renderer/scene';

const matShadowView = new Mat4();
const matShadowViewProj = new Mat4();
const vec3_center = new Vec3();
const vec4ShadowInfo = new Vec4();

export class PipelineUBO {
    public static updateGlobalUBOView (pipeline: RenderPipeline, bufferView: Float32Array) {
        const device = pipeline.device;
        const root = legacyCC.director.root;
        const fv = bufferView;

        const shadingWidth = Math.floor(device.width);
        const shadingHeight = Math.floor(device.height);

        // update UBOGlobal
        fv[UBOGlobal.TIME_OFFSET] = root.cumulativeTime;
        fv[UBOGlobal.TIME_OFFSET + 1] = root.frameTime;
        fv[UBOGlobal.TIME_OFFSET + 2] = legacyCC.director.getTotalFrames();

        fv[UBOGlobal.SCREEN_SIZE_OFFSET] = device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = device.height;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / device.height;

        fv[UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];
    }

    public static updateCameraUBOView (pipeline: RenderPipeline, bufferView: Float32Array,
        camera: Camera) {
        const device = pipeline.device;
        const scene = camera.scene ? camera.scene : legacyCC.director.getScene().renderScene;
        const mainLight = scene.mainLight;
        const sceneData = pipeline.pipelineSceneData;
        const ambient = sceneData.ambient;
        const fog = sceneData.fog;
        const shadingWidth = Math.floor(device.width);
        const shadingHeight = Math.floor(device.height);
        const cv = bufferView;
        const exposure = camera.exposure;
        const isHDR = sceneData.isHDR;
        const shadingScale = sceneData.shadingScale;
        const fpScale = sceneData.fpScale;

        // update camera ubo
        cv[UBOCamera.SCREEN_SCALE_OFFSET] = camera.width / shadingWidth * shadingScale;
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 1] = camera.height / shadingHeight * shadingScale;
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 2] = 1.0 / cv[UBOCamera.SCREEN_SCALE_OFFSET];
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 3] = 1.0 / cv[UBOCamera.SCREEN_SCALE_OFFSET + 1];

        cv[UBOCamera.EXPOSURE_OFFSET] = exposure;
        cv[UBOCamera.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        cv[UBOCamera.EXPOSURE_OFFSET + 2] = isHDR ? 1.0 : 0.0;
        cv[UBOCamera.EXPOSURE_OFFSET + 3] = fpScale / exposure;

        if (mainLight) {
            Vec3.toArray(cv, mainLight.direction, UBOCamera.MAIN_LIT_DIR_OFFSET);
            Vec3.toArray(cv, mainLight.color, UBOCamera.MAIN_LIT_COLOR_OFFSET);
            if (mainLight.useColorTemperature) {
                const colorTempRGB = mainLight.colorTemperatureRGB;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
            }

            if (isHDR) {
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * fpScale;
            } else {
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
            }
        } else {
            Vec3.toArray(cv, Vec3.UNIT_Z, UBOCamera.MAIN_LIT_DIR_OFFSET);
            Vec4.toArray(cv, Vec4.ZERO, UBOCamera.MAIN_LIT_COLOR_OFFSET);
        }

        const skyColor = ambient.colorArray;
        if (isHDR) {
            skyColor[3] = ambient.skyIllum * fpScale;
        } else {
            skyColor[3] = ambient.skyIllum * exposure;
        }
        cv.set(skyColor, UBOCamera.AMBIENT_SKY_OFFSET);
        cv.set(ambient.albedoArray, UBOCamera.AMBIENT_GROUND_OFFSET);

        Mat4.toArray(cv, camera.matView, UBOCamera.MAT_VIEW_OFFSET);
        Mat4.toArray(cv, camera.node.worldMatrix, UBOCamera.MAT_VIEW_INV_OFFSET);
        Vec3.toArray(cv, camera.position, UBOCamera.CAMERA_POS_OFFSET);

        Mat4.toArray(cv, camera.matProj, UBOCamera.MAT_PROJ_OFFSET);
        Mat4.toArray(cv, camera.matProjInv, UBOCamera.MAT_PROJ_INV_OFFSET);
        Mat4.toArray(cv, camera.matViewProj, UBOCamera.MAT_VIEW_PROJ_OFFSET);
        Mat4.toArray(cv, camera.matViewProjInv, UBOCamera.MAT_VIEW_PROJ_INV_OFFSET);
        cv[UBOCamera.CAMERA_POS_OFFSET + 3] = this.getCombineSignY();

        cv.set(fog.colorArray, UBOCamera.GLOBAL_FOG_COLOR_OFFSET);

        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;
    }

    public static updateShadowUBOView (pipeline: RenderPipeline, bufferView: Float32Array, camera: Camera) {
        const device = pipeline.device;
        const mainLight = camera.scene!.mainLight;
        const sceneData = pipeline.pipelineSceneData;
        const shadowInfo = sceneData.shadows;
        const sv = bufferView;

        if (shadowInfo.enabled) {
            if (mainLight && shadowInfo.type === ShadowType.ShadowMap) {
                // light view
                let shadowCameraView: Mat4;

                // light proj
                let x = 0;
                let y = 0;
                let far = 0;
                if (shadowInfo.autoAdapt) {
                    shadowCameraView = getShadowWorldMatrix(pipeline, mainLight.node!.getWorldRotation()!, mainLight.direction, vec3_center);
                    // if orthoSize is the smallest, auto calculate orthoSize.
                    const radius = shadowInfo.sphere.radius;
                    x = radius * shadowInfo.aspect;
                    y = radius;

                    const halfFar = Vec3.distance(shadowInfo.sphere.center, vec3_center);
                    far =  Math.min(halfFar * Shadows.COEFFICIENT_OF_EXPANSION, Shadows.MAX_FAR);
                } else {
                    shadowCameraView = mainLight.node!.getWorldMatrix();

                    x = shadowInfo.orthoSize * shadowInfo.aspect;
                    y = shadowInfo.orthoSize;

                    far = shadowInfo.far;
                }

                Mat4.toArray(sv, shadowCameraView, UBOShadow.MAT_LIGHT_VIEW_OFFSET);
                Mat4.invert(matShadowView, shadowCameraView!);

                Mat4.ortho(matShadowViewProj, -x, x, -y, y, shadowInfo.near, far,
                    device.capabilities.clipSpaceMinZ, device.capabilities.clipSpaceSignY);
                Mat4.multiply(matShadowViewProj, matShadowViewProj, matShadowView);
                Mat4.toArray(sv, matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

                const isSupportHalfFloat = supportsHalfFloatTexture(device);
                const linear = (shadowInfo.linear && isSupportHalfFloat) ? 1.0 : 0.0;
                sv[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET + 0] = shadowInfo.near;
                sv[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET + 1] = far;
                sv[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET + 2] = linear;
                sv[UBOShadow.SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET + 3] = shadowInfo.selfShadow ? 1.0 : 0.0;

                sv[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 0] = shadowInfo.size.x;
                sv[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 1] = shadowInfo.size.y;
                sv[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 2] = shadowInfo.pcf;
                sv[UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 3] = shadowInfo.bias;

                const packing = shadowInfo.packing ? 1.0 : (isSupportHalfFloat ? 0.0 : 1.0);
                sv[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 0] = 0.0;
                sv[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 1] = packing;
                sv[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 2] = shadowInfo.normalBias;
                sv[UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 3] = 0.0;
            } else if (mainLight && shadowInfo.type === ShadowType.Planar) {
                updatePlanarPROJ(shadowInfo, mainLight, sv);
            }

            Color.toArray(sv, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
        }
    }

    public static updateShadowUBOLightView (pipeline: RenderPipeline, bufferView: Float32Array, light: Light) {
        const device = pipeline.device;
        const shadowInfo = pipeline.pipelineSceneData.shadows;
        const sv = bufferView;
        const isSupportHalfFloat = supportsHalfFloatTexture(device);
        const linear = (shadowInfo.linear && isSupportHalfFloat) ? 1.0 : 0.0;
        const packing = shadowInfo.packing ? 1.0 : (isSupportHalfFloat ? 0.0 : 1.0);
        let _x = 0; let _y = 0; let _far = 0;
        let shadowCameraView: Mat4;
        switch (light.type) {
        case LightType.DIRECTIONAL:
            // light view
            (light).update();
            // light proj
            if (shadowInfo.autoAdapt) {
                const node = (light).node;
                if (node) {
                    shadowCameraView = getShadowWorldMatrix(pipeline, node.getWorldRotation(), (light as any).direction, vec3_center);
                }
                // if orthoSize is the smallest, auto calculate orthoSize.
                const radius = shadowInfo.sphere.radius;
                _x = radius * shadowInfo.aspect;
                _y = radius;

                const halfFar = Vec3.distance(shadowInfo.sphere.center, vec3_center);
                _far = Math.min(halfFar * Shadows.COEFFICIENT_OF_EXPANSION, Shadows.MAX_FAR);
            } else {
                shadowCameraView = (light as any).node.getWorldMatrix();

                _x = shadowInfo.orthoSize * shadowInfo.aspect;
                _y = shadowInfo.orthoSize;

                _far = shadowInfo.far;
            }

            Mat4.toArray(sv, shadowCameraView!, UBOShadow.MAT_LIGHT_VIEW_OFFSET);
            Mat4.invert(matShadowView, shadowCameraView!);

            vec4ShadowInfo.set(shadowInfo.near, _far, linear, shadowInfo.selfShadow ? 1.0 : 0.0);
            Vec4.toArray(sv, vec4ShadowInfo, UBOShadow.SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET);

            vec4ShadowInfo.set(0.0, packing, shadowInfo.normalBias, 0.0);
            Vec4.toArray(sv, vec4ShadowInfo, UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET);

            Mat4.ortho(matShadowViewProj, -_x, _x, -_y, _y, shadowInfo.near, _far,
                device.capabilities.clipSpaceMinZ, device.capabilities.clipSpaceSignY);
            break;
        case LightType.SPOT:
            // light view
            Mat4.toArray(sv, (light as any).node.getWorldMatrix(), UBOShadow.MAT_LIGHT_VIEW_OFFSET);
            Mat4.invert(matShadowView, (light as any).node.getWorldMatrix());

            vec4ShadowInfo.set(0.01, (light as SpotLight).range, linear, shadowInfo.selfShadow ? 1.0 : 0.0);
            Vec4.toArray(sv, vec4ShadowInfo, UBOShadow.SHADOW_NEAR_FAR_LINEAR_SELF_INFO_OFFSET);

            vec4ShadowInfo.set(1.0, packing, shadowInfo.normalBias, 0.0);
            Vec4.toArray(sv, vec4ShadowInfo, UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET);

            // light proj
            Mat4.perspective(matShadowViewProj, (light as any).spotAngle, (light as any).aspect, 0.001, (light as any).range);
            break;
        default:
        }
        // light viewProj
        Mat4.multiply(matShadowViewProj, matShadowViewProj, matShadowView);

        Mat4.toArray(sv, matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

        vec4ShadowInfo.set(shadowInfo.size.x, shadowInfo.size.y, shadowInfo.pcf, shadowInfo.bias);
        Vec4.toArray(sv, vec4ShadowInfo, UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET);

        Color.toArray(sv, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
    }

    protected _globalUBO = new Float32Array(UBOGlobal.COUNT);
    protected _cameraUBO = new Float32Array(UBOCamera.COUNT);
    protected _shadowUBO = new Float32Array(UBOShadow.COUNT);
    static _combineSignY = 0;
    protected declare _device: Device;
    protected declare _pipeline: RenderPipeline;

    /**
     *|combinedSignY|clipSpaceSignY|screenSpaceSignY| Backends |
     *|    :--:     |    :--:      |      :--:      |   :--:   |
     *|      0      |      -1      |      -1        |  Vulkan  |
     *|      1      |       1      |      -1        |  Metal   |
     *|      2      |      -1      |       1        |          |
     *|      3      |       1      |       1        |  GL-like |
     */
    public static getCombineSignY () {
        return PipelineUBO._combineSignY;
    }

    private _initCombineSignY () {
        const device = this._device;
        PipelineUBO._combineSignY = (device.capabilities.screenSpaceSignY * 0.5 + 0.5) << 1 | (device.capabilities.clipSpaceSignY * 0.5 + 0.5);
    }

    public activate (device: Device, pipeline: RenderPipeline) {
        this._device = device;
        this._pipeline = pipeline;
        const ds = this._pipeline.descriptorSet;
        this._initCombineSignY();

        const globalUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            UBOGlobal.SIZE,
            UBOGlobal.SIZE,
        ));
        ds.bindBuffer(UBOGlobal.BINDING, globalUBO);

        const cameraUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            UBOCamera.SIZE,
            UBOCamera.SIZE,
        ));
        ds.bindBuffer(UBOCamera.BINDING, cameraUBO);

        const shadowUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            UBOShadow.SIZE,
            UBOShadow.SIZE,
        ));
        ds.bindBuffer(UBOShadow.BINDING, shadowUBO);
    }

    /**
     * @en Update all UBOs
     * @zh 更新全部 UBO。
     */
    public updateGlobalUBO () {
        const globalDSManager = this._pipeline.globalDSManager;
        const ds = this._pipeline.descriptorSet;
        const cmdBuffer = this._pipeline.commandBuffers;
        ds.update();
        PipelineUBO.updateGlobalUBOView(this._pipeline, this._globalUBO);
        cmdBuffer[0].updateBuffer(ds.getBuffer(UBOGlobal.BINDING), this._globalUBO);

        globalDSManager.bindBuffer(UBOGlobal.BINDING, ds.getBuffer(UBOGlobal.BINDING));
        globalDSManager.update();
    }

    public updateCameraUBO (camera: Camera) {
        const globalDSManager = this._pipeline.globalDSManager;
        const ds = this._pipeline.descriptorSet;
        const cmdBuffer = this._pipeline.commandBuffers;
        PipelineUBO.updateCameraUBOView(this._pipeline, this._cameraUBO, camera);
        cmdBuffer[0].updateBuffer(ds.getBuffer(UBOCamera.BINDING), this._cameraUBO);

        globalDSManager.bindBuffer(UBOCamera.BINDING, ds.getBuffer(UBOCamera.BINDING));
        globalDSManager.update();
    }

    public updateShadowUBO (camera: Camera) {
        const sceneData = this._pipeline.pipelineSceneData;
        const shadowInfo = sceneData.shadows;
        if (!shadowInfo.enabled) return;

        const ds = this._pipeline.descriptorSet;
        const cmdBuffer = this._pipeline.commandBuffers;
        const shadowFrameBufferMap = sceneData.shadowFrameBufferMap;
        const mainLight = camera.scene!.mainLight;
        ds.update();
        if (mainLight && shadowFrameBufferMap.has(mainLight)) {
            ds.bindTexture(UNIFORM_SHADOWMAP_BINDING, shadowFrameBufferMap.get(mainLight)!.colorTextures[0]!);
        }
        PipelineUBO.updateShadowUBOView(this._pipeline, this._shadowUBO, camera);
        cmdBuffer[0].updateBuffer(ds.getBuffer(UBOShadow.BINDING), this._shadowUBO);
    }

    public updateShadowUBOLight (light: Light) {
        const ds = this._pipeline.descriptorSet;
        PipelineUBO.updateShadowUBOLightView(this._pipeline, this._shadowUBO, light);
        ds.getBuffer(UBOShadow.BINDING).update(this._shadowUBO);
    }

    public updateShadowUBORange (offset: number, data: Mat4 | Color) {
        if (data instanceof Mat4) {
            Mat4.toArray(this._shadowUBO, data, offset);
        } else if (data instanceof Color) {
            Color.toArray(this._shadowUBO, data, offset);
        }
    }

    public destroy () {
    }
}
