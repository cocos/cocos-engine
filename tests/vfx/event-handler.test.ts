import { EventHandler, EventSpawnStates } from '../../cocos/vfx/event-handler';
import { VFXEmitterParams, ModuleExecContext } from '../../cocos/vfx/particle-base';
import { ParticleDataSet } from '../../cocos/vfx/particle-data-set';
import { ModuleExecStage, VFXModule } from '../../cocos/vfx/particle-module';

describe('event-handler', () => {
    test ('EventSpawnStates', () => {
        const eventSpawnStates = new EventSpawnStates();
        expect(eventSpawnStates.capacity).toBe(16);
        expect(eventSpawnStates.count).toBe(0);
        expect(() => eventSpawnStates.setSpawnFraction(0, 0.1)).toThrowError();
        for (let i = 0; i < 1000; i++) {
            expect(eventSpawnStates.getSpawnFraction(i)).toBe(0);
        }
        expect(eventSpawnStates.capacity).toBe(1024);
        expect(eventSpawnStates.count).toBe(1000);
        for (let i = 0; i < 1000; i++) {
            eventSpawnStates.setSpawnFraction(i, i + 1);
        }
        for (let i = 0; i < 1000; i++) {
            expect(eventSpawnStates.getSpawnFraction(i)).toBe(i + 1);
        }
        eventSpawnStates.tick();
        expect(eventSpawnStates.count).toBe(1000);
        for (let i = 0; i < 1000; i++) {
            expect(eventSpawnStates.getSpawnFraction(i)).toBe(i + 1);
        }
        for (let i = 0; i < 500; i++) {
            eventSpawnStates.setSpawnFraction(i, (i + 1) * 2);
        }
        for (let i = 0; i < 500; i++) {
            expect(eventSpawnStates.getSpawnFraction(i)).toBe((i + 1) * 2);
        }
        for (let i = 500; i < 1000; i++) {
            expect(eventSpawnStates.getSpawnFraction(i)).toBe(i + 1);
        }
        eventSpawnStates.tick();
        expect(eventSpawnStates.count).toBe(1000);
        expect(eventSpawnStates.capacity).toBe(1024);
        expect(eventSpawnStates.getSpawnFraction(0)).toBe(1 * 2);
        expect(eventSpawnStates.getSpawnFraction(29)).toBe(30 * 2);
        expect(eventSpawnStates.getSpawnFraction(499)).toBe(500 * 2);
        expect(eventSpawnStates.getSpawnFraction(898)).toBe(899);
        expect(eventSpawnStates.getSpawnFraction(999)).toBe(1000);
        eventSpawnStates.tick();
        expect(eventSpawnStates.count).toBe(5);
        expect(eventSpawnStates.capacity).toBe(1024);
        for (let i = 0; i < 500; i++) {
            if (i === 29 || i === 499 || i === 0) {
                expect(eventSpawnStates.getSpawnFraction(i)).toBe((i + 1) * 2);
            } else {
                expect(eventSpawnStates.getSpawnFraction(i)).toBe(0);
            }
            eventSpawnStates.setSpawnFraction(i, 0.1);
        }
        
        eventSpawnStates.tick();
        expect(eventSpawnStates.count).toBe(500);
        for (let i = 0; i < 500; i++) {
            expect(eventSpawnStates.getSpawnFraction(i)).toBeCloseTo(0.1, 5);
        }
        eventSpawnStates.tick();
        expect(eventSpawnStates.count).toBe(500);
        eventSpawnStates.tick();
        expect(eventSpawnStates.count).toBe(0);
        expect(eventSpawnStates.capacity).toBe(1024);
        for (let i = 0; i < 500; i++) {
            expect(eventSpawnStates.getSpawnFraction(i)).toBe(0);
            eventSpawnStates.setSpawnFraction(i, 0.1);
        }
        eventSpawnStates.clear();
        expect(eventSpawnStates.count).toBe(0);
        for (let i = 0; i < 500; i++) {
            expect(eventSpawnStates.getSpawnFraction(i)).toBe(0);
        }
        expect(eventSpawnStates.count).toBe(500);
        eventSpawnStates.clear();
        expect(eventSpawnStates.count).toBe(0);
    });

    test('EventHandler', () => {
        @VFXModule.register('test', ModuleExecStage.EMITTER)
        class TestModule extends VFXModule {
            public execute(particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
                throw new Error('Method not implemented.');
            }
        }

        @VFXModule.register('test2', ModuleExecStage.EVENT_HANDLER)
        class TestModule2 extends VFXModule {
            public execute(particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
                throw new Error('Method not implemented.');
            }
        }

        const eventHandler = new EventHandler();
        expect(() => eventHandler.addModule(TestModule)).toThrowError();
        expect(() => eventHandler.addModule(TestModule2)).not.toThrowError();

        for (let i = 0; i < 5; i++) { 
            expect(eventHandler.eventSpawnStates.getSpawnFraction(i)).toBe(0);
            eventHandler.eventSpawnStates.setSpawnFraction(i, i);
        }

        const particles = new ParticleDataSet();
        const params = new VFXEmitterParams();
        const context = new ModuleExecContext();
        eventHandler.tick(particles, emitter, user, context);
        for (let i = 0; i < 5; i++) {
            expect(eventHandler.eventSpawnStates.getSpawnFraction(i)).toBe(i);
        }
        eventHandler.tick(particles, emitter, user, context);
        eventHandler.tick(particles, emitter, user, context);
        expect(eventHandler.eventSpawnStates.count).toBe(0);
        for (let i = 0; i < 5; i++) {
            expect(eventHandler.eventSpawnStates.getSpawnFraction(i)).toBe(0);
        }
    });
});