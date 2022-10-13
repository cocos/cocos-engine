import { Node } from "../../../cocos/scene-graph";
import { AnimationClip } from "../../../cocos/animation/animation-clip";
import { AnimationState } from "../../../cocos/animation/animation-state";

test('Evaluate embedded players in animation state', () => {
    const clip = new AnimationClip();
    clip.duration = 0.8;
    clip.speed = 0.6;
    clip.wrapMode = AnimationClip.WrapMode.Loop;

    const node = new Node();

    const embeddedPlayerEvaluation = new EmbeddedPlayerEvaluationMock();
    jest.spyOn(clip, 'createEmbeddedPlayerEvaluator').mockImplementation((targetNode: Node) => {
        expect(targetNode).toBe(node);
        return embeddedPlayerEvaluation as unknown as ReturnType<AnimationClip['createEmbeddedPlayerEvaluator']>;
    });
    jest.spyOn(clip, 'containsAnyEmbeddedPlayer').mockImplementation(() => {
        return true;
    });

    const animationState = new AnimationState(clip);
    animationState.initialize(node);
    expect(embeddedPlayerEvaluation.notifyHostSpeedChanged).toBeCalledTimes(1);
    expect(embeddedPlayerEvaluation.notifyHostSpeedChanged.mock.calls[0][0]).toBe(0.6);
    embeddedPlayerEvaluation.notifyHostSpeedChanged.mockClear();
    embeddedPlayerEvaluation.zeroCheck();

    animationState.play();
    expect(embeddedPlayerEvaluation.notifyHostPlay).toBeCalledTimes(1);
    expect(embeddedPlayerEvaluation.notifyHostPlay.mock.calls[0][0]).toBeCloseTo(0.0);
    embeddedPlayerEvaluation.notifyHostPlay.mockClear();
    embeddedPlayerEvaluation.zeroCheck();

    animationState.update(0.2);
    expect(embeddedPlayerEvaluation.evaluate).toBeCalledTimes(1);
    // Perfect first frame..
    expect(embeddedPlayerEvaluation.evaluate.mock.calls[0][0]).toBeCloseTo(0.0);
    expect(embeddedPlayerEvaluation.evaluate.mock.calls[0][1]).toBeCloseTo(0);
    embeddedPlayerEvaluation.evaluate.mockClear();
    embeddedPlayerEvaluation.zeroCheck();

    animationState.update(0.3);
    expect(embeddedPlayerEvaluation.evaluate).toBeCalledTimes(1);
    expect(embeddedPlayerEvaluation.evaluate.mock.calls[0][0]).toBeCloseTo(0.3 * 0.6);
    expect(embeddedPlayerEvaluation.evaluate.mock.calls[0][1]).toBeCloseTo(0);
    embeddedPlayerEvaluation.evaluate.mockClear();
    embeddedPlayerEvaluation.zeroCheck();

    // Cross iterations
    animationState.update(10.0);
    expect(embeddedPlayerEvaluation.evaluate).toBeCalledTimes(1);
    expect(embeddedPlayerEvaluation.evaluate.mock.calls[0][0]).toBeCloseTo(animationState.current);
    expect(embeddedPlayerEvaluation.evaluate.mock.calls[0][1]).toBe(Math.trunc((0.3 + 10.0) * 0.6 / 0.8));
    embeddedPlayerEvaluation.evaluate.mockClear();
    embeddedPlayerEvaluation.zeroCheck();

    animationState.pause();
    expect(embeddedPlayerEvaluation.notifyHostPause).toBeCalledTimes(1);
    expect(embeddedPlayerEvaluation.notifyHostPause.mock.calls[0][0]).toBeCloseTo(animationState.current);
    embeddedPlayerEvaluation.notifyHostPause.mockClear();
    embeddedPlayerEvaluation.zeroCheck();

    animationState.stop();
    expect(embeddedPlayerEvaluation.notifyHostStop).toBeCalledTimes(1);
    embeddedPlayerEvaluation.notifyHostStop.mockClear();
    embeddedPlayerEvaluation.zeroCheck();
});

// @ts-expect-error
class EmbeddedPlayerEvaluationMock implements ReturnType<AnimationClip['createEmbeddedPlayerEvaluator']> {
    public notifyHostSpeedChanged: jest.Mock<void, [number]> = jest.fn();

    public notifyHostPlay: jest.Mock<void, [number]> = jest.fn();

    public notifyHostPause: jest.Mock<void, [number]> = jest.fn();

    public notifyHostStop: jest.Mock = jest.fn();

    public evaluate: jest.Mock<void, [number, number]> = jest.fn();

    public zeroCheck() {
        expect(this.notifyHostSpeedChanged).not.toBeCalled();
        expect(this.notifyHostPlay).not.toBeCalled();
        expect(this.notifyHostPause).not.toBeCalled();
        expect(this.notifyHostStop).not.toBeCalled();
        expect(this.evaluate).not.toBeCalled();
    }
}

