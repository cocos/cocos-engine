
type FloatArray = Float64Array | Float32Array;

interface IColorLike {
    r: number;
    g: number;
    b: number;
    a: number;
    _val: number;

}

interface IMat3Like {
    m: FloatArray
}

interface IMat4Like {
    m: FloatArray
}

interface IQuatLike {
    x: number;
    y: number;
    z: number;
    w: number;
}

interface IRectLike {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ISizeLike {
    width: number;
    height: number;
}

interface IVec2Like {
    x: number;
    y: number;
}

interface IVec3Like {
    x: number;
    y: number;
    z: number;
}

interface IVec4Like {
    x: number;
    y: number;
    z: number;
    w: number;
}