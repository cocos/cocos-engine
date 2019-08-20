/**
 * @hidden
 */

import { replaceProperty } from '../utils/deprecated';
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