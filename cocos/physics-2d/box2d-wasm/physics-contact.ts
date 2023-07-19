/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

// import b2 from '@cocos/box2d';
import { Fixture } from '@cocos/box2d';
import { B2, addImplPtrReference, getB2ObjectFromImpl, removeImplPtrReference } from './instantiated';
import { Vec2 } from '../../core';
import { PHYSICS_2D_PTM_RATIO } from '../framework/physics-types';
import { Collider2D, Contact2DType, PhysicsSystem2D } from '../framework';
import { B2Shape2D } from './shapes/shape-2d';
import { IPhysics2DContact, IPhysics2DImpulse, IPhysics2DManifoldPoint, IPhysics2DWorldManifold } from '../spec/i-physics-contact';
import { B2PhysicsWorld } from './physics-world';

const pools: PhysicsContact[] = [];

// temp world manifold
const pointCache = [new Vec2(), new Vec2()];

// const b2worldmanifold = null;//new B2.WorldManifold();

const worldmanifold: IPhysics2DWorldManifold = {
    points: [] as Vec2[],
    separations: [] as number[],
    normal: new Vec2(),
};

class ManifoldPoint implements IPhysics2DManifoldPoint {
    localPoint = new Vec2();
    normalImpulse = 0;
    tangentImpulse = 0;
}

const manifoldPointCache = [new ManifoldPoint(), new ManifoldPoint()];

const manifold = {
    type: 0,
    localPoint: new Vec2(),
    localNormal: new Vec2(),
    points: [] as ManifoldPoint[],
};

const impulse: IPhysics2DImpulse = {
    normalImpulses: [] as number[],
    tangentImpulses: [] as number[],
};

export class PhysicsContact implements IPhysics2DContact {
    static get (b2contact: B2.Contact): PhysicsContact {
        let c = pools.pop();

        if (!c) {
            c = new PhysicsContact();
        }

        c.init(b2contact);
        return c;
    }

    static put (b2contact: B2.Contact): void {
        const c = getB2ObjectFromImpl<PhysicsContact>(b2contact);
        if (!c) return;

        pools.push(c);
        c.reset();
    }

    colliderA: Collider2D | null = null;
    colliderB: Collider2D | null = null;

    disabled = false;
    disabledOnce = false;

    private _impulse: B2.ContactImpulse | null = null;
    private _inverted = false;
    private _impl: B2.Contact | null = null;
    private _b2Worldmanifold: B2.WorldManifold | null = null;

    _setImpulse (impulse: B2.ContactImpulse | null): void {
        this._impulse = impulse;
    }

    init (b2contact: B2.Contact): void {
        this.colliderA = (getB2ObjectFromImpl<B2Shape2D>(b2contact.GetFixtureA())).collider;
        this.colliderB = (getB2ObjectFromImpl<B2Shape2D>(b2contact.GetFixtureB())).collider;
        this.disabled = false;
        this.disabledOnce = false;
        this._impulse = null;
        this._inverted = false;

        // cannot directly assign b2contact to this._impl, since b2contact is a temporary object and
        // will be released by box2d wasm call back function automatically.
        // Here we get the b2contact from b2world, which will not be released by wasm automatically.
        this._impl = (PhysicsSystem2D.instance.physicsWorld as B2PhysicsWorld)
            .getContactWithContactImplPtr((b2contact as any).$$.ptr);
        addImplPtrReference(this, this._impl);

        this._b2Worldmanifold = new B2.WorldManifold();
    }

    reset (): void {
        this.setTangentSpeed(0);
        this.resetFriction();
        this.resetRestitution();

        this.colliderA = null;
        this.colliderB = null;
        this.disabled = false;
        this._impulse = null;

        removeImplPtrReference(this, this._impl!);
        this._impl = null;

        //delete this._b2worldmanifold
        //todo
    }

    getWorldManifold (): IPhysics2DWorldManifold {
        const points = worldmanifold.points;
        const separations = worldmanifold.separations;
        const normal = worldmanifold.normal;

        this._impl!.GetWorldManifold(this._b2Worldmanifold!);
        const count = this._impl!.GetManifold().pointCount;
        points.length = separations.length = count;

        for (let i = 0; i < count; i++) {
            const p = pointCache[i];
            const point = this._b2Worldmanifold!.GetPoint(i);
            p.x = point.x * PHYSICS_2D_PTM_RATIO;
            p.y = point.y * PHYSICS_2D_PTM_RATIO;
            points[i] = p;
            separations[i] = this._b2Worldmanifold!.GetSeparation(i) * PHYSICS_2D_PTM_RATIO;
        }

        normal.x = this._b2Worldmanifold!.normal.x;
        normal.y = this._b2Worldmanifold!.normal.y;

        if (this._inverted) {
            normal.x *= -1;
            normal.y *= -1;
        }

        return worldmanifold;
    }

    getManifold (): { type: number; localPoint: Vec2; localNormal: Vec2; points: ManifoldPoint[]; } {
        const points = manifold.points;
        const localNormal = manifold.localNormal;
        const localPoint = manifold.localPoint;

        const b2manifold = this._impl!.GetManifold();
        const count = points.length = b2manifold.pointCount;

        for (let i = 0; i < count; i++) {
            const p = manifoldPointCache[i];
            const b2p = b2manifold.GetPoint(i);
            p.localPoint.x = b2p.localPoint.x * PHYSICS_2D_PTM_RATIO;
            p.localPoint.y = b2p.localPoint.y * PHYSICS_2D_PTM_RATIO;
            p.normalImpulse = b2p.normalImpulse * PHYSICS_2D_PTM_RATIO;
            p.tangentImpulse = b2p.tangentImpulse;

            points[i] = p;
        }

        localPoint.x = b2manifold.localPoint.x * PHYSICS_2D_PTM_RATIO;
        localPoint.y = b2manifold.localPoint.y * PHYSICS_2D_PTM_RATIO;
        localNormal.x = b2manifold.localNormal.x;
        localNormal.y = b2manifold.localNormal.y;
        manifold.type = b2manifold.type;

        if (this._inverted) {
            localNormal.x *= -1;
            localNormal.y *= -1;
        }

        return manifold;
    }

    getImpulse (): IPhysics2DImpulse | null {
        const b2impulse = this._impulse;
        if (!b2impulse) return null;

        const normalImpulses = impulse.normalImpulses;
        const tangentImpulses = impulse.tangentImpulses;
        const count = b2impulse.count;
        for (let i = 0; i < count; i++) {
            normalImpulses[i] = b2impulse.normalImpulses[i] * PHYSICS_2D_PTM_RATIO;
            tangentImpulses[i] = b2impulse.tangentImpulses[i];
        }

        tangentImpulses.length = normalImpulses.length = count;

        return impulse;
    }

    emit (contactType: string): void {
        let func = '';
        switch (contactType) {
        case Contact2DType.BEGIN_CONTACT:
            func = 'onBeginContact';
            break;
        case Contact2DType.END_CONTACT:
            func = 'onEndContact';
            break;
        case Contact2DType.PRE_SOLVE:
            func = 'onPreSolve';
            break;
        case Contact2DType.POST_SOLVE:
            func = 'onPostSolve';
            break;
        default:
            break;
        }

        const colliderA = this.colliderA;
        const colliderB = this.colliderB;

        const bodyA = colliderA!.body;
        const bodyB = colliderB!.body;

        if (bodyA!.enabledContactListener) {
            colliderA?.emit(contactType, colliderA, colliderB, this);
        }

        if (bodyB!.enabledContactListener) {
            colliderB?.emit(contactType, colliderB, colliderA, this);
        }

        if (bodyA!.enabledContactListener || bodyB!.enabledContactListener) {
            PhysicsSystem2D.instance.emit(contactType, colliderA, colliderB, this);
        }

        if (this.disabled || this.disabledOnce) {
            this.setEnabled(false);
            this.disabledOnce = false;
        }
    }

    setEnabled (value): void {
        this._impl!.SetEnabled(value);
    }

    isTouching (): boolean {
        return this._impl!.IsTouching();
    }

    setTangentSpeed (value): void {
        this._impl!.SetTangentSpeed(value);
    }

    getTangentSpeed (): number {
        return this._impl!.GetTangentSpeed();
    }

    setFriction (value): void {
        this._impl!.SetFriction(value);
    }

    getFriction (): number {
        return this._impl!.GetFriction();
    }

    resetFriction (): void {
        return this._impl!.ResetFriction();
    }

    setRestitution (value): void {
        this._impl!.SetRestitution(value);
    }

    getRestitution (): number {
        return this._impl!.GetRestitution();
    }

    resetRestitution (): void {
        return this._impl!.ResetRestitution();
    }
}
