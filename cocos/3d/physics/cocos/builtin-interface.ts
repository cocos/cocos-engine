/**
 * 声明了一系列built-in-physics相关的的接口
 */
export interface IShapeTransform {
    translate (...args: any): any;
    scale (...args: any): any;
    rotate (...args: any): any;
}
