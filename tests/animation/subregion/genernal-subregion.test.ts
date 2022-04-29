import { Node } from "../../../cocos/core";
import {  Subregion, SubRegionPlayer, InstantiatedSubRegionPlayer } from "../../../cocos/core/animation/subregion/subregion";
import { AnimationClipHostSubRegionMock } from "./util";

describe('General subregion test', () => {
    test('Default', () => {
        const subregion = new Subregion();
        expect(subregion.begin).toBe(0.0);
        expect(subregion.end).toBe(0.0);
        expect(subregion.reconciledSpeed).toBe(false);
        expect(subregion.player).toBe(null);
    });

    describe('Subregion behaviors during animation clip evaluation', () => {
        test('Subregion\'s play() is called when and only when host evaluating', () => {
            const subregion = new Subregion();
            const subregionPlayerMock = subregion.player = new SubregionPlayerMock(false);
            subregion.begin = 0.3;
            subregion.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostSubRegionMock(node, subregion, 1.2);
            
            host.play(0.32); // The time has arrived in subregion's interval, but it has not been evaluated.
            expect(subregionPlayerMock.playMock).toHaveBeenCalledTimes(0);

            host.evaluateAt(0.33); // Enter the region
            expect(subregionPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(subregionPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
            subregionPlayerMock.playMock.mockClear();

            subregionPlayerMock.zeroCheck();
        });

        test('Subregion\'s stop() is called when host evaluating outside the subregion\'s interval', () => {
            const subregion = new Subregion();
            const subregionPlayerMock = subregion.player = new SubregionPlayerMock(false);
            subregion.begin = 0.3;
            subregion.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostSubRegionMock(node, subregion, 1.2);

            host.evaluateAt(0.33); // Enter the region
            expect(subregionPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(subregionPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
            subregionPlayerMock.playMock.mockClear();

            host.evaluateAt(0.6); // Evaluate at the middle, nothing happened

            host.evaluateAt(0.75); // Evaluate outside the interval, call `stop()`
            expect(subregionPlayerMock.stopMock).toHaveBeenCalledTimes(1);
            subregionPlayerMock.stopMock.mockClear();

            subregionPlayerMock.zeroCheck();
        });

        test('Subregion\'s stop() is also called when host stops', () => {
            const subregion = new Subregion();
            const subregionPlayerMock = subregion.player = new SubregionPlayerMock(false);
            subregion.begin = 0.3;
            subregion.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostSubRegionMock(node, subregion, 1.2);

            host.evaluateAt(0.33); // Enter the region
            expect(subregionPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(subregionPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
            subregionPlayerMock.playMock.mockClear();

            host.stop(); // Evaluate outside the interval, call `stop()`
            expect(subregionPlayerMock.stopMock).toHaveBeenCalledTimes(1);
            subregionPlayerMock.stopMock.mockClear();

            subregionPlayerMock.zeroCheck();
        });

        test('Subregion\'s play() is triggered every time it reentered', () => {
            const subregion = new Subregion();
            const subregionPlayerMock = subregion.player = new SubregionPlayerMock(false);
            subregion.begin = 0.3;
            subregion.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostSubRegionMock(node, subregion, 1.2);

            host.evaluateAt(0.33); // Enter the region
            expect(subregionPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(subregionPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
            subregionPlayerMock.playMock.mockClear();

            host.evaluateAt(0.8); // Evaluate outside the interval
            expect(subregionPlayerMock.stopMock).toHaveBeenCalledTimes(1);
            subregionPlayerMock.stopMock.mockClear();

            host.evaluateAt(0.42); // Again enter the region
            expect(subregionPlayerMock.playMock).toHaveBeenCalledTimes(1);
            expect(subregionPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.12);
            subregionPlayerMock.playMock.mockClear();

            subregionPlayerMock.zeroCheck();
        });

        test('Subregion\'s pause() is called when host pauses in the subregions\'s interval', () => {
            const subregion = new Subregion();
            const subregionPlayerMock = subregion.player = new SubregionPlayerMock(false);
            subregion.begin = 0.3;
            subregion.end = 0.7;
            const node = new Node();
            const host = new AnimationClipHostSubRegionMock(node, subregion, 1.2);

            host.play(0.13);
            host.evaluateAt(0.13);
            host.pause(0.14); // Pause at the outside before the first time the subregion entered.
            expect(subregionPlayerMock.pauseMock).not.toHaveBeenCalled();
            
            host.play(0.32);
            host.evaluateAt(0.32); // Enter the subregion
            subregionPlayerMock.playMock.mockClear();

            expect(subregionPlayerMock.pauseMock).not.toHaveBeenCalled();
            host.pause(0.33);
            expect(subregionPlayerMock.pauseMock).toHaveBeenCalledTimes(1);
            subregionPlayerMock.pauseMock.mockClear();

            host.play(0.4);
            subregionPlayerMock.playMock.mockClear();
            host.evaluateAt(0.87); // Exit the subregion
            subregionPlayerMock.stopMock.mockClear();

            host.pause(0.9);  // Pause at the outside
            expect(subregionPlayerMock.pauseMock).not.toHaveBeenCalled();

            subregionPlayerMock.zeroCheck();
        });

        describe('Host resuming', () => {
            type HostResumingInput = [
                title: string,
                // Input: whether the host resumes at the same time when it paused.
                hostResumeAtSameTime: boolean,
                // Input: whether the subregion is random accessible.
                randomAccessible: boolean,
                // The result: whether the subregion will be resumed or stopped.
                subregionResumable: boolean,
            ];
            test.each([
                [
                    'For non-random-accessible subregion, if host resume at same time, the subregion will be resumed, too',
                    true,
                    false,
                    true,
                ],
                [
                    'For non-random-accessible subregion, subregion would be stopped if host resume at different time ',
                    false,
                    false,
                    false,
                ],
                [
                    'For random-accessible subregion, subregion would be stopped even if host resume at different time ',
                    false,
                    true,
                    true,
                ],
            ] as ReadonlyArray<HostResumingInput>)(`%s`, (_title, hostResumeAtSameTime, subregionRandomAccessible, subregionResumable) => {
                const subregion = new Subregion();
                const subregionPlayerMock = subregion.player = new SubregionPlayerMock(subregionRandomAccessible);
                subregion.begin = 0.3;
                subregion.end = 0.7;
                const node = new Node();
                const host = new AnimationClipHostSubRegionMock(node, subregion, 1.2);
                
                host.play(0.0);
    
                host.evaluateAt(0.33); // Enter the region
                expect(subregionPlayerMock.playMock).toHaveBeenCalledTimes(1);
                expect(subregionPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(0.03);
                subregionPlayerMock.playMock.mockClear();
    
                host.pause(0.4);
                expect(subregionPlayerMock.pauseMock).toHaveBeenCalledTimes(1);
                subregionPlayerMock.pauseMock.mockClear();
    
                const hostResumeTime = hostResumeAtSameTime
                    ? 0.4
                    : 0.4 + 0.02; // Resume at a different time
                host.play(hostResumeTime);

                if (subregionResumable) {
                    expect(subregionPlayerMock.playMock).toHaveBeenCalledTimes(1);
                    expect(subregionPlayerMock.playMock.mock.calls[0][0]).toBeCloseTo(hostResumeTime - 0.3);
                    subregionPlayerMock.playMock.mockClear();
                } else {
                    expect(subregionPlayerMock.stopMock).toHaveBeenCalledTimes(1);
                    subregionPlayerMock.stopMock.mockClear();
                }
    
                subregionPlayerMock.zeroCheck();
            });
        });

        test('Subregion\'s setSpeed() is called if it has "reconciledSpeed" set to true', () => {
            const subregion = new Subregion();
            const subregionPlayerMock = subregion.player = new SubregionPlayerMock(false);
            subregion.begin = 0.3;
            subregion.end = 0.7;
            subregion.reconciledSpeed = true;
            const node = new Node();
            const host = new AnimationClipHostSubRegionMock(node, subregion, 1.2);

            host.setSpeed(1.9);
            expect(subregionPlayerMock.setSpeedMock).toBeCalledTimes(1);
            expect(subregionPlayerMock.setSpeedMock.mock.calls[0][0]).toBeCloseTo(1.9);
            subregionPlayerMock.setSpeedMock.mockClear();

            subregionPlayerMock.zeroCheck();
        });

        test('Subregion\'s setSpeed() is not called if it has "reconciledSpeed" set to false', () => {
            const subregion = new Subregion();
            const subregionPlayerMock = subregion.player = new SubregionPlayerMock(false);
            subregion.begin = 0.3;
            subregion.end = 0.7;
            subregion.reconciledSpeed = false;
            const node = new Node();
            const host = new AnimationClipHostSubRegionMock(node, subregion, 1.2);

            host.setSpeed(1.9);
            expect(subregionPlayerMock.setSpeedMock).not.toBeCalled();

            subregionPlayerMock.zeroCheck();
        });
    });
});

class SubregionPlayerMock extends SubRegionPlayer {
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
        return new InstantiatedSubregionPlayerMock(
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

class InstantiatedSubregionPlayerMock extends InstantiatedSubRegionPlayer {
    constructor(
        randomAccess: boolean,
        private _destroyMock: jest.Mock,
        private _playMock: jest.Mock,
        private _pauseMock: jest.Mock,
        private _stopMock: jest.Mock,
        private _setSpeedMock: jest.Mock,
    ) {
        super();
        this._randomAccess = randomAccess;
    }

    public destroy(...args: Parameters<InstantiatedSubRegionPlayer['destroy']>): void {
        this._destroyMock(...args);
    }

    public play(...args: Parameters<InstantiatedSubRegionPlayer['play']>): void {
        this._playMock(...args);
    }

    public pause(...args: Parameters<InstantiatedSubRegionPlayer['pause']>): void {
        this._pauseMock(...args);
    }

    public stop(...args: Parameters<InstantiatedSubRegionPlayer['stop']>): void {
        this._stopMock(...args);
    }

    public setSpeed(...args: Parameters<InstantiatedSubRegionPlayer['stop']>): void {
        this._setSpeedMock(...args);
    }
}