
/**
 * 将属性的 Get 访问器标记为不可变的。
 * 属性必须为 Javascript 原生类型或继承自 ValueType。
 */
export function constget (target: Object, propertyKey: string | symbol) {
    if (!CC_DEBUG) {
        return;
    }

    const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (propertyDescriptor && propertyDescriptor.get) {
        const rawGet = propertyDescriptor.get;
        function constGet (this: any) {
            const value = rawGet.call(this);
            return value ? Object.freeze(value.clone()) : value;
        }
        propertyDescriptor.get = constGet;
    }
    return propertyDescriptor;
}
