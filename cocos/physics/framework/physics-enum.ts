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

import { Enum } from '../../core';

export enum ERigidBodyType {
    DYNAMIC = 1,
    STATIC = 2,
    KINEMATIC = 4,
}
Enum(ERigidBodyType);

export enum EAxisDirection {
    X_AXIS,
    Y_AXIS,
    Z_AXIS,
}
Enum(EAxisDirection);

export enum ESimplexType {
    VERTEX = 1,
    LINE = 2,
    TRIANGLE = 3,
    TETRAHEDRON = 4,
}
Enum(ESimplexType);

export enum EColliderType {
    BOX,
    SPHERE,
    CAPSULE,
    CYLINDER,
    CONE,
    MESH,
    PLANE,
    SIMPLEX,
    TERRAIN,
}
Enum(EColliderType);

export enum EConstraintType {
    POINT_TO_POINT,
    HINGE,
    CONE_TWIST
}
Enum(EConstraintType);

export enum PhysicsGroup {
    DEFAULT = 1,
}
Enum(PhysicsGroup);
