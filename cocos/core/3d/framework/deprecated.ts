
/**
 * @category component
 */

import { removeProperty, replaceProperty } from '../../utils';
import { MeshRenderer } from './mesh-renderer';
import { Camera } from './camera-component';
import { Light } from './light-component';
import { SpotLight } from './spot-light-component';
import { SphereLight } from './sphere-light-component';
import { DirectionalLight } from './directional-light-component';
import { SkinnedMeshRenderer } from './skinned-mesh-renderer';
import { SkinnedMeshBatchRenderer, SkinnedMeshUnit } from './skinned-mesh-batch-renderer';
import { js } from '../../utils/js';
import { legacyCC } from '../../global-exports';

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

/**
 * Alias of [[Camera]]
 * @deprecated Since v1.2
 */
export { Camera as CameraComponent };
legacyCC.CameraComponent = Camera;
js.setClassAlias(Camera, 'cc.CameraComponent');
/**
 * Alias of [[Light]]
 * @deprecated Since v1.2
 */
export { Light as LightComponent };
legacyCC.LightComponent = Light;
js.setClassAlias(Light, 'cc.LightComponent');
/**
 * Alias of [[DirectionalLight]]
 * @deprecated Since v1.2
 */
export { DirectionalLight as DirectionalLightComponent };
legacyCC.DirectionalLightComponent = DirectionalLight;
js.setClassAlias(DirectionalLight, 'cc.DirectionalLightComponent');
/**
 * Alias of [[SphereLight]]
 * @deprecated Since v1.2
 */
export { SphereLight as SphereLightComponent };
legacyCC.SphereLightComponent = SphereLight;
js.setClassAlias(SphereLight, 'cc.SphereLightComponent');
/**
 * Alias of [[SpotLight]]
 * @deprecated Since v1.2
 */
export { SpotLight as SpotLightComponent };
legacyCC.SpotLightComponent = SpotLight;
js.setClassAlias(SpotLight, 'cc.SpotLightComponent');
/**
 * Alias of [[MeshRenderer]]
 * @deprecated Since v1.2
 */
export { MeshRenderer as ModelComponent };
legacyCC.ModelComponent = MeshRenderer;
js.setClassAlias(MeshRenderer, 'cc.ModelComponent');
/**
 * Alias of [[SkinnedMeshRenderer]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshRenderer as SkinningModelComponent };
legacyCC.SkinningModelComponent = SkinnedMeshRenderer;
js.setClassAlias(SkinnedMeshRenderer, 'cc.SkinningModelComponent');
/**
 * Alias of [[SkinnedMeshUnit]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshUnit as SkinningModelUnit };
legacyCC.SkinningModelUnit = SkinnedMeshUnit;
js.setClassAlias(SkinnedMeshUnit, 'cc.SkinningModelUnit');
/**
 * Alias of [[SkinnedMeshBatchRenderer]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshBatchRenderer as BatchedSkinningModelComponent };
legacyCC.BatchedSkinningModelComponent = SkinnedMeshBatchRenderer;
js.setClassAlias(SkinnedMeshBatchRenderer, 'cc.BatchedSkinningModelComponent');
