import { EventHandler } from '../../cocos/vfx/event-handler';
import { ContextDataSet } from '../../cocos/vfx/base';
import { ParticleDataSet } from '../../cocos/vfx/particle-data-set';
import { ModuleExecStageFlags, VFXModule } from '../../cocos/vfx/vfx-module';
import { EmitterDataSet } from '../../cocos/vfx/emitter-data-set';
import { UserDataSet } from '../../cocos/vfx/user-data-set';

describe('event-handler', () => {
    test('EventHandler', () => {
        @VFXModule.register('test', ModuleExecStageFlags.EMITTER)
        class TestModule extends VFXModule {
            public execute(particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
                throw new Error('Method not implemented.');
            }
        }

        @VFXModule.register('test2', ModuleExecStageFlags.EVENT_HANDLER)
        class TestModule2 extends VFXModule {
            public execute(particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
                throw new Error('Method not implemented.');
            }
        }

        const eventHandler = new EventHandler();
        expect(() => eventHandler.addModule(TestModule)).toThrowError();
        expect(() => eventHandler.addModule(TestModule2)).not.toThrowError();
    });
});