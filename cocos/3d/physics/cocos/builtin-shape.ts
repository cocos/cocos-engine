import { Quat, Vec3 } from '../../../core/value-types';
import { ShapeBase } from '../api';
import { EShapeType } from '../physic-enum';
import { BuiltInBody } from './builtin-body';
import { IShapeTransform } from './builtin-interface';
import { BoxShape } from './shapes/BoxShape';
import { SphereShape } from './shapes/SphereShape';

export class BuiltInShape implements ShapeBase {
    get shape () { return this._shape; }
    get type () { return this._type; }
    set type (v: EShapeType) { this._type = v; }

    protected _shape: IShapeTransform | undefined;
    protected _type: EShapeType = EShapeType.SHAPE_AABB;

    protected _body!: BuiltInBody;
    /** 相对于节点的偏移 */
    protected _center: Vec3 = new Vec3(0, 0, 0);

    public _setBody (body: BuiltInBody) {
        this._body = body;
    }
    public setCenter (center: Vec3): void {
        this._center = center;
        /** TODO ：更新形状在世界的位置并需要加上节点的世界位置 */

    }

    public getUserData () {

    }
    public setUserData (data: any): void {

    }
    public getCollisionResponse (): boolean {
        return false;
    }
    public setCollisionResponse (value: boolean): void {
    }

    public setPosition (pos: Vec3) {
        this._shape!.translate(pos, this._center);
    }

    public setScale (scale: Vec3): void {
        this._shape!.scale(scale);
    }

    public setRotation (rotation: Quat): void {
        this._shape!.rotate(rotation);
    }
}

export class BuiltInBoxShape extends BuiltInShape {
    private _box: BoxShape;

    constructor (size: Vec3) {
        super();
        this._box = new BoxShape(
            this._center.x,
            this._center.y,
            this._center.z,
            size.x * 0.5,
            size.y * 0.5,
            size.z * 0.5,
        );
        this._shape = this._box as unknown as IShapeTransform;
    }
    public setSize (size: Vec3) {
        this._box.size = size;
    }
}

export class BuiltInSphereShape extends BuiltInShape {
    private _sphere: SphereShape;
    public get radius () { return this._sphere.r; }
    constructor (radius) {
        super();
        this._sphere = new SphereShape(this._center.x, this._center.y, this._center.z, radius);
        this._shape = this._sphere as unknown as IShapeTransform;
    }
    public setRadius (radius: number) {
        this._sphere.r = radius;
    }
}
