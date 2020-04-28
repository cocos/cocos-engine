/**
 * @hidden
 */

import { removeProperty } from '../core/utils/deprecated';
import Burst from './burst';

removeProperty(Burst.prototype, 'Burst.prototype', [
    {
        'name': 'minCount'
    },
    {
        'name': 'maxCount',
    }
]);