/**
 * @hidden
 */

import { deprecatedWrapper } from '../../deprecated';
import line from './line'

deprecatedWrapper({
    oldTarget: line.prototype,
    oldPrefix: 'line',
    newTarget: line.prototype,
    newPrefix: 'line',
    pairs: [
        ['mag', 'len'],
        ['magnitude', 'len'],
    ],
});