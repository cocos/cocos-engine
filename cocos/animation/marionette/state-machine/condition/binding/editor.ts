import { EDITOR } from 'internal:constants';
import { _decorator, assertIsTrue, js } from '../../../../../core';
import { TCBinding, TCBindingValueType } from './binding';

/**
 * @zh
 * 描述某个（过渡条件）绑定类的类型信息。
 * @en
 * Describes the type info of a (transition condition)binding class.
 */
export interface TCBindingTypeInfo {
    /**
     * @zh
     * 该绑定类型的创建菜单信息。
     * @en
     * The creation menu info of this binding class.
     */
    menu?: string;

    /**
     * @zh
     * 该绑定类能提供的所有值类型。
     * @en
     * All value types that this binding can provides.
     */
    provisions?: readonly TCBindingValueType[];

    /**
     * @zh
     * 如果有定义，表示该类型的绑定支持的过渡源状态的类型。
     * @en
     * If defined, represents the type(s) of the transition source state supported by this type of binding.
     */
    transitionSourceFilter?: TCBindingTransitionSourceFilter;
}

const tcnBindingTypeInfoMap = new WeakMap<Constructor<TCBinding<number>>, TCBindingTypeInfo>();

// eslint-disable-next-line @typescript-eslint/ban-types
function getOrCreateTCBindingTypeInfo <TFunction extends Function> (target: TFunction): TCBindingTypeInfo {
    assertIsTrue(
        js.isChildClassOf(target, TCBinding),
        `This method can only be applied to subclasses of TCBinding`,
    );
    const constructor = target as unknown as Constructor<TCBinding<number>>;
    let info = tcnBindingTypeInfoMap.get(constructor);
    if (!info) {
        info = {};
        tcnBindingTypeInfoMap.set(constructor, info);
    }
    return info;
}

export const provide = (...valueTypes: readonly TCBindingValueType[]): ClassDecorator => (!EDITOR ? (): void => {} : (target): void => {
    const info = getOrCreateTCBindingTypeInfo(target);
    info.provisions = valueTypes.slice();
});

export enum TCBindingTransitionSourceFilter {
    /** Motion states. */
    MOTION = 1 << 0,

    /** Pose states. */
    POSE = 1 << 1,

    /** Empty states. */
    EMPTY = 1 << 2,

    /** All states having weight concept. */
    WEIGHTED = MOTION | POSE | EMPTY,
}

export const support = (transitionSourceFilter: TCBindingTransitionSourceFilter): ClassDecorator => (!EDITOR ? (): void => {} : (target): void => {
    const info = getOrCreateTCBindingTypeInfo(target);
    info.transitionSourceFilter = transitionSourceFilter;
});

/**
 * @zh 获取指定（过渡条件）绑定类的类型信息。
 * @zh Gets the type info of specified (transition condition)binding class.
 * @param constructor @zh 该绑定类的构造函数。@en The binding class's constructor.
 * @returns @zh 类型信息。@en Type info.
 */
export function getTCBindingTypeInfo (constructor: Constructor<TCBinding<number>>): Readonly<TCBindingTypeInfo> | undefined {
    return tcnBindingTypeInfoMap.get(constructor);
}
