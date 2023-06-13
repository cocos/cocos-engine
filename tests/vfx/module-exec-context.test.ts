import { DelayMode, LoopMode } from "../../cocos/vfx/enum";
import { ContextDataSet } from "../../cocos/vfx/base";
import { ModuleExecStage } from "../../cocos/vfx/vfx-module";

describe('module-exec-context', () => {
    test ('ExecutionRange', () => {
        const context = new ContextDataSet();
        expect(context.fromIndex).toBe(0);
        expect(context.toIndex).toBe(0);
        context.setExecuteRange(0, 1);
        expect(context.fromIndex).toBe(0);
        expect(context.toIndex).toBe(1);
        context.setExecuteRange(0, 1000);
        expect(context.fromIndex).toBe(0);
        expect(context.toIndex).toBe(1000);
        context.setExecuteRange(100, 1000);
        expect(context.fromIndex).toBe(100);
        expect(context.toIndex).toBe(1000);
        context.setExecuteRange(100, 100);
        expect(context.fromIndex).toBe(100);
        expect(context.toIndex).toBe(100);
        expect(() => context.setExecuteRange(100, 99)).toThrowError();
    });

    test ('setExecutionStage', () => {
        const context = new ContextDataSet();
        expect(context.executionStage).toBe(ModuleExecStage.UNKNOWN);
        context.setExecutionStage(ModuleExecStage.UPDATE);
        expect(context.executionStage).toBe(ModuleExecStage.UPDATE);
        context.setExecutionStage(ModuleExecStage.EMITTER);
        expect(context.executionStage).toBe(ModuleExecStage.EMITTER);
    });
});