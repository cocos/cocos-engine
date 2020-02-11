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

import { Physics3DManager } from './physics-manager';
import { PhysicsRayResult } from './physics-ray-result';
import { BoxCollider3D } from './components/collider/box-collider-component';
import { Collider3D } from './components/collider/collider-component';
import { SphereCollider3D } from './components/collider/sphere-collider-component';
import { RigidBody3D } from './components/rigid-body-component';
import { ConstantForce } from './components/constant-force';
import { PhysicsMaterial } from './assets/physics-material';

export {
    Physics3DManager,
    PhysicsRayResult,
    PhysicsMaterial,

    Collider3D,
    BoxCollider3D,
    SphereCollider3D,
    RigidBody3D,
};

cc.Physics3DManager = Physics3DManager;
cc.Collider3D = Collider3D;
cc.BoxCollider3D = BoxCollider3D;
cc.SphereCollider3D = SphereCollider3D;
cc.RigidBody3D = RigidBody3D;
cc.PhysicsRayResult = PhysicsRayResult;
cc.ConstantForce = ConstantForce;
