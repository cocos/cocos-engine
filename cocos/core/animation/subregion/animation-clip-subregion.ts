import { ccclass, serializable } from 'cc.decorator';
import type { Node } from '../../scene-graph/node';
import { AnimationClip } from '../animation-clip';
import { AnimationState } from '../animation-state';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { InstantiatedSubRegionPlayer, SubRegionPlayer } from './subregion';

/**
 * @en
 * The animation clip subregion player. The players play animation clip on a subregion.
 * @zh
 * 动画剪辑子区域播放器。此播放器在子区域上播放动画剪辑。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}/AnimationClipSubRegionPlayer`)
export class AnimationClipSubRegionPlayer extends SubRegionPlayer {
    /**
     * @en
     * The animation clip to play.
     * @zh
     * 要播放的动画剪辑。
     */
    @serializable
    public clip: AnimationClip | null = null;

    public instantiate (root: Node) {
        const { clip } = this;
        if (!clip) {
            return null;
        }
        const state = new AnimationState(clip);
        state.initialize(
            root,
        );
        return new InstantiatedAnimationClipSubRegionPlayer(state);
    }
}

class InstantiatedAnimationClipSubRegionPlayer extends InstantiatedSubRegionPlayer {
    constructor (animationState: AnimationState) {
        super();
        this._animationState = animationState;
    }

    public destroy (): void {
        this._animationState.destroy();
    }

    /**
     * Plays the particle system from the beginning no matter current time.
     */
    public play (time: number): void {
        this._animationState.time = time;
        this._animationState.play();
    }

    /**
     * Stops the animation state no matter current time.
     * @param _time Ignored.
     */
    public stop (_time: number): void {
        this._animationState.stop();
    }

    /**
     * Sets the speed of the animation state.
     */
    public setSpeed (speed: number): void {
        this._animationState.speed = speed;
    }

    private _animationState: AnimationState;
}
