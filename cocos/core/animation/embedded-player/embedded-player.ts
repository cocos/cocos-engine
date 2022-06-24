import { ccclass, serializable } from 'cc.decorator';
import { EditorExtendable } from '../../data/editor-extendable';
import type { Node } from '../../scene-graph';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}EmbeddedPlayer`)
export class EmbeddedPlayer extends EditorExtendable {
    /**
     * @en
     * Begin time, in seconds.
     * @zh
     * 开始时间，以秒为单位。
     */
    @serializable
    public begin = 0.0;

    /**
      * @en
      * End time, in seconds.
      * @zh
      * 结束时间，以秒为单位。
      */
    @serializable
    public end = 0.0;

    /**
      * @en
      * Whether the speed of this embedded player should be reconciled with the host animation clip.
      * @zh
      * 子区域的播放速度是否应和宿主动画剪辑保持一致。
      */
    @serializable
    public reconciledSpeed = false;

    /**
     * @en
     * Player of the embedded player.
     * @zh
     * 子区域的播放器。
     */
    @serializable
    public playable: EmbeddedPlayable | null = null;
}

export abstract class EmbeddedPlayable {
    /**
     * @en
     * Instantiates this sub region.
     * @zh
     * 实例化此子区域。
     * @param root The root node of animation context.
     * @internal
     */
    public abstract instantiate(root: Node): EmbeddedPlayableState | null;
}

export abstract class EmbeddedPlayableState {
    constructor (randomAccess: boolean) {
        this._randomAccess = randomAccess;
    }

    /**
     * @zh
     * 是否可以随意调整此播放器到任何时间。
     * @en
     * Indicates if this player can be adjusted to any time.
     */
    public get randomAccess () {
        return this._randomAccess;
    }

    /**
     * @zh
     * 销毁此播放器。
     * @zh
     * Destroys this player state.
     */
    public abstract destroy (): void;

    /**
     * @zh
     * 该方法在此播放器开始播放时触发。
     * @en
     * This method is called when this player gets to play.
     * @param time Current time on the embedded player, relative to embedded player's start。
     */
    public abstract play(time: number): void;

    /**
     * @zh
     * 该方法在此播放器暂停播放时触发。
     * @en
     * This method is called when this player pauses.
     */
    public abstract pause(): void;

    /**
     * @zh
     * 该方法在此播放器结束播放时触发，或在宿主动画剪辑本身停止播放时触发。
     * @en
     * This method is called when this player ends its playback, and is called when the host animation clip is stopped.
     */
    public abstract stop(): void;

    /**
     * @zh
     * 如果 [[`EmbeddedPlayer.reconciledSpeed`]] 为 `true`，则在宿主的播放速度改变时触发。
     * @en
     * If [[`EmbeddedPlayer.reconciledSpeed`]] is `true`, is called when the host changes its speed.
     * @param speed The speed.
     */
    public abstract setSpeed(speed: number): void;

    private declare _randomAccess: boolean;
}
