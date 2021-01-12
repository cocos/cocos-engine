import { BuiltinShape2D } from './shape-2d';
import { Vec2, Rect } from '../../../core';
import { PolygonCollider2D } from '../../framework';
import Intersection2D from '../intersection-2d';

const tempVec2 = new Vec2();

export class BuiltinPolygonShape extends BuiltinShape2D {
    private _worldPoints: Vec2[] = []
    get worldPoints (): Readonly<Vec2[]> {
        return this._worldPoints;
    }

    update () {
        const aabb = this._worldAabb;

        const collider = this.collider as PolygonCollider2D;
        const points = collider.points;
        const offset = collider.offset;
        const worldMatrix = collider.node.worldMatrix;

        const worldPoints = this._worldPoints;

        worldPoints.length = points.length;

        let minx = 1e6; let miny = 1e6; let maxx = -1e6; let maxy = -1e6;
        for (let i = 0, l = points.length; i < l; i++) {
            if (!worldPoints[i]) {
                worldPoints[i] = new Vec2();
            }

            tempVec2.x = points[i].x + offset.x;
            tempVec2.y = points[i].y + offset.y;

            Vec2.transformMat4(tempVec2, tempVec2, worldMatrix);

            const x = tempVec2.x;
            const y = tempVec2.y;

            worldPoints[i].x = x;
            worldPoints[i].y = y;

            if (x > maxx) maxx = x;
            if (x < minx) minx = x;
            if (y > maxy) maxy = y;
            if (y < miny) miny = y;
        }

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
