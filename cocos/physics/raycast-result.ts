/**
 * @hidden
 */

import { Component } from '../core/components/component';
import { Vec3 } from '../core/math';
import { RigidBodyBase, ShapeBase } from './api';
import { INode } from '../core/utils/interfaces';

export class RaycastResult {
    get hitPoint (): Vec3 {
        return this._hitPoint;
    }

    get distance (): number {
        return this._distance;
    }

    get collider (): Component {
        return this._collidier!;
    }

    get node (): INode {
        return this._node!;
    }

    private _hitPoint: Vec3 = new Vec3();
    private _distance: number = 0;
    private _collidier: Component | null = null;
    private _node: INode | null = null;

    public _assign (hitPoint: any, distance: number, shape: ShapeBase, body: RigidBodyBase) {
        Vec3.copy(this._hitPoint, hitPoint);
        this._distance = distance;
        this._node = body.getUserData();
        this._collidier = shape.getUserData() as Component;
    }
}
