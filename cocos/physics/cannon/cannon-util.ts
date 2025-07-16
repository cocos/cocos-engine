/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import CANNON from '@cocos/cannon';
import { getWrap } from '../utils/util';
import { IBaseShape } from '../spec/i-physics-shape';
import { PhysicsRayResult } from '../framework';
import { IRaycastOptions } from '../spec/i-physics-world';

export function toCannonRaycastOptions (out: CANNON.IRaycastOptions, options: IRaycastOptions): void {
    out.checkCollisionResponse = !options.queryTrigger;
    out.collisionFilterGroup = -1;
    out.collisionFilterMask = options.mask;
    // out.skipBackfaces = true;
}

export function fillRaycastResult (result: PhysicsRayResult, cannonResult: CANNON.RaycastResult): void {
    result._assign(
        cannonResult.hitPointWorld,
        cannonResult.distance,
        getWrap<IBaseShape>(cannonResult.shape).collider,
        cannonResult.hitNormalWorld,
    );
}

export function commitShapeUpdates (body: CANNON.Body): void {
    body.aabbNeedsUpdate = true;
    body.updateMassProperties();
    body.updateBoundingRadius();
}
