import { Vec2 } from '../../cocos/core';
import { VFXEmitter } from '../../cocos/vfx/vfx-emitter';
import { VFXExecutionStage } from '../../cocos/vfx/vfx-module';
import { DelayMode, LoopMode } from '../../cocos/vfx/enum';
describe('VFXEmitter', () => {
    test('Parameters Validation', () => {
        const particleEmitter = new VFXEmitter();
        expect(particleEmitter.duration).toBe(5);
        particleEmitter.duration = -1;
        expect(particleEmitter.duration).toBe(0.01);
        expect(particleEmitter.loopCount).toBe(1);
        particleEmitter.loopCount = 0;
        expect(particleEmitter.loopCount).toBe(1);
        particleEmitter.loopCount = 2.2;
        expect(particleEmitter.loopCount).toBe(2);
        expect(particleEmitter.delayRange).toStrictEqual(new Vec2());
        particleEmitter.delayRange = new Vec2(-1, -0.2);
        expect(particleEmitter.delayRange).toStrictEqual(new Vec2(0, 0));
        expect(particleEmitter.prewarmTime).toStrictEqual(5);
        particleEmitter.prewarmTime = -1;
        expect(particleEmitter.prewarmTime).toStrictEqual(0.001);
        expect(particleEmitter.prewarmTimeStep).toStrictEqual(0.03);
        particleEmitter.prewarmTimeStep = -1;
        expect(particleEmitter.prewarmTimeStep).toStrictEqual(0.001);
        expect(particleEmitter.simulationSpeed).toStrictEqual(1);
        particleEmitter.simulationSpeed = -1;
        expect(particleEmitter.simulationSpeed).toStrictEqual(0.001);
        expect(particleEmitter.maxDeltaTime).toStrictEqual(0.05);
        expect(particleEmitter.capacity).toBe(100);
        particleEmitter.capacity = -1;
        expect(particleEmitter.capacity).toBe(0);
        particleEmitter.capacity = 123.2;
        expect(particleEmitter.capacity).toBe(123);
        expect(particleEmitter.randomSeed).toBe(0);
        particleEmitter.randomSeed = -1;
        expect(particleEmitter.randomSeed).toBe(-1 >>> 0);
        particleEmitter.randomSeed = 23121.2213;
        expect(particleEmitter.randomSeed).toBe(23121);
    });

    test('Event Handler', () => {
        const particleEmitter = new VFXEmitter();
        expect(particleEmitter.eventHandlers.length).toBe(0);
        expect(particleEmitter.eventHandlerCount).toBe(0);
        expect(() => particleEmitter.getEventHandlerAt(0)).toThrowError();
        const eventHandler = particleEmitter.addEventHandler();
        expect(eventHandler.execStage).toBe(VFXExecutionStage.EVENT_HANDLER);
        expect(eventHandler.modules.length).toBe(0);
        expect(particleEmitter.eventHandlers.length).toBe(1);
        expect(particleEmitter.eventHandlerCount).toBe(1);
        expect(particleEmitter.eventHandlers[0]).toBe(eventHandler);
        expect(particleEmitter.getEventHandlerAt(0)).toBe(eventHandler);
        expect(() => particleEmitter.getEventHandlerAt(1)).toThrowError();
        particleEmitter.removeEventHandlerAt(0);
        expect(particleEmitter.eventHandlers.length).toBe(0);
        expect(particleEmitter.eventHandlerCount).toBe(0); 
        expect(() => particleEmitter.getEventHandlerAt(0)).toThrowError();
        const eventHandler2 = particleEmitter.addEventHandler();
        const eventHandler3 = particleEmitter.addEventHandler();
        expect(eventHandler2.execStage).toBe(VFXExecutionStage.EVENT_HANDLER);
        expect(eventHandler2.modules.length).toBe(0);
        expect(eventHandler3.execStage).toBe(VFXExecutionStage.EVENT_HANDLER);
        expect(eventHandler3.modules.length).toBe(0);
        expect(particleEmitter.eventHandlers.length).toBe(2);
        expect(particleEmitter.eventHandlerCount).toBe(2);
        expect(particleEmitter.eventHandlers[0]).toBe(eventHandler2);
        expect(particleEmitter.eventHandlers[1]).toBe(eventHandler3);
        expect(particleEmitter.getEventHandlerAt(0)).toBe(eventHandler2);
        expect(particleEmitter.getEventHandlerAt(1)).toBe(eventHandler3);
        expect(() => particleEmitter.getEventHandlerAt(2)).toThrowError();
        particleEmitter.removeEventHandlerAt(1);
        expect(particleEmitter.eventHandlers.length).toBe(1);
        expect(particleEmitter.eventHandlerCount).toBe(1);
        expect(particleEmitter.eventHandlers[0]).toBe(eventHandler2);
        expect(particleEmitter.getEventHandlerAt(0)).toBe(eventHandler2);
        expect(() => particleEmitter.getEventHandlerAt(1)).toThrowError();
        const eventHandler4 = particleEmitter.addEventHandler();
        expect(eventHandler4.execStage).toBe(VFXExecutionStage.EVENT_HANDLER);
        expect(eventHandler4.modules.length).toBe(0);
        expect(particleEmitter.eventHandlers.length).toBe(2);
        expect(particleEmitter.eventHandlerCount).toBe(2);
        expect(particleEmitter.eventHandlers[0]).toBe(eventHandler2);
        expect(particleEmitter.eventHandlers[1]).toBe(eventHandler4);
        expect(particleEmitter.getEventHandlerAt(0)).toBe(eventHandler2);
        expect(particleEmitter.getEventHandlerAt(1)).toBe(eventHandler4);
        expect(() => particleEmitter.getEventHandlerAt(2)).toThrowError();
        particleEmitter.removeEventHandlerAt(0);
        expect(particleEmitter.eventHandlers.length).toBe(1);
        expect(particleEmitter.eventHandlerCount).toBe(1);
        expect(particleEmitter.eventHandlers[0]).toBe(eventHandler4);
        expect(particleEmitter.getEventHandlerAt(0)).toBe(eventHandler4);
    });

    test('Stage', () => {
        const particleEmitter = new VFXEmitter();
        expect(particleEmitter.spawnStage.modules.length).toBe(0);
        expect(particleEmitter.updateStage.modules.length).toBe(0);
        expect(particleEmitter.emitterStage.modules.length).toBe(0);
        expect(particleEmitter.updateStage.execStage).toBe(VFXExecutionStage.UPDATE);
        expect(particleEmitter.emitterStage.execStage).toBe(VFXExecutionStage.EMITTER);
        expect(particleEmitter.spawnStage.execStage).toBe(VFXExecutionStage.SPAWN);
    });
    
});

describe('update Emitter Time', () => {
    const emitter = new VFXEmitter();
    test('Edge case', () => {
        expect(() => emitter.updateEmitterTime(1, 0, DelayMode.NONE, 0, LoopMode.ONCE, 1, 0.5)).toThrowError();
    });

    test('No delay, Infinite Loop', () => {
        testEmitterTime(emitter, [5, 4, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [4, 5, 5 / 7, 4 / 7, 1, 0]);
        testEmitterTime(emitter, [7.25, 6.8, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 1]);
        testEmitterTime(emitter, [7.25, 7.25, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [0.25, 0.25, 0.25 / 7, 0.25 / 7, 0, 1]);
        testEmitterTime(emitter, [12, 11.75, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [4.75, 5, 5 / 7, 4.75 / 7, 0.25, 1]);
        testEmitterTime(emitter, [14, 13.75, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [6.75, 0, 0, 6.75 / 7, 0.25, 2]);
    });
    
    test('No delay, Once Loop', () => {
        testEmitterTime(emitter, [5, 4, DelayMode.NONE, 1, LoopMode.ONCE, 1, 7], [4, 5, 5 / 7, 4 / 7, 1, 0]);
        testEmitterTime(emitter, [7.25, 6.8, DelayMode.NONE, 1, LoopMode.ONCE, 1, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 1]);
        testEmitterTime(emitter, [7.5, 7.1, DelayMode.NONE, 1, LoopMode.ONCE, 1, 7], [7, 7, 1, 1, 0, 1]);
    });

    test('No delay, Multiple Loop', () => {
        testEmitterTime(emitter, [5, 4, DelayMode.NONE, 1, LoopMode.MULTIPLE, 2, 7], [4, 5, 5 / 7, 4 / 7, 1, 0]);
        testEmitterTime(emitter, [7.25, 6.8, DelayMode.NONE, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 1]);
        testEmitterTime(emitter, [12, 11.5, DelayMode.NONE, 1, LoopMode.MULTIPLE, 2, 7], [4.5, 5, 5 / 7, 4.5 / 7, 0.5, 1]);
        testEmitterTime(emitter, [14.5, 13.8, DelayMode.NONE, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 2]);
    });

    test('First delay, Infinite Loop', () => {
        testEmitterTime(emitter, [0.25, 0, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [0, 0, 0, 0, 0, 0]);
        testEmitterTime(emitter, [5, 4, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [3, 4, 4 / 7, 3 / 7, 1, 0]);
        testEmitterTime(emitter, [7.25, 6.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [5.8, 6.25, 6.25 / 7, 5.8 / 7, 0.45, 0]);
        testEmitterTime(emitter, [8.25, 7.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 1]);
        testEmitterTime(emitter, [9, 8.5, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [0.5, 1, 1 / 7, 0.5 / 7, 0.5, 1]);
        testEmitterTime(emitter, [15.25, 14.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 2]);
        testEmitterTime(emitter, [15.6, 15.3, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [0.3, 0.6, 0.6 / 7, 0.3 / 7, 0.3, 2]);
    });

    test('First delay, Once Loop', () => {
        testEmitterTime(emitter, [0.25, 0, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.ONCE, 1, 7], [0, 0, 0, 0, 0, 0]);
        testEmitterTime(emitter, [8.25, 7.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.ONCE, 1, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 1]);
        testEmitterTime(emitter, [8.5, 8.1, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.ONCE, 1, 7], [7, 7, 1, 1, 0, 1]);
    });

    test('First delay, Multiple loop', () => {
        testEmitterTime(emitter, [0.25, 0, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [0, 0, 0, 0, 0, 0]);
        testEmitterTime(emitter, [8.25, 7.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 1]);
        testEmitterTime(emitter, [8.5, 8.1, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [0.1, 0.5, 0.5 / 7, 0.1 / 7, 0.4, 1]);
        testEmitterTime(emitter, [15.2, 14.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 2]);
        testEmitterTime(emitter, [15.5, 15.2, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [7, 7, 1, 1, 0, 2]);
    });

    test('Every Loop, Infinite loop', () => {
        testEmitterTime(emitter, [0.25, 0, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [0, 0, 0, 0, 0, 0]);
        testEmitterTime(emitter, [1.25, 0.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [0, 0.25, 0.25 / 7, 0, 0.25, 0]);
        testEmitterTime(emitter, [5, 4.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [3.8, 4, 4 / 7, 3.8 / 7, 0.2, 0]);
        testEmitterTime(emitter, [8.25, 7.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [6.8, 0, 0, 6.8 / 7, 0.2, 1]);
        testEmitterTime(emitter, [8.8, 8.6, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [0, 0, 0, 0, 0, 1]);
        testEmitterTime(emitter, [9.2, 8.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [0, 0.2, 0.2 / 7, 0, 0.2, 1]);
        testEmitterTime(emitter, [16.2, 15.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [6.8, 0, 0, 6.8 / 7, 0.2, 2]);
    });

    test('Every Loop, Once loop', () => {
        testEmitterTime(emitter, [0.25, 0, DelayMode.EVERY_LOOP, 1, LoopMode.ONCE, 1, 7], [0, 0, 0, 0, 0, 0]);
        testEmitterTime(emitter, [1.25, 0.8, DelayMode.EVERY_LOOP, 1, LoopMode.ONCE, 1, 7], [0, 0.25, 0.25 / 7, 0, 0.25, 0]);
        testEmitterTime(emitter, [5, 4.8, DelayMode.EVERY_LOOP, 1, LoopMode.ONCE, 1, 7], [3.8, 4, 4 / 7, 3.8 / 7, 0.2, 0]);
        testEmitterTime(emitter, [8.25, 7.8, DelayMode.EVERY_LOOP, 1, LoopMode.ONCE, 1, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 1]);
        testEmitterTime(emitter, [8.8, 8.6, DelayMode.EVERY_LOOP, 1, LoopMode.ONCE, 1, 7], [7, 7, 1, 1, 0, 1]);
    });

    test('Every Loop, Multiple loop', () => {
        testEmitterTime(emitter, [0.25, 0, DelayMode.EVERY_LOOP, 1, LoopMode.MULTIPLE, 2, 7], [0, 0, 0, 0, 0, 0]);
        testEmitterTime(emitter, [1.25, 0.8, DelayMode.EVERY_LOOP, 1, LoopMode.MULTIPLE, 2, 7], [0, 0.25, 0.25 / 7, 0, 0.25, 0]);
        testEmitterTime(emitter, [5, 4.8, DelayMode.EVERY_LOOP, 1, LoopMode.MULTIPLE, 2, 7], [3.8, 4, 4 / 7, 3.8 / 7, 0.2, 0]);
        testEmitterTime(emitter, [8.25, 7.8, DelayMode.EVERY_LOOP, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 0, 0, 6.8 / 7, 0.2, 1]);
        testEmitterTime(emitter, [8.8, 8.6, DelayMode.EVERY_LOOP, 1, LoopMode.MULTIPLE, 2, 7], [0, 0, 0, 0, 0, 1]);
        testEmitterTime(emitter, [9.2, 8.8, DelayMode.EVERY_LOOP, 1, LoopMode.MULTIPLE, 2, 7], [0, 0.2, 0.2 / 7, 0, 0.2, 1]);
        testEmitterTime(emitter, [12.2, 12, DelayMode.EVERY_LOOP, 1, LoopMode.MULTIPLE, 2, 7], [3, 3.2, 3.2 / 7, 3 / 7, 0.2, 1]);
        testEmitterTime(emitter, [16.2, 15.8, DelayMode.EVERY_LOOP, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 2]);
    });
});

function testEmitterTime(emitter: VFXEmitter, input: number[], output: number[]) {
    emitter.updateEmitterTime(input[0], input[1], input[2], input[3], input[4], input[5], input[6]);
    expect(emitter.deltaTime).toBeCloseTo(input[0] - input[1], 5);
    expect(emitter.previousTime).toBeCloseTo(output[0], 5);
    expect(emitter.currentTime).toBeCloseTo(output[1], 5);
    expect(emitter.normalizedLoopAge).toBeCloseTo(output[2], 5);
    expect(emitter.normalizedPrevLoopAge).toBeCloseTo(output[3], 5);
    expect(emitter.emitterDeltaTime).toBeCloseTo(output[4], 5);
    expect(emitter.emitterFrameOffset).toBeCloseTo(emitter.deltaTime > 0 ? (emitter.deltaTime - emitter.emitterDeltaTime) / emitter.deltaTime: 0, 5);
    expect(emitter.loopCount).toBeCloseTo(output[5], 5);
}