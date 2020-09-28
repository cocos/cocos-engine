import b2 from '@cocos/box2d';
import { b2Shape2D } from "./shape-2d";
import { BoxCollider2D } from "../../framework";
import { PHYSICS_2D_PTM_RATIO } from "../../framework/physics-types";
import { IBoxShape } from '../../spec/i-physics-shape';
import { Vec2, Rect } from '../../../core';

let tempAabb = new Rect;

export class b2BoxShape extends b2Shape2D implements IBoxShape {
    _worldPoints: Vec2[] = [new Vec2, new Vec2, new Vec2, new Vec2];
    get worldPoints (): Readonly<Vec2>[] {
        let aabb = tempAabb;
        
        let collider = this.collider as BoxCollider2D;
        let size = collider.size;
        let offset = collider.offset;

        aabb.x = offset.x - size.width / 2;
        aabb.y = offset.y - size.height / 2;
        aabb.width = size.width;
        aabb.height = size.height;

        let wps = this._worldPoints;
        let wp0 = wps[0], wp1 = wps[1],
            wp2 = wps[2], wp3 = wps[3];

        aabb.transformMat4ToPoints(collider.node.worldMatrix, wp0, wp1, wp2, wp3);

        return wps;
    }

    _createShapes (scaleX: number, scaleY: number) {
        scaleX = Math.abs(scaleX);
        scaleY = Math.abs(scaleY);

        let comp = this.collider as BoxCollider2D;

        let width = comp.size.width / 2 / PHYSICS_2D_PTM_RATIO * scaleX;
        let height = comp.size.height / 2 / PHYSICS_2D_PTM_RATIO * scaleY;
        let offsetX = comp.offset.x / PHYSICS_2D_PTM_RATIO * scaleX;
        let offsetY = comp.offset.y / PHYSICS_2D_PTM_RATIO * scaleY;

        let shape = new b2.PolygonShape();
        shape.SetAsBox(width, height, new b2.Vec2(offsetX, offsetY), 0);

        return [shape];
    }
}
