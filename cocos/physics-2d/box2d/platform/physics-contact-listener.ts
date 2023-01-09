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

import b2 from '@cocos/box2d';
import { assert, js } from '../../../core';
import { fastRemove } from '../../../core/utils/array';
import { Contact2DType, PhysicsSystem2D } from '../../framework';
import { PhysicsContact, CollisionStatus } from '../physics-contact';
import { b2Shape2D } from '../shapes/shape-2d';

// enum CollisionStatus {
//     ENTER,
//     STAY,
//     EXIT,
//     UNKNOWN
// }
// class Collision {
//     //private static readonly _collisionMap = new Map<string, Collision>();
//     // public static getCollision (key: string) {
//     //     return Collision._collisionMap.get(key);
//     // }

//     // public static getOrCreateCollision (key: string) {
//     //     let retCollision!: Collision;
//     //     let newCreated = false;
//     //     if (Collision._collisionMap.has(key)) {
//     //         retCollision = Collision._collisionMap.get(key)!;
//     //         retCollision.reference = true;
//     //         newCreated = false;
//     //     } else {
//     //         retCollision = new Collision(key);
//     //         Collision._collisionMap.set(key, retCollision);
//     //         newCreated = true;
//     //     }
//     //     return { retCollision, newCreated };
//     // }

//     private readonly key: string;
//     public ref = 0;
//     public status: CollisionStatus = CollisionStatus.UNKNOWN;
//     public b2Contact: any;
//     // public set reference (v: boolean) {
//     //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
//     //     v ? this.ref++ : this.ref--;
//     //     if (this.ref === 0) { this.destroy(); }
//     // }

//     public constructor (key: string) {
//         this.ref = 1;
//         this.key = key;
//     }

//     // private destroy () {
//     //     Collision._collisionMap.delete(this.key);
//     // }
// }

export class PhysicsContactListener extends b2.ContactListener {
    private _contactFixtures: b2.Fixture[] = [];
    // static readonly _collisionMap = new Map<string, Collision>();

    private getContactKey (contact: b2.Contact) {
        const colliderA = (contact.m_fixtureA.m_userData as b2Shape2D).collider;
        const colliderB = (contact.m_fixtureB.m_userData as b2Shape2D).collider;
        //const c: PhysicsContact = (contact as b2ContactExtends).m_userData as PhysicsContact;
        let key = colliderA.uuid + colliderB.uuid;
        if (colliderA.uuid > colliderB.uuid) {
            key = colliderB.uuid + colliderA.uuid;
        }
        return key;
    }

    BeginContact (contact: b2.Contact) {
        //if (!this._BeginContact) return;

        // const fixtureA = contact.GetFixtureA();
        // const fixtureB = contact.GetFixtureB();
        // const fixtures = this._contactFixtures;

        const key = this.getContactKey(contact);

        if (PhysicsContact._contactMap.has(key)) {
            const retCollision = PhysicsContact._contactMap.get(key)!;
            retCollision.ref++;
            console.log('   collision++', key, 'current ref is:', retCollision.ref);
            if (retCollision.status === Contact2DType.END_CONTACT) {
                retCollision.status = Contact2DType.STAY_CONTACT;
                console.log('   set as stay');
            } else {
                retCollision.status = Contact2DType.BEGIN_CONTACT;
                console.log('   set as enter');
            }
        } else {
            console.log('   new collision', key, 'current ref is:', 1);
            const retCollision = new PhysicsContact(key, contact);
            PhysicsContact._contactMap.set(key, retCollision);
            retCollision.status = Contact2DType.BEGIN_CONTACT;
        }

        // (contact as any)._shouldReport = false;

        // if (fixtures.indexOf(fixtureA) !== -1 || fixtures.indexOf(fixtureB) !== -1) {
        //     (contact as any)._shouldReport = true; // for quick check whether this contact should report
        //     this._BeginContact(contact as b2ContactExtends);
        // }
    }

    EndContact (contact: b2.Contact) {
        const key = this.getContactKey(contact);

        if (PhysicsContact._contactMap.has(key)) {
            const retCollision = PhysicsContact._contactMap.get(key)!;
            retCollision.ref--;
            console.log('   collision--', key, 'current ref is:', retCollision.ref);
            if (retCollision.ref <= 0) {
                console.log('   set as exit');
                retCollision.status = Contact2DType.END_CONTACT;
            }
        } else {
            assert(false);
        }

        // let collision = Collision.getCollision(key);
        // assert(collision);
        // collision.reference = false;

        // //if collision is still not removed, return
        // collision = Collision.getCollision(key);
        // if (collision) { return; }

        // if (this._EndContact && (contact as any)._shouldReport) {
        //     (contact as any)._shouldReport = false;
        //     this._EndContact(contact as b2ContactExtends);
        // }
    }

    PreSolve (contact: b2.Contact, oldManifold: b2.Manifold) {
        // if (this._PreSolve && (contact as any)._shouldReport) {
        //     this._PreSolve(contact as b2ContactExtends, oldManifold);
        // }

        // const colliderA = (contact.m_fixtureA.m_userData as b2Shape2D).collider;
        // const colliderB = (contact.m_fixtureB.m_userData as b2Shape2D).collider;
        // //const c: PhysicsContact = (contact as b2ContactExtends).m_userData as PhysicsContact;
        // let key = colliderA.uuid + colliderB.uuid;
        // if (colliderA.uuid > colliderB.uuid) {
        //     key = colliderB.uuid + colliderA.uuid;
        // }

        // const retCollision = PhysicsContact._contactMap.get(key)!;
    }

    PostSolve (contact: b2.Contact, impulse: b2.ContactImpulse) {
        // if (this._PostSolve && (contact as any)._shouldReport) {
        //     this._PostSolve(contact as b2ContactExtends, impulse);
        // }
    }

    registerContactFixture (fixture) {
        this._contactFixtures.push(fixture);
    }

    unregisterContactFixture (fixture) {
        js.array.remove(this._contactFixtures, fixture);
    }

    // private _BeginContact (b2contact: b2ContactExtends) {
    //     const c = PhysicsContact.get(b2contact);
    //     // c.emit(Contact2DType.BEGIN_CONTACT);
    //     this.emit(Contact2DType.BEGIN_CONTACT, c);
    // }

    // private _EndContact (b2contact: b2ContactExtends) {
    //     const c = b2contact.m_userData;
    //     if (!c) {
    //         return;
    //     }
    //     c.emit(Contact2DType.END_CONTACT);

    //     PhysicsContact.put(b2contact);
    // }

    // private _PreSolve (b2contact: b2ContactExtends, oldManifold: b2.Manifold) {
    //     const c = b2contact.m_userData;
    //     if (!c) {
    //         return;
    //     }

    //     const bodyA = c.colliderA.body;
    //     const bodyB = c.colliderB.body;
    //     if (!bodyA || !bodyB || !bodyA.enabledInHierarchy || !bodyB.enabledInHierarchy) {
    //         return;
    //     }

    //     c.emit(Contact2DType.PRE_SOLVE);
    // }

    // private _PostSolve (b2contact: b2ContactExtends, impulse: b2.ContactImpulse) {
    //     const c: PhysicsContact = b2contact.m_userData;
    //     if (!c) {
    //         return;
    //     }

    //     const bodyA = c.colliderA!.body;
    //     const bodyB = c.colliderB!.body;
    //     if (!bodyA || !bodyB || !bodyA.enabledInHierarchy || !bodyB.enabledInHierarchy) {
    //         return;
    //     }

    //     // impulse only survive during post sole callback
    //     c._setImpulse(impulse);
    //     c.emit(Contact2DType.POST_SOLVE);
    //     c._setImpulse(null);
    // }

    public FinalizeCollision () {
        console.log('FinalizeCollision');
        //const deleteList: string[] = [];
        PhysicsContact._contactMap.forEach((collision: PhysicsContact, key: string) => {
            //console.log('forEach', key, collision);

            if (collision.status === Contact2DType.END_CONTACT) {
                //deleteList.push(key);
                PhysicsContact._contactMap.delete(key);
                console.log('   report end collision', key, 'current ref is:', collision.ref);

                //const contact = collision.b2Contact;
                const bodyA = collision.colliderA!.body;
                const bodyB = collision.colliderB!.body;
                if (!bodyA || !bodyB || !bodyA.enabledInHierarchy || !bodyB.enabledInHierarchy) {
                    return;
                }

                //if (collision.shouldReport) {
                //collision.shouldReport = false;
                this.emit(Contact2DType.END_CONTACT, collision);
                //}

                // if (this._EndContact && b2contact._shouldReport) {
                //     b2contact._shouldReport = false;
                //     this._EndContact(b2contact as b2ContactExtends);
                // }
            } else if (collision.status === Contact2DType.BEGIN_CONTACT) {
                collision.status = Contact2DType.STAY_CONTACT;
                console.log('   report enter collision', key, 'current ref is:', collision.ref);

                //const contact = collision.b2Contact;

                // const fixtureA = contact.GetFixtureA();//todo
                // const fixtureB = contact.GetFixtureB();
                //const fixtures = this._contactFixtures;

                //collision.shouldReport = false;
                //if (fixtures.indexOf(fixtureA) !== -1 || fixtures.indexOf(fixtureB) !== -1) {
                //collision.shouldReport = true; // for quick check whether this contact should report
                //this._BeginContact(b2contact as b2ContactExtends);
                this.emit(Contact2DType.BEGIN_CONTACT, collision);
                //}
            }

            // if (collision.ref <= 0) {
            //     deleteList.push(key);
            //     PhysicsContact._contactMap.delete(key);
            //     const b2contact = collision.b2Contact;
            //     if (this._EndContact && b2contact._shouldReport) {
            //         b2contact._shouldReport = false;
            //         this._EndContact(b2contact as b2ContactExtends);
            //     }
            // } else if (collision.ref > 0) {
            //     if (collision.status === CollisionStatus.ENTER) {
            //         collision.status = CollisionStatus.STAY;

            //         const b2contact = collision.b2Contact;

            //         const fixtureA = b2contact.GetFixtureA();
            //         const fixtureB = b2contact.GetFixtureB();
            //         const fixtures = this._contactFixtures;

            //         b2contact._shouldReport = false;

            //         if (fixtures.indexOf(fixtureA) !== -1 || fixtures.indexOf(fixtureB) !== -1) {
            //             b2contact._shouldReport = true; // for quick check whether this contact should report
            //             this._BeginContact(b2contact as b2ContactExtends);
            //         }
            //     }
            // }
        });

        // for (let i = 0; i < deleteList.length; i++) {
        //     PhysicsContact._contactMap.delete(deleteList[i]);
        // }
    }

    emit (contactType, collision: PhysicsContact) {
        const colliderA = collision.colliderA!;
        const colliderB = collision.colliderB!;

        const bodyA = colliderA.body!;
        const bodyB = colliderB.body!;

        if (bodyA.enabledContactListener) {
            colliderA?.emit(contactType, colliderA, colliderB, collision);
        }

        if (bodyB.enabledContactListener) {
            colliderB?.emit(contactType, colliderB, colliderA, collision);
        }

        if (bodyA.enabledContactListener || bodyB.enabledContactListener) {
            PhysicsSystem2D.instance.emit(contactType, colliderA, colliderB, collision);//?
        }

        if (collision.disabled || collision.disabledOnce) {
            collision.setEnabled(false);
            collision.disabledOnce = false;
        }
    }
}
