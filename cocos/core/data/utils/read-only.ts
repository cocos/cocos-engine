
export function readOnly (target: Object, propertyKey: string | symbol) {
    if (!CC_DEBUG) {
        return;
    }

    const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (propertyDescriptor && propertyDescriptor.get) {
        const rawGet = propertyDescriptor.get;
        function readOnlyGet (this: any) {
            const value = rawGet.call(this);
            return Object.freeze(value.clone());
        }
        propertyDescriptor.get = readOnlyGet;
    }
    return propertyDescriptor;
}
