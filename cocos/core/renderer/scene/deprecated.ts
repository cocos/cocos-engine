import { replaceProperty, removeProperty, markAsWarning } from "../../utils";
import { RenderScene } from "./render-scene";
import { Layers } from "../../scene-graph";
import { legacyCC } from '../../global-exports';

replaceProperty(RenderScene.prototype, 'RenderScene.prototype', [
    {
        'name': 'raycastUI',
        'newName': 'raycastAllCanvas'
    },
    {
        'name': 'raycastUI2D',
        'newName': 'raycastAllCanvas'
    },
    {
        'name': 'raycast',
        'newName': 'raycastAllModels'
    },
    {
        'name': 'raycastModels',
        'newName': 'raycastAllModels'
    },
    {
        'name': 'raycastModel',
        'newName': 'raycastSingleModel'
    },
]);

removeProperty(RenderScene.prototype, 'RenderScene.prototype', [
    {
        'name': 'raycastUI2DNode'
    },
    {
        'name': 'raycastUINode',
    }
]);

markAsWarning(RenderScene.prototype, 'RenderScene.prototype', [
    { 'name': 'raycastAll', 'suggest': 'using intersect in geometry' },
    { 'name': 'raycastAllModels', 'suggest': 'using intersect in geometry' },
    { 'name': 'raycastSingleModel', 'suggest': 'using intersect in geometry' },
    { 'name': 'raycastAllCanvas', 'suggest': 'using intersect in geometry' },
    { 'name': 'rayResultCanvas' },
    { 'name': 'rayResultModels' },
    { 'name': 'rayResultAll' },
    { 'name': 'rayResultSingleModel' },
]);

const CameraVisFlags = {};

removeProperty(CameraVisFlags, 'CameraVisFlags', [
    {
        name: 'GENERAL',
    }
]);

replaceProperty(CameraVisFlags, 'CameraVisFlags', [
    {
        name: 'PROFILER',
        newName: 'PROFILER',
        target: Layers.BitMask,
        targetName: 'PROFILER'
    },
    {
        name: 'GIZMOS',
        newName: 'GIZMOS',
        target: Layers.BitMask,
        targetName: 'GIZMOS'
    },
    {
        name: 'EDITOR',
        newName: 'EDITOR',
        target: Layers.BitMask,
        targetName: 'EDITOR'
    },
    {
        name: 'UI',
        newName: 'UI',
        target: Layers.BitMask,
        targetName: 'UI_3D'
    },
    {
        name: 'UI2D',
        newName: 'UI2D',
        target: Layers.BitMask,
        targetName: 'UI_2D'
    },
]);

legacyCC.CameraVisFlags = CameraVisFlags;

export { CameraVisFlags };

const VisibilityFlags = {};

removeProperty(VisibilityFlags, 'VisibilityFlags', [
    {
        name: 'GENERAL',
    }
]);

replaceProperty(VisibilityFlags, 'VisibilityFlags', [
    {
        name: 'ALWALS',
        newName: 'ALWALS',
        target: Layers.Enum,
        targetName: 'ALWALS'
    },
    {
        name: 'PROFILER',
        newName: 'PROFILER',
        target: Layers.Enum,
        targetName: 'PROFILER'
    },
    {
        name: 'GIZMOS',
        newName: 'GIZMOS',
        target: Layers.Enum,
        targetName: 'GIZMOS'
    },
    {
        name: 'EDITOR',
        newName: 'EDITOR',
        target: Layers.Enum,
        targetName: 'EDITOR'
    },
    {
        name: 'UI',
        newName: 'UI',
        target: Layers.Enum,
        targetName: 'UI_3D'
    },
    {
        name: 'UI2D',
        newName: 'UI2D',
        target: Layers.Enum,
        targetName: 'UI_2D'
    },
]);

legacyCC.VisibilityFlags = VisibilityFlags;

export { VisibilityFlags };
