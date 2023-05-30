jest.mock('../../../cocos/animation/marionette/graph-eval');

import { AnimationController } from "../../../cocos/animation/animation";
import { AnimationGraphCustomEventEmitter } from "../../../cocos/animation/marionette/event/custom-event-emitter";
import { AnimationGraphEval } from "../../../cocos/animation/marionette/graph-eval";
import { AnimationGraph } from "../../../cocos/animation/marionette/animation-graph";
import { EventTarget, Node } from "../../../exports/base";
import { AnimationGraphEvalMock } from './utils/eval-mock';
import 'jest-extended';

/**
 * Test animation controller's event API itself.
 * 
 * Within the tests, events are emitted in a simulated way
 * and these tests observe if the animation controller correctly forwards them to users callback
 * after users' listening/un-listening behaviors.
 */
describe(`Animation controller custom event APIs`, () => {
    beforeEach(() => {
        stealControllerCustomEventEmitter();
    });

    afterEach(() => {
        (AnimationGraphEval as jest.Mock).mockReset();
    });

    test(`On and Off`, () => {
        const graphEvalMock = new AnimationGraphEventSimulator();

        const callbackMockManager = new CallbackMockManager();

        const event_a_callback_mock = callbackMockManager.add();
        graphEvalMock.controller.onCustomEvent_experimental('event_a', event_a_callback_mock);
        const event_b_callback_mock = callbackMockManager.add();
        graphEvalMock.controller.onCustomEvent_experimental('event_b', event_b_callback_mock);

        // Add 4 listeners, with different `this` arg, listen to 'a'.
        const event_a_callback_with_this_arg = callbackMockManager.add();
        const event_a_callback_this_args = Array.from({ length: 4 }, () => ({}));
        const event_a_callback_this_args_backup = event_a_callback_this_args.slice();
        for (let i = 0; i < event_a_callback_this_args.length; ++i) {
            graphEvalMock.controller.onCustomEvent_experimental('event_a', event_a_callback_with_this_arg, event_a_callback_this_args[i]);
        }

        const check_event_a_callback_with_this_arg_to_be_called = () => {
            expect(event_a_callback_with_this_arg).toBeCalledTimes(event_a_callback_this_args.length);
            expect(event_a_callback_with_this_arg.mock.instances).toIncludeAllMembers(event_a_callback_this_args);
        };

        callbackMockManager.zeroCheck();

        // The listeners should be called normally.
        for (let i = 0; i < 2; ++i) {
            graphEvalMock.simulateCustomEvent('event_a');
            expect(event_a_callback_mock).toBeCalledTimes(1);
            event_a_callback_mock.mockClear();
            check_event_a_callback_with_this_arg_to_be_called();
            event_a_callback_with_this_arg.mockClear();
            callbackMockManager.zeroCheck();

            graphEvalMock.simulateCustomEvent('event_b');
            expect(event_b_callback_mock).toBeCalledTimes(1);
            event_b_callback_mock.mockClear();
            callbackMockManager.zeroCheck();
        }

        // Off the listener with no `this` arg.
        graphEvalMock.controller.offCustomEvent_experimental('event_a', event_a_callback_mock);
        // Should remove successfully.
        graphEvalMock.simulateCustomEvent('event_a');
        check_event_a_callback_with_this_arg_to_be_called();
        event_a_callback_with_this_arg.mockClear();
        callbackMockManager.zeroCheck();

        // Off the listener with `this` arg, at middle, tail, then first.
        for (let i = 0; i < 3; ++i) {
            if (i === 0) {
                graphEvalMock.controller.offCustomEvent_experimental(
                    'event_a',
                    event_a_callback_with_this_arg,
                    event_a_callback_this_args[1],
                );
                event_a_callback_this_args.splice(1, 1);
            } else if (i === 1) {
                graphEvalMock.controller.offCustomEvent_experimental(
                    'event_a',
                    event_a_callback_with_this_arg,
                    event_a_callback_this_args[event_a_callback_this_args.length - 1],
                );
                event_a_callback_this_args.splice(event_a_callback_this_args.length - 1, 1);
            } else if (i === 2) {
                graphEvalMock.controller.offCustomEvent_experimental(
                    'event_a',
                    event_a_callback_with_this_arg,
                    event_a_callback_this_args[0],
                );
                event_a_callback_this_args.splice(0, 1);
            }

            graphEvalMock.simulateCustomEvent('event_a');
            check_event_a_callback_with_this_arg_to_be_called();
            event_a_callback_with_this_arg.mockClear();
            callbackMockManager.zeroCheck();
        }

        // Re-add all event-a listeners.
        graphEvalMock.controller.onCustomEvent_experimental('event_a', event_a_callback_mock);
        event_a_callback_this_args.length = 0;
        event_a_callback_this_args.push(...event_a_callback_this_args_backup);
        for (let i = 0; i < event_a_callback_this_args.length; ++i) {
            graphEvalMock.controller.onCustomEvent_experimental('event_a', event_a_callback_with_this_arg, event_a_callback_this_args[i]);
        }
        // Re-add should success.
        graphEvalMock.simulateCustomEvent('event_a');
        graphEvalMock.controller.offCustomEvent_experimental('event_a');
        expect(event_a_callback_mock).toBeCalledTimes(1);
        event_a_callback_mock.mockClear();
        check_event_a_callback_with_this_arg_to_be_called();
        event_a_callback_with_this_arg.mockClear();
        callbackMockManager.zeroCheck();

        // Off with no callback specified. All listeners should be removed.
        graphEvalMock.controller.offCustomEvent_experimental('event_a');
        graphEvalMock.simulateCustomEvent('event_a');
        callbackMockManager.zeroCheck();
    });
});

const stoleCustomEventEmitterMap = new WeakMap<AnimationGraphEval, AnimationGraphCustomEventEmitter>();

function stealControllerCustomEventEmitter() {
    const originalClass = jest.requireActual('../../../cocos/animation/marionette/graph-eval').AnimationGraphEval as typeof AnimationGraphEval;

    const AnimationGraphEvalClassMock = (AnimationGraphEval as jest.Mock);

    AnimationGraphEvalClassMock.mockImplementation((...args: ConstructorParameters<typeof AnimationGraphEval>) => {
        const [graph, root, controller, originalEmitter, ...remain] = args;

        const graphEval = new originalClass(graph, root, controller, new EventTarget(), ...remain);
        stoleCustomEventEmitterMap.set(graphEval, originalEmitter);

        return graphEval;
    });
}

class AnimationGraphEventSimulator extends AnimationGraphEvalMock {
    constructor(...events: string[]) {
        super(
            new Node(),
            new AnimationGraph(),
        );

        // @ts-expect-error HACK
        const graphEval = super.controller._graphEval;
        expect(graphEval).not.toBeFalsy();
        const mocked = stoleCustomEventEmitterMap.get(graphEval!);
        expect(mocked).not.toBeUndefined();
        this._mockedEventEmitter = mocked!;
    }

    public simulateCustomEvent(eventName: string) {
        this._mockedEventEmitter.emit(eventName);
    }

    private _mockedEventEmitter: AnimationGraphCustomEventEmitter;
}

class CallbackMockManager {
    private mocks: jest.Mock[] = [];

    add () {
        const mock = jest.fn();
        this.mocks.push(mock);
        return mock;
    }

    zeroCheck () {
        for (const mock of this.mocks) {
            expect(mock).not.toBeCalled();
        }
    }
}
