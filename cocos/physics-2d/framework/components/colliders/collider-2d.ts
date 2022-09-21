

import { EDITOR } from 'internal:constants';

import { editable } from 'cc.decorator';
import { ccclass, property, type } from '../../../../core/data/class-decorator';
import { Component, Vec2, Rect } from '../../../../core';
import { PhysicsGroup } from '../../../../physics/framework/physics-enum';
import { Eventify } from '../../../../core/event';

import { RigidBody2D } from '../rigid-body-2d';
import { createShape } from '../../instance';
import { ECollider2DType } from '../../physics-types';
import { IBaseShape } from '../../../spec/i-physics-shape';
import { legacyCC } from '../../../../core/global-exports';

@ccclass('cc.Collider2D')
export class Collider2D extends Eventify(Component) {
    @editable
    editing = false;
    /**
     * @en Tag. If a node has several collider components, you can judge which type of collider is collided according to the tag.
     * @zh 标签。当一个节点上有多个碰撞组件时，在发生碰撞后，可以使用此标签来判断是节点上的哪个碰撞组件被碰撞了。
     */
    @property
    tag = 0;

    /**
     * @en
     * Gets or sets the group of the rigid body.
     * @zh
     * 获取或设置分组。
     */
    @type(PhysicsGroup)
    public get group (): number {
        return this._group;
    }
    public set group (v: number) {
        this._group = v;
        if (this._shape && this._shape.onGroupChanged) {
            this._shape.onGroupChanged();
        }
    }

    /**
     * @en The density.
     * @zh 密度
     */
    @property
    get density () {
        return this._density;
    }
    set density (v) {
        this._density = v;
    }

    /**
     * @en
     * A sensor collider collects contact information but never generates a collision response
     * @zh
     * 一个传感器类型的碰撞体会产生碰撞回调，但是不会发生物理碰撞效果。
     */
    @property
    get sensor () {
        return this._sensor;
    }
    set sensor (v) {
        this._sensor = v;
    }

    /**
     * @en
     * The friction coefficient, usually in the range [0,1].
     * @zh
     * 摩擦系数，取值一般在 [0, 1] 之间
     */
    @property
    get friction () {
        return this._friction;
    }
    set friction (v) {
        this._friction = v;
    }

    /**
     * @en
     * The restitution (elasticity) usually in the range [0,1].
     * @zh
     * 弹性系数，取值一般在 [0, 1]之间
     */
    @property
    get restitution () {
        return this._restitution;
    }
    set restitution (v) {
        this._restitution = v;
    }
    /**
     * @en Position offset
     * @zh 位置偏移量
     */
    @property
    get offset () {
        return this._offset;
    }
    set offset (v) {
        this._offset = v;
    }

    /**
     * @en
     * Physics collider will find the rigidbody component on the node and set to this property.
     * @zh
     * 碰撞体会在初始化时查找节点上是否存在刚体，如果查找成功则赋值到这个属性上。
     */
    get body () {
        return this._body;
    }

    get impl () {
        return this._shape;
    }

    readonly TYPE: ECollider2DType = ECollider2DType.None;

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!EDITOR || legacyCC.GAME_VIEW) {
            this._shape = createShape(this.TYPE);
            this._shape.initialize(this);

            if (this._shape.onLoad) {
                this._shape.onLoad();
            }

            this._body = this.getComponent(RigidBody2D);
        }
    }

    protected onEnable () {
        if (this._shape) {
            this._shape.onEnable!();
        }
    }

    protected onDisable () {
        if (this._shape && this._shape.onDisable) {
            this._shape.onDisable();
        }
    }

    protected onDestroy () {
        if (this._shape && this._shape.onDestroy) {
            this._shape.onDestroy();
        }
    }

    /**
     * @en
     * If the physics engine is box2d, need to call this function to apply current changes to collider, this will regenerate inner box2d fixtures.
     * @zh
     * 如果物理引擎是 box2d, 需要调用此函数来应用当前 collider 中的修改，调用此函数会重新生成 box2d 的夹具。
     */
    apply () {
        if (this._shape && this._shape.apply) {
            this._shape.apply();
        }
    }

    /**
     * @en
     * Get the world aabb of the collider
     * @zh
     * 获取碰撞体的世界坐标系下的包围盒
     */
    get worldAABB (): Readonly<Rect> {
        if (this._shape) {
            return this._shape.worldAABB;
        }

        return new Rect();
    }

    // protected properties

    protected _shape: IBaseShape | null = null;
    protected _body: RigidBody2D | null = null;

    @property
    protected _group = PhysicsGroup.DEFAULT;
    @property
    protected _density = 1.0;
    @property
    protected _sensor = false;
    @property
    protected _friction = 0.2;
    @property
    protected _restitution = 0;
    @property
    protected _offset = new Vec2();
}
