import { DelayMode, LoopMode, ParticleExecContext } from "../../cocos/particle/particle-base";

describe('particle-exec-context', () => {
    describe('update Emitter Time', () => {
        const context = new ParticleExecContext();
        test('Edge case', () => {
            expect(() => context.updateEmitterTime(1, 0, DelayMode.NONE, 0, LoopMode.ONCE, 1, 0.5)).toThrowError();
        });

        test('No delay, Infinite Loop', () => {
            testEmitterTime(context, [5, 4, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [4, 5, 5 / 7, 4 / 7, 1, 0]);
            testEmitterTime(context, [7.25, 6.8, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 1]);
            testEmitterTime(context, [7.25, 7.25, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [0.25, 0.25, 0.25 / 7, 0.25 / 7, 0, 1]);
            testEmitterTime(context, [12, 11.75, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [4.75, 5, 5 / 7, 4.75 / 7, 0.25, 1]);
            testEmitterTime(context, [14, 13.75, DelayMode.NONE, 1, LoopMode.INFINITE, 1, 7], [6.75, 0, 0, 6.75 / 7, 0.25, 2]);
        });
        
        test('No delay, Once Loop', () => {
            testEmitterTime(context, [5, 4, DelayMode.NONE, 1, LoopMode.ONCE, 1, 7], [4, 5, 5 / 7, 4 / 7, 1, 0]);
            testEmitterTime(context, [7.25, 6.8, DelayMode.NONE, 1, LoopMode.ONCE, 1, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 1]);
            testEmitterTime(context, [7.5, 7.1, DelayMode.NONE, 1, LoopMode.ONCE, 1, 7], [7, 7, 1, 1, 0, 1]);
        });

        test('No delay, Multiple Loop', () => {
            testEmitterTime(context, [5, 4, DelayMode.NONE, 1, LoopMode.MULTIPLE, 2, 7], [4, 5, 5 / 7, 4 / 7, 1, 0]);
            testEmitterTime(context, [7.25, 6.8, DelayMode.NONE, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 1]);
            testEmitterTime(context, [12, 11.5, DelayMode.NONE, 1, LoopMode.MULTIPLE, 2, 7], [4.5, 5, 5 / 7, 4.5 / 7, 0.5, 1]);
            testEmitterTime(context, [14.5, 13.8, DelayMode.NONE, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 2]);
        });

        test('First delay, Infinite Loop', () => {
            testEmitterTime(context, [0.25, 0, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [0, 0, 0, 0, 0, 0]);
            testEmitterTime(context, [5, 4, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [3, 4, 4 / 7, 3 / 7, 1, 0]);
            testEmitterTime(context, [7.25, 6.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [5.8, 6.25, 6.25 / 7, 5.8 / 7, 0.45, 0]);
            testEmitterTime(context, [8.25, 7.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 1]);
            testEmitterTime(context, [9, 8.5, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [0.5, 1, 1 / 7, 0.5 / 7, 0.5, 1]);
            testEmitterTime(context, [15.25, 14.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 2]);
            testEmitterTime(context, [15.6, 15.3, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.INFINITE, 1, 7], [0.3, 0.6, 0.6 / 7, 0.3 / 7, 0.3, 2]);
        });

        test('First delay, Once Loop', () => {
            testEmitterTime(context, [0.25, 0, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.ONCE, 1, 7], [0, 0, 0, 0, 0, 0]);
            testEmitterTime(context, [8.25, 7.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.ONCE, 1, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 1]);
            testEmitterTime(context, [8.5, 8.1, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.ONCE, 1, 7], [7, 7, 1, 1, 0, 1]);
        });

        test('First delay, Multiple loop', () => {
            testEmitterTime(context, [0.25, 0, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [0, 0, 0, 0, 0, 0]);
            testEmitterTime(context, [8.25, 7.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 0.25, 0.25 / 7, 6.8 / 7, 0.45, 1]);
            testEmitterTime(context, [8.5, 8.1, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [0.1, 0.5, 0.5 / 7, 0.1 / 7, 0.4, 1]);
            testEmitterTime(context, [15.2, 14.8, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [6.8, 7, 1, 6.8 / 7, 0.2, 2]);
            testEmitterTime(context, [15.5, 15.2, DelayMode.FIRST_LOOP_ONLY, 1, LoopMode.MULTIPLE, 2, 7], [7, 7, 1, 1, 0, 2]);
        });

        test('Every Loop, Infinite loop', () => {
            testEmitterTime(context, [0.25, 0, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [0, 0, 0, 0, 0, 0]);
            testEmitterTime(context, [1.25, 0.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [0, 0.25, 0.25 / 7, 0, 0.25, 0]);
            testEmitterTime(context, [5, 4.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [3.8, 4, 4 / 7, 3.8 / 7, 0.2, 0]);
            testEmitterTime(context, [8.25, 7.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [6.8, 0, 0, 6.8 / 7, 0.2, 1]);
            testEmitterTime(context, [8.8, 8.6, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [0, 0, 0, 0, 0, 1]);
            testEmitterTime(context, [9.2, 8.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [0, 0.2, 0.2 / 7, 0, 0.2, 1]);
            testEmitterTime(context, [16.2, 15.8, DelayMode.EVERY_LOOP, 1, LoopMode.INFINITE, 1, 7], [6.8, 0, 0, 6.8 / 7, 0.2, 2]);
        });
    });
});

function testEmitterTime(context: ParticleExecContext, input: number[], output: number[]) {
    context.updateEmitterTime(input[0], input[1], input[2], input[3], input[4], input[5], input[6]);
    expect(context.emitterPreviousTime).toBeCloseTo(output[0], 5);
    expect(context.emitterCurrentTime).toBeCloseTo(output[1], 5);
    expect(context.emitterNormalizedTime).toBeCloseTo(output[2], 5);
    expect(context.emitterNormalizedPrevTime).toBeCloseTo(output[3], 5);
    expect(context.emitterDeltaTime).toBeCloseTo(output[4], 5);
    expect(context.loopCount).toBeCloseTo(output[5], 5);
}