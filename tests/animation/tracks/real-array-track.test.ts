import { RealArrayTrack } from "../../../cocos/animation/tracks/array-track";

describe('Real array track', () => {
    test('Length', () => {
        const track = new RealArrayTrack();
        expect(track.elementCount).toBe(0);
        expect(track.channels()).toHaveLength(0);

        track.elementCount = 0;
        expect(track.elementCount).toBe(0);
        expect(track.channels()).toHaveLength(0);

        track.elementCount = 2;
        expect(track.elementCount).toBe(2);
        expect(track.channels()).toHaveLength(2);
        expect(track.channels()[0].curve.keyFramesCount).toBe(0);
        expect(track.channels()[1].curve.keyFramesCount).toBe(0);

        track.channels()[0].curve.assignSorted([
            [0.0, 3.14],
        ]);
        track.elementCount = 1;
        expect(track.elementCount).toBe(1);
        expect(track.channels()).toHaveLength(1);
        expect(track.channels()[0].curve.getKeyframeValue(0).value).toBe(3.14);
    });
});