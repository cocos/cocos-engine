import CANNON from 'cannon';
import { Mat4, Quat, Vec3 } from '../../../core/value-types';
import { clamp, mat4, quat, vec3 } from '../../../core/vmath';
import { ICollisionCallback, ICollisionEvent, ICreateBodyOptions, PhysicsWorldBase, RigidBodyBase } from '../api';
import { ERigidBodyType, ETransformSource } from '../physic-enum';
import { getWrap, setWrap, stringfyVec3 } from '../util';
import { defaultCannonMaterial } from './cannon-const';
import { toCannonVec3 } from './cannon-util';
import { CannonWorld } from './cannon-world';
import { CannonShape } from './shapes/cannon-shape';

export class CannonRigidBody implements RigidBodyBase {

    get impl (): CANNON.Body {
        return this._body;
    }

    private _body: CANNON.Body;
    private _velocityResult: Vec3 = new Vec3();
    private _useGravity = true;
    private _material: CANNON.Material;
    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;
    private _onWorldBeforeStepListener: () => any;
    private _onWorldPostStepListener: (event: CANNON.ICollisionEvent) => any;
    private _collisionCallbacks: ICollisionCallback[] = [];
    private _shapes: CannonShape[] = [];
    private _transformSource: ETransformSource = ETransformSource.SCENE;
    private _userData: any;
    private _world: CannonWorld | null = null;
    private _name: string;

    constructor (options?: ICreateBodyOptions) {
        options = options || {};
        this._name = options.name || '';
        this._material = defaultCannonMaterial;
        this._body = new CANNON.Body({
            material: this._material,
            type: ERigidBodyType.DYNAMIC,
        });
        setWrap<RigidBodyBase>(this._body, this);
        this._body.allowSleep = true;
        this._body.sleepSpeedLimit = 0.1; // Body will feel sleepy if speed<1 (speed == norm of velocity)
        this._body.sleepTimeLimit = 1; // Body falls asleep after 1s of sleepiness

        this._onCollidedListener = this._onCollided.bind(this);
        this._onWorldBeforeStepListener = this._onWorldBeforeStep.bind(this);
        this._onWorldPostStepListener = this._onWorldPostStep.bind(this);

        this._body.preStep = () => {
            this._onSelfPreStep();
        };

        this._body.postStep = () => {
            this._onSelfPostStep();
        };
    }

    /** group */
    public getGroup (): number {
        return this._body.collisionFilterGroup;
    }

    public setGroup (v: number): void {
        this._body.collisionFilterGroup = v;
    }

    public addGroup (v: number): void {
        this._body.collisionFilterGroup |= v;
    }

    public removeGroup (v: number): void {
        this._body.collisionFilterGroup &= ~v;
    }

    /** mask */
    public getMask (): number {
        return this._body.collisionFilterMask;
    }

    public setMask (v: number): void {
        this._body.collisionFilterMask = v;
    }

    public addMask (v: number): void {
        this._body.collisionFilterMask |= v;
    }

    public removeMask (v: number): void {
        this._body.collisionFilterMask &= ~v;
    }

    public wakeUp (): void {
        return this._body.wakeUp();
    }
    public sleep (): void {
        return this._body.sleep();
    }

    public name () {
        return this._name;
    }

    public getType (): ERigidBodyType {
        return this._body.type;
    }

    public setType (v: ERigidBodyType): void {
        this._body.type = v;
    }

    public addShape (shape: CannonShape, offset?: Vec3) {
        const index = this._shapes.length;
        this._shapes.push(shape);
        if (offset != null) {
            this._body.addShape(shape.impl, toCannonVec3(offset));
        } else {
            this._body.addShape(shape.impl);
        }
        shape._setBody(this._body, index);
    }

    public removeShape (shape: CannonShape) {
        const i = this._shapes.indexOf(shape);
        if (i < 0) {
            return;
        }
        this._removeShape(i);
        for (let j = i + 1; j < this._shapes.length; ++j) {
            const s = this._shapes[j];
            s._setIndex(j - 1);
        }
        this._shapes.splice(i, 1);
    }

    public getMass () {
        return this._body.mass;
    }

    public setMass (value: number) {
        this._body.mass = value;
        this._body.updateMassProperties();
        // if (this._cannonBody.type !== CANNON.Body.KINEMATIC) {
        //     // this._resetBodyTypeAccordingMess();
        //     // this._onBodyTypeUpdated();
        // }
    }

    public getIsKinematic () {
        return this._body.type === CANNON.Body.KINEMATIC;
    }

    public setIsKinematic (value: boolean) {
        if (value) {
            this._body.type = CANNON.Body.KINEMATIC;
        } else {
            this._body.type = CANNON.Body.DYNAMIC;
            // this._resetBodyTypeAccordingMess();
        }
        // this._onBodyTypeUpdated();
    }

    public getLinearDamping () {
        return this._body.linearDamping;
    }

    public setLinearDamping (value: number) {
        this._body.linearDamping = value;
    }

    public getAngularDamping () {
        return this._body.angularDamping;
    }

    public setAngularDamping (value: number) {
        this._body.angularDamping = value;
    }

    public getUseGravity (): boolean {
        return this._useGravity;
    }

    public setUseGravity (value: boolean) {
        this._useGravity = value;
    }

    public getIsTrigger (): boolean {
        return this._body.collisionResponse;
    }

    public setIsTrigger (value: boolean): void {
        this._body.collisionResponse = !value;
    }

    public getVelocity (): Vec3 {
        vec3.copy(this._velocityResult, this._body.velocity);
        return this._velocityResult;
    }

    public setVelocity (value: Vec3): void {
        vec3.copy(this._body.velocity, value);
    }

    public getFreezeRotation (): boolean {
        return this._body.fixedRotation;
    }

    public setFreezeRotation (value: boolean) {
        this._body.fixedRotation = value;
        this._body.updateMassProperties();
    }

    public applyForce (force: Vec3, position?: Vec3) {
        if (!position) {
            position = new Vec3();
            vec3.copy(position, this._body.position);
        }
        this._body.wakeUp();
        this._body.applyForce(toCannonVec3(force), toCannonVec3(position));
    }

    public applyImpulse (impulse: Vec3) {
        this._body.wakeUp();
        this._body.applyImpulse(toCannonVec3(impulse), this._body.position);
    }

    public setWorld (world: PhysicsWorldBase | null) {
        if (this._world) {
            this._body.world.removeEventListener('postStep', this._onWorldPostStepListener);
            // this._cannonBody.world.removeEventListener('beforeStep', this._onWorldBeforeStepListener);
            this._world.removeBeforeStep(this._onWorldBeforeStepListener);
            this._body.removeEventListener('collide', this._onCollidedListener);
            this._body.world.remove(this._body);
            this._world = null;
        }

        const cworld = world as unknown as (CannonWorld | null);
        if (cworld) {
            cworld.impl.addBody(this._body);
            this._body.addEventListener('collide', this._onCollidedListener);
            cworld.addBeforeStep(this._onWorldBeforeStepListener);
            // this._cannonBody.world.addEventListener('beforeStep', this._onWorldBeforeStepListener);
            this._body.world.addEventListener('postStep', this._onWorldPostStepListener);
        }
        this._world = cworld;
    }

    public isPhysicsManagedTransform (): boolean {
        return this._transformSource === ETransformSource.PHYSIC;
    }

    public getPosition (out: Vec3) {
        vec3.copy(out, this._body.position);
    }

    public setPosition (value: Vec3) {
        vec3.copy(this._body.position, value);
        // console.log(`[[CANNON]] Set body position to ${stringfyVec3(value)}.`);
    }

    public getRotation (out: Quat) {
        quat.copy(out, this._body.quaternion);
    }

    public setRotation (value: Quat) {
        quat.copy(this._body.quaternion, value);
        // console.log(`[[CANNON]] Set body rotation to ${stringfyQuat(value)}.`);
    }

    public translateAndRotate (m: Mat4, rot: Quat): void {
        mat4.getTranslation(this._body.position, m);
        quat.copy(this._body.quaternion, rot);
    }

    public scaleAllShapes (scale: Vec3) {
        for (const shape of this._shapes) {
            shape.setScale(scale);
        }
    }

    public addCollisionCallback (callback: ICollisionCallback): void {
        this._collisionCallbacks.push(callback);
    }

    public removeCollisionCllback (callback: ICollisionCallback): void {
        const i = this._collisionCallbacks.indexOf(callback);
        if (i >= 0) {
            this._collisionCallbacks.splice(i, 1);
        }
    }

    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
    }

    public _stringfyThis () {
        return `${this._name.length ? this._name : '<No-name>'}`;
    }

    public _devStrinfy () {
        const shapes = this._body.shapes.map((s) => getWrap<CannonShape>(s)._devStrinfy()).join('; ');
        return `Name: [[${this._name.length ? this._name : '<No-name>'}]], position: ${stringfyVec3(this._body.position)}, shapes: [${shapes}]`;
    }

    private _resetBodyTypeAccordingMess () {
        if (this._body.mass <= 0) {
            this._body.type = CANNON.Body.STATIC;
        } else {
            this._body.type = CANNON.Body.DYNAMIC;
        }
    }

    private _onBodyTypeUpdated () {
        if (this._body) {
            if (this._body.type === CANNON.Body.STATIC) {
                this._transformSource = ETransformSource.SCENE;
            } else {
                this._transformSource = ETransformSource.PHYSIC;
            }
        }
    }

    private _onCollided (event: CANNON.ICollisionEvent) {
        const evt: ICollisionEvent = {
            source: getWrap<RigidBodyBase>(event.body),
            target: getWrap<RigidBodyBase>((event as any).target),
        };
        for (const callback of this._collisionCallbacks) {
            // TODO : 目前的Canon无法支持Enter\Stay\Exit，目前碰撞仅触发两次Stay
            callback('onCollisionStay', evt);
        }
    }

    private _onWorldBeforeStep () {
    }

    private _onWorldPostStep (event: CANNON.IEvent) {
    }

    private _onSelfPreStep () {
        if (!this._useGravity) {
            this._body.force.y -= this._body.mass * this._body.world.gravity.y;
        }
    }

    private _onSelfPostStep () {

    }

    private _removeShape (iShape: number) {
        const body = this._body;
        const shape = body.shapes[iShape];
        body.shapes.splice(iShape, 1);
        body.shapeOffsets.splice(iShape, 1);
        body.shapeOrientations.splice(iShape, 1);
        body.updateMassProperties();
        body.updateBoundingRadius();
        body.aabbNeedsUpdate = true;
        (shape as any).body = null;
    }
}
