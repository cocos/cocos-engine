/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { UBOGlobal, UBOShadow, UBOCamera, UNIFORM_SHADOWMAP_BINDING,
    supportsR32FloatTexture, UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING, UBOCSM, isEnableEffect } from './define';
import { Device, BufferInfo, BufferUsageBit, MemoryUsageBit, DescriptorSet } from '../gfx';
import { Camera } from '../render-scene/scene/camera';
import { Mat4, Vec3, Vec4, Color, toRadian, cclegacy } from '../core';
import { PipelineRuntime } from './custom/pipeline';
import { CSMLevel, PCFType, Shadows, ShadowType } from '../render-scene/scene/shadows';
import { Light, LightType } from '../render-scene/scene/light';
import { DirectionalLight, SpotLight } from '../render-scene/scene';
import { RenderWindow } from '../render-scene/core/render-window';
import { builtinResMgr } from '../asset/asset-manager/builtin-res-mgr';
import { Texture2D } from '../asset/assets';
import { DebugViewCompositeType } from './debug-view';
import { legacyCC } from '../core/global-exports';
import { getDescBindingFromName } from './custom/define';

const _matShadowView = new Mat4();
const _matShadowProj = new Mat4();
const _matShadowViewProj = new Mat4();
const _vec4ShadowInfo = new Vec4();
const _lightDir = new Vec4(0.0, 0.0, 1.0, 0.0);
const _tempVec3 = new Vec3();

export class PipelineUBO {
    public static updateGlobalUBOView (window: RenderWindow, bufferView: Float32Array) {
        const director = cclegacy.director;
        const root = director.root;
        const fv = bufferView;

        const shadingWidth = Math.floor(window.width);
        const shadingHeight = Math.floor(window.height);

        // update UBOGlobal
        fv[UBOGlobal.TIME_OFFSET] = root.cumulativeTime;
        fv[UBOGlobal.TIME_OFFSET + 1] = root.frameTime;
        fv[UBOGlobal.TIME_OFFSET + 2] = director.getTotalFrames();
        fv[UBOGlobal.TIME_OFFSET + 3] = root.cumulativeTime - Math.floor(root.frameTime);

        fv[UBOGlobal.SCREEN_SIZE_OFFSET] = shadingWidth;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = shadingHeight;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / shadingWidth;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / shadingHeight;

        fv[UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];

        if (cclegacy.internal.reflectionProbeManager) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            fv[UBOGlobal.PROBE_INFO_OFFSET] = cclegacy.internal.reflectionProbeManager.getMaxProbeId() + 1;
        }

        const debugView = root.debugView;
        fv[UBOGlobal.DEBUG_VIEW_MODE_OFFSET] = debugView.singleMode as number;

        for (let i = 1; i <= 3; i++) {
            fv[UBOGlobal.DEBUG_VIEW_MODE_OFFSET + i] = 0.0;
        }
        for (let i = DebugViewCompositeType.DIRECT_DIFFUSE as number; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
            const offset = i >> 3;
            const bit = i % 8;
            fv[UBOGlobal.DEBUG_VIEW_MODE_OFFSET + 1 + offset] += (debugView.isCompositeModeEnabled(i) ? 1.0 : 0.0) * (10.0 ** bit);
        }

        fv[UBOGlobal.DEBUG_VIEW_MODE_OFFSET + 3] += (debugView.lightingWithAlbedo ? 1.0 : 0.0) * (10.0 ** 6.0);
        fv[UBOGlobal.DEBUG_VIEW_MODE_OFFSET + 3] += (debugView.csmLayerColoration ? 1.0 : 0.0) * (10.0 ** 7.0);
    }

    public static updateCameraUBOView (pipeline: PipelineRuntime, bufferView: Float32Array,
        camera: Camera) {
        const scene = camera.scene ? camera.scene : cclegacy.director.getScene().renderScene;
        const mainLight = scene.mainLight;
        const sceneData = pipeline.pipelineSceneData;
        const ambient = sceneData.ambient;
        const skybox = sceneData.skybox;
        const fog = sceneData.fog;
        const shadowInfo = sceneData.shadows;
        const cv = bufferView;
        const exposure = camera.exposure;
        const isHDR = sceneData.isHDR;

        // update camera ubo
        cv[UBOCamera.SCREEN_SCALE_OFFSET] = sceneData.shadingScale;
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 1] = sceneData.shadingScale;
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 2] = 1.0 / cv[UBOCamera.SCREEN_SCALE_OFFSET];
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 3] = 1.0 / cv[UBOCamera.SCREEN_SCALE_OFFSET + 1];

        cv[UBOCamera.EXPOSURE_OFFSET] = exposure;
        cv[UBOCamera.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        cv[UBOCamera.EXPOSURE_OFFSET + 2] = isHDR ? 1.0 : 0.0;
        cv[UBOCamera.EXPOSURE_OFFSET + 3] = 1.0 / Camera.standardExposureValue;

        if (mainLight) {
            const shadowEnable = (mainLight.shadowEnabled && shadowInfo.type === ShadowType.ShadowMap) ? 1.0 : 0.0;
            const mainLightDir = mainLight.direction;
            _lightDir.set(mainLightDir.x, mainLightDir.y, mainLightDir.z, shadowEnable);
            Vec4.toArray(cv, _lightDir, UBOCamera.MAIN_LIT_DIR_OFFSET);
            Vec3.toArray(cv, mainLight.color, UBOCamera.MAIN_LIT_COLOR_OFFSET);
            if (mainLight.useColorTemperature) {
                const colorTempRGB = mainLight.colorTemperatureRGB;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
            }

            if (isHDR) {
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
            } else {
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance;
            }
        } else {
            _lightDir.set(0, 0, 1, 0);
            Vec4.toArray(cv, _lightDir, UBOCamera.MAIN_LIT_DIR_OFFSET);
            Vec4.toArray(cv, Vec4.ZERO, UBOCamera.MAIN_LIT_COLOR_OFFSET);
        }

        const skyColor = ambient.skyColor;
        if (isHDR) {
            skyColor.w = ambient.skyIllum * exposure;
        } else {
            skyColor.w = ambient.skyIllum;
        }
        cv[UBOCamera.AMBIENT_SKY_OFFSET + 0] = skyColor.x;
        cv[UBOCamera.AMBIENT_SKY_OFFSET + 1] = skyColor.y;
        cv[UBOCamera.AMBIENT_SKY_OFFSET + 2] = skyColor.z;
        cv[UBOCamera.AMBIENT_SKY_OFFSET + 3] = skyColor.w;
        cv[UBOCamera.AMBIENT_GROUND_OFFSET + 0] = ambient.groundAlbedo.x;
        cv[UBOCamera.AMBIENT_GROUND_OFFSET + 1] = ambient.groundAlbedo.y;
        cv[UBOCamera.AMBIENT_GROUND_OFFSET + 2] = ambient.groundAlbedo.z;
        cv[UBOCamera.AMBIENT_GROUND_OFFSET + 3] = skybox.envmap ? skybox.envmap?.mipmapLevel : 1.0;

        Mat4.toArray(cv, camera.matView, UBOCamera.MAT_VIEW_OFFSET);
        Mat4.toArray(cv, camera.node.worldMatrix, UBOCamera.MAT_VIEW_INV_OFFSET);
        Vec3.toArray(cv, camera.position, UBOCamera.CAMERA_POS_OFFSET);

        Mat4.toArray(cv, camera.matProj, UBOCamera.MAT_PROJ_OFFSET);
        Mat4.toArray(cv, camera.matProjInv, UBOCamera.MAT_PROJ_INV_OFFSET);
        Mat4.toArray(cv, camera.matViewProj, UBOCamera.MAT_VIEW_PROJ_OFFSET);
        Mat4.toArray(cv, camera.matViewProjInv, UBOCamera.MAT_VIEW_PROJ_INV_OFFSET);
        cv[UBOCamera.CAMERA_POS_OFFSET + 3] = this.getCombineSignY();

        cv[UBOCamera.SURFACE_TRANSFORM_OFFSET] = camera.surfaceTransform;
        cv[UBOCamera.SURFACE_TRANSFORM_OFFSET + 1] = camera.cameraUsage;
        cv[UBOCamera.SURFACE_TRANSFORM_OFFSET + 2] = Math.cos(toRadian(sceneData.skybox.getRotationAngle()));
        cv[UBOCamera.SURFACE_TRANSFORM_OFFSET + 3] = Math.sin(toRadian(sceneData.skybox.getRotationAngle()));

        const colorTempRGB = fog.colorArray;
        cv[UBOCamera.GLOBAL_FOG_COLOR_OFFSET] = colorTempRGB.x;
        cv[UBOCamera.GLOBAL_FOG_COLOR_OFFSET + 1] = colorTempRGB.y;
        cv[UBOCamera.GLOBAL_FOG_COLOR_OFFSET + 2] = colorTempRGB.z;
        cv[UBOCamera.GLOBAL_FOG_COLOR_OFFSET + 3] = colorTempRGB.z;

        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;

        cv[UBOCamera.NEAR_FAR_OFFSET] = camera.nearClip;
        cv[UBOCamera.NEAR_FAR_OFFSET + 1] = camera.farClip;

        cv[UBOCamera.VIEW_PORT_OFFSET] = sceneData.shadingScale * camera.window.width * camera.viewport.x;
        cv[UBOCamera.VIEW_PORT_OFFSET + 1] = sceneData.shadingScale * camera.window.height * camera.viewport.y;
        cv[UBOCamera.VIEW_PORT_OFFSET + 2] = sceneData.shadingScale * camera.window.width * camera.viewport.z;
        cv[UBOCamera.VIEW_PORT_OFFSET + 3] = sceneData.shadingScale * camera.window.height * camera.viewport.w;
    }

    public static getPCFRadius (shadowInfo: Shadows, mainLight: DirectionalLight): number {
        const shadowMapSize = shadowInfo.size.x;
        switch (mainLight.shadowPcf) {
        case PCFType.HARD:
            return 0.0;
        case PCFType.SOFT:
            return 1.0  / (shadowMapSize * 0.5);
        case PCFType.SOFT_2X:
            return 2.0  / (shadowMapSize * 0.5);
        case PCFType.SOFT_4X:
            return 3.0  / (shadowMapSize * 0.5);
        default:
        }
        return 0.0;
    }

    public static updatePlanarNormalAndDistance (shadowInfo: Shadows, shadowUBO: Float32Array) {
        Vec3.normalize(_tempVec3, shadowInfo.normal);
        shadowUBO[UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 0] = _tempVec3.x;
        shadowUBO[UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 1] = _tempVec3.y;
        shadowUBO[UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 2] = _tempVec3.z;
        shadowUBO[UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 3] = -shadowInfo.distance;
    }

    public static updateShadowUBOView (pipeline: PipelineRuntime, shadowBufferView: Float32Array,
        csmBufferView: Float32Array, camera: Camera) {
        const device = pipeline.device;
        const mainLight = camera.scene!.mainLight;
        const sceneData = pipeline.pipelineSceneData;
        const shadowInfo = sceneData.shadows;
        const csmLayers = sceneData.csmLayers;
        const sv = shadowBufferView;
        const cv = csmBufferView;
        const csmSupported = sceneData.csmSupported;
        const packing = supportsR32FloatTexture(device) ? 0.0 : 1.0;

        if (mainLight && shadowInfo.enabled) {
            if (shadowInfo.type === ShadowType.ShadowMap) {
                if (mainLight.shadowEnabled) {
                    if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1 || !csmSupported) {
                        const matShadowView = csmLayers.specialLayer.matShadowView;
                        const matShadowProj = csmLayers.specialLayer.matShadowProj;
                        const matShadowViewProj = csmLayers.specialLayer.matShadowViewProj;
                        let near = 0.1;
                        let far = 0;
                        let levelCount = 0;
                        if (mainLight.shadowFixedArea) {
                            near = mainLight.shadowNear;
                            far = mainLight.shadowFar;
                            levelCount = 0;
                        } else {
                            far = csmLayers.specialLayer.shadowCameraFar;
                            levelCount = 1;
                        }

                        Mat4.toArray(sv, matShadowView, UBOShadow.MAT_LIGHT_VIEW_OFFSET);

                        sv[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 0] = matShadowProj.m10;
                        sv[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 1] = matShadowProj.m14;
                        sv[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 2] = matShadowProj.m11;
                        sv[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 3] = matShadowProj.m15;

                        sv[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 0] = matShadowProj.m00;
                        sv[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 1] = matShadowProj.m05;
                        sv[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 2] = 1.0 / matShadowProj.m00;
                        sv[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 3] = 1.0 / matShadowProj.m05;

                        Mat4.toArray(sv, matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

                        _vec4ShadowInfo.set(near, far, 0, 1.0 - mainLight.shadowSaturation);
                        Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET);

                        _vec4ShadowInfo.set(0, packing, mainLight.shadowNormalBias, levelCount);
                        Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET);
                    } else {
                        const layerThreshold = this.getPCFRadius(shadowInfo, mainLight);
                        for (let i = 0; i < mainLight.csmLevel; i++) {
                            const layer = csmLayers.layers[i];
                            const matShadowView = layer.matShadowView;
                            _vec4ShadowInfo.set(matShadowView.m00, matShadowView.m04, matShadowView.m08, layerThreshold);
                            Vec4.toArray(cv, _vec4ShadowInfo, UBOCSM.CSM_VIEW_DIR_0_OFFSET + 4 * i);
                            _vec4ShadowInfo.set(matShadowView.m01, matShadowView.m05, matShadowView.m09, layer.splitCameraNear);
                            Vec4.toArray(cv, _vec4ShadowInfo, UBOCSM.CSM_VIEW_DIR_1_OFFSET + 4 * i);
                            _vec4ShadowInfo.set(matShadowView.m02, matShadowView.m06, matShadowView.m10, layer.splitCameraFar);
                            Vec4.toArray(cv, _vec4ShadowInfo, UBOCSM.CSM_VIEW_DIR_2_OFFSET + 4 * i);

                            const csmAtlas = layer.csmAtlas;
                            Vec4.toArray(cv, csmAtlas, UBOCSM.CSM_ATLAS_OFFSET + 4 * i);

                            const matShadowViewProj = layer.matShadowViewProj;
                            Mat4.toArray(cv, matShadowViewProj, UBOCSM.MAT_CSM_VIEW_PROJ_OFFSET + 16 * i);

                            const matShadowProj = layer.matShadowProj;
                            cv[UBOCSM.CSM_PROJ_DEPTH_INFO_OFFSET + 0 + 4 * i] = matShadowProj.m10;
                            cv[UBOCSM.CSM_PROJ_DEPTH_INFO_OFFSET + 1 + 4 * i] = matShadowProj.m14;
                            cv[UBOCSM.CSM_PROJ_DEPTH_INFO_OFFSET + 2 + 4 * i] = matShadowProj.m11;
                            cv[UBOCSM.CSM_PROJ_DEPTH_INFO_OFFSET + 3 + 4 * i] = matShadowProj.m15;

                            cv[UBOCSM.CSM_PROJ_INFO_OFFSET + 0 + 4 * i] = matShadowProj.m00;
                            cv[UBOCSM.CSM_PROJ_INFO_OFFSET + 1 + 4 * i] = matShadowProj.m05;
                            cv[UBOCSM.CSM_PROJ_INFO_OFFSET + 2 + 4 * i] = 1.0 / matShadowProj.m00;
                            cv[UBOCSM.CSM_PROJ_INFO_OFFSET + 3 + 4 * i] = 1.0 / matShadowProj.m05;
                        }
                        _vec4ShadowInfo.set(mainLight.csmTransitionRange, 0, 0, 0);
                        Vec4.toArray(cv, _vec4ShadowInfo, UBOCSM.CSM_SPLITS_INFO_OFFSET);

                        _vec4ShadowInfo.set(0.1, mainLight.shadowDistance, 0, 1.0 - mainLight.shadowSaturation);
                        Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET);

                        _vec4ShadowInfo.set(0.0, packing, mainLight.shadowNormalBias, mainLight.csmLevel);
                        Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET);
                    }
                    _vec4ShadowInfo.set(shadowInfo.size.x, shadowInfo.size.y, mainLight.shadowPcf, mainLight.shadowBias);
                    Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET);
                }
            } else {
                PipelineUBO.updatePlanarNormalAndDistance(shadowInfo, sv);
            }

            Color.toArray(sv, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
        }
    }

    public static updateShadowUBOLightView (pipeline: PipelineRuntime, shadowBufferView: Float32Array, light: Light, level: number) {
        const device = pipeline.device;
        const sceneData = pipeline.pipelineSceneData;
        const shadowInfo = sceneData.shadows;
        const csmLayers = sceneData.csmLayers;
        const sv = shadowBufferView;
        const packing = supportsR32FloatTexture(device) ? 0.0 : 1.0;
        const cap = pipeline.device.capabilities;
        const csmSupported = sceneData.csmSupported;

        switch (light.type) {
        case LightType.DIRECTIONAL: {
            const mainLight = light as DirectionalLight;
            if (shadowInfo.enabled && mainLight && mainLight.shadowEnabled) {
                if (shadowInfo.type === ShadowType.ShadowMap) {
                    let near = 0.1;
                    let far = 0;
                    let matShadowView;
                    let matShadowProj;
                    let matShadowViewProj;
                    let levelCount = 0;
                    if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1 || !csmSupported) {
                        matShadowView = csmLayers.specialLayer.matShadowView;
                        matShadowProj = csmLayers.specialLayer.matShadowProj;
                        matShadowViewProj = csmLayers.specialLayer.matShadowViewProj;
                        if (mainLight.shadowFixedArea) {
                            near = mainLight.shadowNear;
                            far = mainLight.shadowFar;
                            levelCount = 0;
                        } else {
                            near = 0.1;
                            far = csmLayers.specialLayer.shadowCameraFar;
                            levelCount = 1;
                        }
                        _vec4ShadowInfo.set(0.0, packing, mainLight.shadowNormalBias, 0);
                        Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET);
                    } else {
                        const layer = csmLayers.layers[level];
                        matShadowView = layer.matShadowView;
                        matShadowProj = layer.matShadowProj;
                        matShadowViewProj = layer.matShadowViewProj;

                        near = layer.splitCameraNear;
                        far = layer.splitCameraFar;
                        levelCount = mainLight.csmLevel;
                    }

                    Mat4.toArray(sv, matShadowView, UBOShadow.MAT_LIGHT_VIEW_OFFSET);

                    sv[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 0] = matShadowProj.m10;
                    sv[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 1] = matShadowProj.m14;
                    sv[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 2] = matShadowProj.m11;
                    sv[UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 3] = matShadowProj.m15;

                    sv[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 0] = matShadowProj.m00;
                    sv[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 1] = matShadowProj.m05;
                    sv[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 2] = 1.0 / matShadowProj.m00;
                    sv[UBOShadow.SHADOW_PROJ_INFO_OFFSET + 3] = 1.0 / matShadowProj.m05;

                    Mat4.toArray(sv, matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

                    _vec4ShadowInfo.set(near, far, 0, 1.0 - mainLight.shadowSaturation);
                    Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET);

                    _vec4ShadowInfo.set(0.0, packing, mainLight.shadowNormalBias, levelCount);
                    Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET);

                    _vec4ShadowInfo.set(shadowInfo.size.x, shadowInfo.size.y, mainLight.shadowPcf, mainLight.shadowBias);
                    Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET);
                }
            }
            break;
        }
        case LightType.SPOT: {
            const spotLight = light as SpotLight;
            if (shadowInfo.enabled && spotLight && spotLight.shadowEnabled) {
                Mat4.invert(_matShadowView, (light as any).node.getWorldMatrix());
                Mat4.toArray(sv, _matShadowView, UBOShadow.MAT_LIGHT_VIEW_OFFSET);

                Mat4.perspective(_matShadowProj, (light as any).angle, 1.0, 0.001, (light as any).range,
                    true, cap.clipSpaceMinZ, cap.clipSpaceSignY, 0);

                Mat4.multiply(_matShadowViewProj, _matShadowProj, _matShadowView);
                Mat4.toArray(sv, _matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

                _vec4ShadowInfo.set(0.01, (light as SpotLight).range, 0.0, 0.0);
                Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET);

                _vec4ShadowInfo.set(shadowInfo.size.x, shadowInfo.size.y, spotLight.shadowPcf, spotLight.shadowBias);
                Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET);

                _vec4ShadowInfo.set(1.0, packing, spotLight.shadowNormalBias, 0.0);
                Vec4.toArray(sv, _vec4ShadowInfo, UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET);
            }
            break;
        }
        default:
        }

        Color.toArray(sv, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
    }

    protected _globalUBO = new Float32Array(UBOGlobal.COUNT);
    protected _cameraUBO = new Float32Array(UBOCamera.COUNT);
    protected _shadowUBO = new Float32Array(UBOShadow.COUNT);
    protected _csmUBO = new Float32Array(UBOCSM.COUNT);
    static _combineSignY = 0;
    protected declare _device: Device;
    protected declare _pipeline: PipelineRuntime;

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

    public activate (device: Device, pipeline: PipelineRuntime) {
        this._device = device;
        this._pipeline = pipeline;
        const ds = this._pipeline.descriptorSet;
        if (isEnableEffect()) {
            return;
        }
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
        const binding = isEnableEffect() ? getDescBindingFromName('CCShadow') : UBOShadow.BINDING;
        ds.bindBuffer(binding, shadowUBO);
        const csmUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            UBOCSM.SIZE,
            UBOCSM.SIZE,
        ));
        const csmBinding = isEnableEffect() ? getDescBindingFromName('CCCSM') : UBOCSM.BINDING;
        ds.bindBuffer(csmBinding, csmUBO);
    }

    /**
     * @en Update all UBOs
     * @zh 更新全部 UBO。
     */
    public updateGlobalUBO (window: RenderWindow) {
        const globalDSManager = this._pipeline.globalDSManager;
        const ds = this._pipeline.descriptorSet;
        const cmdBuffer = this._pipeline.commandBuffers;
        ds.update();
        PipelineUBO.updateGlobalUBOView(window, this._globalUBO);
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
        if (mainLight && shadowFrameBufferMap.has(mainLight)) {
            ds.bindTexture(UNIFORM_SHADOWMAP_BINDING, shadowFrameBufferMap.get(mainLight)!.colorTextures[0]!);
        }
        PipelineUBO.updateShadowUBOView(this._pipeline, this._shadowUBO, this._csmUBO, camera);
        ds.update();
        const binding = isEnableEffect() ? getDescBindingFromName('CCShadow') : UBOShadow.BINDING;
        cmdBuffer[0].updateBuffer(ds.getBuffer(binding), this._shadowUBO);
        const csmBinding = isEnableEffect() ? getDescBindingFromName('CCCSM') : UBOCSM.BINDING;
        cmdBuffer[0].updateBuffer(ds.getBuffer(csmBinding), this._csmUBO);
    }

    public updateShadowUBOLight (globalDS: DescriptorSet, light: Light, level = 0) {
        PipelineUBO.updateShadowUBOLightView(this._pipeline, this._shadowUBO, light, level);
        globalDS.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        globalDS.bindTexture(UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        globalDS.update();
        const binding = isEnableEffect() ? getDescBindingFromName('CCShadow') : UBOShadow.BINDING;
        this._pipeline.commandBuffers[0].updateBuffer(globalDS.getBuffer(binding), this._shadowUBO);
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
