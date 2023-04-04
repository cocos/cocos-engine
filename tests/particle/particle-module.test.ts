import { Module } from "module";
import { ParticleEmitterParams, ParticleExecContext } from "../../cocos/particle/particle-base";
import { ParticleDataSet } from "../../cocos/particle/particle-data-set";
import { ModuleExecStage, ParticleModule } from "../../cocos/particle/particle-module";

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
        const index = ParticleModule.findAProperPositionToInsert(modules, module1);
        expect(index).toBe(0);
        modules.splice(index, 0, module1);

        const module2= new TestModule();
        const index2 = ParticleModule.findAProperPositionToInsert(modules, module2);
        expect(index2).toBe(1);
        modules.splice(index2, 0, module2);

        const module3 = new TestModule2();
        const index3 = ParticleModule.findAProperPositionToInsert(modules, module3);
        expect(index3).toBe(0);
        modules.splice(index3, 0, module3);

        const module4 = new TestModule2();
        const index4 = ParticleModule.findAProperPositionToInsert(modules, module4);
        expect(index4).toBe(1);
        modules.splice(index4, 0, module4);

        const module5 = new TestModule3();
        const index5 = ParticleModule.findAProperPositionToInsert(modules, module5);
        expect(index5).toBe(4);
        modules.splice(index5, 0, module5);

        const module6 = new TestModule4();
        const index6 = ParticleModule.findAProperPositionToInsert(modules, module6);
        expect(index6).toBe(5);
        modules.splice(index6, 0, module6);

        const module7 = new TestModule5();
        const index7 = ParticleModule.findAProperPositionToInsert(modules, module7);
        expect(index7).toBe(5);
        modules.splice(index7, 0, module7);

        const module8 = new TestModule4();
        const index8 = ParticleModule.findAProperPositionToInsert(modules, module8);
        expect(index8).toBe(7);
        modules.splice(index8, 0, module8);

        const module9 = new TestModule5();
        const index9 = ParticleModule.findAProperPositionToInsert(modules, module9);
        expect(index9).toBe(6);
        modules.splice(index9, 0, module9);
        const expectedResult = [module3, module4, module1, module2, module5, module7, module9, module6, module8];
        for (let i = 0; i < modules.length; i++) {
            expect(modules[i]===expectedResult[i]).toBeTruthy();
        }
    });
})