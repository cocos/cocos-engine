import { ExpressionType } from "../../../cocos/vfx/expression";
import { FloatExpression } from "../../../cocos/vfx/expressions/float";
import { ModuleExecContext, VFXEmitterParams } from "../../../cocos/vfx/particle-base";
import { ParticleDataSet } from "../../../cocos/vfx/particle-data-set";
import { RandomStream } from "../../../cocos/vfx/random-stream";

describe('FloatExpression', () => {
    test('type', () => {
        class MyExpression extends FloatExpression {
            public evaluateSingle(time: number, randomStream: RandomStream, context: ModuleExecContext): number {
                throw new Error("Method not implemented.");
            }
            public evaluate(index: number): number {
                throw new Error("Method not implemented.");
            }
            public get isConstant(): boolean {
                return false;
            }
            public tick(particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
                throw new Error("Method not implemented.");
            }
            public bind(particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext, randomOffset: number) {
                throw new Error("Method not implemented.");
            }
        }
        const expression = new MyExpression();
        expect(expression.type).toBe(ExpressionType.FLOAT);
    });
});