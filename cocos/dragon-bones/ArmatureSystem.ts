import { director } from '../core/director';
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

    private static instance: ArmatureSystem;

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
        if (!ArmatureSystem.instance) {
            ArmatureSystem.instance = new ArmatureSystem();
            director.registerSystem(ArmatureSystem.ID, ArmatureSystem.instance, System.Priority.SCHEDULER);
        }
        return ArmatureSystem.instance;
    }

    private static armatures = new Set<ArmatureDisplay>();

    public add (armature: ArmatureDisplay | null) {
        if (!armature) return;
        if (!ArmatureSystem.armatures.has(armature)) {
            ArmatureSystem.armatures.add(armature);
        }
    }

    public remove (armature: ArmatureDisplay | null) {
        if (!armature) return;
        if (ArmatureSystem.armatures.has(armature)) {
            ArmatureSystem.armatures.delete(armature);
        }
    }

    postUpdate (dt: number) {
        if (!ArmatureSystem.armatures) {
            return;
        }
        ArmatureSystem.armatures.forEach((armature) => {
            armature.updateAnimation(dt);
        });
    }
}

legacyCC.internal.ArmatureSystem = ArmatureSystem;
