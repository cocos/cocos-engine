import { director, Director } from '../core/director';
import { System } from '../core/components';
import { ArmatureDisplay } from './ArmatureDisplay';
import { legacyCC } from '../core/global-exports';

export class ArmatureSystem extends System {
    /**
     * @en
     * The ID flag of the system.
     * @zh
     * 此系统的 ID 标记。
     */
    static readonly ID = 'ARMATURE';

    /**
     * @en
     * Gets the instance of the tween system.
     * @zh
     * 获取Spine骨骼系统的实例。
     */

    public static get instance (): ArmatureSystem {
        return ArmatureSystem._instance;
    }

    public static set instance (sys:ArmatureSystem) {
        ArmatureSystem._instance = sys;
    }

    private static _instance: ArmatureSystem;

    private _armatures = new Set<ArmatureDisplay>();

    public registerArmature (armature: ArmatureDisplay | null) {
        if (!armature) return;
        if (!this._armatures.has(armature)) {
            this._armatures.add(armature);
        }
    }

    public unregisterArmature (armature: ArmatureDisplay | null) {
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

director.once(Director.EVENT_INIT, () => {
    initArmatureSystem();
});

function initArmatureSystem () {
    const oldIns = ArmatureSystem.instance;
    if (oldIns) {
        director.unregisterSystem(oldIns);
    }
    const sys = new ArmatureSystem();
    (ArmatureSystem.instance as any) = sys;
    director.registerSystem(ArmatureSystem.ID, sys, System.Priority.SCHEDULED);
}
legacyCC.internal.ArmatureSystem = ArmatureSystem;
