import { assertIsTrue } from '../../core/data/utils/asserts';
import { Pose } from './pose';
import { TransformArray } from './transform-array';
import { SharedStackBasedAllocator, SharedStackBasedAllocatorManager } from './shared-stack-based-allocator';

export class PoseAllocator {
    constructor (transformCount: number, metaValueCount: number) {
        this._transformCount = transformCount;
        this._metaValueCount = metaValueCount;

        const poseBytes = calculateRequiredBytes(
            transformCount,
            metaValueCount,
            1,
        );

        this._memoryAllocator = globalPosePageMemoryAllocatorManager.createAllocator(poseBytes);
    }

    public destroy () {
        assertIsTrue(this._allocatedCount === 0, `Can not destroy the allocator since it's not empty.`);

        for (let iPose = 0; iPose < this._poses.length; ++iPose) {
            this._memoryAllocator.pop();
        }

        this._poses.length = 0;

        return this._memoryAllocator.destroy();
    }

    public get allocatedCount () {
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

    public pop () {
        assertIsTrue(this.allocatedCount > 0, `PoseAllocator: push/pop does not match.`);

        --this._allocatedCount;

        // Unlock the allocator while popping last pose.
        if (this._allocatedCount === 0) {
            this._memoryAllocator.debugUnlock();
        }

        // Note: we don't actually free the pose -- only destroy() will free the pose.
        // This does not cause big problem since all pose allocators share the same stack memory.
    }

    private _poses: Pose[] = [];

    private declare readonly _transformCount: number;

    private declare readonly _metaValueCount: number;

    private _allocatedCount = 0;

    private _memoryAllocator: SharedStackBasedAllocator;

    private _allocateNewPose () {
        const slice = this._memoryAllocator.push();
        const transformsByteLength = TransformArray.BYTES_PER_ELEMENT * this._transformCount;
        const baseOffset = slice.byteOffset;
        const transforms = new TransformArray(slice.buffer, baseOffset, this._transformCount);
        const metaValues = new Float64Array(slice.buffer, baseOffset + transformsByteLength, this._metaValueCount);
        const pose = Pose._create(transforms, metaValues);
        this._poses.push(pose);
    }
}

function calculateRequiredBytes (
    transformCount: number,
    metaValueCount: number,
    capacity: number,
) {
    return (TransformArray.BYTES_PER_ELEMENT * transformCount
        + Float64Array.BYTES_PER_ELEMENT * metaValueCount) * capacity;
}

const PAGE_SIZE = calculateRequiredBytes(128, 10, 4);

const globalPosePageMemoryAllocatorManager = new SharedStackBasedAllocatorManager([
    PAGE_SIZE,
]);
