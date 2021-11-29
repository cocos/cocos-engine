/**
 * @packageDocumentation
 * @hidden
 */
import b2 from '@cocos/box2d';
import { b2Shape2D } from './shape-2d';
import * as PolygonSeparator from '../../framework/utils/polygon-separator';
import { PolygonCollider2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { IPolygonShape } from '../../spec/i-physics-shape';
import { Vec2 } from '../../../core';

export class b2PolygonShape extends b2Shape2D implements IPolygonShape {
    _worldPoints: Vec2[] = [];
    get worldPoints (): Readonly<Vec2>[] {
        const comp = this.collider as PolygonCollider2D;
        const points = comp.points;
        const worldPoints = this._worldPoints;
        const m = comp.node.worldMatrix;
        for (let i = 0; i < points.length; i++) {
            if (!worldPoints[i]) {
                worldPoints[i] = new Vec2();
            }
            Vec2.transformMat4(worldPoints[i], points[i], m);
        }
        worldPoints.length = points.length;

        return this._worldPoints;
    }

    _createShapes (scaleX: number, scaleY: number) {
        const shapes: b2.PolygonShape[] = [];

        const comp = this.collider as PolygonCollider2D;
        const points = comp.points;

        // check if last point equal to first point
        if (points.length > 0 && points[0].equals(points[points.length - 1])) {
            points.length -= 1;
        }

        const polys = PolygonSeparator.ConvexPartition(points);
        const offset = comp.offset;

        for (let i = 0; i < polys.length; i++) {
            const poly = polys[i];

            let shape: b2.PolygonShape | null = null; let vertices: b2.Vec2[] = [];
            let firstVertice: b2.Vec2 | null = null;

            for (let j = 0, l = poly.length; j < l; j++) {
                if (!shape) {
                    shape = new b2.PolygonShape();
                }
                const p = poly[j];
                const x = (p.x + offset.x) / PHYSICS_2D_PTM_RATIO * scaleX;
                const y = (p.y + offset.y) / PHYSICS_2D_PTM_RATIO * scaleY;
                const v = new b2.Vec2(x, y);
                vertices.push(v);

                if (!firstVertice) {
                    firstVertice = v;
                }

                if (vertices.length === b2.maxPolygonVertices) {
                    // @ts-ignore
                    shape.Set(b2.pointsToVec2Array(vertices)[0], vertices.length);
                    shapes.push(shape);

                    shape = null;

                    if (j < l - 1) {
                        vertices = [firstVertice, vertices[vertices.length - 1]];
                    }
                }
            }

            if (shape) {
                // @ts-ignore
                shape.Set(b2.pointsToVec2Array(vertices)[0], vertices.length);
                shapes.push(shape);
            }
        }

        return shapes;
    }
}
