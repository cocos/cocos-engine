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

import { B2 } from '../instantiated';
import { Vec2 } from '../../../core';
import { ERaycast2DType } from '../../framework';

export class PhysicsRayCastCallback {// extends B2.RayCastCallback {
    static _type = ERaycast2DType.Closest;
    static _fixtures: number[] = [];//B2.Fixture ptr
    static _points: Vec2[] = [];
    static _normals: Vec2[] = [];
    static _fractions: number[] = [];

    static _mask = 0xffffffff;

    static init (type: ERaycast2DType, mask: number): void {
        PhysicsRayCastCallback._type = type;
        PhysicsRayCastCallback._mask = mask;
        PhysicsRayCastCallback._fixtures.length = 0;
        PhysicsRayCastCallback._points.length = 0;
        PhysicsRayCastCallback._normals.length = 0;
        PhysicsRayCastCallback._fractions.length = 0;
    }

    static ReportFixture (fixture: number, point: B2.Vec2, normal: B2.Vec2, fraction: number): any {
        if ((B2.FixtureGetFilterData(fixture).categoryBits & PhysicsRayCastCallback._mask) === 0) {
            return 0;
        }

        if (PhysicsRayCastCallback._type === ERaycast2DType.Closest) {
            PhysicsRayCastCallback._fixtures[0] = fixture;
            PhysicsRayCastCallback._points[0] = point as Vec2;
            PhysicsRayCastCallback._normals[0] = normal as Vec2;
            PhysicsRayCastCallback._fractions[0] = fraction;
            return fraction;
        }

        PhysicsRayCastCallback._fixtures.push(fixture);
        PhysicsRayCastCallback._points.push(new Vec2(point.x, point.y));
        PhysicsRayCastCallback._normals.push(new Vec2(normal.x, normal.y));
        PhysicsRayCastCallback._fractions.push(fraction);

        if (PhysicsRayCastCallback._type === ERaycast2DType.Any) {
            return 0;
        } else if (PhysicsRayCastCallback._type >= ERaycast2DType.All) {
            return 1;
        }

        return fraction;
    }

    static getFixtures (): number[] {
        return PhysicsRayCastCallback._fixtures;
    }

    static getPoints (): Vec2[] {
        return PhysicsRayCastCallback._points;
    }

    static getNormals (): Vec2[] {
        return PhysicsRayCastCallback._normals;
    }

    static getFractions (): number[] {
        return PhysicsRayCastCallback._fractions;
    }

    static callback = {
        ReportFixture (fixture: number, point: B2.Vec2, normal: B2.Vec2, fraction: number): any {
            return PhysicsRayCastCallback.ReportFixture(fixture, point, normal, fraction);
        },
    };
}
