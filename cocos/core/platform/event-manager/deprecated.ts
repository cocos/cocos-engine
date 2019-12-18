/**
 * @hidden
 */

import { replaceProperty } from '../../utils';
import { SystemEventType } from './event-enum';

replaceProperty(SystemEventType, 'Node.EventType', [
    {
        name: 'POSITION_PART',
        newName: 'TRANSFORM_CHANGED',
    },
    {
        name: 'ROTATION_PART',
        newName: 'TRANSFORM_CHANGED',
    },
    {
        name: 'SCALE_PART',
        newName: 'TRANSFORM_CHANGED',
    },
]);
