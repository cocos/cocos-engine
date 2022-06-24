import { Node } from "../../../cocos/core";
import { addEmbeddedPlayerTag, AnimationClip } from "../../../cocos/core/animation/animation-clip";
import { AnimationState } from "../../../cocos/core/animation/animation-state";
import { EmbeddedPlayer, EmbeddedPlayable, EmbeddedPlayableState } from "../../../cocos/core/animation/embedded-player/embedded-player";
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

            host.evaluateAt(0.33); // Enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
            embeddedPlayerMock.playMock.mockClear();

            embeddedPlayerMock.zeroCheck();
        });

        test('Embedded player\'s stop() is called when host evaluating outside the embedded player\'s interval', () => {
            const embeddedPlayer = new EmbeddedPlayer();
            const embeddedPlayerMock = embeddedPlayer.playable = new EmbeddedPlayerMock(false);
            embeddedPlayer.begin = 0.3;
            embeddedPlayer.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostEmbeddedPlayerMock(node, embeddedPlayer, 1.2);

            host.evaluateAt(0.33); // Enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
            embeddedPlayerMock.playMock.mockClear();

            host.evaluateAt(0.6); // Evaluate at the middle, nothing happened

            host.evaluateAt(0.75); // Evaluate outside the interval, call `stop()`
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

            host.evaluateAt(0.33); // Enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
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

            host.evaluateAt(0.33); // Enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
            embeddedPlayerMock.playMock.mockClear();

            host.evaluateAt(0.8); // Evaluate outside the interval
            expect(embeddedPlayerMock.stopMock).toHaveBeenCalledTimes(1);
            embeddedPlayerMock.stopMock.mockClear();

            host.evaluateAt(0.42); // Again enter the region
            expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(embeddedPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.12);
            embeddedPlayerMock.playMock.mockClear();

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
            host.evaluateAt(0.13);
            host.pause(0.14); // Pause at the outside before the first time the embedded player entered.
            expect(embeddedPlayerMock.pauseMock).not.toHaveBeenCalled();
            
            host.play(0.32);
            host.evaluateAt(0.32); // Enter the embedded player
            embeddedPlayerMock.playMock.mockClear();

            expect(embeddedPlayerMock.pauseMock).not.toHaveBeenCalled();
            host.pause(0.33);
            expect(embeddedPlayerMock.pauseMock).toHaveBeenCalledTimes(1);
            embeddedPlayerMock.pauseMock.mockClear();

            host.play(0.4);
            embeddedPlayerMock.playMock.mockClear();
            host.evaluateAt(0.87); // Exit the embedded player
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
    
                host.evaluateAt(0.33); // Enter the region
                expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
                expect(embeddedPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
                embeddedPlayerMock.playMock.mockClear();
    
                host.pause(0.4);
                expect(embeddedPlayerMock.pauseMock).toHaveBeenCalledTimes(1);
                embeddedPlayerMock.pauseMock.mockClear();
    
                const hostResumeTime = hostResumeAtSameTime
                    ? 0.4
                    : 0.4 + 0.02; // Resume at a different time
                host.play(hostResumeTime);

                if (embeddedPlayerResumable) {
                    expect(embeddedPlayerMock.playMock).toHaveBeenCalledTimes(1);
                    expect(embeddedPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(hostResumeTime - 0.3);
                    embeddedPlayerMock.playMock.mockClear();
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

        test('Broadcasting of animation state\'s speed', () => {
            const clip = new AnimationClip();
            clip.speed = 0.6;
            const embeddedPlayer = new EmbeddedPlayer();
            embeddedPlayer.reconciledSpeed = true;
            const playerMock = embeddedPlayer.playable = new EmbeddedPlayerMock();
            clip[addEmbeddedPlayerTag](embeddedPlayer);

            const animationState = new AnimationState(clip);
            const node = new Node();
            expect(playerMock.setSpeedMock).not.toBeCalled();

            animationState.initialize(node);
            expect(playerMock.setSpeedMock).toBeCalledTimes(1);
            expect(playerMock.setSpeedMock.mock.calls[0][0]).toBe(0.6);
            playerMock.setSpeedMock.mockClear();

            animationState.speed = 0.8;
            expect(playerMock.setSpeedMock).toBeCalledTimes(1);
            expect(playerMock.setSpeedMock.mock.calls[0][0]).toBe(0.8);
            playerMock.setSpeedMock.mockClear();
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

    public zeroCheck() {
        for (const mock of [
            this._destroyMock,
            this._playMock,
            this._pauseMock,
            this._stopMock,
            this._setSpeedMock,
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
        );
    }

    private _destroyMock = jest.fn();
    private _playMock = jest.fn();
    private _pauseMock = jest.fn();
    private _stopMock = jest.fn();
    private _setSpeedMock = jest.fn();
}

class InstantiatedEmbeddedPlayerMock extends EmbeddedPlayableState {
    constructor(
        randomAccess: boolean,
        private _destroyMock: jest.Mock,
        private _playMock: jest.Mock,
        private _pauseMock: jest.Mock,
        private _stopMock: jest.Mock,
        private _setSpeedMock: jest.Mock,
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
}