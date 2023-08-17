import { assertIsTrue } from '../../core/data/utils/asserts';
import { Pose } from './pose';
import { TransformArray } from './transform-array';
import { SharedStackBasedAllocator, SharedStackBasedAllocatorManager } from './shared-stack-based-allocator';

export class PoseStackAllocator {
    constructor (transformCount: number, auxiliaryCurveCount: number) {
        this._transformCount = transformCount;
        this._auxiliaryCurveCount = auxiliaryCurveCount;

        const poseBytes = calculateRequiredBytes(
            transformCount,
            auxiliaryCurveCount,
            1,
        );

        this._memoryAllocator = globalPosePageMemoryAllocatorManager.createAllocator(poseBytes);
    }

    public destroy (): void {
        assertIsTrue(this._allocatedCount === 0, `Can not destroy the allocator since it's not empty.`);

        for (let iPose = 0; iPose < this._poses.length; ++iPose) {
            this._memoryAllocator.pop();
        }

        this._poses.length = 0;

        return this._memoryAllocator.destroy();
    }

    public get allocatedCount (): number {
        return this._allocatedCount;
    }

    public push (): Pose {
        // Lock the allocator when pushing first pose.
        if (this._allocatedCount === 0) {
            this._memoryAllocator.debugLock();
        }

        if (this._allocatedCount === this._poses.length) {
            this._allocateNewPose();
            assertIsTrue(this._allocatedCount < this._poses.length);
        }

        const pose = this._poses[this._allocatedCount];

        ++this._allocatedCount;

        return pose;
    }

    public pop (): void {
        assertIsTrue(this._allocatedCount > 0, `PoseStackAllocator: push/pop does not match.`);

        --this._allocatedCount;

        // Unlock the allocator while popping last pose.
        if (this._allocatedCount === 0) {
            this._memoryAllocator.debugUnlock();
        }

        // Note: we don't actually free the pose -- only destroy() will free the pose.
        // This does not cause big problem since all pose allocators share the same stack memory.
    }

    get top (): Pose {
        assertIsTrue(this._allocatedCount > 0);
        return this._poses[this._allocatedCount - 1];
    }

    private _poses: Pose[] = [];

    private declare readonly _transformCount: number;

    private declare readonly _auxiliaryCurveCount: number;

    private _allocatedCount = 0;

    private _memoryAllocator: SharedStackBasedAllocator;

    private _allocateNewPose (): void {
        const slice = this._memoryAllocator.push();
        const transformsByteLength = TransformArray.BYTES_PER_ELEMENT * this._transformCount;
        const baseOffset = slice.byteOffset;
        const transforms = new TransformArray(slice.buffer, baseOffset, this._transformCount);
        const auxiliaryCurves = new Float64Array(slice.buffer, baseOffset + transformsByteLength, this._auxiliaryCurveCount);
        const pose = Pose._create(transforms, auxiliaryCurves);
        this._poses.push(pose);
    }
}

function calculateRequiredBytes (
    transformCount: number,
    auxiliaryCurveCount: number,
    capacity: number,
): number {
    return (TransformArray.BYTES_PER_ELEMENT * transformCount
        + Float64Array.BYTES_PER_ELEMENT * auxiliaryCurveCount) * capacity;
}

const PAGE_SIZE = calculateRequiredBytes(128, 10, 4);

const globalPosePageMemoryAllocatorManager = new SharedStackBasedAllocatorManager([
    PAGE_SIZE,
]);
