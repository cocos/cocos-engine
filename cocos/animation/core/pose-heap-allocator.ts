import { TEST } from 'internal:constants';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { Pose } from './pose';
import { TransformArray } from './transform-array';

const MAX_POSE_PER_PAGE = 8;

const allocationInfoTag = Symbol('PoseHeapAllocator');

type PagedPose = Pose & {
    [allocationInfoTag]: AllocationInfo;
};

function isPagedPose (pose: Pose): pose is PagedPose {
    return allocationInfoTag in pose;
}

const POSE_ALLOCATOR_DEBUG_FULL = TEST;

export class PoseHeapAllocator {
    constructor (transformCount: number, metaValueCount: number) {
        this._transformCount = transformCount;
        this._metaValueCount = metaValueCount;
    }

    public get allocatedCount (): number {
        return this._allocatedCount;
    }

    public allocatePose (): Pose {
        ++this._allocatedCount;
        const { _pages: pages } = this;
        const nPages = pages.length;

        // Debug check our promise on `this._foremostPossibleFreePage`.
        if (POSE_ALLOCATOR_DEBUG_FULL) {
            for (let iPage = 0; iPage < this._foremostPossibleFreePage; ++iPage) {
                const page = pages[iPage];
                assertIsTrue(page.freeCount === 0);
            }
        }

        for (let iPage = this._foremostPossibleFreePage; iPage < nPages; ++iPage) {
            const page = pages[iPage];
            const pose = page.tryAllocate();
            if (pose) {
                pose[allocationInfoTag].pageIndex = iPage;
                if (page.freeCount === 0) {
                    // Only step one, even the next page is not free.
                    ++this._foremostPossibleFreePage;
                }
                return pose;
            }
        }

        const pose = this._allocatePoseInNewPage();
        // Update the flag, no matter if its capacity is 1.
        this._foremostPossibleFreePage = pose[allocationInfoTag].pageIndex;
        return pose;
    }

    public destroyPose (pose: Pose): void {
        assertIsTrue(isPagedPose(pose));
        const { _pages: pages } = this;
        const nPages = pages.length;
        const pageIndex = pose[allocationInfoTag].pageIndex;
        assertIsTrue(pageIndex >= 0 && pageIndex < nPages);
        const page = pages[pageIndex];
        page.deallocate(pose);
        --this._allocatedCount;

        // If the destruction performed on former page,
        // update the flag so that next allocation find from this.
        if (pageIndex < this._foremostPossibleFreePage) {
            assertIsTrue(page.freeCount > 0);
            this._foremostPossibleFreePage = pageIndex;
        }
    }

    private _transformCount = 0;

    private _metaValueCount = 0;

    private _pages: PosePage[] = [];

    private _allocatedCount = 0;

    /**
     * Index of the page that:
     * - All former pages are busy.
     * - This page and the following pages're possible having free location to allocate.
     */
    private _foremostPossibleFreePage = 0;

    private _allocatePoseInNewPage (): PagedPose {
        const page = new PosePage(this._transformCount, this._metaValueCount, 4);
        const pageIndex = this._pages.length;
        this._pages.push(page);
        const pose = page.tryAllocate();
        assertIsTrue(pose); // Shall not fail
        pose[allocationInfoTag].pageIndex = pageIndex;
        return pose;
    }
}

class AllocationInfo {
    get pageIndex (): number {
        return this._id >> POSE_INDEX_BITS;
    }

    set pageIndex (value) {
        this._id &= POSE_INDEX_MASK;
        this._id |= (value << POSE_INDEX_BITS);
    }

    get poseIndex (): number {
        return this._id & POSE_INDEX_MASK;
    }

    set poseIndex (value) {
        this._id &= ~POSE_INDEX_MASK;
        this._id |= value;
    }

    /**
     * ((page index) << POSE_INDEX_BITS) + (pose index into page)
     */
    private _id = -1;
}

const POSE_INDEX_MASK = 0b111;
const POSE_INDEX_BITS = 3;
assertIsTrue(POSE_INDEX_MASK + 1 >= MAX_POSE_PER_PAGE);

class PosePage {
    constructor (private _transformCount: number, private _metaValueCount: number, private _capacity: number) {
        const byteLength = (TransformArray.BYTES_PER_ELEMENT * _transformCount
            + Float64Array.BYTES_PER_ELEMENT * _metaValueCount) * _capacity;
        this._buffer = new ArrayBuffer(byteLength);
        this._poses = new Array(_capacity).fill(null);
        this._freeCount = _capacity;
    }

    get capacity (): number {
        return this._capacity;
    }

    get freeCount (): number {
        return this._freeCount;
    }

    public tryAllocate (): PagedPose | null {
        const { _poses: poses, _idleFlags: idleFlags, _capacity: capacity } = this;
        const idlePoseIndex = findRightmostSetBit(idleFlags);
        if (idlePoseIndex >= capacity) {
            return null;
        }
        assertIsTrue(idlePoseIndex >= 0 && idlePoseIndex < poses.length);
        const pose = poses[idlePoseIndex] ??= this._createPose(idlePoseIndex);
        pose[allocationInfoTag].poseIndex = idlePoseIndex;
        this._idleFlags &= ~(1 << idlePoseIndex);
        assertIsTrue(this._freeCount > 0);
        --this._freeCount;
        return pose;
    }

    public deallocate (pose: PagedPose): void {
        const { _poses: poses } = this;
        const poseIndex = pose[allocationInfoTag].poseIndex;
        assertIsTrue(poseIndex >= 0 && poseIndex < poses.length);
        assertIsTrue(poses[poseIndex] === pose);
        // Set as idle
        this._idleFlags |= (1 << poseIndex);
        assertIsTrue(this._freeCount < this._capacity);
        ++this._freeCount;
    }

    private _buffer: ArrayBuffer;

    private _idleFlags = 0xF;

    private _poses: (PagedPose | null)[];

    private _freeCount = 0;

    private _createPose (index: number): PagedPose {
        const transformsByteLength = TransformArray.BYTES_PER_ELEMENT * this._transformCount;
        const baseOffset = (transformsByteLength
            + Float64Array.BYTES_PER_ELEMENT * this._metaValueCount) * index;
        const transforms = new TransformArray(this._buffer, baseOffset, this._transformCount);
        const metaValues = new Float64Array(this._buffer, baseOffset + transformsByteLength, this._metaValueCount);
        const pose = Pose._create(transforms, metaValues);
        pose[allocationInfoTag] = new AllocationInfo();
        return pose as PagedPose;
    }
}

function findRightmostSetBit (bits: number): number {
    // Math.log(2) === -Infinity
    return bits === 0 ? Infinity : Math.log2(bits & -bits);
}
