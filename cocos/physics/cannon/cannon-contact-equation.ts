/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

import { IContactEquation, ICollisionEvent } from "../framework";
import { IVec3Like, Vec3 } from "../../core";
import { CannonShape } from "./shapes/cannon-shape";

export class CannonContactEquation implements IContactEquation {

    get isBodyA (): boolean {
        const si = (this.event.selfCollider.shape as CannonShape).impl;
        const bj = this.impl!.bj;
        return si.body.id == bj.id;
    }

    impl: CANNON.ContactEquation | null = null;
    event: ICollisionEvent;

    constructor (event: ICollisionEvent) {
        this.event = event;
    }

    getLocalPointOnA (out: IVec3Like): void {
        if (this.impl) Vec3.copy(out, this.impl.rj);
    }

    getLocalPointOnB (out: IVec3Like): void {
        if (this.impl) Vec3.copy(out, this.impl.ri);
    }

    getWorldPointOnA (out: IVec3Like): void {
        if (this.impl) Vec3.add(out, this.impl.rj, this.impl.bj.position);
    }

    getWorldPointOnB (out: IVec3Like): void {
        if (this.impl) Vec3.add(out, this.impl.ri, this.impl.bi.position);
    }

    getLocalNormalOnB (out: IVec3Like): void {
        if (this.impl) Vec3.copy(out, this.impl.ni);
    }

    getWorldNormalOnB (out: IVec3Like): void {
        if (this.impl) Vec3.transformQuat(out, this.impl.ni, this.impl.bi.quaternion);
    }

}