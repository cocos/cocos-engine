/**
 * @hidden
 */

import { removeProperty } from '../../utils';
import { UIComponent } from './ui-component';

removeProperty(UIComponent.prototype, 'UIComponent',[
    {
        name: '_visibility',
    },
    {
        name: 'setVisibility',
    },
]);
