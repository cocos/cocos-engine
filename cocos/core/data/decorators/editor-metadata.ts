// Should be https://github.com/tc39/proposal-decorator-metadata
const editorMetadataTag = Symbol('[[EditorMetadata]]');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ClassMetadata {
    // TODO
}

interface ClassMetadataInternal extends ClassMetadata {
    properties: Record<PropertyKey, ClassFieldMetadata>;
}

export interface ClassFieldMetadata {
    /**
     * @zh 如果存在，则指定这个类方法作为按钮的入口。
     * 当为字符串时指定了按钮的显示名称，否则，按钮的显示名称就是该字段的名称。
     */
    button?: true | string;
}

/**
 * @zh
 * 生成一个方法装饰器，它将被装饰的方法声明为编辑器的“按钮入口”。
 * @en
 * Creates a method decorator which declares the decorated method as a "button entry" in editor.
 * @param displayName @zh 该按钮的显示名称，如果没有指定。会使用方法本身的名字。@en
 * The button's display name. If not specified, the method's name is used.
 * @returns @zh 生成的装饰器。@en The generated decorator.
 */
export function button (displayName?: string): MethodDecorator {
    return (target, propertyKey) => {
        const propertyMetadata = getOrCreatePropertyMetadata(target.constructor as Constructor<unknown>, propertyKey);
        propertyMetadata.button = displayName ?? true;
    };
}

export function getClassFieldMetadata (
    constructor: Constructor<unknown>,
    propertyKey: symbol | string,
): ClassFieldMetadata | undefined {
    return constructor[editorMetadataTag]?.properties?.[propertyKey] as ClassFieldMetadata | undefined;
}

function getOrCreateInternalClassMetadata (constructor: Constructor<unknown>) {
    const classMetadata = (constructor[editorMetadataTag] as {
        [editorMetadataTag]: ClassMetadataInternal;
    })[editorMetadataTag] ??= {
        properties: {},
    };
    return classMetadata;
}

function getOrCreatePropertyMetadata (constructor: Constructor<unknown>, propertyKey: string | PropertyKey) {
    const classMetadataInternal = getOrCreateInternalClassMetadata(constructor);
    const propertyMetadata = classMetadataInternal.properties[propertyKey] ??= {};
    return propertyMetadata;
}
