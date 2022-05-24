import { Color, Vec3, Vec2 } from '../../core';
import { JSB } from '../../core/default-constants';
import { NULL_HANDLE, Render2dHandle, Render2dPool, Render2dView } from '../../core/renderer';
import { NativeAdvanceRenderData } from '../../core/renderer/2d/native-2d';
import { BulletTrimeshShape } from '../../physics/bullet/shapes/bullet-trimesh-shape';

export class AdvanceRenderData {
    protected x = 0;
    protected y = 0;
    protected z = 0;
    protected u = 0;
    protected v = 0;

    protected colorR = 0;
    protected colorG = 0;
    protected colorB = 0;
    protected colorA = 0;

    protected _pos:Vec3 = new Vec3();
    protected _uv:Vec2 = new Vec2();
    protected _color:Color = new Color();

    protected declare _nativeObj:NativeAdvanceRenderData;

    protected _render2dHandle :Render2dHandle = NULL_HANDLE;
    protected sharedArray = new Float32Array(9);

    get nativeObj () {
        return this._nativeObj;
    }

    constructor () {
        this._init();

        // test code
        this.pos = new Vec3(1, 2, 3);

        this._nativeObj.colorA = 5;
    }

    set pos (val: Vec3) {
        Vec3.copy(this._pos, val);
        if (JSB) {
            this.sharedArray[0] = val.x;
            this.sharedArray[1] = val.y;
            this.sharedArray[2] = val.z;
        }
    }

    set uv (val:Vec2) {
        Vec2.copy(this._uv, val);
        if (JSB) {
            this.sharedArray[3] = val.x;
            this.sharedArray[4]  = val.y;
        }
    }

    set color (val:Color) {
        Color.copy(this._color, val);
        if (JSB) {
            this.sharedArray[5] = val.r;
            this.sharedArray[6] = val.g;
            this.sharedArray[7] = val.b;
            this.sharedArray[8] = val.a;
        }
    }

    protected _init () {
        if (JSB) {
            this._nativeObj = new NativeAdvanceRenderData();
            this._nativeObj.ParseRender2dData(this.sharedArray);
        }
    }
}
