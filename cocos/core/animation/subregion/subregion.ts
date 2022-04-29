import { ccclass, serializable } from 'cc.decorator';
import type { Node } from '../../scene-graph';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}Subregion`)
export class Subregion {
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
      * Whether the speed of this subregion should be reconciled with the host animation clip.
      * @zh
      * 子区域的播放速度是否应和宿主动画剪辑保持一致。
      */
    @serializable
    public reconciledSpeed = false;

    /**
     * @en
     * Player of the subregion.
     * @zh
     * 子区域的播放器。
     */
    @serializable
    public player: SubRegionPlayer | null = null;
}

export abstract class SubRegionPlayer {
    /**
     * @en
     * Instantiates this sub region.
     * @zh
     * 实例化此子区域。
     * @param root The root node of animation context.
     * @internal
     */
    public abstract instantiate(root: Node): InstantiatedSubRegionPlayer | null;
}

export abstract class InstantiatedSubRegionPlayer {
    /**
     * 可以随意调整此播放器到任何时间。
     */
    public get randomAccess () {
        return this._randomAccess;
    }

    /**
     * 销毁此播放器。
     */
    public abstract destroy (): void;

    /**
     * 在开始播放此子区域时触发。
     * @param time Current time on the subregion, relative to subregion's start。
     */
    public abstract play(time: number): void;

    /**
     * 在暂停此子区域的播放时触发。
     */
    public abstract pause(): void;

    /**
     * 在结束播放此子区域时触发，或所在动画本身停止播放时触发。
     */
    public abstract stop(): void;

    /**
     * 如果子区域的 [[`Subregion.reconciledSpeed`]] 为 `true`，则在宿主的播放速度改变时触发。
     * @param speed The speed.
     */
    public abstract setSpeed(speed: number): void;

    /**
     * @internal
     */
    protected _randomAccess = false;
}
