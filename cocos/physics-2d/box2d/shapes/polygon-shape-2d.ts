import b2 from '@cocos/box2d';
import { b2Shape2D } from "./shape-2d";
import * as PolygonSeparator from '../../framework/utils/polygon-separator';
import { PolygonCollider2D } from "../../framework";
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { IPolygonShape } from '../../spec/i-physics-shape';
import { Vec2 } from '../../../core';

export class b2PolygonShape extends b2Shape2D implements IPolygonShape {
    _worldPoints: Vec2[] = [];
    get worldPoints (): Readonly<Vec2>[] {
        let comp = this.collider as PolygonCollider2D;
        let points = comp.points;
        let worldPoints = this._worldPoints;
        let m = comp.node.worldMatrix;
        for (let i = 0; i < points.length; i++) {
            if (!worldPoints[i]) {
                worldPoints[i] = new Vec2;
            }
            Vec2.transformMat4(worldPoints[i], points[i], m);
        }
        worldPoints.length = points.length;

        return this._worldPoints;
    }

    _createShapes (scaleX: number, scaleY: number) {
        let shapes: b2.PolygonShape[] = [];

        let comp = this.collider as PolygonCollider2D;
        let points = comp.points;

        // check if last point equal to first point
        if (points.length > 0 && points[0].equals(points[points.length - 1])) {
            points.length -= 1;
        }

        let polys = PolygonSeparator.ConvexPartition(points);
        let offset = comp.offset;

        for (let i = 0; i < polys.length; i++) {
            let poly = polys[i];

            let shape: b2.PolygonShape | null = null, vertices: b2.Vec2[] = [];
            let firstVertice: b2.Vec2 | null = null;

            for (let j = 0, l = poly.length; j < l; j++) {
                if (!shape) {
                    shape = new b2.PolygonShape();
                }
                let p = poly[j];
                let x = (p.x + offset.x) / PHYSICS_2D_PTM_RATIO * scaleX;
                let y = (p.y + offset.y) / PHYSICS_2D_PTM_RATIO * scaleY;
                let v = new b2.Vec2(x, y);
                vertices.push(v);

                if (!firstVertice) {
                    firstVertice = v;
                }

                if (vertices.length === b2.maxPolygonVertices) {
                    shape.Set(vertices, vertices.length);
                    shapes.push(shape);

                    shape = null;

                    if (j < l - 1) {
                        vertices = [firstVertice, vertices[vertices.length - 1]];
                    }
                }
            }

            if (shape) {
                shape.Set(vertices, vertices.length);
                shapes.push(shape);
            }
        }

        return shapes;
    }
}
