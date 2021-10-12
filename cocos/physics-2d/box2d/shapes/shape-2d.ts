/**
 * @packageDocumentation
 * @hidden
 */
import b2 from '@cocos/box2d';

import { IBaseShape } from '../../spec/i-physics-shape';
import { Collider2D, PhysicsSystem2D, RigidBody2D, PHYSICS_2D_PTM_RATIO } from '../../../../exports/physics-2d-framework';
import { Rect } from '../../../core';
import { b2PhysicsWorld } from '../physics-world';
import { PhysicsGroup } from '../../../physics/framework/physics-enum';

const tempFilter = new b2.Filter();

function getFilter (shape: b2Shape2D) {
    const comp = shape.collider;
    tempFilter.categoryBits = comp.group === PhysicsGroup.DEFAULT ? comp.body!.group : comp.group;
    tempFilter.maskBits = PhysicsSystem2D.instance.collisionMatrix[tempFilter.categoryBits];
    return tempFilter;
}

export class b2Shape2D implements IBaseShape {
    protected _shapes: b2.Shape[] = [];
    protected _fixtures: b2.Fixture[] = [];

    protected _collider: Collider2D | null = null;
    protected _body: b2.Body | null = null;

    private _inited = false;

    private _rect = new Rect();

    get impl () {
        return this._shapes;
    }

    get collider () {
        return this._collider!;
    }

    initialize (comp: Collider2D) {
        this._collider = comp;
    }

    onLoad () {
    }

    onEnable () {
        PhysicsSystem2D.instance._callAfterStep(this, this._init);
    }

    onDisable () {
        PhysicsSystem2D.instance._callAfterStep(this, this._destroy);
    }

    start () {

    }

    onGroupChanged () {
        const filter = getFilter(this);
        this._fixtures.forEach((f) => {
            f.SetFilterData(filter);
        });
    }

    apply () {
        if (!this._init || PhysicsSystem2D.instance.stepping) return;
        this._destroy();
        this._init();
    }

    get worldAABB (): Readonly<Rect> {
        const MAX = 10e6;

        let minX = MAX; let minY = MAX;
        let maxX = -MAX; let maxY = -MAX;

        const fixtures = this._fixtures;
        for (let i = 0; i < fixtures.length; i++) {
            const fixture = fixtures[i];

            const count = fixture.GetShape().GetChildCount();
            for (let j = 0; j < count; j++) {
                const aabb = fixture.GetAABB(j);
                if (aabb.lowerBound.x < minX) minX = aabb.lowerBound.x;
                if (aabb.lowerBound.y < minY) minY = aabb.lowerBound.y;
                if (aabb.upperBound.x > maxX) maxX = aabb.upperBound.x;
                if (aabb.upperBound.y > maxY) maxY = aabb.upperBound.y;
            }
        }

        minX *= PHYSICS_2D_PTM_RATIO;
        minY *= PHYSICS_2D_PTM_RATIO;
        maxX *= PHYSICS_2D_PTM_RATIO;
        maxY *= PHYSICS_2D_PTM_RATIO;

        const r = this._rect;
        r.x = minX;
        r.y = minY;
        r.width = maxX - minX;
        r.height = maxY - minY;

        return r;
    }

    getFixtureIndex (fixture: b2.Fixture) {
        return this._fixtures.indexOf(fixture);
    }

    _createShapes (scaleX: number, scaleY: number): b2.Shape[] {
        return [];
    }

    _init () {
        if (this._inited) return;

        const comp = this.collider;
        const body = comp.getComponent(RigidBody2D);
        if (!body) return;

        const innerBody = body.impl?.impl as b2.Body;
        if (!innerBody) return;

        const node = body.node;
        const scale = node.worldScale;

        const shapes = scale.x === 0 && scale.y === 0 ? [] : this._createShapes(scale.x, scale.y);

        const filter = getFilter(this);

        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];

            const fixDef: b2.IFixtureDef = {
                density: comp.density,
                isSensor: comp.sensor,
                friction: comp.friction,
                restitution: comp.restitution,
                shape,

                filter,
            };

            const fixture = innerBody.CreateFixture(fixDef);
            fixture.m_userData = this;

            if (body.enabledContactListener) {
                (PhysicsSystem2D.instance.physicsWorld as b2PhysicsWorld).registerContactFixture(fixture);
            }

            this._shapes.push(shape);
            this._fixtures.push(fixture);
        }

        this._body = innerBody;

        this._inited = true;
    }

    _destroy () {
        if (!this._inited) return;

        const fixtures = this._fixtures;
        const body = this._body;

        for (let i = fixtures.length - 1; i >= 0; i--) {
            const fixture = fixtures[i];
            fixture.m_userData = null;

            (PhysicsSystem2D.instance.physicsWorld as b2PhysicsWorld).unregisterContactFixture(fixture);

            if (body) {
                body.DestroyFixture(fixture);
            }
        }

        this._body = null;

        this._fixtures.length = 0;
        this._shapes.length = 0;
        this._inited = false;
    }
}
