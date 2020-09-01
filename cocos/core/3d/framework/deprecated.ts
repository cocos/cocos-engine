/**
 * @hidden
 */

import { removeProperty, replaceProperty } from '../../utils';
import { Model } from './model-component';
import { Camera } from './camera-component';

removeProperty(Model.prototype, 'Model.prototype', [
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
