
/**
 * NOTE, this a internal construction test.
 */

import { SharedStackBasedAllocatorManager } from "../../cocos/animation/core/shared-stack-based-allocator";

describe(`Pose allocator`, () => {
    describe(`Single allocator`, () => {
        test(`Allocation happen in single page`, () => {
            const monitor = createAllocationMonitor();
    
            const manager = new SharedStackBasedAllocatorManager([128]);
            const allocator = manager.createAllocator(30);
    
            // Creates the allocator does not cause allocation.
            expect(monitor.allocatedBytes).toBe(0);
    
            // Let's first work in first page only.
            // First allocation, allocate one page.
            const slice1 = allocator.push();
            expect(monitor.allocatedBytes).toBe(128);
            monitor.clear();
    
            const tailSlices: typeof slice1[] = [];
    
            // Then, we can allocate 3 slices without actual allocation.
            for (let i = 0; i < 3; ++i) {
                tailSlices.push(allocator.push());
            }
            
            const check = () => {
                // Checks if their buffers are the same one.
                expect(new Set([slice1, ...tailSlices].map(({ buffer }) => buffer)).size).toBe(1);
                // Checks if their byte offsets are different.
                expect(new Set([slice1, ...tailSlices].map(({ byteOffset }) => byteOffset)).size).toBe(tailSlices.length + 1);
                // Checks if no allocation happened.
                expect(monitor.allocatedBytes).toBe(0);
            };
    
            check();
    
            // Re-push one and recheck.
            allocator.pop();
            tailSlices.pop();
            tailSlices.push(allocator.push());
            check();
    
            // Pop two then push one and recheck.
            for (let i = 0; i < 2; ++i) {
                allocator.pop();
                tailSlices.pop();
            }
            tailSlices.push(allocator.push());
            check();
        });

        test(`Allocate new page`, () => {
            const monitor = createAllocationMonitor();
    
            const manager = new SharedStackBasedAllocatorManager([128]);
            const allocator = manager.createAllocator(30);

            const firstPageSlice = allocator.push();
            for (let i = 0; i < 3; ++i) {
                allocator.push();
            }

            // Since first page is full, new page is allocated.
            monitor.clear();
            const nextPageSlice = allocator.push();
            expect(monitor.allocatedBytes).toBe(128);
            monitor.clear();
            // Brand new buffer.
            expect(nextPageSlice.buffer).not.toBe(firstPageSlice.buffer);
            // Still: we can allocate 3 slices without actual allocation.
            for (let i = 0; i < 3; ++i) {
                allocator.push();
            }
            expect(monitor.allocatedBytes).toBe(0);
        });

        test(`Page releasing`, () => {
            const monitor = createAllocationMonitor();
    
            const manager = new SharedStackBasedAllocatorManager([128]);
            const allocator = manager.createAllocator(30);

            // Page 0
            const page0FirstSlice = allocator.push();
            for (let i = 0; i < 3; ++i) {
                void allocator.push();
            }

            // Page1
            const page1FirstSlice = allocator.push();
            for (let i = 0; i < 3; ++i) {
                void allocator.push();
            }

            // Page2
            const page2FirstSlice = allocator.push();
            void allocator.push();

            expect(monitor.allocatedBytes).toBe(128 * 3);
            monitor.clear();

            // Re-pop one, no surprise.
            allocator.pop();
            expect(allocator.push().buffer).toBe(page2FirstSlice.buffer);

            // Pop all slices in page2, and then allocate, the buffer has changed, in the same time new allocation is fired.
            allocator.pop();
            allocator.pop();
            expect(monitor.allocatedBytes).toBe(0);
            expect(allocator.push().buffer).not.toBe(page2FirstSlice.buffer);
            expect(monitor.allocatedBytes).toBe(128);
            monitor.clear();
            allocator.pop();

            // Now pop all slices in page1, same result.
            for (let i = 0; i < 4; ++i) {
                allocator.pop();
            }
            expect(monitor.allocatedBytes).toBe(0);
            expect(allocator.push().buffer).not.toBe(page1FirstSlice.buffer);
            expect(monitor.allocatedBytes).toBe(128);
            monitor.clear();
            allocator.pop();

            // Same again for page0--the first page.
            for (let i = 0; i < 4; ++i) {
                allocator.pop();
            }
            expect(monitor.allocatedBytes).toBe(0);
            expect(allocator.push().buffer).not.toBe(page0FirstSlice.buffer);
            expect(monitor.allocatedBytes).toBe(128);
            monitor.clear();
            allocator.pop();

            expect(allocator.isEmpty);

            allocator.destroy();
            expect(manager.isEmpty).toBe(true);
        });

        test(`Zero length allocator`, () => {
            const monitor = createAllocationMonitor();
            
            const manager = new SharedStackBasedAllocatorManager([128]);

            const allocator = manager.createAllocator(0);

            const slices = Array.from({ length: 256 }, () => allocator.push());

            // All slices from a 0-length allocator refers to the same buffer and same 0 byte offset.
            expect(new Set(slices.map((_) => _.buffer)).size).toBe(1);
            expect(new Set(slices.map((_) => _.byteOffset)).size).toBe(1);

            // It still allocates one page.
            expect(monitor.allocatedBytes).toBe(128);
        });
    });

    describe(`Memory sharing between allocators`, () => {
        test(`No buckets`, () => {
            const monitor = createAllocationMonitor();

            const manager = new SharedStackBasedAllocatorManager([]);
        
            const allocator1 = manager.createAllocator(10);
            const allocator2 = manager.createAllocator(10);
            expect(allocator1).not.toBe(allocator2);
            const allocator3 = manager.createAllocator(5);
            expect(allocator3).not.toBe(allocator1);
            const allocator4 = manager.createAllocator(14);
            expect(allocator4).not.toBe(allocator1);

            expect(monitor.allocatedBytes).toBe(0);
        });

        test(`One zero bucket`, () => {
            const monitor = createAllocationMonitor();

            const manager = new SharedStackBasedAllocatorManager([0]);
        
            const allocator1 = manager.createAllocator(10);
            const allocator2 = manager.createAllocator(10);
            expect(allocator1).not.toBe(allocator2);
            const allocator3 = manager.createAllocator(5);
            expect(allocator3).not.toBe(allocator1);
            const allocator4 = manager.createAllocator(14);
            expect(allocator4).not.toBe(allocator1);

            expect(monitor.allocatedBytes).toBe(0);
        });

        test(`Multiple thresholds`, () => {
            const manager = new SharedStackBasedAllocatorManager([6, 10]);
        
            const allocator1 = manager.createAllocator(2);
            const slice1 = allocator1.push();

            // Another allocator, having same page size with allocator1
            {
                const allocator2 = manager.createAllocator(2);
                expect(allocator1).not.toBe(allocator2);
                const slice2 = allocator2.push();
                expect(slice2.buffer).toBe(slice1.buffer);
            }

            // Another allocator, less than the threshold, but different than the allocator1.
            {
                const allocator3 = manager.createAllocator(4);
                expect(allocator3).not.toBe(allocator1);
                const slice3 = allocator3.push();
                expect(slice3.buffer).toBe(slice1.buffer);
            }

            // Another allocator, equal to the allocator.
            {
                const allocator3 = manager.createAllocator(6);
                expect(allocator3).not.toBe(allocator1);
                const slice3 = allocator3.push();
                expect(slice3.buffer).toBe(slice1.buffer);
            }

            // Here's an allocator with page size between thresholds.
            const allocatorWithPageSizeBetweenThresholds = manager.createAllocator(7);
            const allocatorWithPageSizeBetweenThresholds_slice1 = allocatorWithPageSizeBetweenThresholds.push();
            {
                expect(allocatorWithPageSizeBetweenThresholds).not.toBe(allocator1);
                const slice4 = allocatorWithPageSizeBetweenThresholds.push();
                expect(slice4.buffer).not.toBe(slice1.buffer);
            }

            // Another allocator with page size between thresholds.
            {
                const allocator4 = manager.createAllocator(8);
                expect(allocator4).not.toBe(allocator1);
                const slice4 = allocator4.push();
                expect(slice4.buffer).not.toBe(slice1.buffer);
                expect(slice4.buffer).toBe(allocatorWithPageSizeBetweenThresholds_slice1.buffer);
            }

            const allocatorWithPageSizeGreaterThanLargestThreshold = manager.createAllocator(17);
            const allocatorWithPageSizeGreaterThanLargestThreshold_slice1 = allocatorWithPageSizeGreaterThanLargestThreshold.push();
            {
                expect(allocatorWithPageSizeGreaterThanLargestThreshold_slice1.buffer).not.toBe(allocatorWithPageSizeBetweenThresholds_slice1.buffer);
            }

            {
                const another = manager.createAllocator(18);
                const slice = another.push();
                {
                    expect(slice.buffer).not.toBe(allocatorWithPageSizeGreaterThanLargestThreshold_slice1.buffer);
                }
            }
        });

        test(`Destroy allocator`, () => {
            const monitor = createAllocationMonitor();

            const manager = new SharedStackBasedAllocatorManager([16, 32, 64]);
            
            const allocator1 = manager.createAllocator(3);
            const allocator2 = manager.createAllocator(6);
            const allocator3 = manager.createAllocator(10);
            expect(monitor.allocatedBytes).toBe(0);

            const slice1_1 = allocator1.push();
            expect(monitor.allocatedBytes).toBe(16);
            monitor.clear();
            const slice1_2 = allocator1.push();
            const slice2 = allocator2.push();
            const slice3 = allocator3.push();
            expect(monitor.allocatedBytes).toBe(0);

            const buffer = slice1_1.buffer;

            expect([slice1_1, slice1_2, slice2, slice3].map((slice) => slice.buffer)).toStrictEqual(
                new Array(4).fill(slice1_1.buffer),
            );

            allocator1.pop();
            const slice1_1x = allocator1.push();
            expect(slice1_1x.buffer).toBe(buffer);
            expect(monitor.allocatedBytes).toBe(0);

            // Once all allocator on a threshold are destroyed, the memory should be released.
            allocator1.pop();
            allocator1.pop();
            allocator2.pop();
            allocator3.pop();
            [allocator1, allocator2, allocator3].forEach((allocator) => allocator.destroy());
            expect(monitor.allocatedBytes).toBe(0);
            expect(manager.isEmpty).toBe(true);

            expect(manager.createAllocator(4).push().buffer).not.toBe(buffer);
            expect(monitor.allocatedBytes).toBe(16);
        });
    });
});

function createAllocationMonitor() {
    let allocatedBytes = 0;

    const arrayBufferVendor = ArrayBuffer;
    globalThis.ArrayBuffer = class extends arrayBufferVendor {
        constructor(...args: ConstructorParameters<ArrayBufferConstructor>) {
            super(...args);
            const [ byteLength ] = args;
            allocatedBytes += byteLength;
        }

        [Symbol.species]() {
            return arrayBufferVendor;
        }
    }

    return {
        get allocatedBytes() {
            return allocatedBytes;
        },

        clear() {
            allocatedBytes = 0;
        },
    };
}