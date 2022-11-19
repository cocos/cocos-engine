import { IBaseShape } from '../../spec/i-physics-shape';
import { Collider2D, PhysicsSystem2D } from '../../../../exports/physics-2d-framework';
import { Rect, Vec2 } from '../../../core';
import { BuiltinPhysicsWorld } from '../builtin-world';
import { BuiltinContact } from '../builtin-contact';

export class BuiltinShape2D implements IBaseShape {
    protected _collider: Collider2D | null = null;

    protected _worldAabb = new Rect();
    //contacts contain this Shape
    public _contacts: BuiltinContact[] = [];

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
    }

    onDisable () {
        (PhysicsSystem2D.instance.physicsWorld as BuiltinPhysicsWorld).removeShape(this);
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
        (PhysicsSystem2D.instance.physicsWorld as BuiltinPhysicsWorld).updateShapeGroup(this);
    }
}
