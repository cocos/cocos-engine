import { DelayMode, ParticleExecContext } from "../../cocos/particle/particle-base";

describe('particle-exec-context', () => {
    test('set Emitter Time', () => {
        const context = new ParticleExecContext();
        context.setEmitterTime(5, 4, 1, DelayMode.EVERY_LOOP, 7);
        expect(context.emitterPreviousTime).toBe(4);
        expect(context.emitterCurrentTime).toBe(5);
        expect(context.emitterNormalizedTime).toStrictEqual(4 / 7);
        expect(context.emitterNormalizedPrevTime).toStrictEqual(3 / 7);
    });
});