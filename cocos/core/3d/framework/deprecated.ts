import { removeProperty } from '../../utils';
import { ModelComponent } from './model-component';

removeProperty(ModelComponent.prototype, 'ModelComponent.prototype', [
    {
        name: 'enableDynamicBatching',
    },
    {
        name: 'receiveShadows',
    },
]);
