import { Node } from "../../../cocos/scene-graph";
import { EmbeddedPlayer, EmbeddedPlayable, EmbeddedPlayableState } from "../../../cocos/animation/embedded-player/embedded-player";
import { AnimationClipHostEmbeddedPlayerMock } from "./util";

describe('General embedded player test', () => {
    test('Default', () => {
        const embeddedPlayer = new EmbeddedPlayer();
        expect(embeddedPlayer.begin).toBe(0.0);
        expect(embeddedPlayer.end).toBe(0.0);
        expect(embeddedPlayer.reconciledSpeed).toBe(false);
        expect(embeddedPlayer.playable).toBe(null);
    });

    describe('Embedded player behaviors during animation clip evaluation', () => {
        test('Embedded player\'s play() is called when and only when host evaluating', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);
            
            host.play(0.32); // The time has arrived in embedded player's interval, but it has not been evaluated.
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(0);

            host.evaluateAt(0.33, 0); // Enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.03);
            embeddedPlayerMock.playMock.mockClear();
            embeddedPlayerMock.setTimeMock.mockClear();

            embeddedPlayerMock.zeroCheck();
        });

        test('Embedded player\'s stop() is called when host evaluating outside the embedded player\'s interval', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);

            host.evaluateAt(0.33, 0); // Enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.03);
            embeddedPlayerMock.playMock.mockClear();
            embeddedPlayerMock.setTimeMock.mockClear();

            host.evaluateAt(0.6, 0); // Evaluate at the middle, nothing happened
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.3);
            embeddedPlayerMock.setTimeMock.mockClear();

            host.evaluateAt(0.75, 0); // Evaluate outside the interval, call `stop()`
            expect(embeddedPlayerMock.stopMock).toHaveBeenCalledTimes(1);
            embeddedPlayerMock.stopMock.mockClear();

            embeddedPlayerMock.zeroCheck();
        });

        test('Embedded player\'s stop() is also called when host stops', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);

            host.evaluateAt(0.33, 0); // Enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.03);
            embeddedPlayerMock.setTimeMock.mockClear();
            embeddedPlayerMock.playMock.mockClear();

            host.stop(); // Evaluate outside the interval, call `stop()`
            expect(embeddedPlayerMock.stopMock).toHaveBeenCalledTimes(1);
            embeddedPlayerMock.stopMock.mockClear();

            embeddedPlayerMock.zeroCheck();
        });

        test('Embedded player\'s play() is triggered every time it reentered', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);

            host.evaluateAt(0.33, 0); // Enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            embeddedPlayerMock.playMock.mockClear();
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.03);
            embeddedPlayerMock.setTimeMock.mockClear();

            host.evaluateAt(0.8, 0); // Evaluate outside the interval
            expect(embeddedPlayerMock.stopMock).toHaveBeenCalledTimes(1);
            embeddedPlayerMock.stopMock.mockClear();

            host.evaluateAt(0.42, 0); // Again enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            embeddedPlayerMock.playMock.mockClear();
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.12);
            embeddedPlayerMock.setTimeMock.mockClear();

            embeddedPlayerMock.zeroCheck();
        });

        test('Embedded player\'s pause() is called when host pauses in the embedded players\'s interval', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);

            host.play(0.13);
            host.evaluateAt(0.13, 0);
            host.pause(0.14); // Pause at the outside before the first time the embedded player entered.
            expect(embeddedPlayerMock.pauseMock).not.toHaveBeenCalled();
            
            host.play(0.32);
            host.evaluateAt(0.32, 0); // Enter the embedded player
            embeddedPlayerMock.playMock.mockClear();
            embeddedPlayerMock.setTimeMock.mockClear();

            expect(embeddedPlayerMock.pauseMock).not.toHaveBeenCalled();
            host.pause(0.33);
            expect(embeddedPlayerMock.pauseMock).toHaveBeenCalledTimes(1);
            embeddedPlayerMock.pauseMock.mockClear();

            host.play(0.4);
            embeddedPlayerMock.playMock.mockClear();
            embeddedPlayerMock.setTimeMock.mockClear();
            host.evaluateAt(0.87, 0); // Exit the embedded player
            embeddedPlayerMock.stopMock.mockClear();

            host.pause(0.9);  // Pause at the outside
            expect(embeddedPlayerMock.pauseMock).not.toHaveBeenCalled();

            embeddedPlayerMock.zeroCheck();
        });

        describe('Host resuming', () => {
            type HostResumingInput = [
                title: string,
                // Input: whether the host resumes at the same time when it paused.
                hostResumeAtSameTime: boolean,
                // Input: whether the embedded player is random accessible.
                randomAccessible: boolean,
                // The result: whether the embedded player will be resumed or stopped.
                embeddedPlayerResumable: boolean,
            ];
            test.each([
                [
                    'For non-random-accessible embedded players, if host resume at same time, the embedded players will be resumed, too',
                    true,
                    false,
                    true,
                ],
                [
                    'For non-random-accessible embedded players, embedded players would be stopped if host resume at different time ',
                    false,
                    false,
                    false,
                ],
                [
                    'For random-accessible embedded players, embedded players would be stopped even if host resume at different time ',
                    false,
                    true,
                    true,
                ],
            ] as ReadonlyArray<HostResumingInput>)(`%s`, (_title, hostResumeAtSameTime, embeddedPlayerRandomAccessible, embeddedPlayerResumable) => {
                const embeddedPlayer = new EmbeddedPlayer();
                const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(embeddedPlayerRandomAccessible);
                embeddedPlayer.begin = 0.3;
                embeddedPlayer.end = 0.7;
                const node = new Node();
                const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);
                
                host.play(0.0);
    
                host.evaluateAt(0.33, 0); // Enter the region
                expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
                embeddedPlayerMock.playMock.mockClear();
                expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
                expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.03);
                embeddedPlayerMock.setTimeMock.mockClear();
    
                host.pause(0.4);
                expect(embeddedPlayerMock.pauseMock).toHaveBeenCalledTimes(1);
                embeddedPlayerMock.pauseMock.mockClear();
    
                const hostResumeTime = hostResumeAtSameTime
                    ? 0.4
                    : 0.4 + 0.02; // Resume at a different time
                host.play(hostResumeTime);

                if (embeddedPlayerResumable) {
                    expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
                    embeddedPlayerMock.playMock.mockClear();
                    expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
                    expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(hostResumeTime - 0.3);
                    embeddedPlayerMock.setTimeMock.mockClear();
                } else {
                    expect(embeddedPlayerMock.stopMock).toHaveBeenCalledTimes(1);
                    embeddedPlayerMock.stopMock.mockClear();
                }
    
                embeddedPlayerMock.zeroCheck();
            });
        });

        test('Embedded player\'s setSpeed() is called if it has "reconciledSpeed" set to true', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            embeddedPlayer.reconciledSpeed = true;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);

            host.setSpeed(1.9);
            expect(embeddedPlayerMock.setSpeedMock).toBeCalledTimes(1);
            expect(embeddedPlayerMock.setSpeedMock.mock.calls[0][0]).toBeCloseTo(1.9);
            embeddedPlayerMock.setSpeedMock.mockClear();

            embeddedPlayerMock.zeroCheck();
        });

        test('Embedded player\'s setSpeed() is not called if it has "reconciledSpeed" set to false', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            embeddedPlayer.reconciledSpeed = false;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);

            host.setSpeed(1.9);
            expect(embeddedPlayerMock.setSpeedMock).not.toBeCalled();

            embeddedPlayerMock.zeroCheck();
        });

        test('Twice evaluations occur in different iterations', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            embeddedPlayer.reconciledSpeed = false;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);
            
            host.evaluateAt(0.31, 0);
            expect(embeddedPlayerMock.playMock).toBeCalledTimes(1);
            embeddedPlayerMock.playMock.mockClear();
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.01);
            embeddedPlayerMock.setTimeMock.mockClear();

            // Evaluate at an outside region in different iterations. Stop.
            host.evaluateAt(0.1, 1);
            expect(embeddedPlayerMock.stopMock).toBeCalledTimes(1);
            embeddedPlayerMock.stopMock.mockClear();

            // Evaluate at an inside-region in different iterations. Play.
            host.evaluateAt(0.32, 2);
            expect(embeddedPlayerMock.playMock).toBeCalledTimes(1);
            embeddedPlayerMock.playMock.mockClear();
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.02);
            embeddedPlayerMock.setTimeMock.mockClear();

            // Slightly tweak the time, to ensure the "last iterations" has been remembered by the evaluation.
            // (if not, play() will be triggered!)
            host.evaluateAt(0.33, 2);
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.03);
            embeddedPlayerMock.setTimeMock.mockClear();
            embeddedPlayerMock.zeroCheck();

            // Evaluate at an inside-region in different iterations. Stop then play.
            host.evaluateAt(0.4, 3);
            expect(embeddedPlayerMock.stopMock).toBeCalledTimes(1);
            expect(embeddedPlayerMock.playMock).toBeCalledTimes(1);
            // Stop then play
            expect(embeddedPlayerMock.stopMock.mock.invocationCallOrder[0]).toBeLessThan(
                embeddedPlayerMock.playMock.mock.invocationCallOrder[0]
            );
            embeddedPlayerMock.stopMock.mockClear();
            embeddedPlayerMock.playMock.mockClear();
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.1);
            embeddedPlayerMock.setTimeMock.mockClear();

            // Even the evaluations span more than one iterations,
            // there still only one stop/play invocation.
            host.evaluateAt(0.5, 8);
            expect(embeddedPlayerMock.stopMock).toBeCalledTimes(1);
            expect(embeddedPlayerMock.playMock).toBeCalledTimes(1);
            // Stop then play
            expect(embeddedPlayerMock.stopMock.mock.invocationCallOrder[0]).toBeLessThan(
                embeddedPlayerMock.playMock.mock.invocationCallOrder[0]
            );
            embeddedPlayerMock.stopMock.mockClear();
            embeddedPlayerMock.playMock.mockClear();
            expect(embeddedPlayerMock.setTimeMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.setTimeMock.mock.calls[0][0]).toBeCloseTo(0.2);
            embeddedPlayerMock.setTimeMock.mockClear();

            // The above also holds for cross-iterations stopping.
            host.evaluateAt(0.8, 100);
            expect(embeddedPlayerMock.stopMock).toBeCalledTimes(1);
            embeddedPlayerMock.stopMock.mockClear();

            embeddedPlayerMock.zeroCheck();
        });

        test('Speed', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            embeddedPlayer.reconciledSpeed = true;
            const playerMock = embeddedPlayer.playable = new EmbeddedPlayerMock();

            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);
            
            host.setSpeed(0.618);
            expect(playerMock.setSpeedMock).toBeCalledTimes(1);
            expect(playerMock.setSpeedMock.mock.calls[0][0]).toBe(0.618);
        });
    });
});

class EmbeddedPlayerMock extends EmbeddedPlayable {
    constructor( private _randomAccess = false) {
        super();
    }
    
    get destroyMock() {
        return this._destroyMock;
    }

    get playMock() {
        return this._playMock;
    }

    get pauseMock () {
        return this._pauseMock;
    }

    get stopMock () {
        return this._stopMock;
    }

    get setSpeedMock() {
        return this._setSpeedMock;
    }

    get setTimeMock() {
        return this._setTimeMock;
    }

    public zeroCheck() {
        for (const mock of [
            this._destroyMock,
            this._playMock,
            this._pauseMock,
            this._stopMock,
            this._setSpeedMock,
            this._setTimeMock,
        ]) {
            expect(mock).toBeCalledTimes(0);
        }
    }

    instantiate() {
        return new InstantiatedEmbeddedPlayerMock(
            this._randomAccess,
            this._destroyMock,
            this._playMock,
            this._pauseMock,
            this._stopMock,
            this._setSpeedMock,
            this._setTimeMock,
        );
    }

    private _destroyMock = jest.fn();
    private _playMock = jest.fn();
    private _pauseMock = jest.fn();
    private _stopMock = jest.fn();
    private _setSpeedMock = jest.fn();
    private _setTimeMock = jest.fn();
}

class InstantiatedEmbeddedPlayerMock extends EmbeddedPlayableState {
    constructor(
        randomAccess: boolean,
        private _destroyMock: jest.Mock,
        private _playMock: jest.Mock,
        private _pauseMock: jest.Mock,
        private _stopMock: jest.Mock,
        private _setSpeedMock: jest.Mock,
        private _setTimeMock: jest.Mock,
    ) {
        super(randomAccess);
    }

    public destroy(...args: Parameters<EmbeddedPlayableState['destroy']>): void {
        this._destroyMock(...args);
    }

    public play(...args: Parameters<EmbeddedPlayableState['play']>): void {
        this._playMock(...args);
    }

    public pause(...args: Parameters<EmbeddedPlayableState['pause']>): void {
        this._pauseMock(...args);
    }

    public stop(...args: Parameters<EmbeddedPlayableState['stop']>): void {
        this._stopMock(...args);
    }

    public setSpeed(...args: Parameters<EmbeddedPlayableState['stop']>): void {
        this._setSpeedMock(...args);
    }

    public setTime(...args: Parameters<EmbeddedPlayableState['setTime']>): void {
        this._setTimeMock(...args);
    }
}