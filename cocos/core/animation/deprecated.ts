/**
 * @hidden
 */

import { replaceProperty } from '../utils/deprecated';
import { AnimationComponent } from './animation-component';
import { AnimationClip } from './animation-clip';

// deprecated
replaceProperty(AnimationComponent.prototype, 'AnimationComponent', [
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
            return AnimationComponent.prototype.removeState.call(this, arg0.name);
        }
    }
]);
