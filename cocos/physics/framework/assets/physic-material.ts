
// @ts-check

/**
 * @category physics
 */

import { Asset } from '../../../core/assets/asset';
import { ccclass, property } from '../../../core/data/class-decorator';
import { math } from '../../../core';

/**
 * @en
 * Physical materials.
 * @zh
 * 物理材质。
 */
@ccclass('cc.PhysicMaterial')
export class PhysicMaterial extends Asset {

    /**
     * @en
     * Gets all physical material instances.
     * @zh
     * 获取所有的物理材质实例。
     */
    static allMaterials: PhysicMaterial[] = [];

    /**
     * @en
     * Friction for this material, if empty, the global default physical material is used.
     * @zh
     * 此材质的摩擦系数, 如果为空，将会使用全局默认的物理材质。
     */
    @property
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
     * Restitution for this material, if empty, the global default physical material is used.
     * @zh
     * 此材质的回弹系数, 如果为空，将会使用全局默认的物理材质。
     */
    @property
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

    @property
    private _friction = 0.1;

    @property
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