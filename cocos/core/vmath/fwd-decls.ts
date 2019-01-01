
declare interface IVec2Like {
    x: number;
    y: number;
}

declare interface IVec3Like {
    x: number;
    y: number;
    z: number;
}

declare interface IVec4Like {
    x: number;
    y: number;
    z: number;
    w: number;
}

declare interface IQuatLike {
    x: number;
    y: number;
    z: number;
    w: number;
}

declare interface IMat2Like {
    m00: number;
    m01: number;
    m02: number;
    m03: number;
}

declare interface IMat23Like {
    m00: number;
    m01: number;
    m02: number;
    m03: number;
    m04: number;
    m05: number;
}

declare interface IMat3Like {
    m00: number;
    m01: number;
    m02: number;
    m03: number;
    m04: number;
    m05: number;
    m06: number;
    m07: number;
    m08: number;
}

declare interface IMat4Like {
    m00: number;
    m01: number;
    m02: number;
    m03: number;
    m04: number;
    m05: number;
    m06: number;
    m07: number;
    m08: number;
    m09: number;
    m10: number;
    m11: number;
    m12: number;
    m13: number;
    m14: number;
    m15: number;
}

declare interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}
