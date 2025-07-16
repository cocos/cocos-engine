/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

import { ILifecycle } from './i-lifecycle';
import { IGroupMask } from './i-group-mask';
import { IVec3Like } from '../../core';
import { CharacterController } from '../framework/components/character-controllers/character-controller';
//import { ERigidBodyType } from '../framework';

export interface IBaseCharacterController extends ILifecycle, IGroupMask {
    initialize (v: CharacterController): boolean;
    updateEventListener: () => void;
    onGround(): boolean;
    getPosition (out: IVec3Like): void;
    setPosition (value: IVec3Like): void;
    setStepOffset (value: number): void;
    setSlopeLimit (value: number): void;
    setContactOffset (value: number): void;
    setDetectCollisions (value: boolean): void;
    setOverlapRecovery (value: boolean): void;
    move(movement: IVec3Like, minDist: number, elapsedTime: number): void;
    syncPhysicsToScene (): void;
}

export interface ICapsuleCharacterController extends IBaseCharacterController {
    setRadius (value: number): void;
    setHeight (value: number): void;
}

export interface IBoxCharacterController extends IBaseCharacterController {
    setHalfHeight (value: number): void;
    setHalfSideExtent (value: number): void;
    setHalfForwardExtent (value: number): void;
}
