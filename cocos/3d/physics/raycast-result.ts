/**
 * @hidden
 */

import { Component } from '../../components/component';
import { Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { RigidBodyBase, ShapeBase } from './api';
import { INode } from '../../core/utils/interfaces';

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

    public _assign (hitPoint: vec3, distance: number, shape: ShapeBase, body: RigidBodyBase) {
        vec3.copy(this._hitPoint, hitPoint);
        this._distance = distance;
        this._node = body.getUserData();
        this._collidier = shape.getUserData() as Component;
    }
}
