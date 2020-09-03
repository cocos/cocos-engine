/**
 * @category animation
 */

import { replaceProperty } from '../utils/deprecated';
import { Animation } from './animation-component';
import { SkeletalAnimation } from './skeletal-animation';
import { AnimationClip } from './animation-clip';
import { js } from '../utils/js';
import { legacyCC } from '../global-exports';

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

/**
 * Alias of [[Animation]]
 * @deprecated Since v1.2
 */
export { Animation as AnimationComponent };
legacyCC.AnimationComponent = Animation;
js.setClassAlias(Animation, 'cc.AnimationComponent');
/**
 * Alias of [[SkeletalAnimation]]
 * @deprecated Since v1.2
 */
export { SkeletalAnimation as SkeletalAnimationComponent };
legacyCC.SkeletalAnimationComponent = SkeletalAnimation;
js.setClassAlias(SkeletalAnimation, 'cc.SkeletalAnimationComponent');
