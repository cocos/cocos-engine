import { EmitterDataSet } from "../../cocos/vfx/emitter-data-set";
import { UserDataSet } from "../../cocos/vfx/user-data-set";
import { VFXEmitterParams, VFXEmitterState, ContextDataSet } from "../../cocos/vfx/base";
import { ParticleDataSet } from "../../cocos/vfx/particle-data-set";
import { VFXExecutionStage, VFXExecutionStageFlags, VFXModule, VFXStage } from "../../cocos/vfx/vfx-module";
import { RandomStream } from "../../cocos/vfx/random-stream";

describe('VFXModule', () => {
    test('VFXModule registry', () => {
        expect(VFXModule.allRegisteredModules.length).toBe(0);
        expect(VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.UPDATE, []).length).toBe(0);
        @VFXModule.register('Test1', VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.SPAWN | VFXExecutionStageFlags.EMITTER)
        class TestModule extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        @VFXModule.register('Test2', VFXExecutionStageFlags.SPAWN, ['customData', 'customData2'], ['customData3'])
        class TestModule2 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        class TestModule3 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        class TestModule4 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }
        expect(VFXModule.allRegisteredModules.length).toBe(2);
        const moduleIdentity = VFXModule.getModuleIdentityByClass(TestModule);
        expect(VFXModule.getModuleIdentityByName('Test1')).toBe(moduleIdentity);
        expect(moduleIdentity).toBeTruthy();
        expect(moduleIdentity?.ctor).toBe(TestModule);
        expect(moduleIdentity?.name).toBe('Test1');
        expect(moduleIdentity?.execStages).toBe( VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.SPAWN | VFXExecutionStageFlags.EMITTER);
        expect(moduleIdentity?.consumeParams.length).toBe(0);
        expect(moduleIdentity?.provideParams.length).toBe(0);
        expect(moduleIdentity).toBe(VFXModule.getModuleIdentityByClassUnsafe(TestModule));

        const moduleIdentity1 = VFXModule.getModuleIdentityByClass(TestModule2);
        expect(VFXModule.getModuleIdentityByName('Test2')).toBe(moduleIdentity1);
        expect(moduleIdentity1).toBeTruthy();
        expect(moduleIdentity1?.ctor).toBe(TestModule2);
        expect(moduleIdentity1?.name).toBe('Test2');
        expect(moduleIdentity1?.execStages).toBe(VFXExecutionStageFlags.SPAWN);
        expect(moduleIdentity1?.consumeParams).toStrictEqual([ 'customData3' ]);
        expect(moduleIdentity1?.provideParams).toStrictEqual([ 'customData', 'customData2' ]);
        expect(moduleIdentity1).toBe(VFXModule.getModuleIdentityByClassUnsafe(TestModule2));

        const spawnModuleIdentities = VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.SPAWN, []);
        expect(spawnModuleIdentities.length).toBe(2);
        expect(spawnModuleIdentities[0]).toBe(moduleIdentity);
        expect(spawnModuleIdentities[1]).toBe(moduleIdentity1);
        const updateModuleIdentities = VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.UPDATE, []);
        expect(updateModuleIdentities.length).toBe(1);
        expect(updateModuleIdentities[0]).toBe(moduleIdentity);
        const emitterUpdateModuleIdentities = VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.EMITTER, []);
        expect(emitterUpdateModuleIdentities.length).toBe(1);
        expect(emitterUpdateModuleIdentities[0]).toBe(moduleIdentity);

        const moduleIdentity2 = VFXModule.getModuleIdentityByClass(TestModule3);
        expect(VFXModule.getModuleIdentityByName('Test3')).toBeFalsy();
        expect(moduleIdentity2).toBeFalsy();
        expect(() => VFXModule.getModuleIdentityByClassUnsafe(TestModule3)).toThrowError();

        VFXModule.register('test3', VFXExecutionStageFlags.EMITTER | VFXExecutionStageFlags.UPDATE, [], ['test3'])(TestModule3);
        expect(VFXModule.allRegisteredModules.length).toBe(3);
        const moduleIdentity3 = VFXModule.getModuleIdentityByClass(TestModule3);
        expect(VFXModule.getModuleIdentityByName('test3')).toBe(moduleIdentity3);
        expect(moduleIdentity3).toBeTruthy();
        expect(VFXModule.getModuleIdentityByClassUnsafe(TestModule3)).toBe(moduleIdentity3);
        expect(moduleIdentity3?.ctor).toBe(TestModule3);
        expect(moduleIdentity3?.name).toBe('test3');
        expect(moduleIdentity3?.execStages).toBe(VFXExecutionStageFlags.EMITTER | VFXExecutionStageFlags.UPDATE);
        expect(moduleIdentity3?.consumeParams).toStrictEqual([ 'test3' ]);
        expect(moduleIdentity3?.provideParams).toStrictEqual([]);
        const emitterModules = VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.EMITTER, []);
        expect(emitterModules.length).toBe(2);
        expect(emitterModules[0]).toBe(moduleIdentity);
        expect(emitterModules[1]).toBe(moduleIdentity3);
        const updateModules = VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.UPDATE, []);
        expect(updateModules.length).toBe(2);
        expect(updateModules[0]).toBe(moduleIdentity);

        expect(() => VFXModule.register('test4', VFXExecutionStageFlags.EMITTER)(TestModule3)).toThrowError();
        expect(() => VFXModule.register('test3', VFXExecutionStageFlags.EMITTER)(TestModule4)).toThrowError();
        VFXModule.clearRegisteredModules();
        expect(VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.EMITTER, []).length).toBe(0);
        expect(VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.UPDATE, []).length).toBe(0);
        expect(VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.SPAWN, []).length).toBe(0);
        expect(VFXModule.allRegisteredModules.length).toBe(0);
        expect(VFXModule.getModuleIdentityByName('Test1')).toBeFalsy();
        expect(VFXModule.getModuleIdentityByName('Test2')).toBeFalsy();
        expect(VFXModule.getModuleIdentityByName('test3')).toBeFalsy();
        expect(VFXModule.getModuleIdentityByClass(TestModule3)).toBeFalsy();
        expect(VFXModule.getModuleIdentityByClass(TestModule)).toBeFalsy();
        expect(VFXModule.getModuleIdentityByClass(TestModule2)).toBeFalsy();
        VFXModule.register('test3', VFXExecutionStageFlags.EMITTER, [], ['test3'])(TestModule3);
        expect(VFXModule.getModuleIdentityByClass(TestModule3)).toBeTruthy();
        expect(VFXModule.getModuleIdentityByName('test3')).toBeTruthy();
        expect(VFXModule.getModuleIdentityByName('test3')).toBe(VFXModule.getModuleIdentityByClass(TestModule3));
        expect(VFXModule.getModuleIdentitiesWithSpecificStage(VFXExecutionStage.EMITTER, [])).toStrictEqual([VFXModule.getModuleIdentityByClass(TestModule3)]);
        VFXModule.clearRegisteredModules();
        expect(VFXModule.getModuleIdentityByClass(TestModule3)).toBeFalsy();
        expect(VFXModule.getModuleIdentityByName('test3')).toBeFalsy();
        expect(VFXModule.allRegisteredModules.length).toBe(0);
    });

    test('Find a proper position to insert', () => {
        @VFXModule.register('Test1', VFXExecutionStageFlags.UPDATE, ['A', 'B'], ['C'])
        class TestModule extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        @VFXModule.register('Test2', VFXExecutionStageFlags.UPDATE, ['C', 'D'], ['E'])
        class TestModule2 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        @VFXModule.register('Test3', VFXExecutionStageFlags.UPDATE, ['D'], ['B'])
        class TestModule3 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        @VFXModule.register('Test4', VFXExecutionStageFlags.UPDATE, [], ['D'])
        class TestModule4 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        @VFXModule.register('Test5', VFXExecutionStageFlags.UPDATE, ['D'], ['D'])
        class TestModule5 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }
        const modules: VFXModule[] = [];
        const module1 = new TestModule();
        const index = VFXModule.findAProperPositionToInsert(modules, module1, 0, modules.length);
        expect(index).toBe(0);
        modules.splice(index, 0, module1);

        const module2= new TestModule();
        const index2 = VFXModule.findAProperPositionToInsert(modules, module2, 0, modules.length);
        expect(index2).toBe(1);
        modules.splice(index2, 0, module2);

        const module3 = new TestModule2();
        const index3 = VFXModule.findAProperPositionToInsert(modules, module3, 0, modules.length);
        expect(index3).toBe(0);
        modules.splice(index3, 0, module3);

        const module4 = new TestModule2();
        const index4 = VFXModule.findAProperPositionToInsert(modules, module4, 0, modules.length);
        expect(index4).toBe(1);
        modules.splice(index4, 0, module4);

        const module5 = new TestModule3();
        const index5 = VFXModule.findAProperPositionToInsert(modules, module5, 0, modules.length);
        expect(index5).toBe(4);
        modules.splice(index5, 0, module5);

        const module6 = new TestModule4();
        const index6 = VFXModule.findAProperPositionToInsert(modules, module6, 0, modules.length);
        expect(index6).toBe(5);
        modules.splice(index6, 0, module6);

        const module7 = new TestModule5();
        const index7 = VFXModule.findAProperPositionToInsert(modules, module7, 0, modules.length);
        expect(index7).toBe(5);
        modules.splice(index7, 0, module7);

        const module8 = new TestModule4();
        const index8 = VFXModule.findAProperPositionToInsert(modules, module8, 0, modules.length);
        expect(index8).toBe(7);
        modules.splice(index8, 0, module8);

        const module9 = new TestModule5();
        const index9 = VFXModule.findAProperPositionToInsert(modules, module9, 0, modules.length);
        expect(index9).toBe(6);
        modules.splice(index9, 0, module9);
        const expectedResult = [module3, module4, module1, module2, module5, module7, module9, module6, module8];
        for (let i = 0; i < modules.length; i++) {
            expect(modules[i] === expectedResult[i]).toBeTruthy();
        }

        modules.length = 0;
        const index10 = VFXModule.findAProperPositionToInsert(modules, module9, 0, modules.length);
        expect(index10).toBe(0);
        modules.splice(index10, 0, module9);
        const index11 = VFXModule.findAProperPositionToInsert(modules, module8, 0, modules.length);
        expect(index11).toBe(1);
        modules.splice(index11, 0, module8);
        const index12 = VFXModule.findAProperPositionToInsert(modules, module7, 0, modules.length);
        expect(index12).toBe(1);
        modules.splice(index12, 0, module7);
        const index13 = VFXModule.findAProperPositionToInsert(modules, module6, 0, modules.length);
        expect(index13).toBe(3);
        modules.splice(index13, 0, module6);
        const index14 = VFXModule.findAProperPositionToInsert(modules, module5, 0, modules.length);
        expect(index14).toBe(0);
        modules.splice(index14, 0, module5);
        const index15 = VFXModule.findAProperPositionToInsert(modules, module4, 0, modules.length);
        expect(index15).toBe(1);
        modules.splice(index15, 0, module4);
        const index16 = VFXModule.findAProperPositionToInsert(modules, module3, 0, modules.length);
        expect(index16).toBe(2);
        modules.splice(index16, 0, module3);
        const index17 = VFXModule.findAProperPositionToInsert(modules, module2, 0, modules.length);
        expect(index17).toBe(7);
        modules.splice(index17, 0, module2);
        const index18 = VFXModule.findAProperPositionToInsert(modules, module1, 0, modules.length);
        expect(index18).toBe(8);
        modules.splice(index18, 0, module1);
        const expectedResult2 = [module5, module4, module3, module9, module7, module8, module6, module2, module1];
        for (let i = 0; i < modules.length; i++) {
            expect(modules[i] === expectedResult2[i]).toBeTruthy();
        }
    });

    test('randomSeed and randomStream', () => {
        class TestModule extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }
        const module = new TestModule();
        expect(module.randomSeed).toBe(0);
        expect(module.randomStream.seed).toBe(0);
        const state = new VFXEmitterState();
        state.randomStream.seed = 123;
        module.onPlay(state);
        expect(module.randomSeed).toBe(RandomStream.);
        expect(module.randomStream.seed).toBe(123);
    })
});

describe('VFXStage', () => {
    test('base', () => {
        const stage = new VFXStage();
        expect(stage.modules.length).toBe(0);
        expect(stage.execStage).toBe(VFXExecutionStage.UNKNOWN);
        
        const stage2 = new VFXStage(VFXExecutionStage.UPDATE);
        expect(stage2.modules.length).toBe(0);
        expect(stage2.execStage).toBe(VFXExecutionStage.UPDATE);

        const stage4 = new VFXStage(VFXExecutionStage.EMITTER);
        expect(stage4.modules.length).toBe(0);
        expect(stage4.execStage).toBe(VFXExecutionStage.EMITTER);

        const stage5 = new VFXStage(VFXExecutionStage.SPAWN);
        expect(stage5.modules.length).toBe(0);
        expect(stage5.execStage).toBe(VFXExecutionStage.SPAWN);
    });

    test ('Add and remove modules', () => {
        VFXModule.clearRegisteredModules();
        @VFXModule.register('Test1', VFXExecutionStageFlags.UPDATE, [], ['A'])
        class TestModule extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        @VFXModule.register('Test2', VFXExecutionStageFlags.EMITTER)
        class TestModule2 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }
        class TestModule3 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }
        @VFXModule.register('Test4', VFXExecutionStageFlags.UPDATE, ['A'], ['B'])
        class TestModule4 extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }
        const emitterStage = new VFXStage(VFXExecutionStage.EMITTER);
        expect(emitterStage.modules.length).toBe(0);
        expect(() => emitterStage.addModule(TestModule)).toThrowError();
        expect(() => emitterStage.addModule(TestModule4)).toThrowError();
        expect(() => emitterStage.addModule(TestModule3)).toThrowError();
        emitterStage.addModule(TestModule2);
        expect(emitterStage.modules.length).toBe(1);
        expect(emitterStage.getModule(TestModule2)).toBeTruthy();
        expect(emitterStage.getModule(TestModule2)).toBeInstanceOf(TestModule2);
        expect(emitterStage.getModule(TestModule)).toBeFalsy();
        expect(emitterStage.getModule(TestModule3)).toBeFalsy();
        expect(emitterStage.getModule(TestModule4)).toBeFalsy();

        const stage = new VFXStage(VFXExecutionStage.UPDATE);
        expect(stage.modules.length).toBe(0);
        expect(stage.getModule(TestModule)).toBeFalsy();
        expect(stage.getModule(TestModule2)).toBeFalsy();
        const module1 = stage.addModule(TestModule);
        expect(module1.enabled).toBeTruthy();
        expect(stage.modules.length).toBe(1);
        expect(stage.modules[0] === module1).toBeTruthy();
        expect(module1).toBeInstanceOf(TestModule);
        expect(stage.getModule(TestModule) === module1).toBeTruthy();
        const module2 = stage.addModule(TestModule);
        expect(module2.enabled).toBeTruthy();
        expect(stage.modules.length).toBe(2);
        expect(module1 !== module2).toBeTruthy();
        expect(module2).toBeInstanceOf(TestModule);
        expect(stage.modules[0] === module1).toBeTruthy();
        expect(stage.modules[1] === module2).toBeTruthy();
        expect(stage.getModule(TestModule) === module1).toBeTruthy();
        const modules = stage.getModules(TestModule, []);
        expect(module1 === modules[0]).toBeTruthy();
        expect(module2 === modules[1]).toBeTruthy();
        stage.removeModule(module1);
        expect(stage.modules.length).toBe(1);
        expect(stage.modules[0] === module2).toBeTruthy();
        expect(stage.getModule(TestModule) === module2).toBeTruthy();
        stage.removeModule(module2);
        expect(stage.modules.length).toBe(0);
        expect(stage.getModule(TestModule)).toBeFalsy();
        expect(() => stage.addModule(TestModule2)).toThrowError();
        expect(() => stage.addModule(TestModule3)).toThrowError();
        const module3 = stage.getOrAddModule(TestModule);
        expect(module3.enabled).toBeTruthy();
        expect(stage.modules.length).toBe(1);
        expect(stage.modules[0] === module3).toBeTruthy();
        expect(stage.getModule(TestModule) === module3).toBeTruthy();
        expect(module3).toBeInstanceOf(TestModule);
        const module4 = stage.getOrAddModule(TestModule);
        expect(stage.modules.length).toBe(1);
        expect(stage.modules[0] === module3).toBeTruthy();
        expect(stage.getModule(TestModule) === module3).toBeTruthy();
        expect(module3 === module4).toBeTruthy();
        expect(module4).toBeInstanceOf(TestModule);
        VFXModule.register('Test3', VFXExecutionStageFlags.UPDATE, ['A', 'B'], [])(TestModule3);
        const module5 = stage.getOrAddModule(TestModule3);
        expect(module5.enabled).toBeTruthy();
        expect(stage.modules.length).toBe(2);
        expect(stage.modules[0] === module5).toBeTruthy();
        expect(stage.modules[1] === module3).toBeTruthy();
        expect(stage.getModule(TestModule3) === module5).toBeTruthy();
        expect(module5 !== module3).toBeTruthy();
        const module6 = stage.getOrAddModule(TestModule4);
        expect(module6.enabled).toBeTruthy();
        expect(stage.modules.length).toBe(3);
        expect(stage.modules[0] === module5).toBeTruthy();
        expect(stage.modules[1] === module6).toBeTruthy();
        expect(stage.modules[2] === module3).toBeTruthy();
        expect(stage.getModule(TestModule4) === module6).toBeTruthy();
        expect(module6).toBeInstanceOf(TestModule4);
        expect(module6 !== module3).toBeTruthy();
        stage.removeModule(module5);
        expect(stage.modules.length).toBe(2);
        expect(stage.modules[0] === module6).toBeTruthy();
        expect(stage.modules[1] === module3).toBeTruthy();
        expect(stage.getModule(TestModule3)).toBeFalsy();
        expect(stage.getModule(TestModule4) === module6).toBeTruthy();
    });

    test ('Move module', () => {
        VFXModule.clearRegisteredModules();
        @VFXModule.register('Test1', VFXExecutionStageFlags.UPDATE, [], ['A'])
        class TestModule extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }
        const stage = new VFXStage(VFXExecutionStage.UPDATE);
        const module1 = stage.addModule(TestModule);
        const module2 = stage.addModule(TestModule);
        const module3 = stage.addModule(TestModule);
        const module4 = stage.addModule(TestModule);
        expect(stage.modules.length).toBe(4);
        expect(stage.modules[0] === module1).toBeTruthy();
        expect(stage.modules[1] === module2).toBeTruthy();
        expect(stage.modules[2] === module3).toBeTruthy();
        expect(stage.modules[3] === module4).toBeTruthy();
        stage.moveUpModule(module3);
        expect(stage.modules.length).toBe(4);
        expect(stage.modules[0] === module1).toBeTruthy();
        expect(stage.modules[1] === module3).toBeTruthy();
        expect(stage.modules[2] === module2).toBeTruthy();
        expect(stage.modules[3] === module4).toBeTruthy();
        stage.moveUpModule(module1);
        expect(stage.modules.length).toBe(4);
        expect(stage.modules[0] === module1).toBeTruthy();
        expect(stage.modules[1] === module3).toBeTruthy();
        expect(stage.modules[2] === module2).toBeTruthy();
        expect(stage.modules[3] === module4).toBeTruthy();
        stage.moveUpModule(module4);
        expect(stage.modules.length).toBe(4);
        expect(stage.modules[0] === module1).toBeTruthy();
        expect(stage.modules[1] === module3).toBeTruthy();
        expect(stage.modules[2] === module4).toBeTruthy();
        expect(stage.modules[3] === module2).toBeTruthy();
        stage.moveDownModule(module1);
        expect(stage.modules.length).toBe(4);
        expect(stage.modules[0] === module3).toBeTruthy();
        expect(stage.modules[1] === module1).toBeTruthy();
        expect(stage.modules[2] === module4).toBeTruthy();
        expect(stage.modules[3] === module2).toBeTruthy();
        stage.moveDownModule(module2);
        expect(stage.modules.length).toBe(4);
        expect(stage.modules[0] === module3).toBeTruthy();
        expect(stage.modules[1] === module1).toBeTruthy();
        expect(stage.modules[2] === module4).toBeTruthy();
        expect(stage.modules[3] === module2).toBeTruthy();
        stage.moveDownModule(module4);
        expect(stage.modules.length).toBe(4);
        expect(stage.modules[0] === module3).toBeTruthy();
        expect(stage.modules[1] === module1).toBeTruthy();
        expect(stage.modules[2] === module2).toBeTruthy();
        expect(stage.modules[3] === module4).toBeTruthy();
    });

    test ('Execute', () => {
        VFXModule.clearRegisteredModules();
        @VFXModule.register('Test1', VFXExecutionStageFlags.UPDATE, [], ['A'])
        class TestModule extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }
        const executeOrder: number[] = [];
        const stage = new VFXStage(VFXExecutionStage.UPDATE);
        const module1 = stage.addModule(TestModule);
        expect(module1.enabled).toBeTruthy();
        module1.enabled = false;
        module1.onPlay = jest.fn(() => { executeOrder.push(1); });
        module1.onStop = jest.fn(() => { executeOrder.push(1); });
        module1.tick = jest.fn(() => { executeOrder.push(1); });
        module1.execute = jest.fn(() => { executeOrder.push(1); });
        const module2 = stage.addModule(TestModule);
        expect(module2.enabled).toBeTruthy();
        module2.enabled = false;
        module2.onPlay = jest.fn(() => { executeOrder.push(2); });
        module2.onStop = jest.fn(() => { executeOrder.push(2); });
        module2.tick = jest.fn(() => { executeOrder.push(2); });
        module2.execute = jest.fn(() => { executeOrder.push(2); });
        const module3 = stage.addModule(TestModule);
        expect(module3.enabled).toBeTruthy();
        module3.enabled = false;
        module3.onPlay = jest.fn(() => { executeOrder.push(3); });
        module3.onStop = jest.fn(() => { executeOrder.push(3); });
        module3.tick = jest.fn(() => { executeOrder.push(3); });
        module3.execute = jest.fn(() => { executeOrder.push(3); });
        const module4 = stage.addModule(TestModule);
        expect(module4.enabled).toBeTruthy();
        module4.enabled = false;
        module4.onPlay = jest.fn(() => { executeOrder.push(4); });
        module4.onStop = jest.fn(() => { executeOrder.push(4); });
        module4.tick = jest.fn(() => { executeOrder.push(4); });
        module4.execute = jest.fn(() => { executeOrder.push(4); });
        const params = new VFXEmitterParams();
        const state = new VFXEmitterState();
        const context = new ContextDataSet();
        const particles = new ParticleDataSet();
        const emitter = new EmitterDataSet();
        const user = new UserDataSet();
        stage.onPlay(params, state);
        expect(module1.onPlay).toBeCalledTimes(1);
        expect(module2.onPlay).toBeCalledTimes(1);
        expect(module3.onPlay).toBeCalledTimes(1);
        expect(module4.onPlay).toBeCalledTimes(1);
        expect(executeOrder).toEqual([1, 2, 3, 4]);
        executeOrder.length = 0;
        stage.onStop(params, state);
        expect(module1.onStop).toBeCalledTimes(1);
        expect(module2.onStop).toBeCalledTimes(1);
        expect(module3.onStop).toBeCalledTimes(1);
        expect(module4.onStop).toBeCalledTimes(1);
        expect(executeOrder).toEqual([1, 2, 3, 4]);
        executeOrder.length = 0;
        stage.tick(dataStore);
        expect(module1.tick).toBeCalledTimes(0);
        expect(module2.tick).toBeCalledTimes(0);
        expect(module3.tick).toBeCalledTimes(0);
        expect(module4.tick).toBeCalledTimes(0);
        expect(executeOrder.length).toBe(0);
        stage.execute(particles, emitter, user, context);
        expect(module1.tick).toBeCalledTimes(0);
        expect(module2.tick).toBeCalledTimes(0);
        expect(module3.tick).toBeCalledTimes(0);
        expect(module4.tick).toBeCalledTimes(0);
        expect(executeOrder.length).toBe(0);
        module1.enabled = true;
        module2.enabled = true;
        stage.tick(dataStore);
        expect(module1.tick).toBeCalledTimes(1);
        expect(module2.tick).toBeCalledTimes(1);
        expect(module3.tick).toBeCalledTimes(0);
        expect(module4.tick).toBeCalledTimes(0);
        expect(executeOrder).toEqual([1, 2]);
        executeOrder.length = 0;
        stage.execute(particles, emitter, user, context);
        expect(module1.execute).toBeCalledTimes(1);
        expect(module2.execute).toBeCalledTimes(1);
        expect(module3.execute).toBeCalledTimes(0);
        expect(module4.execute).toBeCalledTimes(0);
        expect(executeOrder).toEqual([1, 2]);
        executeOrder.length = 0;
        module3.enabled = true;
        module4.enabled = true;
        stage.tick(dataStore);
        expect(module1.tick).toBeCalledTimes(2);
        expect(module2.tick).toBeCalledTimes(2);
        expect(module3.tick).toBeCalledTimes(1);
        expect(module4.tick).toBeCalledTimes(1);
        expect(executeOrder).toEqual([1, 2, 3, 4]);
        executeOrder.length = 0;
        stage.execute(particles, emitter, user, context);
        expect(module1.execute).toBeCalledTimes(2);
        expect(module2.execute).toBeCalledTimes(2);
        expect(module3.execute).toBeCalledTimes(1);
        expect(module4.execute).toBeCalledTimes(1);
        expect(executeOrder).toEqual([1, 2, 3, 4]);
        executeOrder.length = 0;
        module1.enabled = false;
        module3.enabled = false;
        stage.tick(dataStore);
        expect(module1.tick).toBeCalledTimes(2);
        expect(module2.tick).toBeCalledTimes(3);
        expect(module3.tick).toBeCalledTimes(1);
        expect(module4.tick).toBeCalledTimes(2);
        expect(executeOrder).toEqual([2, 4]);
        executeOrder.length = 0;
        stage.execute(particles, emitter, user, context);
        expect(module1.execute).toBeCalledTimes(2);
        expect(module2.execute).toBeCalledTimes(3);
        expect(module3.execute).toBeCalledTimes(1);
        expect(module4.execute).toBeCalledTimes(2);
        expect(executeOrder).toEqual([2, 4]);
        executeOrder.length = 0;
        module1.enabled = true;
        module2.enabled = false;
        stage.tick(dataStore);
        expect(module1.tick).toBeCalledTimes(3);
        expect(module2.tick).toBeCalledTimes(3);
        expect(module3.tick).toBeCalledTimes(1);
        expect(module4.tick).toBeCalledTimes(3);
        expect(executeOrder).toEqual([1, 4]);
        executeOrder.length = 0;
        stage.execute(particles, emitter, user, context);
        expect(module1.execute).toBeCalledTimes(3);
        expect(module2.execute).toBeCalledTimes(3);
        expect(module3.execute).toBeCalledTimes(1);
        expect(module4.execute).toBeCalledTimes(3);
        expect(executeOrder).toEqual([1, 4]);
        executeOrder.length = 0;
        module1.enabled = true;
        module2.enabled = true;
        module3.enabled = true;
        module4.enabled = true;
        stage.moveUpModule(module3);
        stage.moveUpModule(module4);
        stage.onPlay(params, state);
        expect(module1.onPlay).toBeCalledTimes(2);
        expect(module2.onPlay).toBeCalledTimes(2);
        expect(module3.onPlay).toBeCalledTimes(2);
        expect(module4.onPlay).toBeCalledTimes(2);
        expect(executeOrder).toEqual([1, 3, 4, 2]);
        executeOrder.length = 0;
        stage.onStop(params, state);
        expect(module1.onStop).toBeCalledTimes(2);
        expect(module2.onStop).toBeCalledTimes(2);
        expect(module3.onStop).toBeCalledTimes(2);
        expect(module4.onStop).toBeCalledTimes(2);
        expect(executeOrder).toEqual([1, 3, 4, 2]);
        executeOrder.length = 0;
        stage.tick(dataStore);
        expect(module1.tick).toBeCalledTimes(4);
        expect(module2.tick).toBeCalledTimes(4);
        expect(module3.tick).toBeCalledTimes(2);
        expect(module4.tick).toBeCalledTimes(4);
        expect(executeOrder).toEqual([1, 3, 4, 2]);
        executeOrder.length = 0;
        stage.execute(particles, emitter, user, context);
        expect(module1.execute).toBeCalledTimes(4);
        expect(module2.execute).toBeCalledTimes(4);
        expect(module3.execute).toBeCalledTimes(2);
        expect(module4.execute).toBeCalledTimes(4);
        expect(executeOrder).toEqual([1, 3, 4, 2]);
    });

    test('execute stage', () => {
        VFXModule.clearRegisteredModules();
        @VFXModule.register('Test1', VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.SPAWN, [], ['A'])
        class TestModule extends VFXModule {
            public execute(dataStore: VFXDataStore) {
                throw new Error("Method not implemented.");
            }
        }

        const updateStage = new VFXStage(VFXExecutionStage.UPDATE);
        const spawnStage = new VFXStage(VFXExecutionStage.SPAWN);

        const module1 = updateStage.addModule(TestModule);
        const module2 = spawnStage.addModule(TestModule);
        module1.enabled = module2.enabled = true;

        module1.tick = module1.execute = jest.fn((dataStore: VFXDataStore) => { 
            expect(context.executionStage).toBe(VFXExecutionStage.UPDATE);
        });

        module2.tick = module2.execute = jest.fn((dataStore: VFXDataStore) => {
            expect(context.executionStage).toBe(VFXExecutionStage.SPAWN);
        });

        const particles = new ParticleDataSet();
        const emitter = new EmitterDataSet();
        const user = new UserDataSet();
        const context = new ContextDataSet();

        updateStage.tick(dataStore);
        expect(module1.tick).toBeCalledTimes(1);
        updateStage.execute(particles, emitter, user, context);
        expect(module1.execute).toBeCalledTimes(2);

        spawnStage.tick(dataStore);
        expect(module2.tick).toBeCalledTimes(1);
        spawnStage.execute(particles, emitter, user, context);
        expect(module2.execute).toBeCalledTimes(2);
    });
});