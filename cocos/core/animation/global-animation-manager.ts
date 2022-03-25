import { legacyCC } from '../global-exports';
import type { AnimationManager } from './animation-manager';

export function getGlobalAnimationManager () {
    const animationManager = legacyCC.director.getAnimationManager() as AnimationManager;
    return animationManager;
}
