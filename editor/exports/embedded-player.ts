import { EmbeddedAnimationClipPlayable } from '../../cocos/animation/embedded-player/embedded-animation-clip-player';
import { EmbeddedParticleSystemPlayable } from '../../cocos/animation/embedded-player/embedded-particle-system-player';
import { EmbeddedPlayable } from '../../cocos/animation/embedded-player/embedded-player';
import { warn } from '../../exports/base';

export {
    embeddedPlayerCountTag,
    getEmbeddedPlayersTag,
    addEmbeddedPlayerTag,
    removeEmbeddedPlayerTag,
    clearEmbeddedPlayersTag,
} from '../../cocos/animation/animation-clip';

export { EmbeddedPlayer } from '../../cocos/animation/embedded-player/embedded-player';

export type { EmbeddedPlayable } from '../../cocos/animation/embedded-player/embedded-player';

export { EmbeddedParticleSystemPlayable };

export { EmbeddedAnimationClipPlayable };

export function isEmbeddedPlayableMountedUnderBone(playable: EmbeddedPlayable) {
    if (playable instanceof EmbeddedAnimationClipPlayable ||
        playable instanceof EmbeddedParticleSystemPlayable) {
        return true;
    } else {
        warn(`Unrecognized playable`, playable);
        return false;
    }
}
