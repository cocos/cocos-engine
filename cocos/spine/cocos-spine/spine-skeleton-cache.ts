import { SpineSkeletonMesh } from './spine-skeleton-imply-wasm';
import { SkeletonData } from '../skeleton-data';

export class SpineAnimationCache {
    public frames: SpineSkeletonMesh[] = [];
    public totalTime = 0;
    public totalFrames = 0;
    public isCompleted = false;

    public checkCompleted () {
        let result = true;
        for (let i = 0; i < this.totalFrames; i++) {
            if (!this.frames[i]) {
                result = false;
                break;
            }
        }
        this.isCompleted = result;
        return result;
    }
}

export class SpineSkeletonCache {
    public static sharedCache = new SpineSkeletonCache();
    protected _animationPool: { [key: string]: SpineAnimationCache };
    constructor () {
        this._animationPool = {};
    }

    queryAnimationCache (data: SkeletonData, skin: string, animationName: string): SpineAnimationCache {
        const uuid = data.uuid;
        const poolKey = `${uuid}#${animationName}#${skin}`;
        let animationCache = this._animationPool[poolKey];
        if (animationCache) {
            return animationCache;
        }
        const sd = data.getRuntimeData()!;
        const animations = sd.animations;
        const length = animations.length;
        let isFind = false;
        for (let i = 0; i < length; i++) {
            if (animations[i].name === animationName) {
                isFind = true;
                animationCache = new SpineAnimationCache();
                animationCache.totalTime = animations[i].duration;
                animationCache.totalFrames = Math.floor(animations[i].duration * 60);
                break;
            }
        }
        if (!isFind) animationCache = null!;
        this._animationPool[poolKey] = animationCache;
        return animationCache;
    }
}
