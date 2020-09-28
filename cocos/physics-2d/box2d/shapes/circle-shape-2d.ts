import b2 from '@cocos/box2d';
import { b2Shape2D } from "./shape-2d";
import { CircleCollider2D } from "../../framework";
import { PHYSICS_2D_PTM_RATIO } from "../../framework/physics-types";
import { ICircleShape } from '../../spec/i-physics-shape';
import { Vec2 } from '../../../core';

export class b2CircleShape extends b2Shape2D implements ICircleShape {
    get worldRadius () {
        return (this._shapes[0] as b2.CircleShape).m_radius * PHYSICS_2D_PTM_RATIO;
    }

    _worldPosition = new Vec2;
    get worldPosition () {
        let p = (this._shapes[0] as b2.CircleShape).m_p;
        return this._worldPosition.set(p.x * PHYSICS_2D_PTM_RATIO, p.y * PHYSICS_2D_PTM_RATIO);
    }

    _createShapes (scaleX: number, scaleY: number) {
        scaleX = Math.abs(scaleX);
        scaleY = Math.abs(scaleY);

        let comp = this.collider as CircleCollider2D;

        let offsetX = comp.offset.x / PHYSICS_2D_PTM_RATIO * scaleX;
        let offsetY = comp.offset.y / PHYSICS_2D_PTM_RATIO * scaleY;

        let shape = new b2.CircleShape();
        shape.m_radius = comp.radius / PHYSICS_2D_PTM_RATIO * scaleX;
        shape.m_p.Set(offsetX, offsetY);
        
        return [shape];
    }
}
