
// @ts-check

/**
 * @category physics
 */

import { Asset } from '../../../core/assets/asset';
import { ccclass, editable, serializable } from 'cc.decorator';
import { math } from '../../../core';

/**
 * @en
 * Physics materials.
 * @zh
 * 物理材质。
 */
@ccclass('cc.PhysicMaterial')
export class PhysicMaterial extends Asset {

    /**
     * @en
     * Gets all physics material instances.
     * @zh
     * 获取所有的物理材质实例。
     */
    static allMaterials: PhysicMaterial[] = [];

    /**
     * @en
     * Friction for this material.
     * @zh
     * 此材质的摩擦系数。
     */
    @editable
    get friction () {
        return this._friction;
    }

    set friction (value) {
        if (!math.equals(this._friction, value)) {
            this._friction = value;
            this.emit('physics_material_update');
        }
    }

    /**
     * @en
     * Rolling friction for this material.
     * @zh
     * 此材质的滚动摩擦系数。
     */
    @editable
    get rollingFriction () {
        return this._rollingFriction;
    }

    set rollingFriction (value) {
        if (!math.equals(this._rollingFriction, value)) {
            this._rollingFriction = value;
            this.emit('physics_material_update');
        }
    }

    /**
     * @en
     * Spinning friction for this material.
     * @zh
     * 此材质的自旋摩擦系数。
     */
    @editable
    get spinningFriction () {
        return this._spinningFriction;
    }

    set spinningFriction (value) {
        if (!math.equals(this._spinningFriction, value)) {
            this._spinningFriction = value;
            this.emit('physics_material_update');
        }
    }

    /**
     * @en
     * Restitution for this material.
     * @zh
     * 此材质的回弹系数。
     */
    @editable
    get restitution () {
        return this._restitution;
    }

    set restitution (value) {
        if (!math.equals(this._restitution, value)) {
            this._restitution = value;
            this.emit('physics_material_update');
        }
    }

    private static _idCounter: number = 0;

    @serializable
    private _friction = 0.5;

    @serializable
    private _rollingFriction = 0.1;

    @serializable
    private _spinningFriction = 0.1;

    @serializable
    private _restitution = 0.1;

    constructor () {
        super();
        PhysicMaterial.allMaterials.push(this);
        if (this._uuid == '') {
            this._uuid = 'pm_' + PhysicMaterial._idCounter++;
        }
    }

    /**
     * @en
     * clone.
     * @zh
     * 克隆。
     */
    public clone () {
        let c = new PhysicMaterial();
        c._friction = this._friction;
        c._restitution = this._restitution;
        c._rollingFriction = this._rollingFriction;
        c._spinningFriction = this._spinningFriction;
        return c;
    }

    /**
     * @en
     * destroy.
     * @zh
     * 销毁。
     * @return 是否成功
     */
    public destroy (): boolean {
        if (super.destroy()) {
            let idx = PhysicMaterial.allMaterials.indexOf(this);
            if (idx >= 0) {
                PhysicMaterial.allMaterials.splice(idx, 1);
            }
            return true;
        } else {
            return false;
        }
    }

}