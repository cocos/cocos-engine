/**
 * @hidden
 */
import { ccclass } from '../data/class-decorator';
import { UniformProxyFactory } from './value-proxy-factories/uniform';
import { HierarchyPath, ComponentPath, CustomTargetPath, TargetPath } from './target-path';
import * as animation from './animation';
import * as easing from './easing';
import './deprecated';
import { IValueProxyFactory } from './value-proxy';

cc.easing = easing;
export * from './bezier';
export { easing };
export * from './animation-curve';
export * from './animation-clip';
export * from './animation-manager';
export {
    AnimationState,
} from './animation-state';
export * from './animation-component';
export * from './skeletal-animation-data-hub';
export * from './skeletal-animation-state';
export * from './skeletal-animation-component';
export * from './transform-utils';
export { animation };

/**
 * Use stuffs in `import('cc').animation` instead.
 * @deprecated Since v1.1.
 */
export * from './cubic-spline-value';

/**
 * Alias of `HierarchyPath`.
 * @deprecated Since v1.1.
 */
@ccclass('cc.HierachyModifier')
export class HierachyModifier extends HierarchyPath {}
cc.HierachyModifier = HierachyModifier;

/**
 * Alias of `ComponentPath`.
 * @deprecated Since v1.1.
 */
@ccclass('cc.ComponentModifier')
export class ComponentModifier extends ComponentPath {}
cc.ComponentModifier = ComponentModifier;

/**
 * Implements `IValueProxyFactory` but do nothing.
 * @deprecated Since v1.1.
 */
@ccclass('cc.CurveValueAdapter')
export class CurveValueAdapter implements IValueProxyFactory {
    public forTarget (target: any) {
        return {
            set: () => {

            },
        };
    }
}
cc.CurveValueAdapter = CurveValueAdapter;

/**
 * Alias of `UniformProxyFactory`.
 * @deprecated Since v1.1.
 */
@ccclass('cc.UniformCurveValueAdapter')
export class UniformCurveValueAdapter extends UniformProxyFactory {}
cc.UniformCurveValueAdapter = UniformCurveValueAdapter;

/**
 * Alias of `isPropertyPath(path) && typeof path === 'string'`.
 * @deprecated Since v1.1.
 */
export function isPropertyModifier (path: TargetPath): path is string {
    return typeof path === 'string';
}
cc.isPropertyModifier = isPropertyModifier;

/**
 * Alias of `isPropertyPath(path) && typeof path === 'number'`.
 * @deprecated Since v1.1.
 */
export function isElementModifier (path: TargetPath): path is number {
    return typeof path === 'number';
}
cc.isElementModifier = isElementModifier;

/**
 * Alias of `isCustomPath()`.
 * @deprecated Since v1.1.
 */
export function isCustomModifier<T extends CustomTargetPath> (path: TargetPath, constructor: Constructor<T>): path is T {
    return path instanceof constructor;
}
cc.isCustomModifier = isCustomModifier;
