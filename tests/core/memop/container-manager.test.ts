import { ScalableContainer } from '../../../cocos/core/memop/scalable-container';
import { containerManager } from '../../../cocos/core/memop/container-manager';


class TestContainer extends ScalableContainer {
    calledTimes = 0;
    tryShrink () {
        this.calledTimes++;
    }
}

test('container', () => {
    // @ts-expect-error
    containerManager._pools.length = 0;

    const testContainer = new TestContainer();
    // @ts-expect-error
    expect(containerManager._pools.length).toBe(1);
    expect(testContainer._poolHandle).toBe(0);

    containerManager.addContainer(testContainer);
    // @ts-expect-error
    expect(containerManager._pools.length).toBe(1);
    expect(testContainer._poolHandle).toBe(0);

    const testContainer1 = new TestContainer();
    // @ts-expect-error
    expect(containerManager._pools.length).toBe(2);
    expect(testContainer1._poolHandle).toBe(1);

    testContainer.destroy();
    // @ts-expect-error
    expect(containerManager._pools.length).toBe(1);
    expect(testContainer._poolHandle).toBe(-1);
    expect(testContainer1._poolHandle).toBe(0);

    const testContainer2 = new TestContainer();
    // @ts-expect-error
    expect(containerManager._pools.length).toBe(2);
    expect(testContainer2._poolHandle).toBe(1);

    testContainer2.destroy();
    // @ts-expect-error
    expect(containerManager._pools.length).toBe(1);
    expect(testContainer2._poolHandle).toBe(-1);
    expect(testContainer1._poolHandle).toBe(0);

    testContainer1.destroy();
    // @ts-expect-error
    expect(containerManager._pools.length).toBe(0);
    expect(testContainer2._poolHandle).toBe(-1);
    expect(testContainer1._poolHandle).toBe(-1);
    expect(testContainer._poolHandle).toBe(-1);

    containerManager.removeContainer(testContainer1);
    // @ts-expect-error
    expect(containerManager._pools.length).toBe(0);
});

test('shrink', () => {
    // @ts-expect-error
    containerManager._pools.length = 0;
    const testContainer = new TestContainer();
    expect(testContainer.calledTimes).toBe(0);

    // default shrink time span is 5
    containerManager.update(6);
    expect(testContainer.calledTimes).toBe(1);

    const testContainer1 = new TestContainer();
    containerManager.update(3);
    expect(testContainer.calledTimes).toBe(1);
    expect(testContainer1.calledTimes).toBe(0);

    containerManager.update(2);
    expect(testContainer.calledTimes).toBe(2);
    expect(testContainer1.calledTimes).toBe(1);

    // set shrink time span
    containerManager.shrinkTimeSpan = 0.5;
    containerManager.update(0);
    expect(testContainer.calledTimes).toBe(3);
    expect(testContainer1.calledTimes).toBe(2);
});