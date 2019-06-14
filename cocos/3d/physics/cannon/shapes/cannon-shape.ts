import CANNON from 'cannon';
import { Quat, Vec3 } from '../../../../core/value-types';
import { vec3 } from '../../../../core/vmath';
import { ShapeBase } from '../../api';
import { stringfyVec3 } from '../../util';
import { commitShapeUpdates } from '../cannon-util';

export class CannonShape implements ShapeBase {

    public get impl () {
        return this._shape!;
    }

    protected _scale: Vec3 = new Vec3(1, 1, 1);

    protected _shape: CANNON.Shape | null = null;

    protected _body: CANNON.Body | null = null;

    private _index: number = -1;

    private _center: Vec3 = new Vec3(0, 0, 0);

    private _userData: any;

    public constructor () {

    }

    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
    }

    public _setIndex (index: number) {
        this._index = index;
        this._recalcCenter();
    }

    public _setBody (body: CANNON.Body, index: number) {
        this._body = body;
        this._setIndex(index);
    }

    public setCenter (center: Vec3): void {
        vec3.copy(this._center, center);
        this._recalcCenter();
    }

    public setScale (scale: Vec3): void {
        vec3.copy(this._scale, scale);
        this._recalcCenter();
    }

    public setRotation (rotation: Quat): void {

    }

    public getCollisionResponse (): boolean {
        return this.impl.collisionResponse;
    }

    public setCollisionResponse (v: boolean): void {
        this.impl.collisionResponse = v;
    }

    public _devStrinfy () {
        if (!this._body) {
            return `<NotAttached>`;
        }
        return `centerOffset: ${stringfyVec3(this._body.shapeOffsets[this._index])}`;
    }

    private _recalcCenter () {
        if (!this._body) {
            return;
        }
        const shapeOffset = this._body.shapeOffsets[this._index];
        vec3.copy(shapeOffset, this._center);
        vec3.multiply(shapeOffset, shapeOffset, this._scale);
        // console.log(`[[CANNON]] Set shape offset to (${shapeOffset.x}, ${shapeOffset.y}, ${shapeOffset.z}).`);

        commitShapeUpdates(this._body);
    }
}
