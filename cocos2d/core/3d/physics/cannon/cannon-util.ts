/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import CANNON from '../../../../../external/cannon/cannon';
import { getWrap } from '../framework/util';
import { IBaseShape } from '../spec/i-physics-shape';
import { PhysicsRayResult } from '../framework';
import { IRaycastOptions } from '../spec/i-physics-world';

const Vec3 = cc.Vec3;

export function groupIndexToBitMask (groupIndex: number, out: { collisionFilterGroup: number; collisionFilterMask: number; }) {
    let categoryBits = 1 << groupIndex;
    let maskBits = 0;
    let bits = cc.game.collisionMatrix[groupIndex];
    if (!bits) {
        cc.error("cannon-utils: group is not exist", groupIndex);
        return;
    }
    for (let i = 0; i < bits.length; i++) {
        if (!bits[i]) continue;
        maskBits |= 1 << i;
    }
    out.collisionFilterGroup = categoryBits;
    out.collisionFilterMask = maskBits;
}

export function toCannonRaycastOptions (out: CANNON.IRaycastOptions, options: IRaycastOptions) {
    out.checkCollisionResponse = !options.queryTrigger;
    groupIndexToBitMask(options.groupIndex, out);
    out.skipBackFaces = false;
}

export function fillRaycastResult (result: PhysicsRayResult, cannonResult: CANNON.RaycastResult) {
    result._assign(
        Vec3.copy(new Vec3(), cannonResult.hitPointWorld),
        cannonResult.distance,
        getWrap<IBaseShape>(cannonResult.shape).collider
    );
}

export function commitShapeUpdates (body: CANNON.Body) {
    body.aabbNeedsUpdate = true;
    body.updateMassProperties();
    body.updateBoundingRadius();
}

export const deprecatedEventMap = {
    'onCollisionEnter': 'collision-enter',
    'onCollisionStay': 'collision-stay',
    'onCollisionExit': 'collision-exit',
    'onTriggerEnter': 'trigger-enter',
    'onTriggerStay': 'trigger-stay',
    'onTriggerExit': 'trigger-exit',
};
