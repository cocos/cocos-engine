import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../global-exports';
import { AnimationManager } from '../animation-manager';
import type { AnimationState } from '../animation-state';

let context: AnimationState.Context | undefined;

export function getGlobalAnimationStateContext () {
    if (!context) {
        const animationManager: AnimationManager = legacyCC.director.getAnimationManager();
        context = {
            enqueue: (state) => {
                animationManager.addAnimation(state);
            },
            dequeue: (state) => {
                animationManager.removeAnimation(state);
            },
            blendStateBuffer: animationManager?.blendState,
        };
        if (!(EDITOR && !legacyCC.GAME_VIEW)) {
            context.emitFrameEvent = (fn, thisArg, args) => {
                animationManager.pushDelayEvent(fn, thisArg, args);
            };
        }
    }
    return context;
}
