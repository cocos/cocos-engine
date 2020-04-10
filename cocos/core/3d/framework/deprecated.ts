/**
 * @hidden
 */

import { removeProperty, replaceProperty } from '../../utils';
import { ModelComponent } from './model-component';
import { CameraComponent } from './camera-component';

removeProperty(ModelComponent.prototype, 'ModelComponent.prototype', [
    {
        name: 'enableDynamicBatching',
    },
    {
        name: 'receiveShadows',
    },
]);

replaceProperty(CameraComponent, 'CameraComponent', [
    {
        name: 'CameraClearFlag',
        newName: 'ClearFlag'
    }
]);
