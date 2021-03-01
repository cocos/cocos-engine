import { BuiltinShape2D } from './shape-2d';
import { Vec2, Mat4, Rect } from '../../../core';
import { CircleCollider2D } from '../../framework';
import Intersection2D from '../intersection-2d';

const tempVec2 = new Vec2();
const tempMat4 = new Mat4();

export class BuiltinCircleShape extends BuiltinShape2D {
    private _worldPosition = new Vec2();
    get worldPosition (): Readonly<Vec2> {
        return this._worldPosition;
    }

    private _worldRadius = 0;
    get worldRadius () {
        return this._worldRadius;
    }

    update () {
        const aabb = this._worldAabb;

        const collider = this.collider as CircleCollider2D;
        const worldMatrix = collider.node.getWorldMatrix(tempMat4);

        // calculate world position
        Vec2.transformMat4(tempVec2, collider.offset, worldMatrix);

        const worldPos = this._worldPosition;
        worldPos.x = tempVec2.x;
        worldPos.y = tempVec2.y;

        // calculate world radius
        worldMatrix.m12 = worldMatrix.m13 = 0;

        tempVec2.x = collider.radius;
        tempVec2.y = 0;

        Vec2.transformMat4(tempVec2, tempVec2, worldMatrix);
        const d = this._worldRadius = tempVec2.length();

        aabb.x = worldPos.x - d;
        aabb.y = worldPos.y - d;
        aabb.width = d * 2;
        aabb.height = d * 2;
    }

    containsPoint (p: Vec2) {
        if (!this.worldAABB.contains(p)) {
            return false;
        }
        const dist = Vec2.subtract(tempVec2, p, this.worldPosition).length();
        return dist < this.worldRadius;
    }
    intersectsRect (rect: Rect) {
        if (!this.worldAABB.intersects(rect)) {
            return false;
        }
        return Intersection2D.rectCircle(rect, this.worldPosition, this.worldRadius);
    }
}
