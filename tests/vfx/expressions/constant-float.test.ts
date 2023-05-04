import { ConstantFloatExpression } from "../../../cocos/vfx/expressions/constant-float";
import { ModuleExecContext } from "../../../cocos/vfx/base";
import { ParticleDataSet } from "../../../cocos/vfx/particle-data-set";
import { RandomStream } from "../../../cocos/vfx/random-stream";

describe('ConstantFloatExpression', () => {
    test('evaluate', () => {
        const particles = new ParticleDataSet();
        particles.addParticles(5);
        const params = new VFXEmitterParams();
        const context = new ModuleExecContext();
        for (let i = 0; i < 100; ++i) {
            const val = Math.random() * 100;
            const expression = new ConstantFloatExpression(val);
            expression.bind(particles, params, context, 0);
            expect(expression.evaluate(0)).toBe(val);
            expect(expression.evaluate(1)).toBe(val);
            expect(expression.evaluate(2)).toBe(val);
            expect(expression.evaluate(3)).toBe(val);
            expect(expression.evaluate(4)).toBe(val);
        }
        
    });
    test('evaluateSingle', () => {
        const val = Math.random() * 100;
        const expression = new ConstantFloatExpression(val);
        const context = new ModuleExecContext();
        const randomStream = new RandomStream();
        expect(expression.evaluateSingle(-0.5, randomStream, context)).toBe(val);
        expect(expression.evaluateSingle(0, randomStream, context)).toBe(val);
        expect(expression.evaluateSingle(0.5, randomStream, context)).toBe(val);
        expect(expression.evaluateSingle(1, randomStream, context)).toBe(val);
        expect(expression.evaluateSingle(1.5, randomStream, context)).toBe(val);
    });

    test('isConstant', () => {
        for (let i = 0; i < 5; i++) {
            const expression = new ConstantFloatExpression(Math.random() * 100);
            expect(expression.isConstant).toBe(true);
        }
    });
});