import { VFXEmitterParams, ContextDataSet } from "../../../cocos/vfx/base";
import { ParticleDataSet } from "../../../cocos/vfx/particle-data-set";
import { FloatFromCurveExpression } from "../../../cocos/vfx/expressions/float-from-curve";

describe('FloatFromCurveExpression', () => {
    test('tick', () => {
        const particles = new ParticleDataSet();
        particles.addParticles(5);
        const params = new VFXEmitterParams();
        const context = new ContextDataSet();
        const expression = new FloatFromCurveExpression();
        expression.tick(dataStore);

    });
});