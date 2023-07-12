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
import { js } from '../../../core';

export class PhysicsContactListener extends b2.ContactListener {
    _contactFixtures: b2.Fixture[] = [];

    _BeginContact: Function | null = null;
    _EndContact: Function | null = null;
    _PreSolve: Function | null = null;
    _PostSolve: Function | null = null;

    setBeginContact (cb) {
        this._BeginContact = cb;
    }

    setEndContact (cb) {
        this._EndContact = cb;
    }

    setPreSolve (cb) {
        this._PreSolve = cb;
    }

    setPostSolve (cb) {
        this._PostSolve = cb;
    }

    BeginContact (contact: b2.Contact) {
        if (!this._BeginContact) return;

        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        const fixtures = this._contactFixtures;

        (contact as any)._shouldReport = false;

        if (fixtures.indexOf(fixtureA) !== -1 || fixtures.indexOf(fixtureB) !== -1) {
            (contact as any)._shouldReport = true; // for quick check whether this contact should report
            this._BeginContact(contact);
        }
    }

    EndContact (contact: b2.Contact) {
        if (this._EndContact && (contact as any)._shouldReport) {
            (contact as any)._shouldReport = false;
            this._EndContact(contact);
        }
    }

    PreSolve (contact: b2.Contact, oldManifold: b2.Manifold) {
        if (this._PreSolve && (contact as any)._shouldReport) {
            this._PreSolve(contact, oldManifold);
        }
    }

    PostSolve (contact: b2.Contact, impulse: b2.ContactImpulse) {
        if (this._PostSolve && (contact as any)._shouldReport) {
            this._PostSolve(contact, impulse);
        }
    }

    registerContactFixture (fixture) {
        this._contactFixtures.push(fixture);
    }

    unregisterContactFixture (fixture) {
        js.array.remove(this._contactFixtures, fixture);
    }
}
