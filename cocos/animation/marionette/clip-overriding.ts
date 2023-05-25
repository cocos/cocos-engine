import { AnimationClip } from '../animation-clip';

/**
 * @zh
 * 描述了如何对动画图中引用的动画剪辑进行替换。
 * @en
 * Describes how to override animation clips in an animation graph.
 */
export interface ReadonlyClipOverrideMap {
    /**
     * @zh
     * 获取指定原始动画剪辑应替换成的动画剪辑。
     * @en
     * Gets the overriding animation clip of specified original animation clip.
     *
     * @param animationClip @zh 原始动画剪辑。@en Original animation clip.
     *
     * @returns @zh 替换的动画剪辑；如果原始动画剪辑不应被替换，则应该返回 `undefined`。 @en
     * The overriding animation clip.
     * If the original animation clip should not be overrode, `undefined` should be returned.
     */
    get(animationClip: AnimationClip): AnimationClip | undefined;
}
