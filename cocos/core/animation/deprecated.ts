/**
 * @hidden
 */

import { replaceProperty } from '../utils/deprecated';
import { Animation } from './animation-component';
import { AnimationClip } from './animation-clip';

// deprecated
replaceProperty(Animation.prototype, 'Animation', [
    {
        'name': 'getAnimationState',
        'newName': 'getState'
    },
    {
        'name': 'addClip',
        'newName': 'createState'
    },
    {
        'name': 'removeClip',
        'newName': 'removeState',
        'customFunction': function (...args: any) {
            let arg0 = args[0] as AnimationClip;
            return Animation.prototype.removeState.call(this, arg0.name);
        }
    }
]);
