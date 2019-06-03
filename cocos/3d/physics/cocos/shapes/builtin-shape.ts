import { Quat, Vec3 } from '../../../../core/value-types';
import { mat4, quat, vec3 } from '../../../../core/vmath';
import { ShapeBase } from '../../api';
import { IBuiltinShape } from '../builtin-interface';

export class BuiltInShape implements ShapeBase {

    public get localShape () {
        return this._worldShape;
    }

    public get worldShape () {
        return this._worldShape;
    }

    protected _localShape!: IBuiltinShape;
    protected _worldShape!: IBuiltinShape;

    constructor () {

    }

    public setCenter (center: Vec3): void {
        vec3.copy(this._localShape.center, center);
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

    public setPosition (position: vec3){

    }

    public setRotation (rotation: Quat): void {
        throw new Error('Method not implemented.');
    }

    public transform (m: mat4, pos: vec3, rot: quat, scale: vec3) {
        this._localShape.transform(m, pos, rot, scale, this._worldShape);
    }

    public translateAndRotate (m: mat4, rot: quat){
        this._localShape.translateAndRotate(m, rot, this._worldShape);
    }

    public setScale (scale: Vec3): void {
        this._localShape.setScale(scale, this._worldShape);
    }
}
