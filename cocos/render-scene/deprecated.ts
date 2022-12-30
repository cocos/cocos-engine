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

import { replaceProperty, removeProperty } from '../core';
import { RenderScene } from './core/render-scene';
import { Layers } from '../scene-graph/layers';
import { legacyCC } from '../core/global-exports';
import { Pass } from './core/pass';
import { Camera } from './scene/camera';
import { Shadows } from './scene/shadows';
import { SpotLight, Model } from './scene';
import { SubModel } from './scene/submodel';

removeProperty(RenderScene.prototype, 'RenderScene.prototype', [
    { name: 'raycastUI2DNode' },
    { name: 'raycastUINode' },
]);

removeProperty(RenderScene.prototype, 'RenderScene.prototype', [
    { name: 'raycastAll', suggest: 'using intersect.rayModel in geometry' },
    { name: 'raycastAllModels', suggest: 'using intersect.rayModel in geometry' },
    { name: 'raycastSingleModel', suggest: 'using intersect.rayModel in geometry' },
    { name: 'raycastAllCanvas', suggest: 'using intersect.rayAABB in geometry' },
    { name: 'rayResultCanvas' },
    { name: 'rayResultModels' },
    { name: 'rayResultAll' },
    { name: 'rayResultSingleModel' },
]);

removeProperty(Model.prototype, 'Model.prototype', [
    { name: 'isInstancingEnabled' },
    { name: 'instancedAttributes' },
]);

const CameraVisFlags = {};

removeProperty(CameraVisFlags, 'CameraVisFlags', [
    {
        name: 'GENERAL',
    },
]);

replaceProperty(CameraVisFlags, 'CameraVisFlags', [
    {
        name: 'PROFILER',
        newName: 'PROFILER',
        target: Layers.BitMask,
        targetName: 'PROFILER',
    },
    {
        name: 'GIZMOS',
        newName: 'GIZMOS',
        target: Layers.BitMask,
        targetName: 'GIZMOS',
    },
    {
        name: 'EDITOR',
        newName: 'EDITOR',
        target: Layers.BitMask,
        targetName: 'EDITOR',
    },
    {
        name: 'UI',
        newName: 'UI',
        target: Layers.BitMask,
        targetName: 'UI_3D',
    },
    {
        name: 'UI2D',
        newName: 'UI2D',
        target: Layers.BitMask,
        targetName: 'UI_2D',
    },
]);

legacyCC.CameraVisFlags = CameraVisFlags;

export { CameraVisFlags };

const VisibilityFlags = {};

removeProperty(VisibilityFlags, 'VisibilityFlags', [
    {
        name: 'GENERAL',
    },
]);

replaceProperty(VisibilityFlags, 'VisibilityFlags', [
    {
        name: 'ALWALS',
        newName: 'ALWALS',
        target: Layers.Enum,
        targetName: 'ALWALS',
    },
    {
        name: 'PROFILER',
        newName: 'PROFILER',
        target: Layers.Enum,
        targetName: 'PROFILER',
    },
    {
        name: 'GIZMOS',
        newName: 'GIZMOS',
        target: Layers.Enum,
        targetName: 'GIZMOS',
    },
    {
        name: 'EDITOR',
        newName: 'EDITOR',
        target: Layers.Enum,
        targetName: 'EDITOR',
    },
    {
        name: 'UI',
        newName: 'UI',
        target: Layers.Enum,
        targetName: 'UI_3D',
    },
    {
        name: 'UI2D',
        newName: 'UI2D',
        target: Layers.Enum,
        targetName: 'UI_2D',
    },
]);

legacyCC.VisibilityFlags = VisibilityFlags;

export { VisibilityFlags };

replaceProperty(Pass.prototype, 'Pass.prototype', [
    {
        name: 'getBindingTypeFromHandle',
        newName: 'getDescriptorTypeFromHandle',
    },
]);

removeProperty(Camera.prototype, 'Camera.prototype', [
    {
        name: 'getSplitFrustum',
    },
    {
        name: 'setMatView',
    },
    {
        name: 'setMatViewInv',
    },
    {
        name: 'setMatProjInv',
    },
    {
        name: 'setMatViewProjInv',
    },
    {
        name: 'setMatProj',
    },
    {
        name: 'setMatViewProj',
    },
    {
        name: 'getMatViewInv',
    },
]);

removeProperty(Shadows.prototype, 'Shadows.prototype', [
    {
        name: 'aspect',
    },
    {
        name: 'selfShadow',
    },
    {
        name: 'linear',
    },
    {
        name: 'packing',
    },
    {
        name: 'autoAdapt',
    },
    {
        name: 'fixedArea',
    },
    {
        name: 'pcf',
    },
    {
        name: 'bias',
    },
    {
        name: 'normalBias',
    },
    {
        name: 'near',
    },
    {
        name: 'far',
    },
    {
        name: 'shadowDistance',
    },
    {
        name: 'invisibleOcclusionRange',
    },
    {
        name: 'orthoSize',
    },
    {
        name: 'saturation',
    },
]);

removeProperty(SpotLight.prototype, 'SpotLight.prototype', [
    {
        name: 'aspect',
    },
]);

replaceProperty(SubModel.prototype, 'SubModel.prototype', [
    {
        name: 'subMeshData',
        newName: 'subMesh',
    },
]);

removeProperty(SubModel.prototype, 'SubModel.prototype', [
    {
        name: 'getSubModel',
        suggest: 'Use `subModels[i]` instead',
    },
    {
        name: 'subModelNum',
        suggest: 'Use `subModels.length` instead',
    },
]);
