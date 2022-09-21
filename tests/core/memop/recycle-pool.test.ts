import { RecyclePool } from '../../../cocos/core/memop/recycle-pool';

let calledTimes = 0;
let id = 0;

class Test {
    id = 0;
    destroyed = false;
    constructor () {
        this.id = id++;
    }
}

function destroy (obj: Test) {
    calledTimes++;
    obj.destroyed = true;
}

const recyclePool = new RecyclePool(() => new Test(), 20, destroy);

test('basic', () => {
    expect(recyclePool.length).toBe(0);
    expect(recyclePool.data.length).toBe(20);

    for (let i = 0; i < 25; i++) {
        const item = recyclePool.add();
        expect(item.id).toBe(i);
    }

    expect(recyclePool.length).toBe(25);
    expect(recyclePool.data.length).toBe(40);

    for (let i = 0; i < 25; i++) {
        recyclePool.removeAt(0);
    }

    expect(recyclePool.length).toBe(0);
    expect(recyclePool.data.length).toBe(40);

    recyclePool.resize(60);

    expect(recyclePool.length).toBe(0);
    expect(recyclePool.data.length).toBe(60);
    expect(calledTimes).toBe(0);
});

test('shrink', () => {
    recyclePool.tryShrink();

    expect(recyclePool.length).toBe(0);
    expect(recyclePool.data.length).toBe(30);
    expect(calledTimes).toBe(30);

    // can not shrink any more
    recyclePool.tryShrink();

    expect(recyclePool.data.length).toBe(20);
    expect(calledTimes).toBe(40);

    for (let i = 0; i < 40; i++) {
        const item = recyclePool.add();
        expect(item.destroyed).toBeFalsy();
    }

    for (let i = 0; i < 40; i++) {
        recyclePool.removeAt(0);
    }

});

test('destroy', () => {
    calledTimes = 0;
    recyclePool.destroy();
    expect(calledTimes).toBe(40);
    expect(recyclePool.data.length).toBe(0);
});