import CANNON from '@cocos/cannon';
import { Vec3 } from '../../core/math';
import { IRigidBody } from '../spec/I-rigid-body';
import { RigidBodyComponent } from '../components/rigid-body-component';
import { PhysicsSystem } from '../../../exports/physics-framework';
import { CannonSharedBody } from './cannon-shared-body';
import { Node } from '../../core';
import { CannonWorld } from './cannon-world';

const v3_cannon0 = new CANNON.Vec3();
const v3_cannon1 = new CANNON.Vec3();

/**
 * wraped shared body
 * dynamic
 * kinematic
 */
export class CannonRigidBody implements IRigidBody {

    rigidBody!: RigidBodyComponent;
    private sharedBody!: CannonSharedBody;
    private get _body () { return this.sharedBody.body; }

    /** LIFECYCLE */

    __preload (com: RigidBodyComponent) {
        this.rigidBody = com;
        this.sharedBody = (PhysicsSystem.instance.physicsWorld as CannonWorld).getSharedBody(this.rigidBody.node as Node);
        this.sharedBody.wrappedBody = this;
    }

    onLoad () {
    }

    onEnable () {
        this.mass = this.rigidBody.mass;
        this.allowSleep = this.rigidBody.allowSleep;
        this.linearDamping = this.rigidBody.linearDamping;
        this.angularDamping = this.rigidBody.angularDamping;
        this.useGravity = this.rigidBody.useGravity;
        this.isKinematic = this.rigidBody.isKinematic;
        this.fixedRotation = this.rigidBody.fixedRotation;
        this.linearFactor = this.rigidBody.linearFactor;
        this.angularFactor = this.rigidBody.angularFactor;
        this.sharedBody.enabled = true;
    }

    onDisable () {
        this.sharedBody.enabled = false;
    }

    onDestroy () {

    }

    /** allow sleep */
    public get allowSleep (): boolean {
        return this._body.allowSleep;
    }

    public set allowSleep (v: boolean) {
        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
        this._body.allowSleep = v;
    }

    public wakeUp (): void {
        return this._body.wakeUp();
    }
    public sleep (): void {
        return this._body.sleep();
    }

    public get isAwake (): boolean {
        return this._body.isAwake();
    }

    public get isSleepy (): boolean {
        return this._body.isSleepy();
    }

    public get isSleeping (): boolean {
        return this._body.isSleeping();
    }

    public set mass (value: number) {
        this._body.mass = value;
        if (this._body.mass == 0) {
            this._body.type = CANNON.Body.STATIC;
        }

        this._body.updateMassProperties();

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }
    }

    public set isKinematic (value: boolean) {
        if (this._body.mass == 0) {
            this._body.type = CANNON.Body.STATIC;
        } else {
            if (value) {
                this._body.type = CANNON.Body.KINEMATIC;
            } else {
                this._body.type = CANNON.Body.DYNAMIC;
            }
        }
    }

    public set fixedRotation (value: boolean) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.fixedRotation = value;
        this._body.updateMassProperties();
    }

    public set linearDamping (value: number) {
        this._body.linearDamping = value;
    }

    public set angularDamping (value: number) {
        this._body.angularDamping = value;
    }

    public set useGravity (value: boolean) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.useGravity = value;
    }

    public set linearFactor (value: Vec3) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.linearFactor, value);
    }

    public set angularFactor (value: Vec3) {

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        Vec3.copy(this._body.angularFactor, value);
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

    public applyForce (force: Vec3, worldPoint?: Vec3) {
        if (worldPoint == null) {
            worldPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, worldPoint));
    }

    public applyImpulse (impulse: Vec3, worldPoint?: Vec3) {
        if (worldPoint == null) {
            worldPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, worldPoint));
    }

    public applyLocalForce (force: Vec3, localPoint?: Vec3): void {
        if (localPoint == null) {
            localPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyLocalForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, localPoint));
    }

    public applyLocalImpulse (impulse: Vec3, localPoint?: Vec3): void {
        if (localPoint == null) {
            localPoint = Vec3.ZERO;
        }

        if (this._body.isSleeping()) {
            this._body.wakeUp();
        }

        this._body.applyLocalImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, localPoint));
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
        Vec3.copy(v3_cannon0, torque);
        this._body.vectorToWorldFrame(v3_cannon0, v3_cannon0);
        this._body.torque.x += v3_cannon0.x;
        this._body.torque.y += v3_cannon0.y;
        this._body.torque.z += v3_cannon0.z;
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

}