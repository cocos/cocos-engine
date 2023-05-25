import { lerp } from '../../../exports/base';
import { AnimationGraphEvalMock } from './utils/eval-mock';
import { createAnimationGraph } from './utils/factory';
import { LinearRealValueAnimationFixture } from './utils/fixtures';
import { SingleRealValueObserver } from './utils/single-real-value-observer';

describe(`Interruption matching`, () => {
    test(`Exit condition should consider "to" port when matching interruption from non-head state`, () => {
        const fixture = {
            motion_1: new LinearRealValueAnimationFixture(1., 2., 6.),
            motion_2: new LinearRealValueAnimationFixture(4., 5., 3.),
            motion_3: new LinearRealValueAnimationFixture(7., 8., 9.),
        };
        // To ensure motion_1 won't exit util motion_2 exit.
        expect(fixture.motion_1.duration).toBeGreaterThan(fixture.motion_2.duration);
        expect(fixture.motion_3.duration).toBeGreaterThan(fixture.motion_2.duration);
    
        const valueObserver = new SingleRealValueObserver();
    
        const exitTime = 0.5;
        const exitTimeUnit = fixture.motion_2.duration;
        const exitTimeAbsolute = exitTimeUnit * exitTime;
    
        const originalTransitionDuration = exitTimeAbsolute * 1.5;
        const interruptingTransitionDuration = Math.max(fixture.motion_1.duration, fixture.motion_2.duration, fixture.motion_3.duration);
    
        const animationGraph = createAnimationGraph({
            variableDeclarations: {
                'original_transition_activated': { type: 'boolean', value: true },
                'interruption_enabled': { type: 'boolean', value: false },
            },
            layers: [{
                stateMachine: {
                    states: {
                        'motion_1': { type: 'motion', motion: fixture.motion_1.createMotion(valueObserver.getCreateMotionContext()) },
                        'motion_2': { type: 'motion', motion: fixture.motion_2.createMotion(valueObserver.getCreateMotionContext()) },
                        'motion_3': { type: 'motion', motion: fixture.motion_3.createMotion(valueObserver.getCreateMotionContext()) },
                    },
                    entryTransitions: [{ to: 'motion_1' }],
                    transitions: [{
                        from: 'motion_1', to: 'motion_2', exitTimeEnabled: false, duration: originalTransitionDuration,
                        conditions: [{ type: 'unary', operator: 'to-be-true', operand: { type: 'variable', name: 'original_transition_activated' } }],
                    }, {
                        from: 'motion_2', to: 'motion_3',
                        exitTimeEnabled: true,
                        exitTime: exitTime,
                        duration: interruptingTransitionDuration,
                        conditions: [{ type: 'unary', operator: 'to-be-true', operand: { type: 'variable', name: 'interruption_enabled' } }],
                    }],
                },
            }],
        });
    
        const evalMock = new AnimationGraphEvalMock(valueObserver.root, animationGraph);
    
        // Satisfies interruption's exit time condition.
        evalMock.step(exitTimeAbsolute + 1e-6); // Past the exit condition
        evalMock.step(exitTimeAbsolute * 0.01);
    
        // Satisfies interruption's condition.
        evalMock.controller.setValue('interruption_enabled', true);
        evalMock.step(0.1);
        // The interruption should have taken place.
        expect(valueObserver.value).toBeCloseTo(
            lerp(
                lerp(
                    fixture.motion_1.getExpected(evalMock.current),
                    fixture.motion_2.getExpected(evalMock.current),
                    evalMock.current / originalTransitionDuration,
                ),
                fixture.motion_3.getExpected(evalMock.lastDeltaTime),
                evalMock.lastDeltaTime / interruptingTransitionDuration,
            ),
            5,
        );
    });
});
