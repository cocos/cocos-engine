/**
 * @hidden
 */

import { removeProperty, replaceProperty } from '../../utils';
import { Model } from './model-component';
import { CameraComponent } from './camera-component';

removeProperty(Model.prototype, 'Model.prototype', [
    {
        name: 'enableDynamicBatching',
    },
    {
        name: 'recieveShadows',
    },
]);

replaceProperty(CameraComponent, 'CameraComponent', [
    {
        name: 'CameraClearFlag',
        newName: 'ClearFlag'
    }
]);
