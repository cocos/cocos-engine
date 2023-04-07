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

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Vec3 } from '../../../core';
import { PhysicsSystem } from '../../framework';
import { ICapsuleCharacterController } from '../../spec/i-character-controller';
import { CapsuleCharacterController } from '../../framework/components/character-controllers/capsule-character-controller';
import { BulletCharacterController } from './bullet-character-controller';
import { BulletWorld } from '../bullet-world';
import { degreesToRadians } from '../../../core/utils/misc';
import { bt } from '../instantiated';
import { BulletCache } from '../bullet-cache';

const v3_0 = new Vec3(0, 0, 0);

export class BulletCapsuleCharacterController extends BulletCharacterController implements ICapsuleCharacterController {
    get component (): CapsuleCharacterController {
        return this._comp as CapsuleCharacterController;
    }

    onComponentSet (): void {
        this.component.node.getWorldPosition(v3_0);
        v3_0.add(this.component.center);
        const pos = BulletCache.instance.BT_V3_0;
        bt.Vec3_set(pos, v3_0.x, v3_0.y, v3_0.z);

        const upDir = new Vec3(0, 1, 0);//temp
        const up = BulletCache.instance.BT_V3_1;
        bt.Vec3_set(up, upDir.x, upDir.y, upDir.z);

        const report = bt.ControllerHitReport_new();

        const bulletWorld = (PhysicsSystem.instance.physicsWorld as BulletWorld);
        const controllerDesc = bt.CapsuleCharacterControllerDesc_new(
            degreesToRadians(this.component.slopeLimit),
            this.component.stepOffset,
            this.component.contactOffset,
            up,
            pos,
            report, //btUserControllerHitReport
            this.component.radius,
            this.component.height,
        );

        //controllerDesc.setReportCallback(PX.PxUserControllerHitReport.implement(physxWorld.callback.controllerHitReportCB));
        this._impl = bt.CapsuleCharacterController_new(bulletWorld.impl, controllerDesc, 0/*?*/);
        //if (this._impl.$$) PX.IMPL_PTR[this._impl.$$.ptr] = this;
    }

    setRadius (value: number): void {
        bt.CapsuleCharacterController_setRadius(this.impl, value);
    }

    setHeight (value: number): void {
        bt.CapsuleCharacterController_setHeight(this.impl, value);
    }
}
