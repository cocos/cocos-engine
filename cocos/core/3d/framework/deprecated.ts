/**
 * @hidden
 */

import { removeProperty, replaceProperty } from '../../utils';
import { ccclass } from '../../data/class-decorator';
import { warnID } from '../../platform/debug';
import { MeshRenderer } from './mesh-renderer';
import { Camera } from './camera-component';
import { Light } from './light-component';
import { SpotLight } from './spot-light-component';
import { SphereLight } from './sphere-light-component';
import { DirectionalLight } from './directional-light-component';
import { SkinnedMeshRenderer } from './skinned-mesh-renderer';
import { SkinnedMeshBatchRenderer } from './skinned-mesh-batch-renderer';

removeProperty(MeshRenderer.prototype, 'MeshRenderer.prototype', [
    {
        name: 'enableDynamicBatching',
    },
    {
        name: 'recieveShadows',
    },
]);

replaceProperty(Camera, 'Camera', [
    {
        name: 'CameraClearFlag',
        newName: 'ClearFlag'
    }
]);

replaceProperty(Camera.prototype, 'Camera.prototype', [
    {
        name: 'color',
        newName: 'clearColor',
    },
    {
        name: 'depth',
        newName: 'clearDepth',
    },
    {
        name: 'stencil',
        newName: 'clearStencil',
    },
]);

@ccclass('cc.CameraComponent')
export class CameraComponent extends Camera {
    constructor () {
        warnID(5400, 'CameraComponent', 'UITransform');
        super();
    }
}
@ccclass('cc.LightComponent')
export class LightComponent extends Light {
    constructor () {
        warnID(5400, 'LightComponent', 'Light');
        super();
    }
}
@ccclass('cc.DirectionalLightComponent')
export class DirectionalLightComponent extends DirectionalLight {
    constructor () {
        warnID(5400, 'DirectionalLightComponent', 'DirectionalLight');
        super();
    }
}
@ccclass('cc.SphereLightComponent')
export class SphereLightComponent extends SphereLight {
    constructor () {
        warnID(5400, 'SphereLightComponent', 'SphereLight');
        super();
    }
}
@ccclass('cc.SpotLightComponent')
export class SpotLightComponent extends SpotLight {
    constructor () {
        warnID(5400, 'SpotLightComponent', 'SpotLight');
        super();
    }
}
@ccclass('cc.ModelComponent')
export class ModelComponent extends MeshRenderer {
    constructor () {
        warnID(5400, 'ModelComponent', 'MeshRenderer');
        super();
    }
}
@ccclass('cc.SkinningModelComponent')
export class SkinningModelComponent extends SkinnedMeshRenderer {
    constructor () {
        warnID(5400, 'SkinningModelComponent', 'SkinnedMeshRenderer');
        super();
    }
}
@ccclass('cc.BatchedSkinningModelComponent')
export class BatchedSkinningModelComponent extends SkinnedMeshBatchRenderer {
    constructor () {
        warnID(5400, 'BatchedSkinningModelComponent', 'SkinnedMeshBatchRenderer');
        super();
    }
}
