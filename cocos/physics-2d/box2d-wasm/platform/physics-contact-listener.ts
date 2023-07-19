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
import { B2 } from '../instantiated';
import { js, warn } from '../../../core';

export class PhysicsContactListener {// extends B2.ContactListener {
    static _contactFixtures: number[] = [];
    static _contactsShouldNotBeReported: number[] = [];

    static _BeginContact: Function | null = null;
    static _EndContact: Function | null = null;
    static _PreSolve: Function | null = null;
    static _PostSolve: Function | null = null;

    // static setBeginContact (cb): void {
    //     this._BeginContact = cb;
    // }

    // static setEndContact (cb): void {
    //     this._EndContact = cb;
    // }

    // static setPreSolve (cb): void {
    //     this._PreSolve = cb;
    // }

    // static setPostSolve (cb): void {
    //     this._PostSolve = cb;
    // }

    static BeginContact (contact: B2.Contact): void {
        if (!this._BeginContact) return;

        const fixtureA = contact.GetFixtureA() as any;
        const fixtureB = contact.GetFixtureB() as any;
        const fixtures = this._contactFixtures;

        //(contact as any)._shouldReport = false;
        this._addContactShouldNotBeReported(contact);

        if (fixtures.indexOf(fixtureA.$$.ptr) !== -1 || fixtures.indexOf(fixtureB.$$.ptr) !== -1) {
            //(contact as any)._shouldReport = true; // for quick check whether this contact should report
            this._removeContactShouldNotBeReported(contact);
            this._BeginContact(contact);
        }
    }

    static EndContact (contact: B2.Contact): void {
        if (this._EndContact && PhysicsContactListener._shouldReportContact(contact)) {
            // (contact as any)._shouldReport = false;
            this._addContactShouldNotBeReported(contact);
            this._EndContact(contact);
        }
    }

    static PreSolve (contact: B2.Contact, oldManifold: B2.Manifold): void {
        if (this._PreSolve && PhysicsContactListener._shouldReportContact(contact)) {
            this._PreSolve(contact, oldManifold);
        }
    }

    static PostSolve (contact: B2.Contact, impulse: B2.ContactImpulse): void {
        if (this._PostSolve && PhysicsContactListener._shouldReportContact(contact)) {
            this._PostSolve(contact, impulse);
        }
    }

    static registerContactFixture (fixture): void {
        this._contactFixtures.push(fixture.$$.ptr);
    }

    static unregisterContactFixture (fixture): void {
        js.array.remove(this._contactFixtures, fixture.$$.ptr);
    }

    static _addContactShouldNotBeReported (contact): void {
        this._contactsShouldNotBeReported.push(contact.$$.ptr);
    }

    static _removeContactShouldNotBeReported (contact): void {
        js.array.remove(this._contactsShouldNotBeReported, contact.$$.ptr);
    }

    static _shouldReportContact (contact): boolean {
        return this._contactsShouldNotBeReported.indexOf(contact.$$.ptr) === -1;
    }

    static callback = {
        BeginContact (contact: B2.Contact): void {
            //warn('BeginContact', contact);
            PhysicsContactListener.BeginContact(contact);
        },
        EndContact (contact: B2.Contact): void {
            //warn('EndContact', contact);
            PhysicsContactListener.EndContact(contact);
        },
        PreSolve (contact: B2.Contact, oldManifold: B2.Manifold): void {
            //warn('PreSolve', contact, oldManifold);
            PhysicsContactListener.PreSolve(contact, oldManifold);
        },
        PostSolve (contact: B2.Contact, impulse: B2.ContactImpulse): void {
            //warn('PostSolve', contact, impulse);
            PhysicsContactListener.PostSolve(contact, impulse);
        },

    }
}
