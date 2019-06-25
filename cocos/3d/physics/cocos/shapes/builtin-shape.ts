import { Quat, Vec3 } from '../../../../core/value-types';
import { mat4, quat, vec3 } from '../../../../core/vmath';
import { ITriggerCallback, ITriggerEvent, ShapeBase } from '../../api';
import { BuiltInBody } from '../builtin-body';
import { IBuiltinShape } from '../builtin-interface';
import { BuiltinObject } from '../object/builtin-object';

export class BuiltinShape extends BuiltinObject implements ShapeBase {

    public get localShape () {
        return this._worldShape;
    }

    public get worldShape () {
        return this._worldShape;
    }

    /** id unique */
    public get id () { return this._id; }

    /** id generator */
    private static idCounter: number = 0;

    public body!: BuiltInBody | null;

    protected _localShape!: IBuiltinShape;

    protected _worldShape!: IBuiltinShape;

    private readonly _id: number;

    private userData: any;

    private _triggeredCB: ITriggerCallback[] = [];

    constructor () {
        super();
        this._id = BuiltinShape.idCounter++;
    }

    public addTriggerCallback (callback: ITriggerCallback): void {
        this._triggeredCB.push(callback);
    }

    public removeTriggerCallback (callback: ITriggerCallback): void {
        const i = this._triggeredCB.indexOf(callback);
        if (i >= 0) {
            this._triggeredCB.splice(i, 1);
        }
    }

    public onTrigger (event: ITriggerEvent) {
        for (const callback of this._triggeredCB) {
            callback(event);
        }
    }

    public setCenter (center: Vec3): void {
        vec3.copy(this._localShape.center, center);
    }

    public getUserData () {
        return this.userData;
    }

    public setUserData (data: any): void {
        this.userData = data;
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
