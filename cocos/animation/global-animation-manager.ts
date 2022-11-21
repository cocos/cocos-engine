import { cclegacy } from '../core';
import type { AnimationManager } from './animation-manager';

export function getGlobalAnimationManager () {
    const animationManager = cclegacy.director.getAnimationManager() as AnimationManager;
    return animationManager;
}
