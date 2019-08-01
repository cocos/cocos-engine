
import { deprecatedWrapper } from '../deprecated';
import { AnimationComponent } from './animation-component';
import { AnimationClip } from './animation-clip';
import { error } from '../core/platform/CCDebug';

// deprecated
if (CC_DEBUG) {

    /**
     * API更名
     */
    deprecatedWrapper({
        oldTarget: AnimationComponent.prototype,
        oldPrefix: "AnimationComponent",
        newTarget: AnimationComponent.prototype,
        newPrefix: "AnimationComponent",
        pairs: [
            ['getAnimationState', 'getState'],
            ['addClip', 'createState']
        ]
    });

    /**
     * API更名，以及参数变更
     */
    deprecatedWrapper({
        oldTarget: AnimationComponent.prototype,
        oldPrefix: "AnimationComponent",
        pairs: [['removeClip']],
        compatible: false,
        custom: function (...args: any) {
            error("removeClip已经弃用，请使用removeState，并注意两者参数不一致");
            let arg0 = args[0] as AnimationClip;
            return AnimationComponent.prototype.removeState.call(this, arg0.name);
        }
    });

}