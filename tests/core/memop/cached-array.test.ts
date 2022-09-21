import { CachedArray } from "../../../cocos/core/memop";

const cachedArray = new CachedArray(10);

test('basic', () => {
    expect(cachedArray.length).toBe(0);
    expect(cachedArray.array.length).toBe(10);

    cachedArray.push(1);
    expect(cachedArray.length).toBe(1);
    cachedArray.push(2);
    expect(cachedArray.length).toBe(2);
    cachedArray.push(3);
    expect(cachedArray.length).toBe(3);
    expect(cachedArray.array.length).toBe(10);

    expect(cachedArray.pop()).toBe(3);
    expect(cachedArray.pop()).toBe(2);
    expect(cachedArray.pop()).toBe(1);
    expect(cachedArray.length).toBe(0);

    for (let i = 0; i < 20; i++) {
        cachedArray.push(i);
    }
    expect(cachedArray.length).toBe(20);
    expect(cachedArray.array.length).toBe(20);
    
    for (let i = 0; i < 20; i++) {
        expect(cachedArray.get(i)).toBe(i);
    }

    cachedArray.clear();
    expect(cachedArray.length).toBe(0);
    expect(cachedArray.array.length).toBe(20);
});

test('sort', () => {
    cachedArray.clear();
    const toBeSort = [5, 9, 2, 3, 8, 4];
    for (let i = 0; i < toBeSort.length; i++) {
        cachedArray.push(toBeSort[i]);
    }

    cachedArray.sort();

    const sorted = [2, 3, 4, 5, 8, 9];

    for (let i = 0; i < toBeSort.length; i++) {
        expect(cachedArray.get(i)).toBe(sorted[i]);
    }

});

test('shrink', () => {
    for (let i = 0; i < 100; i++) {
        cachedArray.push(i);
    }

    cachedArray.clear();
    expect(cachedArray.length).toBe(0);
    expect(cachedArray.array.length).toBeGreaterThan(100);

    cachedArray.push(1);
    cachedArray.push(2);
    cachedArray.push(3);

    expect(cachedArray.length).toBe(3);

    cachedArray.tryShrink();

    expect(cachedArray.length).toBe(3);
    expect(cachedArray.array.length < 100 && cachedArray.array.length > 50).toBeTruthy();

    // can not shrink any more
    cachedArray.tryShrink();
    cachedArray.tryShrink();
    cachedArray.tryShrink();
    cachedArray.tryShrink();

    expect(cachedArray.length).toBe(3);
    expect(cachedArray.array.length).toBeGreaterThan(10);
    expect(cachedArray.array.length).toBeLessThan(20);
});

test('destroy', () => {
    cachedArray.destroy();
    expect(cachedArray.length).toBe(0);
    expect(cachedArray.array.length).toBe(0);
});