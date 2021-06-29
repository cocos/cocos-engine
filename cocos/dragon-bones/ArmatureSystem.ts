import { director } from '../core/director';
import { System } from '../core/components';
import { ArmatureDisplay } from './ArmatureDisplay';
import { legacyCC } from '../core/global-exports';
import { errorID } from '../core';

export class ArmatureSystem extends System {
    /**
     * @en
     * The ID flag of the system.
     * @zh
     * 此系统的 ID 标记。
     */
    static readonly ID = 'ARMATURE';

    private static _instance: ArmatureSystem;

    private constructor () {
        super();
    }

    /**
     * @en
     * Gets the instance of the ArmatureSystem system.
     * @zh
     * 获取 Dragonbones Armature系统的单例。
     */
    public static getInstance () {
        if (!ArmatureSystem._instance) {
            ArmatureSystem._instance = new ArmatureSystem();
            director.registerSystem(ArmatureSystem.ID, ArmatureSystem._instance, System.Priority.HIGH);
        }
        return ArmatureSystem._instance;
    }

    private _armatures = new Set<ArmatureDisplay>();

    public add (armature: ArmatureDisplay | null) {
        if (!armature) return;
        if (!this._armatures.has(armature)) {
            this._armatures.add(armature);
        }
    }

    public remove (armature: ArmatureDisplay | null) {
        if (!armature) return;
        if (this._armatures.has(armature)) {
            this._armatures.delete(armature);
        }
    }

    postUpdate (dt: number) {
        if (!this._armatures) {
            return;
        }
        this._armatures.forEach((armature) => {
            armature.updateAnimation(dt);
        });
    }
}

legacyCC.internal.ArmatureSystem = ArmatureSystem;
