import { CallbacksInvoker } from '../../cocos/core/event/callbacks-invoker';
import { Event } from '../../cocos/input/types';
import { Node } from '../../cocos/scene-graph/node';
import { Component } from '../../cocos/scene-graph/component';
import { CCObject } from '../../cocos/core/data/object';

test('test', function () {
    let ci = new CallbacksInvoker();

    let cb1 = jest.fn();
    let cb2 = jest.fn();
    let cb3 = jest.fn();
    ci.on('a', cb1);
    expect(ci.hasEventListener('a', function () {})).toBeFalsy();
    expect(ci.hasEventListener('a', cb1)).toBeTruthy();
    ci.on('a', cb2);
    ci.on('b', cb3);
    ci.on('nil', undefined);

    ci.emit('a');
    expect(cb1.mock.calls.length).toBe(1);
    expect(cb2.mock.calls.length).toBe(1);

    ci.emit('b');
    expect(cb3.mock.calls.length).toBe(1);

    ci.off('a', cb2);
    ci.emit('a');
    expect(cb1.mock.calls.length).toBe(2);
    expect(cb2.mock.calls.length).toBe(1);

    ci.on('a', cb2);
    expect(ci.hasEventListener('a')).toBeTruthy();
    ci.removeAll('a');
    expect(ci.hasEventListener('a')).toBeFalsy();
    ci.emit('a');
    expect(cb1.mock.calls.length).toBe(2);
    expect(cb2.mock.calls.length).toBe(1);
});

test('remove self during invoking', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn(function () {
        ci.off('eve', cb1);
    });
    let cb2 = jest.fn();

    ci.on('eve', cb1);
    ci.on('eve', cb2);
    ci.emit('eve');
    expect(cb2.mock.calls.length).toBe(1);

    ci.emit('eve');
    expect(cb1.mock.calls.length).toBe(1);
    expect(cb2.mock.calls.length).toBe(2);
});

test('remove self with target during invoking', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn(function () {
        ci.off('eve', cb1, target);
    });
    let cb2 = jest.fn();
    let target = {};

    ci.on('eve', cb1, target);
    ci.on('eve', cb2, target);
    ci.emit('eve');
    expect(cb1.mock.calls.length).toBe(1);
    expect(cb2.mock.calls.length).toBe(1);

    ci.emit('eve');
    expect(cb1.mock.calls.length).toBe(1);
    expect(cb2.mock.calls.length).toBe(2);
});

test('remove previous during invoking', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn();
    let cb2 = jest.fn(function () {
        ci.off('eve', cb1);
    });

    ci.on('eve', cb1);
    ci.on('eve', cb2);
    ci.emit('eve');

    expect(ci.hasEventListener('eve', cb1)).toBeFalsy();
    expect(ci.hasEventListener('eve', cb2)).toBeTruthy();
});

test('remove previous with target during invoking', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn();
    let cb2 = jest.fn(function () {
        ci.off('eve', cb1, target);
    });
    let target = {};

    ci.on('eve', cb1, target);
    ci.on('eve', cb2, target);
    ci.emit('eve');

    expect(ci.hasEventListener('eve', cb1, target)).toBeFalsy();
    expect(ci.hasEventListener('eve', cb2, target)).toBeTruthy();
});

test('remove last during invoking', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn();
    let cb2 = jest.fn(function () {
        ci.off('eve', cb2);
    });

    ci.on('eve', cb1);
    ci.on('eve', cb2);
    ci.emit('eve');

    expect(ci.hasEventListener('eve', cb1)).toBeTruthy();
    expect(ci.hasEventListener('eve', cb2)).toBeFalsy();
});

test('remove last with target during invoking', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn();
    let cb2 = jest.fn(function () {
        ci.off('eve', cb2, target);
    });
    let target = {};
    ci.on('eve', cb1, target);
    ci.on('eve', cb2, target);
    ci.emit('eve');

    expect(ci.hasEventListener('eve', cb1, target)).toBeTruthy();
    expect(ci.hasEventListener('eve', cb2, target)).toBeFalsy();
});

test('remove multiple callbacks during invoking', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn();
    let cb2 = jest.fn(function () {
        ci.off('eve', cb1);
        ci.off('eve', cb3, target);
    });
    let cb3 = jest.fn(function () {
        ci.off('eve', cb2, target);
    });
    let target = {};
    ci.on('eve', cb1);
    ci.on('eve', cb1, target);
    ci.on('eve', cb2, target);
    ci.on('eve', cb3);
    ci.on('eve', cb3, target);
    ci.emit('eve');

    expect(cb1.mock.calls.length).toBe(2);
    expect(cb2.mock.calls.length).toBe(1);
    expect(cb3.mock.calls.length).toBe(1);
    expect(ci.hasEventListener('eve', cb1, target)).toBeTruthy();
    expect(ci.hasEventListener('eve', cb1)).toBeFalsy();
    expect(ci.hasEventListener('eve', cb2, target)).toBeFalsy();
    expect(ci.hasEventListener('eve', cb3, target)).toBeFalsy();
});

test('remove all callbacks during invoking', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn();
    let cb2 = jest.fn(function () {
        ci.removeAll('eve');
    });
    let cb3 = jest.fn(function () {
        ci.off('eve', cb2, target);
    });
    let target = {};
    ci.on('eve', cb1);
    ci.on('eve', cb1, target);
    ci.on('eve', cb2, target);
    ci.on('eve', cb3);
    ci.on('eve', cb3, target);
    ci.emit('eve');

    expect(cb1.mock.calls.length).toBe(2);
    expect(cb2.mock.calls.length).toBe(1);
    expect(cb3.mock.calls.length).toBe(0);
    expect(ci.hasEventListener('eve')).toBeFalsy();
});

test('remove and add again during invoking (node)', function () {
    let target = new Object();
    let node = new Node();

    let cb1 = function () {
        node.off('eve', cb1, target);
        node.on('eve', cb1, target);
    };

    node.on('eve', cb1, target);
    node.dispatchEvent(new Event('eve'));

    expect(node.hasEventListener('eve', cb1, target)).toBeTruthy();
});

test('remove twice and add again during invoking (node)', function () {
   let target = new Object();
   let node = new Node();

   let cb1 = function () {
       node.off('eve', cb1, target);
       node.off('eve', cb1, target);
       node.on('eve', cb1, target);
   };

   node.on('eve', cb1, target);
   node.dispatchEvent(new Event('eve'));

   expect(node.hasEventListener('eve', cb1, target)).toBeTruthy();
});

test('remove and check has during invoking (node)', function () {
   let target = new Object();
   let node = new Node();

   let cb1 = function () {
       node.off('eve', cb1, target);
       expect(node.hasEventListener('eve', cb1, target)).toBeFalsy();
   };

   node.on('eve', cb1, target);
   node.dispatchEvent(new Event('eve'));
});

test('CallbacksInvoker support target', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn(function () {
        if (this && this.name)
            this.count++;
    });
    let cb2 = jest.fn();
    let cb3 = jest.fn();

    let target1 = {
        name: 'CallbackTarget1',
        count: 0
    };
    let target2 = {
        name: 'CallbackTarget2',
        count: 0
    };

    ci.on('a', cb1);
    ci.on('a', cb1, target1);
    ci.on('a', cb1);
    ci.on('a', cb1, target2);
    ci.on('a', cb2, target2);
    ci.on('a', cb2, target1);
    ci.on('a', cb3);
    ci.on('a', cb3, target1);
    ci.on('b', cb1, target1);

    expect(ci.hasEventListener('a', cb2)).toBeFalsy();
    expect(ci.hasEventListener('a', cb2, target1)).toBeTruthy();
    expect(ci.hasEventListener('a', cb3)).toBeTruthy();

    ci.emit('a');
    expect(cb1.mock.calls.length).toBe(3);
    expect(target1.count).toBe(1);
    expect(target2.count).toBe(1);

    expect(cb2.mock.calls.length).toBe(2);
    expect(cb3.mock.calls.length).toBe(2);

    expect(ci.hasEventListener('a', cb1.bind(target1))).toBeFalsy();

    ci.off('b', cb1);
    ci.off('b', cb1, target2);
    expect(ci.hasEventListener('b', cb1, target1)).toBeTruthy();
    ci.off('b', cb1, target1);
    expect(ci.hasEventListener('b', cb1, target1)).toBeFalsy();

    cb1.mockClear();
    target1.count = 0;
    target2.count = 0;
    cb2.mockClear();
    cb3.mockClear();
    ci.off('a', cb1, target2);
    ci.off('a', cb1, target1);
    ci.off('a', cb2, target2);
    ci.off('a', cb3, target2);
    ci.emit('a');
    expect(target1.count).toBe(0);
    expect(target2.count).toBe(0);

    expect(cb1.mock.calls.length).toBe(1);
    expect(cb2.mock.calls.length).toBe(1);
    expect(cb3.mock.calls.length).toBe(2);
});

test('CallbacksInvoker remove target', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn();
    let cb2 = jest.fn();
    let cb3 = jest.fn();

    let target1 = {
        name: 'CallbackTarget1',
        count: 0
    };
    let target2 = {
        name: 'CallbackTarget2',
        count: 0
    };

    ci.on('a', cb1);
    ci.on('a', cb1, target1);
    ci.on('a', cb1);
    ci.on('a', cb1, target2);
    ci.on('a', cb2, target2);
    ci.on('a', cb2, target1);
    ci.on('a', cb3);
    ci.on('a', cb3, target1);

    ci.emit('a');
    expect(cb1.mock.calls.length).toBe(3);
    expect(cb2.mock.calls.length).toBe(2);
    expect(cb3.mock.calls.length).toBe(2);

    ci.removeAll(target1);

    cb1.mockClear();
    cb2.mockClear();
    cb3.mockClear();

    ci.emit('a');
    expect(cb1.mock.calls.length).toBe(2);
    expect(cb2.mock.calls.length).toBe(1);
    expect(cb3.mock.calls.length).toBe(1);

    ci.removeAll(target2);

    cb1.mockClear();
    cb2.mockClear();
    cb3.mockClear();

    ci.emit('a');
    expect(cb1.mock.calls.length).toBe(1);
    expect(cb2.mock.calls.length).toBe(0);
    expect(cb3.mock.calls.length).toBe(1);
});

test('event type conflict with object prototype', function () {
    let ci = new CallbacksInvoker();
    let cb1 = jest.fn(function () {
        ci.off('toString', cb1);
    });
    let cb2 = jest.fn();

    ci.on('toString', cb1);
    ci.on('toString', cb2);
    ci.emit('toString');
    expect(cb1.mock.calls.length).toBe(1);
    expect(cb2.mock.calls.length).toBe(1);

    ci.emit('toString');
    expect(cb1.mock.calls.length).toBe(1);
    expect(cb2.mock.calls.length).toBe(2);
});

test('nest invoke', function () {
    let ci = new CallbacksInvoker();

    let actualSequence = [];
    let isParentLoop = true;

    let cb1 = function () {
        actualSequence.push(cb1);
        if (isParentLoop) {
            isParentLoop = false;
            ci.emit('visit');
        }
    };
    let cb2 = function () {
        actualSequence.push(cb2);
    };

    ci.on('visit', cb1);
    ci.on('visit', cb2);
    ci.emit('visit');

    expect(actualSequence).toEqual([cb1, cb1, cb2, cb2]);
});

test('remove during nest invoke', function () {
    let ci = new CallbacksInvoker();

    let actualSequence = [];
    let isParentLoop = true;

    let cb1 = function () {
        actualSequence.push(cb1);
        if (isParentLoop) {
            isParentLoop = false;
            ci.emit('visit');
        }
        else {
            ci.off('visit', cb1);
            expect(ci.hasEventListener('visit')).toBeFalsy();
        }
    };

    ci.on('visit', cb1);
    ci.emit('visit');

    expect(actualSequence).toEqual([cb1, cb1]);
});

test('remove many during nest invoke', function () {
    let ci = new CallbacksInvoker();

    let actualSequence = [];
    let isParentLoop = true;

    let cb1 = function () {
        actualSequence.push(cb1);
    };
    let cb2 = function () {
        actualSequence.push(cb2);
        if (isParentLoop) {
            isParentLoop = false;
            ci.emit('visit');
        }
        else {
            ci.off('visit', cb1);
            ci.off('visit', cb2);
        }
    };
    let cb3 = function () {
        actualSequence.push(cb3);
    };

    ci.on('visit', cb1);
    ci.on('visit', cb2);
    ci.on('visit', cb3);
    ci.emit('visit');

    expect(actualSequence).toEqual([cb1, cb2, cb1, cb2, cb3, cb3]);
});

test('Destroyed node should no longer be invoked as target', () => {
    let ci = new CallbacksInvoker();
    let node = new Node();
    let cb1 = jest.fn(() => {
        node.setPosition(100, 0, 0);
    });

    ci.on('test', cb1, node);
    expect(ci.hasEventListener('test', cb1, node)).toBeTruthy();

    ci.emit('test');
    expect(node.position.x).toBe(100);
    expect(cb1.mock.calls.length).toBe(1);

    node.destroy();
    expect(ci.hasEventListener('test', cb1, node)).toBeFalsy();
    ci.emit('test');
    expect(cb1.mock.calls.length).toBe(1);

    node = new Node();
    let cb2 = jest.fn(() => {
        node.destroy();
    });
    
    ci.on('test', cb2, node);
    expect(ci.hasEventListener('test', cb2, node)).toBeTruthy();

    ci.emit('test');
    expect(cb1.mock.calls.length).toBe(1);
    ci.emit('test');
    expect(cb1.mock.calls.length).toBe(1);
    expect(ci.hasEventListener('test', cb2, node)).toBeFalsy();
});

test('Destroyed component should no longer be invoked as target', () => {
    let ci = new CallbacksInvoker();
    let node = new Node();
    let comp = node.addComponent(Component);
    
    let cb1 = jest.fn(function () {
        this.node.setPosition(100, 0, 0);
    });
    ci.on('test', cb1, comp);
    expect(ci.hasEventListener('test', cb1, comp)).toBeTruthy();

    ci.emit('test');
    expect(node.position.x).toBe(100);
    expect(cb1.mock.calls.length).toBe(1);

    comp.destroy();
    expect(ci.hasEventListener('test', cb1, comp)).toBeFalsy();
    ci.emit('test');
    expect(cb1.mock.calls.length).toBe(1);

    node = new Node();
    comp = node.addComponent(Component);
    let cb2 = jest.fn(() => {
        node.destroy();
        // Force destroy node with the component
        CCObject._deferredDestroy();
    });
    
    ci.on('test', cb2, comp);
    expect(ci.hasEventListener('test', cb2, comp)).toBeTruthy();

    ci.emit('test');
    expect(cb1.mock.calls.length).toBe(1);
    ci.emit('test');
    expect(cb1.mock.calls.length).toBe(1);
});
