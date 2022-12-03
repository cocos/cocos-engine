/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import './deprecation';

export { Asset } from './asset';
export { BufferAsset } from './buffer-asset';
export * from './scripts';
export { RenderingSubMesh } from './rendering-sub-mesh';
export { SceneAsset } from './scene-asset';
export { default as TextAsset } from './text-asset';
export { default as JsonAsset } from './json-asset';
export { ImageAsset } from './image-asset';
export { Texture2D } from './texture-2d';
export { TextureCube } from './texture-cube';
export { EffectAsset } from './effect-asset';
export { Material } from './material';
export { RenderTexture } from './render-texture';

// add attr for missing classes under jsb
import { EDITOR } from 'internal:constants';
import { CCClass, CCFloat, CCInteger, cclegacy, CCString } from '../../core';
import { RenderQueueDesc, RenderQueueSortMode, RenderTextureConfig } from '../../rendering/pipeline-serialization';
import { LightProbeInfo, MobilityMode } from '../../scene-graph';
import { TextureCube } from './texture-cube';
import { LightProbesData, Tetrahedron, Vertex } from '../../gi/light-probe';
import {
    BloomStage,
    DeferredPipeline,
    ForwardPipeline,
    ForwardStage,
    GbufferStage,
    LightingStage,
    PostProcessStage
} from '../../rendering';

if (EDITOR) {
    CCClass.Attr.setClassAttr(cc.Asset, '_native', 'serializable', true);
    CCClass.Attr.setClassAttr(cc.Asset, '_native', 'visible', false);
    CCClass.Attr.setClassAttr(cc.Asset, '_nativeAsset', 'visible', false);
    CCClass.Attr.setClassAttr(cc.Asset, '_nativeAsset', 'serializable', false);
    CCClass.Attr.setClassAttr(cc.Asset, '_nativeAsset', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.Asset, '_nativeAsset', 'hasSetter', true);

    CCClass.Attr.setClassAttr(cc.BufferAsset, '_nativeAsset', 'serializable', false);
    CCClass.Attr.setClassAttr(cc.BufferAsset, '_nativeAsset', 'visible', false);
    CCClass.Attr.setClassAttr(cc.BufferAsset, '_nativeAsset', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.BufferAsset, '_nativeAsset', 'hasSetter', true);

    CCClass.Attr.setClassAttr(RenderQueueDesc, 'isTransparent', 'serializable', true);
    CCClass.Attr.setClassAttr(RenderQueueDesc, 'isTransparent', 'visible', true);
    CCClass.Attr.setClassAttr(RenderQueueDesc, 'sortMode', 'type', RenderQueueSortMode.FRONT_TO_BACK);
    CCClass.Attr.setClassAttr(RenderQueueDesc, 'sortMode', 'enumList', cclegacy.Enum(RenderQueueSortMode));
    CCClass.Attr.setClassAttr(RenderQueueDesc, 'stages', 'type', [CCString]);

    CCClass.Attr.setClassAttr(ForwardStage, 'renderQueues', 'type', [RenderQueueDesc]);
    CCClass.Attr.setClassAttr(ForwardStage, 'renderQueues', 'displayOrder', 2);
    CCClass.Attr.setClassAttr(ForwardStage, 'renderQueues', 'serializable', true);
    CCClass.Attr.setClassAttr(ForwardStage, 'renderQueues', 'visible', true);

    CCClass.Attr.setClassAttr(cc.Node, '_persistNode', 'serializable', false);
    CCClass.Attr.setClassAttr(cc.Node, '_persistNode', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.Node, '_persistNode', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.Node, 'name', 'serializable', false);
    CCClass.Attr.setClassAttr(cc.Node, 'name', 'visible', true);
    CCClass.Attr.setClassAttr(cc.Node, 'name', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.Node, 'name', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.Node, 'angle', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.Node, 'angle', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.Node, 'mobility', 'type', MobilityMode);
    CCClass.Attr.setClassAttr(cc.Node, 'mobility', 'enumList', MobilityMode);

    CCClass.Attr.setClassAttr(cc.AmbientInfo, 'skyLightingColor', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.AmbientInfo, 'skyLightingColor', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.AmbientInfo, 'skyIllum', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.AmbientInfo, 'skyIllum', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.AmbientInfo, 'groundLightingColor', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.AmbientInfo, 'groundLightingColor', 'hasSetter', true);

    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'enabled', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'enabled', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'envLightingType', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'envLightingType', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'useHDR', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'useHDR', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'envmap', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'envmap', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'type', CCFloat);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'tooltip', 'i18n:ENGINE.skybox.rotationAngle');
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'slide', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'serializable', false);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'visible', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'min', 0);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'max', 360);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'step', 1);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'rotationAngle', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'diffuseMap', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'diffuseMap', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'reflectionMap', 'type', TextureCube);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'reflectionMap', 'displayOrder', 100);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'reflectionMap', 'readonly', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'reflectionMap', 'serializable', false);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'reflectionMap', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'reflectionMap', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'skyboxMaterial', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, 'skyboxMaterial', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, '_rotationAngle', 'serializable', true);
    CCClass.Attr.setClassAttr(cc.SkyboxInfo, '_rotationAngle', 'visible', false);

    CCClass.Attr.setClassAttr(cc.FogInfo, 'enabled', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'enabled', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'accurate', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'accurate', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogColor', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogColor', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'type', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'type', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogDensity', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogDensity', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogStart', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogStart', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogEnd', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogEnd', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogAtten', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogAtten', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogTop', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogTop', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogRange', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.FogInfo, 'fogRange', 'hasSetter', true);

    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'enabled', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'enabled', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'type', 'tooltip', 'i18n:ENGINE.shadow.type');
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'type', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'type', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'shadowColor', 'tooltip', 'i18n:ENGINE.shadow.shadowColor');
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'shadowColor', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'shadowColor', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'planeDirection', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'planeDirection', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'planeHeight', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'planeHeight', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'maxReceived', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'maxReceived', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'shadowMapSize', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.ShadowsInfo, 'shadowMapSize', 'hasSetter', true);

    CCClass.Attr.setClassAttr(cc.OctreeInfo, 'enabled', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.OctreeInfo, 'enabled', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.OctreeInfo, 'minPos', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.OctreeInfo, 'minPos', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.OctreeInfo, 'maxPos', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.OctreeInfo, 'maxPos', 'hasSetter', true);
    CCClass.Attr.setClassAttr(cc.OctreeInfo, 'depth', 'hasGetter', true);
    CCClass.Attr.setClassAttr(cc.OctreeInfo, 'depth', 'hasSetter', true);

    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'type', CCFloat);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'displayName', 'GIScale');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'tooltip', 'i18n:ENGINE.light_probe.giScale');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'serializable', false);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'visible', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'min', 0.1);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'max', 10);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'step', 0.1);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'hasGetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giScale', 'hasSetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'type', CCInteger);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'displayName', 'GISamples');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'tooltip', 'i18n:ENGINE.light_probe.giSamples');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'serializable', false);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'visible', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'min', 64);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'max', 65536);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'step', 1);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'hasGetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'giSamples', 'hasSetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'type', CCInteger);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'tooltip', 'i18n:ENGINE.light_probe.bounces');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'serializable', false);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'visible', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'min', 1);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'max', 4);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'step', 1);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'hasGetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'bounces', 'hasSetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'type', CCFloat);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'tooltip', 'i18n:ENGINE.light_probe.reduceRinging');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'slide', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'serializable', false);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'visible', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'min', 0);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'max', 0.05);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'step', 0.001);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'hasGetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'reduceRinging', 'hasSetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showProbe', 'tooltip', 'i18n:ENGINE.light_probe.showProbe');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showProbe', 'serializable', false);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showProbe', 'visible', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showProbe', 'hasGetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showProbe', 'hasSetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showWireframe', 'tooltip', 'i18n:ENGINE.light_probe.showWireframe');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showWireframe', 'serializable', false);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showWireframe', 'visible', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showWireframe', 'hasGetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showWireframe', 'hasSetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showConvex', 'tooltip', 'i18n:ENGINE.light_probe.showConvex');
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showConvex', 'serializable', false);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showConvex', 'visible', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showConvex', 'hasGetter', true);
    CCClass.Attr.setClassAttr(LightProbeInfo, 'showConvex', 'hasSetter', true);

    CCClass.Attr.setClassAttr(cc.SceneGlobals, 'bakedWithStationaryMainLight', 'serializable', true);
    CCClass.Attr.setClassAttr(cc.SceneGlobals, 'bakedWithStationaryMainLight', 'visible', true);

    CCClass.Attr.setClassAttr(ForwardPipeline, 'renderTextures', 'type', [RenderTextureConfig]);
    CCClass.Attr.setClassAttr(ForwardPipeline, 'renderTextures', 'displayOrder', 2);
    CCClass.Attr.setClassAttr(ForwardPipeline, 'renderTextures', 'serializable', true);
    CCClass.Attr.setClassAttr(ForwardPipeline, 'renderTextures', 'visible', true);

    CCClass.Attr.setClassAttr(GbufferStage, 'renderQueues', 'type', [RenderQueueDesc]);
    CCClass.Attr.setClassAttr(GbufferStage, 'renderQueues', 'displayOrder', 2);
    CCClass.Attr.setClassAttr(GbufferStage, 'renderQueues', 'serializable', true);
    CCClass.Attr.setClassAttr(GbufferStage, 'renderQueues', 'visible', true);

    CCClass.Attr.setClassAttr(LightingStage, '_deferredMaterial', 'type', cc.Material);
    CCClass.Attr.setClassAttr(LightingStage, '_deferredMaterial', 'displayOrder', 3);
    CCClass.Attr.setClassAttr(LightingStage, '_deferredMaterial', 'serializable', true);
    CCClass.Attr.setClassAttr(LightingStage, '_deferredMaterial', 'visible', true);
    CCClass.Attr.setClassAttr(LightingStage, 'renderQueues', 'type', [RenderQueueDesc]);
    CCClass.Attr.setClassAttr(LightingStage, 'renderQueues', 'displayOrder', 2);
    CCClass.Attr.setClassAttr(LightingStage, 'renderQueues', 'serializable', true);
    CCClass.Attr.setClassAttr(LightingStage, 'renderQueues', 'visible', true);

    CCClass.Attr.setClassAttr(PostProcessStage, '_postProcessMaterial', 'type', cc.Material);
    CCClass.Attr.setClassAttr(PostProcessStage, '_postProcessMaterial', 'displayOrder', 3);
    CCClass.Attr.setClassAttr(PostProcessStage, '_postProcessMaterial', 'serializable', true);
    CCClass.Attr.setClassAttr(PostProcessStage, '_postProcessMaterial', 'visible', true);
    CCClass.Attr.setClassAttr(PostProcessStage, 'renderQueues', 'type', [RenderQueueDesc]);
    CCClass.Attr.setClassAttr(PostProcessStage, 'renderQueues', 'displayOrder', 2);
    CCClass.Attr.setClassAttr(PostProcessStage, 'renderQueues', 'serializable', true);
    CCClass.Attr.setClassAttr(PostProcessStage, 'renderQueues', 'visible', true);

    CCClass.Attr.setClassAttr(BloomStage, '_bloomMaterial', 'type', cc.Material);
    CCClass.Attr.setClassAttr(BloomStage, '_bloomMaterial', 'displayOrder', 3);
    CCClass.Attr.setClassAttr(BloomStage, '_bloomMaterial', 'serializable', true);
    CCClass.Attr.setClassAttr(BloomStage, '_bloomMaterial', 'visible', true);

    CCClass.Attr.setClassAttr(DeferredPipeline, 'renderTextures', 'type', [RenderTextureConfig]);
    CCClass.Attr.setClassAttr(DeferredPipeline, 'renderTextures', 'displayOrder', 2);
    CCClass.Attr.setClassAttr(DeferredPipeline, 'renderTextures', 'serializable', true);
    CCClass.Attr.setClassAttr(DeferredPipeline, 'renderTextures', 'visible', true);

    CCClass.Attr.setClassAttr(LightProbesData, '_probes', 'type', [Vertex]);
    CCClass.Attr.setClassAttr(LightProbesData, '_tetrahedrons', 'type', [Tetrahedron]);
}
