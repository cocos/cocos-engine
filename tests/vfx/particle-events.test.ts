import { VFXEventInfo, VFXEvents } from '../../cocos/vfx/base';
import { RandomStream } from '../../cocos/vfx/random-stream';

describe('VFXEvents', () => {
    test('capacity', () => {
        const particleEventInfo = new VFXEventInfo();
        const particleEvents = new VFXEvents();
        expect(particleEvents.capacity).toBe(16);
        expect(particleEvents.count).toBe(0);
        particleEvents.dispatch(particleEventInfo);
        expect(particleEvents.count).toBe(1);
        expect(particleEvents.capacity).toBe(16);
        for (let i = 0; i < 50; i++) {
            particleEvents.dispatch(particleEventInfo);
        }
        expect(particleEvents.count).toBe(51);
        expect(particleEvents.capacity).toBe(64);
        particleEvents.clear();
        expect(particleEvents.count).toBe(0);
        expect(particleEvents.capacity).toBe(64);
        for (let i = 0; i < 100; i++) {
            particleEvents.dispatch(particleEventInfo);
        }
        expect(particleEvents.count).toBe(100);
        expect(particleEvents.capacity).toBe(128);
        particleEvents.clear();
        expect(particleEvents.count).toBe(0);
        expect(particleEvents.capacity).toBe(128);
    });
    
    test('dispatch and getEventInfo', () => {
        const particleEventInfo = new VFXEventInfo();
        const particleEvents = new VFXEvents();
        expect(particleEvents.count).toBe(0);
        expect(() => particleEvents.getEventInfoAt(particleEventInfo, 0)).toThrowError();
        const randomStream = new RandomStream();
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < 100; i++) {
            particleEventInfo.type = randomStream.getIntFromRange(0, 4);
            particleEventInfo.color.set(randomStream.getIntFromRange(0, 255), randomStream.getIntFromRange(0, 255), randomStream.getIntFromRange(0, 255), randomStream.getIntFromRange(0, 255));
            particleEventInfo.position.set(randomStream.getFloatFromRange(10, 20), randomStream.getFloatFromRange(5, 10), randomStream.getFloatFromRange(1, 5));
            particleEventInfo.velocity.set(randomStream.getFloatFromRange(10, 20), randomStream.getFloatFromRange(5, 10), randomStream.getFloatFromRange(1, 5));
            particleEventInfo.size.set(randomStream.getFloatFromRange(10, 20), randomStream.getFloatFromRange(5, 10), randomStream.getFloatFromRange(1, 5));
            particleEventInfo.rotation.set(randomStream.getFloatFromRange(10, 20), randomStream.getFloatFromRange(5, 10), randomStream.getFloatFromRange(1, 5));
            particleEventInfo.randomSeed = randomStream.getUInt32();
            particleEventInfo.currentTime = randomStream.getFloatFromRange(0, 5);
            particleEventInfo.prevTime = randomStream.getFloatFromRange(0, 5);
            particleEventInfo.particleId = randomStream.getIntFromRange(0, 100);
            particleEvents.dispatch(particleEventInfo);
        }

        expect(particleEvents.count).toBe(100);
        expect(() => particleEvents.getEventInfoAt(particleEventInfo, -1)).toThrowError();
        expect(() => particleEvents.getEventInfoAt(particleEventInfo, 200)).toThrowError();

        const particleEventInfo2 = new VFXEventInfo();
        for (let i = 0; i < 100; i++) {
            const eventInfo = particleEvents.getEventInfoAt(particleEventInfo2, i);
            expect(eventInfo.type).toBe(randomStream2.getIntFromRange(0, 4));
            expect(eventInfo.color.r).toBe(randomStream2.getIntFromRange(0, 255));
            expect(eventInfo.color.g).toBe(randomStream2.getIntFromRange(0, 255));
            expect(eventInfo.color.b).toBe(randomStream2.getIntFromRange(0, 255));
            expect(eventInfo.color.a).toBe(randomStream2.getIntFromRange(0, 255));
            expect(eventInfo.position.x).toBeCloseTo(randomStream2.getFloatFromRange(10, 20), 5);
            expect(eventInfo.position.y).toBeCloseTo(randomStream2.getFloatFromRange(5, 10), 5);
            expect(eventInfo.position.z).toBeCloseTo(randomStream2.getFloatFromRange(1, 5), 5);
            expect(eventInfo.velocity.x).toBeCloseTo(randomStream2.getFloatFromRange(10, 20), 5);
            expect(eventInfo.velocity.y).toBeCloseTo(randomStream2.getFloatFromRange(5, 10), 5);
            expect(eventInfo.velocity.z).toBeCloseTo(randomStream2.getFloatFromRange(1, 5), 5);
            expect(eventInfo.size.x).toBeCloseTo(randomStream2.getFloatFromRange(10, 20), 5);
            expect(eventInfo.size.y).toBeCloseTo(randomStream2.getFloatFromRange(5, 10), 5);
            expect(eventInfo.size.z).toBeCloseTo(randomStream2.getFloatFromRange(1, 5), 5);
            expect(eventInfo.rotation.x).toBeCloseTo(randomStream2.getFloatFromRange(10, 20), 5);
            expect(eventInfo.rotation.y).toBeCloseTo(randomStream2.getFloatFromRange(5, 10), 5);
            expect(eventInfo.rotation.z).toBeCloseTo(randomStream2.getFloatFromRange(1, 5), 5);
            expect(eventInfo.randomSeed).toBe(randomStream2.getUInt32());
            expect(eventInfo.currentTime).toBeCloseTo(randomStream2.getFloatFromRange(0, 5), 5);
            expect(eventInfo.prevTime).toBeCloseTo(randomStream2.getFloatFromRange(0, 5), 5);
            expect(eventInfo.particleId).toBe(randomStream2.getIntFromRange(0, 100));
        }
        
    });

});