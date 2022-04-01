import { BuiltinShape2D } from './shape-2d';
import { Vec2, Rect } from '../../../core';
import { BoxCollider2D } from '../../framework';
import Intersection2D from '../intersection-2d';

export class BuiltinBoxShape extends BuiltinShape2D {
    private _worldPoints = [new Vec2(), new Vec2(), new Vec2(), new Vec2()]
    get worldPoints (): Readonly<Vec2[]> {
        return this._worldPoints;
    }

    update () {
        const aabb = this._worldAabb;

        const collider = this.collider as BoxCollider2D;
        const size = collider.size;
        const offset = collider.offset;

        aabb.x = offset.x - size.width / 2;
        aabb.y = offset.y - size.height / 2;
        aabb.width = size.width;
        aabb.height = size.height;

        const wps = this._worldPoints;
        const wp0 = wps[0]; const wp1 = wps[1];
        const wp2 = wps[2]; const wp3 = wps[3];

        aabb.transformMat4ToPoints(collider.node.worldMatrix, wp0, wp1, wp2, wp3);

        const minx = Math.min(wp0.x, wp1.x, wp2.x, wp3.x);
        const miny = Math.min(wp0.y, wp1.y, wp2.y, wp3.y);
        const maxx = Math.max(wp0.x, wp1.x, wp2.x, wp3.x);
        const maxy = Math.max(wp0.y, wp1.y, wp2.y, wp3.y);

        aabb.x = minx;
        aabb.y = miny;
        aabb.width = maxx - minx;
        aabb.height = maxy - miny;
    }

    containsPoint (p: Vec2) {
        if (!this.worldAABB.contains(p)) {
            return false;
        }
        return Intersection2D.pointInPolygon(p, this.worldPoints);
    }
    intersectsRect (rect: Rect) {
        if (!this.worldAABB.intersects(rect)) {
            return false;
        }
        return Intersection2D.rectPolygon(rect, this.worldPoints);
    }
}
