/**
 * @hidden
 */

// deprecated
import { Tween, tweenUtil } from './tween';
import { warn } from '../core';

/**
 * @zh
 * 增加一个 tween 缓动，与 creator 2D 中的 cc.tween 功能类似
 * @deprecated
 * 下个版本中将会移除 tween 方法，请及时调整为 tweenUtil
 */
export function tween (target: {}): Tween {
    warn("tween' is deprecated, please use 'tweenUtil' instead ")
    return tweenUtil(target);
}
cc.tween = tween;

