/**
 * @hidden
 */

import { replaceProperty } from '../utils/deprecated';
import { Animation } from './animation-component';
import { SkeletalAnimation } from './skeletal-animation';
import { AnimationClip } from './animation-clip';
import { ccclass } from '../data/class-decorator';
import { warnID } from '../platform/debug';
import { Node } from '../scene-graph/node';

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

@ccclass('cc.AnimationComponent')
export class AnimationComponent extends Animation {
    constructor () {
        warnID(5400, 'AnimationComponent', 'Animation');
        super();
    }
}
@ccclass('cc.SkeletalAnimationComponent')
export class SkeletalAnimationComponent extends SkeletalAnimation {
    constructor (path = '', target: Node | null = null) {
        warnID(5400, 'SkeletalAnimationComponent', 'SkeletalAnimation');
        super(path, target);
    }
}
