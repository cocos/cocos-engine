import { assertIsTrue } from '../../core/data/utils/asserts';
import { Pose } from './pose';
import { TransformArray } from './transform-array';

const MAX_POSE_PER_PAGE = 8;

export class PoseAllocator {
    constructor (transformCount: number, metaValueCount: number) {
        this._transformCount = transformCount;
        this._metaValueCount = metaValueCount;
    }

    public allocatePose (): Pose {
        const { _pages: pages } = this;
        const nPages = pages.length;
        for (let iPage = 0; iPage < nPages; ++iPage) {
            const page = pages[iPage];
            const pose = page.tryAllocate();
            if (pose) {
                pose.pageIndex = iPage;
                return pose;
            }
        }
        return this._allocatePoseInNewPage();
    }

    public destroyPose (pose: Pose) {
        assertIsTrue(pose instanceof PagedPose);
        const { _pages: pages } = this;
        const nPages = pages.length;
        const pageIndex = pose.pageIndex;
        assertIsTrue(pageIndex >= 0 && pageIndex < nPages);
        const page = pages[pageIndex];
        page.deallocate(pose);
    }

    private _transformCount = 0;

    private _metaValueCount = 0;

    private _pages: PosePage[] = [];

    private _allocatePoseInNewPage (): PagedPose {
        const page = new PosePage(this._transformCount, this._metaValueCount, 4);
        const pageIndex = this._pages.length;
        this._pages.push(page);
        const pose = page.tryAllocate();
        assertIsTrue(pose); // Shall not fail
        pose.pageIndex = pageIndex;
        return pose;
    }
}

class PagedPose extends Pose {
    constructor (transforms: TransformArray, metaValues: Float64Array) {
        super(transforms, metaValues);
    }

    get pageIndex () {
        return this._id >> POSE_INDEX_BITS;
    }

    set pageIndex (value) {
        this._id &= POSE_INDEX_MASK;
        this._id |= (value << POSE_INDEX_BITS);
    }

    get poseIndex () {
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
    }

    get capacity () {
        return this._capacity;
    }

    public tryAllocate (): PagedPose | null {
        const { _poses: poses, _idleFlags: idleFlags, _capacity: capacity } = this;
        const idlePoseIndex = findRightmostSetBit(idleFlags);
        if (idlePoseIndex >= capacity) {
            return null;
        }
        assertIsTrue(idlePoseIndex >= 0 && idlePoseIndex < poses.length);
        const pose = poses[idlePoseIndex] ??= this._createPose(idlePoseIndex);
        pose.poseIndex = idlePoseIndex;
        this._idleFlags &= ~(1 << idlePoseIndex);
        return pose;
    }

    public deallocate (pose: PagedPose) {
        const { _poses: poses } = this;
        const poseIndex = pose.poseIndex;
        assertIsTrue(poseIndex >= 0 && poseIndex < poses.length);
        assertIsTrue(poses[poseIndex] === pose);
        // Set as idle
        this._idleFlags |= (1 << poseIndex);
    }

    private _buffer: ArrayBuffer;

    private _idleFlags = 0xF;

    private _poses: (PagedPose | null)[];

    private _createPose (index: number) {
        const transformsByteLength = TransformArray.BYTES_PER_ELEMENT * this._transformCount;
        const baseOffset = (transformsByteLength
            + Float64Array.BYTES_PER_ELEMENT * this._metaValueCount) * index;
        const transforms = new TransformArray(this._buffer, baseOffset, this._transformCount);
        const metaValues = new Float64Array(this._buffer, baseOffset + transformsByteLength, this._metaValueCount);
        return new PagedPose(transforms, metaValues);
    }
}

function findRightmostSetBit (bits: number) {
    // Math.log(2) === -Infinity
    return bits === 0 ? Infinity : Math.log2(bits & -bits);
}
