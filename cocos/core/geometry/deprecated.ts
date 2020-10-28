/**
 * @packageDocumentation
 * @hidden
 */

import { replaceProperty, removeProperty } from '../utils/x-deprecated';
import line from './line';
import intersect from './intersect';

replaceProperty(line.prototype, 'line', [
    {
        name: 'mag',
        newName: 'len',
    },
    {
        name: 'magnitude',
        newName: 'len',
    },
]);

removeProperty(intersect, 'intersect', [
    {
        name: 'line_quad'
    }
])