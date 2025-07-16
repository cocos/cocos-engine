import { DEBUG, TEST } from 'internal:constants';
import { assertIsTrue, binarySearchEpsilon } from '../../core';

const allocatorPageCountTag = Symbol(DEBUG ? '[[The count of pages used by this allocator.]]' : '');

const onStackPurgedTag = Symbol(DEBUG ? `[[Notify that theres is no allocator on the stack anymore.]]` : '');

class SharedMemoryPage {
    constructor (byteLength: number) {
        this.buffer = new ArrayBuffer(byteLength);
    }

    public readonly buffer: ArrayBuffer;

    public useCount = 0;
}

class PagedStack {
    constructor (private _manager: SharedStackBasedAllocatorManager, private _pageSize: number) {
    }

    get pageSize (): number {
        return this._pageSize;
    }

    get debugLocking (): boolean {
        return this._locking;
    }

    public get allocatorCount (): number {
        return this._allocatorCount;
    }

    public debugLock (): void {
        assertIsTrue(!this._locking, `The memory is locking.`);
        this._locking = true;
    }

    public debugUnlock (): void {
        assertIsTrue(this._locking, `Wrong execution logic: the memory is not locking.`);
        this._locking = false;
    }

    public getPageMemory (index: number): ArrayBuffer {
        assertIsTrue(index >= 0 && index < this._pages.length, `Page index out of range`);
        return this._pages[index].buffer;
    }

    public pushPage (allocator: SharedStackBasedAllocator): SharedMemoryPage {
        const oldAllocatorPageCount = allocator[allocatorPageCountTag];

        assertIsTrue(oldAllocatorPageCount <= this._pages.length);
        if (oldAllocatorPageCount === this._pages.length) {
            this._pushNewPage();
        }
        assertIsTrue(oldAllocatorPageCount < this._pages.length);

        const page = this._pages[oldAllocatorPageCount];
        ++page.useCount;
        ++allocator[allocatorPageCountTag];

        return page;
    }

    public popPage (allocator: SharedStackBasedAllocator): void {
        const allocatorPageCount = allocator[allocatorPageCountTag];
        assertIsTrue(allocatorPageCount > 0);
        const allocatorLastPageIndex = allocatorPageCount - 1;
        const lastPage = this._pages[allocatorLastPageIndex];
        assertIsTrue(lastPage.useCount > 0);

        --lastPage.useCount;
        --allocator[allocatorPageCountTag];

        // If the page has no users, remove it.
        if (lastPage.useCount === 0) {
            // "The page has no users" also means that it's the last page in our list.
            assertIsTrue(allocatorLastPageIndex === this._pages.length - 1);
            this._pages.pop();
        }
    }

    public createAllocator (sliceSize: number): SharedStackBasedAllocator {
        const allocator = new SharedStackBasedAllocator(this, sliceSize);
        ++this._allocatorCount;
        return allocator;
    }

    public destroyAllocator (allocator: SharedStackBasedAllocator): void {
        // Decrease use count of all pages used by the allocator.
        const allocatorPageCount = allocator[allocatorPageCountTag];
        for (let iPage = 0; iPage < allocatorPageCount; ++iPage) {
            const page = this._pages[iPage];
            assertIsTrue(page.useCount > 0);
            --page.useCount;
        }

        assertIsTrue(this._allocatorCount > 0);
        --this._allocatorCount;

        // If we no longer have allocator, notify manager for possible further cleanup.
        if (this._allocatorCount === 0) {
            this._manager[onStackPurgedTag](this);
        }
    }

    private _locking = false;

    private _pages: SharedMemoryPage[] = [];
    private _allocatorCount = 0;

    private _pushNewPage (): void {
        const newPage = new SharedMemoryPage(this._pageSize);
        this._pages.push(newPage);
    }
}

class SharedMemorySlice {
    constructor (
        public readonly buffer: ArrayBuffer,
        public readonly byteOffset: number,
    ) {
    }
}

/**
 * Dev note:
 * - `push()` do create new object(SharedMemorySlice) and do array push-back, no caching.
 * - `pop()` do array pop-back.
 */
class SharedStackBasedAllocator {
    [allocatorPageCountTag] = 0;

    constructor (
        private _resource: PagedStack,
        private _sliceSize: number,
    ) {
        const slicesPerPage = Math.floor(this._resource.pageSize / _sliceSize);
        assertIsTrue(slicesPerPage > 0);
        this._slicesPerPage = slicesPerPage;
    }

    public get isEmpty (): boolean {
        return this._slices.length === 0;
    }

    public destroy (): void {
        assertIsTrue(this._slices.length === 0, `Can not destroy the allocator since it's not empty.`);
        assertIsTrue(!this._resource.debugLocking, `Can not destroy the allocator since it's locking.`);

        this._resource.destroyAllocator(this);
    }

    public debugLock (): void {
        this._resource.debugLock();
    }

    public debugUnlock (): void {
        this._resource.debugUnlock();
    }

    public push (): SharedMemorySlice {
        const {
            _sliceSize: sliceLength,
            _slices: slices,
            _slicesPerPage: slicesPerPage,
        } = this;

        const desiredSliceIndex = slices.length;

        let newSliceIndexInPage = 0;
        let newSlicePageIndex = 0;

        // Specially handle 0 slice length.
        if (sliceLength === 0) {
            // If the slice length is 0, we ensure this allocator has and has only one page.
            // All slices use this page then.
            if (this[allocatorPageCountTag] === 0) {
                this._resource.pushPage(this);
            }
            assertIsTrue(this[allocatorPageCountTag] === 1);
        } else {
            const capacity = slicesPerPage * this[allocatorPageCountTag];
            assertIsTrue(desiredSliceIndex <= capacity);
            if (desiredSliceIndex === capacity) {
                // We need more pages.
                this._resource.pushPage(this);
                assertIsTrue(desiredSliceIndex < slicesPerPage * this[allocatorPageCountTag]);
            }

            newSliceIndexInPage = desiredSliceIndex % slicesPerPage;
            newSlicePageIndex = (desiredSliceIndex - newSliceIndexInPage) / slicesPerPage;
            assertIsTrue(this[allocatorPageCountTag] * slicesPerPage >= desiredSliceIndex);
        }

        const pageMemory = this._resource.getPageMemory(newSlicePageIndex);
        const newSlice = new SharedMemorySlice(
            pageMemory,
            sliceLength * newSliceIndexInPage,
        );
        this._slices.push(newSlice);
        return newSlice;
    }

    public pop (): void {
        const {
            _slices: slices,
            _slicesPerPage: slicesPerPage,
        } = this;

        const allocatedCount = slices.length;
        assertIsTrue(allocatedCount > 0);

        const removingSliceIndex = allocatedCount - 1;
        if (this._sliceSize === 0) {
            // If the slice length is 0, we should pop page if we're popping the last slice,
            // it's the only page in this allocator.
            assertIsTrue(this[allocatorPageCountTag] === 1);
            if (removingSliceIndex === 0) {
                this._resource.popPage(this);
            }
        } else {
            const removingSliceIndexInPage = removingSliceIndex % slicesPerPage;
            if (removingSliceIndexInPage === 0) {
                // Now that the last(beginning) slice of last page is pop-ed,
                // we pop the last page.
                this._resource.popPage(this);
            }
        }

        this._slices.pop();
    }

    private _slicesPerPage = 0;

    private _slices: SharedMemorySlice[] = [];
}

export class SharedStackBasedAllocatorManager {
    constructor (private _thresholds: number[]) {
        assertIsTrue(_thresholds.every((v, i, arr) => i === 0 || v > arr[i - 1]));
    }

    public get isEmpty (): boolean {
        return this._stacks.size === 0;
    }

    public createAllocator (pageSize: number): SharedStackBasedAllocator {
        const allocationPageSize = pageSize;

        // Select stack page size according to allocation page size and threshold.
        const stackPageSize = this._selectStackPageSize(allocationPageSize);

        // Get or create stack.
        let stack = this._stacks.get(stackPageSize);
        if (!stack) {
            stack = new PagedStack(this, stackPageSize);
            this._stacks.set(stackPageSize, stack);
        }

        // Create the allocator.
        return stack.createAllocator(allocationPageSize);
    }

    public [onStackPurgedTag] (stack: PagedStack): void {
        let stackFound = false;
        for (const [k, v] of this._stacks) {
            if (v === stack) {
                this._stacks.delete(k);
                stackFound = true;
                break;
            }
        }
        if (!stackFound) {
            assertIsTrue(false, `Given allocator is not of mime.`);
        }
    }

    private _stacks = new Map<number, PagedStack>();

    private _selectStackPageSize (allocationPageSize: number): number {
        let thresholdIndex = binarySearchEpsilon(this._thresholds, allocationPageSize);
        let stackPageSize = allocationPageSize;
        if (thresholdIndex >= 0) {
            stackPageSize = this._thresholds[thresholdIndex];
        } else {
            thresholdIndex = ~thresholdIndex;
            if (thresholdIndex === this._thresholds.length) {
                // If stack beyonds the max threshold, no shared.
            } else {
                assertIsTrue(thresholdIndex >= 0 && thresholdIndex < this._thresholds.length);
                stackPageSize = this._thresholds[thresholdIndex];
            }
        }
        return stackPageSize;
    }
}

export type { SharedStackBasedAllocator };
