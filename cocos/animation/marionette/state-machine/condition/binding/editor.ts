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
}

const tcnBindingTypeInfoMap = new WeakMap<Constructor<TCBinding<number>>, TCBindingTypeInfo>();

// eslint-disable-next-line @typescript-eslint/ban-types
function getOrCreateTCBindingTypeInfo <TFunction extends Function> (target: TFunction) {
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

export const menu = (menu: string): ClassDecorator => (!EDITOR ? () => {} : (target) => {
    const info = getOrCreateTCBindingTypeInfo(target);
    if (info) {
        const prefix = 'i18n:';
        let i18nMenu = menu;
        if (menu.startsWith(prefix)) {
            const extensionPrefix = 'ENGINE.';
            i18nMenu = `${prefix}${extensionPrefix}${menu.slice(prefix.length)}`;
        }
        info.menu = i18nMenu;
    }
});

export const provide = (...valueTypes: readonly TCBindingValueType[]): ClassDecorator => (!EDITOR ? () => {} : (target) => {
    const info = getOrCreateTCBindingTypeInfo(target);
    if (info) {
        info.provisions = valueTypes.slice();
    }
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
