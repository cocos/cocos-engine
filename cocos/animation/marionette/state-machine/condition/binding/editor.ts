import { EDITOR } from 'internal:constants';
import { _decorator, assertIsTrue, js } from '../../../../../core';
import { TCBinding, TCBindingValueType } from './binding';

export interface TCFBindingTypeInfo {
    menu?: string;
    provisions?: readonly TCBindingValueType[];
}

const tcnBindingTypeInfoMap = new WeakMap<Constructor<TCBinding<number>>, TCFBindingTypeInfo>();

// eslint-disable-next-line @typescript-eslint/ban-types
function getOrCreateTCBindingTypeInfo <TFunction extends Function> (target: TFunction) {
    assertIsTrue(
        js.isChildClassOf(target, TCBinding),
        `This method can only be applied to subclasses of TCFBinding`,
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
        info.menu = menu;
    }
});

export const provide = (...valueTypes: readonly TCBindingValueType[]): ClassDecorator => (!EDITOR ? () => {} : (target) => {
    const info = getOrCreateTCBindingTypeInfo(target);
    if (info) {
        info.provisions = valueTypes.slice();
    }
});

export function getTCBindingTypeInfo (constructor: Constructor<TCBinding<number>>): Readonly<TCFBindingTypeInfo> | undefined {
    return tcnBindingTypeInfoMap.get(constructor);
}
