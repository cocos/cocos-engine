import { director, Director } from '../core/director';
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

    /**
     * @en
     * Gets the instance of the tween system.
     * @zh
     * 获取Spine骨骼系统的实例。
     */

    public static get instance (): SkeletonSystem {
        return SkeletonSystem._instance;
    }

    public static set instance (sys:SkeletonSystem) {
        SkeletonSystem._instance = sys;
    }

    private static _instance: SkeletonSystem;

    private _skeletons = new Set<Skeleton>();

    public registerSkeleton (skeleton: Skeleton | null) {
        if (!skeleton) return;
        if (!this._skeletons.has(skeleton)) {
            this._skeletons.add(skeleton);
        }
    }

    public unregisterSkeleton (skeleton: Skeleton | null) {
        if (!skeleton) return;
        if (this._skeletons.has(skeleton)) {
            this._skeletons.delete(skeleton);
        }
    }

    postUpdate (dt: number) {
        if (!this._skeletons) {
            return;
        }
        this._skeletons.forEach((skeleton) => {
            skeleton.updateAnimation(dt);
        });
    }
}

director.once(Director.EVENT_INIT, () => {
    initSkeletonSystem();
});

function initSkeletonSystem () {
    const oldIns = SkeletonSystem.instance;
    if (oldIns) {
        director.unregisterSystem(oldIns);
    }
    const sys = new SkeletonSystem();
    (SkeletonSystem.instance as any) = sys;
    director.registerSystem(SkeletonSystem.ID, sys, System.Priority.SCHEDULED);
}
