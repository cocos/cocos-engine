import { CurveRange } from '../../../cocos/particle/curve-range';
import { SpawnRateModule } from '../../../cocos/particle/modules/spawn-rate';
import { DelayMode, ParticleEmitterParams, ParticleExecContext } from '../../../cocos/particle/particle-base';
import { ParticleDataSet } from '../../../cocos/particle/particle-data-set';

describe('SpawnRate', () => {
    test('constant', () => {
        const spawnRate = new SpawnRateModule();
        spawnRate.rate = new CurveRange(1);
        const context = new ParticleExecContext();
        const params = new ParticleEmitterParams();
        const particles = new ParticleDataSet();
        context.resetSpawningState();
        context.updateEmitterTime(params, 1, 0, 0);
        spawnRate.execute(particles, params, context);
        expect(context.spawnContinuousCount).toStrictEqual(1);

        spawnRate.rate.constant = 10;
        context.resetSpawningState();
        context.updateEmitterTime(params, 1.25, 1, 0);
        spawnRate.execute(particles, params, context);
        expect(context.spawnContinuousCount).toStrictEqual(10 * 0.25);

        context.resetSpawningState();
        context.updateEmitterTime(params, 0.25, 4.75, 0);
        spawnRate.execute(particles, params, context);
        expect(context.spawnContinuousCount).toStrictEqual(10 * 0.5);

    });
});