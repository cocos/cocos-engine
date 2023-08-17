import { Component, Node } from "../../../exports/base";
import { AnimationGraphEvalMock } from './utils/eval-mock';
import 'jest-extended';
import { createAnimationGraph } from "./utils/factory";

test(`State machine event binding`, () => {
    const animationGraph = createAnimationGraph({
        variableDeclarations: {
            'm1-to-m2': { type: 'boolean', value: false },
            'm2-to-p1': { type: 'boolean', value: false },
            'p1-to-p2': { type: 'boolean', value: false },
        },
        layers: [{
            stateMachine: {
                states: {
                    'm1': {
                        type: 'motion',
                        transitionInEventBinding: 'm1-transition-in-event', transitionOutEventBinding: 'm1-transition-out-event',
                    },
                    'm2': {
                        type: 'motion',
                        transitionInEventBinding: 'm2-transition-in-event', transitionOutEventBinding: 'm2-transition-out-event',
                    },
                    'p1': {
                        type: 'procedural',
                        graph: { },
                        transitionInEventBinding: 'p1-transition-in-event', transitionOutEventBinding: 'p1-transition-out-event',
                    },
                    'p2': {
                        type: 'procedural',
                        graph: { },
                        transitionInEventBinding: 'p2-transition-in-event', transitionOutEventBinding: 'p2-transition-out-event',
                    },
                },
                entryTransitions: [{ to: 'm1' }],
                transitions: [{
                    from: 'm1', to: 'm2',
                    exitTimeEnabled: false,
                    duration: 1.0,
                    startEventBinding: 'm1-to-m2-start-event',
                    endEventBinding: 'm1-to-m2-end-event',
                    conditions: [{ type: 'unary', operand: { type: 'variable', name: 'm1-to-m2' } }],
                }, {
                    from: 'm2', to: 'p1',
                    duration: 1.0,
                    startEventBinding: 'm2-to-p1-start-event',
                    endEventBinding: 'm2-to-p1-end-event',
                    conditions: [{ type: 'unary', operand: { type: 'variable', name: 'm2-to-p1' } }],
                }, {
                    from: 'p1', to: 'p2',
                    duration: 1.0,
                    startEventBinding: 'p1-to-p2-start-event',
                    endEventBinding: 'p1-to-p2-end-event',
                    conditions: [{ type: 'unary', operand: { type: 'variable', name: 'p1-to-p2' } }],
                }],
            },
        }],
    });

    const node = new Node();

    class EventListener extends Component { }
    const eventListener = node.addComponent(EventListener) as EventListener;

    const defineMethod = (methodName: string, method: Function) => {
        eventListener[methodName] = method;
    };

    const evalMock = new AnimationGraphEvalMock(node, animationGraph);

    const stateEventCallbacks = Array.from({ length: 4 }, () => {
        return {
            _in: jest.fn(),
            _out: jest.fn(),
        };
    });
    const [m1, m2, p1, p2] = stateEventCallbacks;
    for (const [callbacks, eventNamePrefix] of [
        [m1, 'm1'],
        [m2, 'm2'],
        [p1, 'p1'],
        [p2, 'p2'],
    ] as const) {
        defineMethod(`${eventNamePrefix}-transition-in-event`, callbacks._in);
        defineMethod(`${eventNamePrefix}-transition-out-event`, callbacks._out);
    }

    const transitionEventCallbacks = Array.from({ length: 3 }, () => {
        return {
            start: jest.fn(),
            end: jest.fn(),
        };
    });
    const [
        m1_to_m2,
        m2_to_p1,
        p1_to_p2,
    ] = transitionEventCallbacks;
    for (const [callbacks, eventNamePrefix] of [
        [m1_to_m2, 'm1-to-m2'],
        [m2_to_p1, 'm2-to-p1'],
        [p1_to_p2, 'p1-to-p2'],
    ] as const) {
        defineMethod(`${eventNamePrefix}-start-event`, callbacks.start);
        defineMethod(`${eventNamePrefix}-end-event`, callbacks.end);
    }

    const checkZero = () => {
        for (const callbacks of stateEventCallbacks) {
            expect(callbacks._in).not.toBeCalled();
            expect(callbacks._out).not.toBeCalled();
        }
        for (const callbacks of transitionEventCallbacks) {
            expect(callbacks.start).not.toBeCalled();
            expect(callbacks.end).not.toBeCalled();
        }
    };

    checkZero();

    evalMock.step(0.2);
    expect(m1._in).toBeCalledTimes(1);
    m1._in.mockClear();
    checkZero();

    evalMock.step(0.2);
    checkZero();

    // Trigger m1-to-m2.
    evalMock.controller.setValue('m1-to-m2', true);
    evalMock.step(0.2);
    expect(m1._out).toBeCalledTimes(1);
    expect(m1_to_m2.start).toBeCalledTimes(1);
    expect(m2._in).toBeCalledTimes(1);
    // Out first, then transition start, then in
    expect(m1._out.mock.invocationCallOrder[0]).toBeLessThan(m1_to_m2.start.mock.invocationCallOrder[0]);
    expect(m1_to_m2.start.mock.invocationCallOrder[0]).toBeLessThan(m2._in.mock.invocationCallOrder[0]);
    m1._out.mockClear();
    m1_to_m2.start.mockClear();
    m2._in.mockClear();
    checkZero();

    // In transition, nothing happen.
    evalMock.step(0.2);
    checkZero();

    // Finish the transition.
    evalMock.step(1.0);
    expect(m1_to_m2.end).toBeCalledTimes(1);
    m1_to_m2.end.mockClear();
    checkZero();
});
