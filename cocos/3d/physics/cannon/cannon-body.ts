import CANNON from 'cannon';
import { Mat4, Quat, Vec3 } from '../../../core/math';
import { ICollisionCallback, ICollisionEventType, ICreateBodyOptions, PhysicsWorldBase, RigidBodyBase, ShapeBase } from '../api';
import { ERigidBodyType } from '../physic-enum';
import { getWrap, setWrap, stringfyVec3 } from '../util';
import { defaultCannonMaterial } from './cannon-const';
import { CannonWorld } from './cannon-world';
import { CannonShape } from './shapes/cannon-shape';

export class CannonRigidBody implements RigidBodyBase {

    get impl (): CANNON.Body {
        return this._body;
    }

    private _body: CANNON.Body;
    private _material: CANNON.Material;
    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;
    private _collisionCallbacks: ICollisionCallback[] = [];
    private _shapes: CannonShape[] = [];
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

        this._body.sleepSpeedLimit = 0.1; // Body will feel sleepy if speed<1 (speed == norm of velocity)
        this._body.sleepTimeLimit = 1; // Body falls asleep after 1s of sleepiness

        this._onCollidedListener = this._onCollided.bind(this);
    }

    /** allow sleep */
    public getAllowSleep (): boolean {
        return this._body.allowSleep;
    }

    public setAllowSleep (v: boolean): void {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        this._body.allowSleep = v;
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

    public isAwake (): boolean {
        return this._body.isAwake();
    }

    public isSleepy (): boolean {
        return this._body.isSleepy();
    }

    public isSleeping (): boolean {
        return this._body.isSleeping();
    }

    public addShape (shape: CannonShape, offset?: Vec3) {
        this._shapes.push(shape);
        if (offset != null) {
            this._body.addShape(shape.impl, Vec3.copy(_tCannonV1, offset));
        } else {
            this._body.addShape(shape.impl);
        }
        shape.setBody(this._body, this._shapes.length - 1);
    }

    public removeShape (shape: CannonShape) {
        const index = this._shapes.indexOf(shape);
        if (index >= 0) {
            this._shapes.splice(index, 1);
            (this._body as any).removeShape(shape.impl);
            shape.setBody(null, -1);
        }
    }

    public getMass () {
        return this._body.mass;
    }

    public setMass (value: number) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.mass = value;
        this._body.updateMassProperties();
    }

    public getIsKinematic () {
        return this._body.type === CANNON.Body.KINEMATIC;
    }

    public setIsKinematic (value: boolean) {
        if (value) {
            this._body.type = CANNON.Body.KINEMATIC;
        } else {
            this._body.type = CANNON.Body.DYNAMIC;
        }
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
        return this._body.useGravity;
    }

    public setUseGravity (value: boolean) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.useGravity = value;
    }

    public getCollisionResponse (): boolean {
        return this._body.collisionResponse;
    }

    public setCollisionResponse (value: boolean): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.collisionResponse = !value;
    }

    public getLinearVelocity (out: Vec3): Vec3 {
        Vec3.copy(out, this._body.velocity);
        return out;
    }

    public setLinearVelocity (value: Vec3): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.velocity, value);
    }

    public getAngularVelocity (out: Vec3): Vec3 {
        Vec3.copy(out, this._body.angularVelocity);
        return out;
    }

    public setAngularVelocity (value: Vec3): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.angularVelocity, value);
    }

    public getLinearFactor (out: Vec3): Vec3 {
        Vec3.copy(out, this._body.linearFactor);
        return out;
    }

    public setLinearFactor (value: Vec3): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.linearFactor, value);
    }

    public getAngularFactor (out: Vec3): Vec3 {
        Vec3.copy(out, this._body.angularFactor);
        return out;
    }

    public setAngularFactor (value: Vec3): void {

        if (this._body.isSleeping()) {
            this._body.wakeUp();

        }
        Vec3.copy(this._body.angularFactor, value);
    }

    public getFreezeRotation (): boolean {
        return this._body.fixedRotation;
    }

    public setFreezeRotation (value: boolean) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.fixedRotation = value;
        this._body.updateMassProperties();
    }

    public applyForce (force: Vec3, worldPoint?: Vec3) {
        if (worldPoint == null) {
            worldPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyForce(Vec3.copy(_tCannonV1, force), Vec3.copy(_tCannonV2, worldPoint));
    }

    public applyImpulse (impulse: Vec3, worldPoint?: Vec3) {
        if (worldPoint == null) {
            worldPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyImpulse(Vec3.copy(_tCannonV1, impulse), Vec3.copy(_tCannonV2, worldPoint));
    }

    public applyLocalForce (force: Vec3, localPoint?: Vec3): void {
        if (localPoint == null) {
            localPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyLocalForce(Vec3.copy(_tCannonV1, force), Vec3.copy(_tCannonV2, localPoint));
    }

    public applyLocalImpulse (impulse: Vec3, localPoint?: Vec3): void {
        if (localPoint == null) {
            localPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyLocalImpulse(Vec3.copy(_tCannonV1, impulse), Vec3.copy(_tCannonV2, localPoint));
    }

    public applyTorque (torque: Vec3): void {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        this._body.torque.x += torque.x;
        this._body.torque.y += torque.y;
        this._body.torque.z += torque.z;
    }

    public applyLocalTorque (torque: Vec3): void {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        Vec3.copy(_tCannonV1, torque);
        this._body.vectorToWorldFrame(_tCannonV1, _tCannonV1);        
        this._body.torque.x += _tCannonV1.x;
        this._body.torque.y += _tCannonV1.y;
        this._body.torque.z += _tCannonV1.z;
    }

    public setWorld (world: PhysicsWorldBase | null) {
        if (this._world) {
            this._body.removeEventListener('collide', this._onCollidedListener);
            this._body.world.remove(this._body);
            this._world = null;
        }

        const cworld = world as unknown as (CannonWorld | null);
        if (cworld) {
            cworld.impl.addBody(this._body);
            this._body.addEventListener('collide', this._onCollidedListener);
        }
        this._world = cworld;
    }

    public getPosition (out: Vec3) {
        Vec3.copy(out, this._body.position);
    }

    public setPosition (value: Vec3) {
        Vec3.copy(this._body.position, value);
    }

    public getRotation (out: Quat) {
        Quat.copy(out, this._body.quaternion);
    }

    public setRotation (value: Quat) {
        Quat.copy(this._body.quaternion, value);
        // console.log(`[[CANNON]] Set body rotation to ${stringfyQuat(value)}.`);
    }

    public translateAndRotate (m: Mat4, rot: Quat): void {
        Mat4.getTranslation(this._body.position, m);
        Quat.copy(this._body.quaternion, rot);
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

    private _onCollided (event: CANNON.ICollisionEvent) {
        CollisionEventObject.type = event.event;
        CollisionEventObject.selfCollider = getWrap<ShapeBase>(event.selfShape).getUserData();
        CollisionEventObject.otherCollider = getWrap<ShapeBase>(event.otherShape).getUserData();
        // CollisionEventObject.selfRigidBody = getWrap<RigidBodyBase>(event.target).getUserData();
        // CollisionEventObject.otherRigidBody = getWrap<RigidBodyBase>(event.body).getUserData();
        let i = 0;
        // tslint:disable-next-line:prefer-for-of
        for (i = CollisionEventObject.contacts.length; i--;) {
            contactsPool.push(CollisionEventObject.contacts.pop());
        }

        // tslint:disable-next-line:prefer-for-of
        for (i = 0; i < event.contacts.length; i++) {
            const cq = event.contacts[i];
            if (contactsPool.length > 0) {
                const c = contactsPool.pop();
                Vec3.copy(c.contactA, cq.ri);
                Vec3.copy(c.contactB, cq.rj);
                Vec3.copy(c.normal, cq.ni);
                CollisionEventObject.contacts.push(c);
            } else {
                const c = {
                    contactA: Vec3.copy(new Vec3(), cq.ri),
                    contactB: Vec3.copy(new Vec3(), cq.rj),
                    normal: Vec3.copy(new Vec3(), cq.ni),
                };
                CollisionEventObject.contacts.push(c);
            }
        }

        // tslint:disable-next-line:prefer-for-of
        for (i = 0; i < this._collisionCallbacks.length; i++) {
            const callback = this._collisionCallbacks[i];
            callback(CollisionEventObject);
        }
    }

}

const CollisionEventObject = {
    type: 'onCollisionEnter' as ICollisionEventType,
    selfCollider: null,
    otherCollider: null,
    // selfRigidBody: null,
    // otherRigidBody: null,
    contacts: [] as any,
};

const contactsPool = [] as any;

const _tCannonV1 = new CANNON.Vec3();

const _tCannonV2 = new CANNON.Vec3();