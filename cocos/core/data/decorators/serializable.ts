/**
 * @category decorator
 */

import { LegacyPropertyDecorator } from './utils';
import { property, IPropertyOptions } from './property';

export const serializable: LegacyPropertyDecorator = (target, propertyKey, descriptor) => {
    return property(makeSerializable({ }))(target, propertyKey, descriptor);
};

export function formerlySerializedAs (name: string): LegacyPropertyDecorator {
    return property(makeSerializable({
        formerlySerializedAs: name,
    }));
}

/**
 * @en
 * Marks the property as editor only.
 * @zh
 * 设置该属性仅在编辑器中生效。
 */
export const editorOnly: LegacyPropertyDecorator = (target, propertyKey, descriptor) => {
    return property({
        editorOnly: true,
    })(target, propertyKey, descriptor);
};

function makeSerializable (options: IPropertyOptions) {
    options.__noImplicit = true;
    if (!('serializable' in options)) {
        options.serializable = true;
    }
    return options;
}
