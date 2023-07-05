import { EventHandler } from '../../cocos/vfx/event-handler';
import { VFXExecutionStageFlags, VFXModule } from '../../cocos/vfx/vfx-module';

describe('event-handler', () => {
    test('EventHandler', () => {
        @VFXModule.register('test', VFXExecutionStageFlags.EMITTER)
        class TestModule extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error('Method not implemented.');
            }
        }

        @VFXModule.register('test2', VFXExecutionStageFlags.EVENT_HANDLER)
        class TestModule2 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error('Method not implemented.');
            }
        }

        const eventHandler = new EventHandler();
        expect(() => eventHandler.addModule(TestModule)).toThrowError();
        expect(() => eventHandler.addModule(TestModule2)).not.toThrowError();
    });
});