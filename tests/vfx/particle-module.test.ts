import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from "../../cocos/vfx/particle-base";
import { ParticleDataSet } from "../../cocos/vfx/particle-data-set";
import { ModuleExecStage, ParticleModule, ParticleModuleStage } from "../../cocos/vfx/particle-module";

describe('particle-module', () => {
    test('particle-module registry', () => {
        expect(ParticleModule.allRegisteredModules.length).toBe(0);
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.ALL, []).length).toBe(0);
        @ParticleModule.register('Test1', ModuleExecStage.UPDATE | ModuleExecStage.SPAWN | ModuleExecStage.EMITTER_UPDATE)
        class TestModule extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        @ParticleModule.register('Test2', ModuleExecStage.SPAWN, ['customData', 'customData2'], ['customData3'])
        class TestModule2 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        class TestModule3 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        class TestModule4 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }
        expect(ParticleModule.allRegisteredModules.length).toBe(2);
        const moduleIdentity = ParticleModule.getModuleIdentityByClass(TestModule);
        expect(ParticleModule.getModuleIdentityByName('Test1')).toBe(moduleIdentity);
        expect(moduleIdentity).toBeTruthy();
        expect(moduleIdentity?.ctor).toBe(TestModule);
        expect(moduleIdentity?.name).toBe('Test1');
        expect(moduleIdentity?.execStages).toBe( ModuleExecStage.UPDATE | ModuleExecStage.SPAWN | ModuleExecStage.EMITTER_UPDATE);
        expect(moduleIdentity?.consumeParams.length).toBe(0);
        expect(moduleIdentity?.provideParams.length).toBe(0);
        expect(moduleIdentity).toBe(ParticleModule.getModuleIdentityByClassNoCheck(TestModule));

        const moduleIdentity1 = ParticleModule.getModuleIdentityByClass(TestModule2);
        expect(ParticleModule.getModuleIdentityByName('Test2')).toBe(moduleIdentity1);
        expect(moduleIdentity1).toBeTruthy();
        expect(moduleIdentity1?.ctor).toBe(TestModule2);
        expect(moduleIdentity1?.name).toBe('Test2');
        expect(moduleIdentity1?.execStages).toBe(ModuleExecStage.SPAWN);
        expect(moduleIdentity1?.consumeParams).toStrictEqual([ 'customData3' ]);
        expect(moduleIdentity1?.provideParams).toStrictEqual([ 'customData', 'customData2' ]);
        expect(moduleIdentity1).toBe(ParticleModule.getModuleIdentityByClassNoCheck(TestModule2));

        const spawnModuleIdentities = ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.SPAWN, []);
        expect(spawnModuleIdentities.length).toBe(2);
        expect(spawnModuleIdentities[0]).toBe(moduleIdentity);
        expect(spawnModuleIdentities[1]).toBe(moduleIdentity1);
        const updateModuleIdentities = ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.UPDATE, []);
        expect(updateModuleIdentities.length).toBe(1);
        expect(updateModuleIdentities[0]).toBe(moduleIdentity);
        const emitterUpdateModuleIdentities = ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.EMITTER_UPDATE, []);
        expect(emitterUpdateModuleIdentities.length).toBe(1);
        expect(emitterUpdateModuleIdentities[0]).toBe(moduleIdentity);
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.RENDER, []).length).toBe(0);
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.ALL, []).length).toBe(2);

        const moduleIdentity2 = ParticleModule.getModuleIdentityByClass(TestModule3);
        expect(ParticleModule.getModuleIdentityByName('Test3')).toBeFalsy();
        expect(moduleIdentity2).toBeFalsy();
        expect(() => ParticleModule.getModuleIdentityByClassNoCheck(TestModule3)).toThrowError();

        ParticleModule.register('test3', ModuleExecStage.EMITTER_UPDATE | ModuleExecStage.RENDER, [], ['test3'])(TestModule3);
        expect(ParticleModule.allRegisteredModules.length).toBe(3);
        const moduleIdentity3 = ParticleModule.getModuleIdentityByClass(TestModule3);
        expect(ParticleModule.getModuleIdentityByName('test3')).toBe(moduleIdentity3);
        expect(moduleIdentity3).toBeTruthy();
        expect(ParticleModule.getModuleIdentityByClassNoCheck(TestModule3)).toBe(moduleIdentity3);
        expect(moduleIdentity3?.ctor).toBe(TestModule3);
        expect(moduleIdentity3?.name).toBe('test3');
        expect(moduleIdentity3?.execStages).toBe(ModuleExecStage.EMITTER_UPDATE | ModuleExecStage.RENDER);
        expect(moduleIdentity3?.consumeParams).toStrictEqual([ 'test3' ]);
        expect(moduleIdentity3?.provideParams).toStrictEqual([]);
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.ALL, []).length).toBe(3);
        const emitterModules = ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.EMITTER_UPDATE, []);
        expect(emitterModules.length).toBe(2);
        expect(emitterModules[0]).toBe(moduleIdentity);
        expect(emitterModules[1]).toBe(moduleIdentity3);
        const renderModules = ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.RENDER, []);
        expect(renderModules.length).toBe(1);
        expect(renderModules[0]).toBe(moduleIdentity3);
        const updateModules = ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.UPDATE, []);
        expect(updateModules.length).toBe(1);
        expect(updateModules[0]).toBe(moduleIdentity);

        expect(() => ParticleModule.register('test4', ModuleExecStage.EMITTER_UPDATE)(TestModule3)).toThrowError();
        expect(() => ParticleModule.register('test3', ModuleExecStage.EMITTER_UPDATE)(TestModule4)).toThrowError();
        ParticleModule.clearRegisteredModules();
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.ALL, []).length).toBe(0);
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.EMITTER_UPDATE, []).length).toBe(0);
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.RENDER, []).length).toBe(0);
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.UPDATE, []).length).toBe(0);
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.SPAWN, []).length).toBe(0);
        expect(ParticleModule.allRegisteredModules.length).toBe(0);
        expect(ParticleModule.getModuleIdentityByName('Test1')).toBeFalsy();
        expect(ParticleModule.getModuleIdentityByName('Test2')).toBeFalsy();
        expect(ParticleModule.getModuleIdentityByName('test3')).toBeFalsy();
        expect(ParticleModule.getModuleIdentityByClass(TestModule3)).toBeFalsy();
        expect(ParticleModule.getModuleIdentityByClass(TestModule)).toBeFalsy();
        expect(ParticleModule.getModuleIdentityByClass(TestModule2)).toBeFalsy();
        ParticleModule.register('test3', ModuleExecStage.EMITTER_UPDATE, [], ['test3'])(TestModule3);
        expect(ParticleModule.getModuleIdentityByClass(TestModule3)).toBeTruthy();
        expect(ParticleModule.getModuleIdentityByName('test3')).toBeTruthy();
        expect(ParticleModule.getModuleIdentityByName('test3')).toBe(ParticleModule.getModuleIdentityByClass(TestModule3));
        expect(ParticleModule.getModuleIdentitiesWithSpecificStage(ModuleExecStage.EMITTER_UPDATE, [])).toStrictEqual([ParticleModule.getModuleIdentityByClass(TestModule3)]);
        ParticleModule.clearRegisteredModules();
        expect(ParticleModule.getModuleIdentityByClass(TestModule3)).toBeFalsy();
        expect(ParticleModule.getModuleIdentityByName('test3')).toBeFalsy();
        expect(ParticleModule.allRegisteredModules.length).toBe(0);
    });

    test('Find a proper position to insert', () => {
        @ParticleModule.register('Test1', ModuleExecStage.UPDATE, ['A', 'B'], ['C'])
        class TestModule extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        @ParticleModule.register('Test2', ModuleExecStage.UPDATE, ['C', 'D'], ['E'])
        class TestModule2 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        @ParticleModule.register('Test3', ModuleExecStage.UPDATE, ['D'], ['B'])
        class TestModule3 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        @ParticleModule.register('Test4', ModuleExecStage.UPDATE, [], ['D'])
        class TestModule4 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        @ParticleModule.register('Test5', ModuleExecStage.UPDATE, ['D'], ['D'])
        class TestModule5 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }
        const modules: ParticleModule[] = [];
        const module1 = new TestModule();
        const index = ParticleModule.findAProperPositionToInsert(modules, module1, 0, modules.length);
        expect(index).toBe(0);
        modules.splice(index, 0, module1);

        const module2= new TestModule();
        const index2 = ParticleModule.findAProperPositionToInsert(modules, module2, 0, modules.length);
        expect(index2).toBe(1);
        modules.splice(index2, 0, module2);

        const module3 = new TestModule2();
        const index3 = ParticleModule.findAProperPositionToInsert(modules, module3, 0, modules.length);
        expect(index3).toBe(0);
        modules.splice(index3, 0, module3);

        const module4 = new TestModule2();
        const index4 = ParticleModule.findAProperPositionToInsert(modules, module4, 0, modules.length);
        expect(index4).toBe(1);
        modules.splice(index4, 0, module4);

        const module5 = new TestModule3();
        const index5 = ParticleModule.findAProperPositionToInsert(modules, module5, 0, modules.length);
        expect(index5).toBe(4);
        modules.splice(index5, 0, module5);

        const module6 = new TestModule4();
        const index6 = ParticleModule.findAProperPositionToInsert(modules, module6, 0, modules.length);
        expect(index6).toBe(5);
        modules.splice(index6, 0, module6);

        const module7 = new TestModule5();
        const index7 = ParticleModule.findAProperPositionToInsert(modules, module7, 0, modules.length);
        expect(index7).toBe(5);
        modules.splice(index7, 0, module7);

        const module8 = new TestModule4();
        const index8 = ParticleModule.findAProperPositionToInsert(modules, module8, 0, modules.length);
        expect(index8).toBe(7);
        modules.splice(index8, 0, module8);

        const module9 = new TestModule5();
        const index9 = ParticleModule.findAProperPositionToInsert(modules, module9, 0, modules.length);
        expect(index9).toBe(6);
        modules.splice(index9, 0, module9);
        const expectedResult = [module3, module4, module1, module2, module5, module7, module9, module6, module8];
        for (let i = 0; i < modules.length; i++) {
            expect(modules[i] === expectedResult[i]).toBeTruthy();
        }

        modules.length = 0;
        const index10 = ParticleModule.findAProperPositionToInsert(modules, module9, 0, modules.length);
        expect(index10).toBe(0);
        modules.splice(index10, 0, module9);
        const index11 = ParticleModule.findAProperPositionToInsert(modules, module8, 0, modules.length);
        expect(index11).toBe(1);
        modules.splice(index11, 0, module8);
        const index12 = ParticleModule.findAProperPositionToInsert(modules, module7, 0, modules.length);
        expect(index12).toBe(1);
        modules.splice(index12, 0, module7);
        const index13 = ParticleModule.findAProperPositionToInsert(modules, module6, 0, modules.length);
        expect(index13).toBe(3);
        modules.splice(index13, 0, module6);
        const index14 = ParticleModule.findAProperPositionToInsert(modules, module5, 0, modules.length);
        expect(index14).toBe(0);
        modules.splice(index14, 0, module5);
        const index15 = ParticleModule.findAProperPositionToInsert(modules, module4, 0, modules.length);
        expect(index15).toBe(1);
        modules.splice(index15, 0, module4);
        const index16 = ParticleModule.findAProperPositionToInsert(modules, module3, 0, modules.length);
        expect(index16).toBe(2);
        modules.splice(index16, 0, module3);
        const index17 = ParticleModule.findAProperPositionToInsert(modules, module2, 0, modules.length);
        expect(index17).toBe(7);
        modules.splice(index17, 0, module2);
        const index18 = ParticleModule.findAProperPositionToInsert(modules, module1, 0, modules.length);
        expect(index18).toBe(8);
        modules.splice(index18, 0, module1);
        const expectedResult2 = [module5, module4, module3, module9, module7, module8, module6, module2, module1];
        for (let i = 0; i < modules.length; i++) {
            expect(modules[i] === expectedResult2[i]).toBeTruthy();
        }
    });
});

describe('ParticleModuleStage', () => {
    test ('Add and remove modules', () => {
        ParticleModule.clearRegisteredModules();
        @ParticleModule.register('Test1', ModuleExecStage.UPDATE, [], ['A'])
        class TestModule extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        @ParticleModule.register('Test2', ModuleExecStage.EMITTER_UPDATE)
        class TestModule2 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }
        class TestModule3 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }
        @ParticleModule.register('Test4', ModuleExecStage.UPDATE | ModuleExecStage.RENDER, ['A'], ['B'])
        class TestModule4 extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }
        const stage = new ParticleModuleStage(ModuleExecStage.UPDATE);
        expect(stage.modules.length).toBe(0);
        expect(stage.getModule(TestModule)).toBeFalsy();
        expect(stage.getModule(TestModule2)).toBeFalsy();
        const module1 = stage.addModule(TestModule);
        expect(stage.modules.length).toBe(1);
        expect(stage.modules[0] === module1).toBeTruthy();
        expect(stage.getModule(TestModule) === module1).toBeTruthy();
        const module2 = stage.addModule(TestModule);
        expect(stage.modules.length).toBe(2);
        expect(module1 !== module2).toBeTruthy();
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
        expect(stage.modules.length).toBe(1);
        expect(stage.modules[0] === module3).toBeTruthy();
        expect(stage.getModule(TestModule) === module3).toBeTruthy();
        const module4 = stage.getOrAddModule(TestModule);
        expect(stage.modules.length).toBe(1);
        expect(stage.modules[0] === module3).toBeTruthy();
        expect(stage.getModule(TestModule) === module3).toBeTruthy();
        expect(module3 === module4).toBeTruthy();
        ParticleModule.register('Test3', ModuleExecStage.UPDATE, ['A', 'B'], [])(TestModule3);
        const module5 = stage.getOrAddModule(TestModule3);
        expect(stage.modules.length).toBe(2);
        expect(stage.modules[0] === module5).toBeTruthy();
        expect(stage.modules[1] === module3).toBeTruthy();
        expect(stage.getModule(TestModule3) === module5).toBeTruthy();
        expect(module5 !== module3).toBeTruthy();
        const module6 = stage.getOrAddModule(TestModule4);
        expect(stage.modules.length).toBe(3);
        expect(stage.modules[0] === module5).toBeTruthy();
        expect(stage.modules[1] === module6).toBeTruthy();
        expect(stage.modules[2] === module3).toBeTruthy();
        expect(stage.getModule(TestModule4) === module6).toBeTruthy();
        expect(module6 !== module3).toBeTruthy();
        stage.removeModule(module5);
        expect(stage.modules.length).toBe(2);
        expect(stage.modules[0] === module6).toBeTruthy();
        expect(stage.modules[1] === module3).toBeTruthy();
        expect(stage.getModule(TestModule3)).toBeFalsy();
        expect(stage.getModule(TestModule4) === module6).toBeTruthy();
    });

    test ('Move module', () => {
        ParticleModule.clearRegisteredModules();
        @ParticleModule.register('Test1', ModuleExecStage.UPDATE, [], ['A'])
        class TestModule extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }
        const stage = new ParticleModuleStage(ModuleExecStage.UPDATE);
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
        ParticleModule.clearRegisteredModules();
        @ParticleModule.register('Test1', ModuleExecStage.UPDATE, [], ['A'])
        class TestModule extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }
        const executeOrder: number[] = [];
        const stage = new ParticleModuleStage(ModuleExecStage.UPDATE);
        const module1 = stage.addModule(TestModule);
        module1.onPlay = jest.fn(() => { executeOrder.push(1); });
        module1.onStop = jest.fn(() => { executeOrder.push(1); });
        module1.tick = jest.fn(() => { executeOrder.push(1); });
        module1.execute = jest.fn(() => { executeOrder.push(1); });
        const module2 = stage.addModule(TestModule);
        module2.onPlay = jest.fn(() => { executeOrder.push(2); });
        module2.onStop = jest.fn(() => { executeOrder.push(2); });
        module2.tick = jest.fn(() => { executeOrder.push(2); });
        module2.execute = jest.fn(() => { executeOrder.push(2); });
        const module3 = stage.addModule(TestModule);
        module3.onPlay = jest.fn(() => { executeOrder.push(3); });
        module3.onStop = jest.fn(() => { executeOrder.push(3); });
        module3.tick = jest.fn(() => { executeOrder.push(3); });
        module3.execute = jest.fn(() => { executeOrder.push(3); });
        const module4 = stage.addModule(TestModule);
        module4.onPlay = jest.fn(() => { executeOrder.push(4); });
        module4.onStop = jest.fn(() => { executeOrder.push(4); });
        module4.tick = jest.fn(() => { executeOrder.push(4); });
        module4.execute = jest.fn(() => { executeOrder.push(4); });
        const params = new ParticleEmitterParams();
        const state = new ParticleEmitterState();
        const context = new ParticleExecContext();
        const particles = new ParticleDataSet();
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
        stage.tick(particles, params, context);
        expect(module1.tick).toBeCalledTimes(0);
        expect(module2.tick).toBeCalledTimes(0);
        expect(module3.tick).toBeCalledTimes(0);
        expect(module4.tick).toBeCalledTimes(0);
        expect(executeOrder.length).toBe(0);
        stage.execute(particles, params, context);
        expect(module1.tick).toBeCalledTimes(0);
        expect(module2.tick).toBeCalledTimes(0);
        expect(module3.tick).toBeCalledTimes(0);
        expect(module4.tick).toBeCalledTimes(0);
        expect(executeOrder.length).toBe(0);
        module1.enabled = true;
        module2.enabled = true;
        stage.tick(particles, params, context);
        expect(module1.tick).toBeCalledTimes(1);
        expect(module2.tick).toBeCalledTimes(1);
        expect(module3.tick).toBeCalledTimes(0);
        expect(module4.tick).toBeCalledTimes(0);
        expect(executeOrder).toEqual([1, 2]);
        executeOrder.length = 0;
        stage.execute(particles, params, context);
        expect(module1.execute).toBeCalledTimes(1);
        expect(module2.execute).toBeCalledTimes(1);
        expect(module3.execute).toBeCalledTimes(0);
        expect(module4.execute).toBeCalledTimes(0);
        expect(executeOrder).toEqual([1, 2]);
        executeOrder.length = 0;
        module3.enabled = true;
        module4.enabled = true;
        stage.tick(particles, params, context);
        expect(module1.tick).toBeCalledTimes(2);
        expect(module2.tick).toBeCalledTimes(2);
        expect(module3.tick).toBeCalledTimes(1);
        expect(module4.tick).toBeCalledTimes(1);
        expect(executeOrder).toEqual([1, 2, 3, 4]);
        executeOrder.length = 0;
        stage.execute(particles, params, context);
        expect(module1.execute).toBeCalledTimes(2);
        expect(module2.execute).toBeCalledTimes(2);
        expect(module3.execute).toBeCalledTimes(1);
        expect(module4.execute).toBeCalledTimes(1);
        expect(executeOrder).toEqual([1, 2, 3, 4]);
        executeOrder.length = 0;
        module1.enabled = false;
        module3.enabled = false;
        stage.tick(particles, params, context);
        expect(module1.tick).toBeCalledTimes(2);
        expect(module2.tick).toBeCalledTimes(3);
        expect(module3.tick).toBeCalledTimes(1);
        expect(module4.tick).toBeCalledTimes(2);
        expect(executeOrder).toEqual([2, 4]);
        executeOrder.length = 0;
        stage.execute(particles, params, context);
        expect(module1.execute).toBeCalledTimes(2);
        expect(module2.execute).toBeCalledTimes(3);
        expect(module3.execute).toBeCalledTimes(1);
        expect(module4.execute).toBeCalledTimes(2);
        expect(executeOrder).toEqual([2, 4]);
        executeOrder.length = 0;
        module1.enabled = true;
        module2.enabled = false;
        stage.tick(particles, params, context);
        expect(module1.tick).toBeCalledTimes(3);
        expect(module2.tick).toBeCalledTimes(3);
        expect(module3.tick).toBeCalledTimes(1);
        expect(module4.tick).toBeCalledTimes(3);
        expect(executeOrder).toEqual([1, 4]);
        executeOrder.length = 0;
        stage.execute(particles, params, context);
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
        stage.tick(particles, params, context);
        expect(module1.tick).toBeCalledTimes(4);
        expect(module2.tick).toBeCalledTimes(4);
        expect(module3.tick).toBeCalledTimes(2);
        expect(module4.tick).toBeCalledTimes(4);
        expect(executeOrder).toEqual([1, 3, 4, 2]);
        executeOrder.length = 0;
        stage.execute(particles, params, context);
        expect(module1.execute).toBeCalledTimes(4);
        expect(module2.execute).toBeCalledTimes(4);
        expect(module3.execute).toBeCalledTimes(2);
        expect(module4.execute).toBeCalledTimes(4);
        expect(executeOrder).toEqual([1, 3, 4, 2]);
    });

    test('execute stage', () => {
        ParticleModule.clearRegisteredModules();
        @ParticleModule.register('Test1', ModuleExecStage.UPDATE | ModuleExecStage.SPAWN, [], ['A'])
        class TestModule extends ParticleModule {
            public execute(particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
                throw new Error("Method not implemented.");
            }
        }

        const updateStage = new ParticleModuleStage(ModuleExecStage.UPDATE);
        const spawnStage = new ParticleModuleStage(ModuleExecStage.SPAWN);

        const module1 = updateStage.addModule(TestModule);
        const module2 = spawnStage.addModule(TestModule);
        module1.enabled = module2.enabled = true;

        module1.tick = module1.execute = jest.fn((particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) => { 
            expect(context.executionStage).toBe(ModuleExecStage.UPDATE);
        });

        module2.tick = module2.execute = jest.fn((particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) => {
            expect(context.executionStage).toBe(ModuleExecStage.SPAWN);
        });

        const particles = new ParticleDataSet();
        const params = new ParticleEmitterParams();
        const context = new ParticleExecContext();

        updateStage.tick(particles, params, context);
        expect(module1.tick).toBeCalledTimes(1);
        updateStage.execute(particles, params, context);
        expect(module1.execute).toBeCalledTimes(2);

        spawnStage.tick(particles, params, context);
        expect(module2.tick).toBeCalledTimes(1);
        spawnStage.execute(particles, params, context);
        expect(module2.execute).toBeCalledTimes(2);
    });
});