import { IVec3Like } from '../../core/math/type-define';
import { Rect, Vec2 } from '../../core';
import { ILifecycle } from '../../physics/spec/i-lifecycle';
import { Collider2D, RigidBody2D } from '../../../exports/physics-2d-framework';

export interface IBaseShape extends ILifecycle {
    readonly impl: any;
    readonly collider: Collider2D;
    readonly worldAABB: Readonly<Rect>;

    // readonly attachedRigidBody: RigidBody2D | null;
    initialize (v: Collider2D): void;
    apply (): void;
    onGroupChanged (): void;
}

export interface IBoxShape extends IBaseShape {
    worldPoints: readonly Readonly<Vec2>[];
}

export interface ICircleShape extends IBaseShape {
    worldPosition: Readonly<Vec2>;
    worldRadius: number;
}

export interface IPolygonShape extends IBaseShape {
    worldPoints: readonly Readonly<Vec2>[];
}
