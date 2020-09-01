/**
 * @hidden
 */

import { removeProperty, replaceProperty } from '../../utils';
import { MeshRenderer } from './mesh-renderer';
import { Camera } from './camera-component';

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
