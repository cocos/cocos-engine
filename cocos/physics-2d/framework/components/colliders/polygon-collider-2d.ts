

import { ccclass, property, menu } from '../../../../core/data/class-decorator';
import { Component, Vec2, Size } from '../../../../core';
import { Collider2D } from './collider-2d';
import { ECollider2DType } from '../../physics-types';
import { IPolygonShape } from '../../../spec/i-physics-shape';

@ccclass('cc.PolygonCollider2D')
@menu('Physics2D/Colliders/PolygonCollider2D')
export class PolygonCollider2D extends Collider2D {
    @property({ serializable: false, displayOrder: 0 })
    threshold = 1;

    @property
    private _points = [new Vec2(-1, -1), new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1)];

    /**
     * @en Polygon points
     * @zh 多边形顶点数组
     */
    @property({ type: Vec2 })
    get points () {
        return this._points;
    }
    set points (v) {
        this._points = v;
    }

    /**
     * @en Get world points
     * @zh 世界坐标下多边形碰撞体的点
     */
    get worldPoints (): readonly Readonly<Vec2>[] {
        if (this._shape) {
            return (this._shape as IPolygonShape).worldPoints;
        }
        return [];
    }

    readonly TYPE = ECollider2DType.POLYGON;
}
