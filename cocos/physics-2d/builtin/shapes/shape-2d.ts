/**
 * @packageDocumentation
 * @hidden
 */
import { IBaseShape } from '../../spec/i-physics-shape';
import { Collider2D, PhysicsSystem2D } from '../../../../exports/physics-2d-framework';
import { Rect, Vec2 } from '../../../core';
import { BuiltinPhysicsWorld } from '../builtin-world';

export class BuiltinShape2D implements IBaseShape {
    protected _collider: Collider2D | null = null;

    protected _worldAabb = new Rect();

    protected _activated: boolean = false;

    get impl () {
        return null;
    }

    get collider () {
        return this._collider!;
    }

    apply () {

    }

    initialize (comp: Collider2D) {
        this._collider = comp;
    }

    onLoad () {
    }

    onEnable () {
        (PhysicsSystem2D.instance.physicsWorld as BuiltinPhysicsWorld).addShape(this);
        this._activated = true;
    }

    onDisable () {
        (PhysicsSystem2D.instance.physicsWorld as BuiltinPhysicsWorld).removeShape(this);
        this._activated = false;
    }

    start () {
    }

    update () {
    }

    get worldAABB (): Readonly<Rect> {
        return this._worldAabb;
    }

    containsPoint (p: Vec2) {
        if (!this.worldAABB.contains(p)) {
            return false;
        }
        return true;
    }

    intersectsRect (rect: Rect) {
        if (!this.worldAABB.intersects(rect)) {
            return false;
        }
        return true;
    }

    onGroupChanged () {
        if(!this._activated) return;
        (PhysicsSystem2D.instance.physicsWorld as BuiltinPhysicsWorld).updateShapeGroup(this);
    }
}
