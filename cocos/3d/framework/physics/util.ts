
export interface IWrappedCANNON<T> {
    __cc_wrapper__: T;
}

export function setWrap<Wrapper>(cannonObject: any, wrapper: Wrapper) {
    (cannonObject as unknown as IWrappedCANNON<Wrapper>).__cc_wrapper__ = wrapper;
}

export function getWrap<Wrapper>(cannonObject: any) {
    return (cannonObject as unknown as IWrappedCANNON<Wrapper>).__cc_wrapper__;
}