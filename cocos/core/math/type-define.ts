/**
 * @category core/math
 */
/**
 * @hidden
 */
export interface IColorLike {
    r: number;
    g: number;
    b: number;
    a: number;
    _val: number;

}

export interface IMat3Like {
    m00: number; m01: number; m02: number;
    m03: number; m04: number; m05: number;
    m06: number; m07: number; m08: number;
}

export interface IMat4Like {
    m00: number; m01: number; m02: number; m03: number;
    m04: number; m05: number; m06: number; m07: number;
    m08: number; m09: number; m10: number; m11: number;
    m12: number; m13: number; m14: number; m15: number;
}

export interface IQuatLike {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface IRectLike {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ISizeLike {
    width: number;
    height: number;
}

export interface IVec2Like {
    x: number;
    y: number;
}

export interface IVec3Like {
    x: number;
    y: number;
    z: number;
}

export interface IVec4Like {
    x: number;
    y: number;
    z: number;
    w: number;
}
