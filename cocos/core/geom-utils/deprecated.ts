/**
 * @hidden
 */

import { replaceProperty } from '../../deprecated';
import line from './line';


replaceProperty(line.prototype, 'line', [
    {
        'name': 'mag',
        'newName': 'len'
    },
    {
        'name': 'magnitude',
        'newName': 'len'
    }
]);