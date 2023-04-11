import { createRealCurve, CurveRange } from '../../../cocos/particle/curve-range';
import { SpawnRateModule } from '../../../cocos/particle/modules/spawn-rate';
import { DelayMode, LoopMode, ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../../../cocos/particle/particle-base';
import { ParticleDataSet } from '../../../cocos/particle/particle-data-set';
import { RandomStream } from '../../../cocos/particle/random-stream';

describe('SpawnRate', () => {
    test('execute', () => {
        const spawnRate = new SpawnRateModule();
        spawnRate.rate = new CurveRange(1);
        const context = new ParticleExecContext();
        const params = new ParticleEmitterParams();
        const particles = new ParticleDataSet();
        const state = new ParticleEmitterState();
        const curveRange1 = new CurveRange(5, 10);
        const curveRange2 = new CurveRange(1, createRealCurve([[0.0, 0], [0.5, 1.0], [1.0, 0.0]]));
        const curveRange3 = new CurveRange(1, createRealCurve([[0.0, 0.3], [0.5, 0.8], [1.0, 0.9]]), createRealCurve([[0.0, 0.1], [0.5, 0.5], [1.0, 0.7]]));

        state.rand.seed = 12345;
        const rand = new RandomStream(12345);
        rand.seed = Math.imul(rand.getUInt32(), rand.getUInt32()) >>> 0;
        spawnRate.onPlay(params, state);
        context.resetSpawningState();
        context.updateEmitterTime(0.25, 0, DelayMode.NONE, 0, LoopMode.ONCE, 1, 1);
        spawnRate.execute(particles, params, context);
        expect(context.spawnContinuousCount).toBeCloseTo(0.25 * spawnRate.rate.evaluate(0.25, rand.getFloat()), 5);

        spawnRate.rate = curveRange1
        context.resetSpawningState();
        context.updateEmitterTime(0.8, 0.6, DelayMode.NONE, 0, LoopMode.ONCE, 1, 1);
        spawnRate.execute(particles, params, context);
        expect(context.spawnContinuousCount).toBeCloseTo(0.2 * curveRange1.evaluate(0.8, rand.getFloat()), 5);

        context.resetSpawningState();
        context.updateEmitterTime(1.1, 0.9, DelayMode.NONE, 0, LoopMode.ONCE, 1, 1);
        spawnRate.rate = curveRange2;
        spawnRate.execute(particles, params, context);
        expect(context.spawnContinuousCount).toBeCloseTo(0.1 * curveRange2.evaluate(1, rand.getFloat()), 5);

        context.resetSpawningState();
        context.updateEmitterTime(1.1, 0.9, DelayMode.NONE, 0, LoopMode.INFINITE, 1, 1);
        spawnRate.rate = curveRange2;
        spawnRate.execute(particles, params, context);
        const random = rand.getFloat();
        expect(context.spawnContinuousCount).toBeCloseTo(0.1 * curveRange2.evaluate(1, random) + 0.1 * curveRange2.evaluate(0.1, random), 5);

        context.resetSpawningState();
        context.updateEmitterTime(1.2, 1.1, DelayMode.NONE, 0, LoopMode.ONCE, 1, 1);
        spawnRate.rate = curveRange3;
        spawnRate.execute(particles, params, context);
        rand.getFloat();
        expect(context.spawnContinuousCount).toBeCloseTo(0, 0);

        context.resetSpawningState();
        context.updateEmitterTime(1.2, 1.1, DelayMode.NONE, 0, LoopMode.INFINITE, 1, 1);
        spawnRate.execute(particles, params, context);
        expect(context.spawnContinuousCount).toBeCloseTo(0.1 * curveRange3.evaluate(0.2, rand.getFloat()), 5);

        context.resetSpawningState();
        let val = 0;
        for (let i = 0; i < 20; i++) {
            context.updateEmitterTime(i * 0.2 + 0.2, i * 0.2, DelayMode.NONE, 0, LoopMode.INFINITE, 1, 5);
            spawnRate.execute(particles, params, context);
            val += 0.2 * curveRange3.evaluate((i * 0.2 + 0.2) / 5, rand.getFloat());
        }
        expect(val).toBeCloseTo(context.spawnContinuousCount, 5);
    });
});