/**
 * @packageDocumentation
 * @module physics
 */

import { Enum } from "../../core";

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
