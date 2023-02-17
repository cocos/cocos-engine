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
import { PhysicsContact } from '../physics-contact';
import { b2Shape2D } from '../shapes/shape-2d';

export class PhysicsContactListener extends b2.ContactListener {
    static readonly _contactMap = new Map<string, PhysicsContact>();

    private getContactKey (contact: b2.Contact) {
        const colliderA = (contact.m_fixtureA.m_userData as b2Shape2D).collider;
        const colliderB = (contact.m_fixtureB.m_userData as b2Shape2D).collider;
        let key = colliderA.uuid + colliderB.uuid;
        if (colliderA.uuid > colliderB.uuid) {
            key = colliderB.uuid + colliderA.uuid;
        }
        return key;
    }

    BeginContact (contact: b2.Contact) {
        const key = this.getContactKey(contact);

        if (PhysicsContactListener._contactMap.has(key)) {
            const retContact = PhysicsContactListener._contactMap.get(key)!;
            retContact.ref++;
            //console.log('   collision++', key, 'current ref is:', retContact.ref);
            if (retContact.status === Contact2DType.END_CONTACT) {
                retContact.status = Contact2DType.STAY_CONTACT;
                //console.log('   set as stay');
            } else if (retContact.status !== Contact2DType.STAY_CONTACT) {
                retContact.status = Contact2DType.BEGIN_CONTACT;
                //console.log('   set as enter');
            }
        } else {
            //console.log('   new collision', key, 'current ref is:', 1);
            const retCollision = new PhysicsContact(contact);
            PhysicsContactListener._contactMap.set(key, retCollision);
            retCollision.status = Contact2DType.BEGIN_CONTACT;
        }
    }

    EndContact (contact: b2.Contact) {
        const key = this.getContactKey(contact);

        const retContact = PhysicsContactListener._contactMap.get(key);
        assert(retContact);

        retContact.ref--;
        //console.log('   collision--', key, 'current ref is:', retCollision.ref);
        if (retContact.ref <= 0) {
            //console.log('   set as exit');
            retContact.status = Contact2DType.END_CONTACT;
        }
    }

    PreSolve (contact: b2.Contact, oldManifold: b2.Manifold) {
    }

    PostSolve (contact: b2.Contact, impulse: b2.ContactImpulse) {
    }

    public finalizeContactEvent () {
        PhysicsContactListener._contactMap.forEach((contact: PhysicsContact, key: string) => {
            //console.log('forEach', key, collision);
            if (contact.status === Contact2DType.END_CONTACT) {
                PhysicsContactListener._contactMap.delete(key);
                //console.log('   report end collision', key, 'current ref is:', contact.ref);
                this.emit(Contact2DType.END_CONTACT, contact);
            } else if (contact.status === Contact2DType.BEGIN_CONTACT) {
                contact.status = Contact2DType.STAY_CONTACT;
                //console.log('   report enter collision', key, 'current ref is:', contact.ref);
                this.emit(Contact2DType.BEGIN_CONTACT, contact);
            } else if (contact.status === Contact2DType.STAY_CONTACT) {
                //console.log('   report stay collision', key, 'current ref is:', contact.ref);
                this.emit(Contact2DType.STAY_CONTACT, contact);
            }
        });
    }

    private emit (contactType, contact: PhysicsContact) {
        const colliderA = contact.colliderA;
        const colliderB = contact.colliderB;
        if (!colliderA || !colliderB) {
            return;
        }

        const bodyA = colliderA.body;
        const bodyB = colliderB.body;
        //if rigid body doesn't exist, collider will be added to groundRigidbody automatically,
        //hence it should emit event
        if ((bodyA && !bodyA.enabledInHierarchy) || (bodyB && !bodyB.enabledInHierarchy) || (!bodyA && !bodyB)) {
            return;
        }

        //bodyA exists and enabledContactListner, or bodyA doesn't exist
        if ((bodyA && bodyA.enabledContactListener) || (!bodyA)) {
            colliderA?.emit(contactType, colliderA, colliderB, contact);
        }

        //bodyB exists and enabledContactListner, or bodyB doesn't exist
        if ((bodyB && bodyB.enabledContactListener) || (!bodyB)) {
            colliderB?.emit(contactType, colliderB, colliderA, contact);
        }

        if ((bodyA && bodyA.enabledContactListener) || (bodyB && bodyB.enabledContactListener) || !bodyA || !bodyB) {
            PhysicsSystem2D.instance.emit(contactType, colliderA, colliderB, contact);
        }

        if (contact.disabled || contact.disabledOnce) {
            contact.setEnabled(false);
            contact.disabledOnce = false;
        }
    }
}
