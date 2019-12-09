
type FloatArray = Float64Array | Float32Array;
export interface IColorLike {
    r: number;
    g: number;
    b: number;
    a: number;
    _val: number;

}

export interface IMat3Like {
    m: FloatArray
}

export interface IMat4Like {
    m: FloatArray
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