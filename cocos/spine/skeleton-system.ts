import { director } from '../core/director';
import { System } from '../core/components';
import { Skeleton } from './skeleton';

export class SkeletonSystem extends System {
    /**
     * @en
     * The ID flag of the system.
     * @zh
     * 此系统的 ID 标记。
     */
    static readonly ID = 'SKELETON';

    private static instance: SkeletonSystem;

    private constructor () {
        super();
    }

    /**
     * @en
     * Gets the instance of the Spine Skeleton system.
     * @zh
     * 获取 Spine 骨骼系统的单例。
     */
    public static getInstance () {
        if (!SkeletonSystem.instance) {
            SkeletonSystem.instance = new SkeletonSystem();
            director.registerSystem(SkeletonSystem.ID, SkeletonSystem.instance, System.Priority.SCHEDULER);
        }
        return SkeletonSystem.instance;
    }

    private static skeletons = new Set<Skeleton>();

    public add (skeleton: Skeleton | null) {
        if (!skeleton) return;
        if (!SkeletonSystem.skeletons.has(skeleton)) {
            SkeletonSystem.skeletons.add(skeleton);
        }
    }

    public remove (skeleton: Skeleton | null) {
        if (!skeleton) return;
        if (SkeletonSystem.skeletons.has(skeleton)) {
            SkeletonSystem.skeletons.delete(skeleton);
        }
    }

    postUpdate (dt: number) {
        if (!SkeletonSystem.skeletons) {
            return;
        }
        SkeletonSystem.skeletons.forEach((skeleton) => {
            skeleton.updateAnimation(dt);
        });
    }
}
