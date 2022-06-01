import { ccclass, serializable } from 'cc.decorator';
import { errorID } from '../../platform/debug';
import type { Node } from '../../scene-graph/node';
import { AnimationClip } from '../animation-clip';
import { AnimationState } from '../animation-state';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { EmbeddedPlayableState, EmbeddedPlayable } from './embedded-player';

/**
 * @en
 * The embedded animation clip playable. The playable play animation clip on a embedded player.
 * @zh
 * 动画剪辑子区域播放器。此播放器在子区域上播放动画剪辑。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}EmbeddedAnimationClipPlayable`)
export class EmbeddedAnimationClipPlayable extends EmbeddedPlayable {
    /**
     * @en
     * Path to the node onto which the animation clip would be played, relative from animation context root.
     * @zh
     * 要播放动画剪辑的节点的路径，相对于动画上下文的根节点。
     */
    @serializable
    public path = '';

    /**
     * @en
     * The animation clip to play.
     * @zh
     * 要播放的动画剪辑。
     */
    @serializable
    public clip: AnimationClip | null = null;

    public instantiate (root: Node) {
        const { clip, path } = this;
        if (!clip) {
            return null;
        }
        const clipRoot = root.getChildByPath(path);
        if (!clipRoot) {
            errorID(3938, path, root.getPathInHierarchy(), clip.name);
            return null;
        }
        const state = new AnimationState(clip);
        state.initialize(
            clipRoot,
        );
        return new EmbeddedAnimationClipPlayableState(state);
    }
}

class EmbeddedAnimationClipPlayableState extends EmbeddedPlayableState {
    constructor (animationState: AnimationState) {
        super(true);
        this._animationState = animationState;
    }

    public destroy (): void {
        this._animationState.destroy();
    }

    /**
     * Plays the animation state at specified time.
     */
    public play (time: number): void {
        this._animationState.play(); // Note play() rewinds the time to 0
        this._animationState.time = time;
    }

    /**
     * Pause the animation state.
     */
    public pause (): void {
        this._animationState.pause();
    }

    /**
     * Stops the animation state.
     */
    public stop (): void {
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
