import { director } from '../core/director';
import { System } from '../core/components';
import { Skeleton } from './skeleton';
import { errorID } from '../core';

export class SkeletonSystem extends System {
    /**
     * @en
     * The ID flag of the system.
     * @zh
     * 此系统的 ID 标记。
     */
    static readonly ID = 'SKELETON';

    private static _instance: SkeletonSystem;

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
        if (!SkeletonSystem._instance) {
            SkeletonSystem._instance = new SkeletonSystem();
            director.registerSystem(SkeletonSystem.ID, SkeletonSystem._instance, System.Priority.HIGH);
        }
        return SkeletonSystem._instance;
    }

    private _skeletons = new Set<Skeleton>();

    public add (skeleton: Skeleton | null) {
        if (!skeleton) return;
        if (!this._skeletons.has(skeleton)) {
            this._skeletons.add(skeleton);
        }
    }

    public remove (skeleton: Skeleton | null) {
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
