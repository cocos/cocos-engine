import { RenderingSubMesh } from '../../assets/mesh';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { RenderPriority, localDescriptorSetLayout } from '../../pipeline/define';
import { IMacroPatch, Pass } from '../core/pass';
import { DSPool, IAPool, SubModelPool, SubModelView, SubModelHandle } from '../core/memory-pools';
import { GFXDescriptorSet, IGFXDescriptorSetInfo } from '../../gfx';
import { legacyCC } from '../../global-exports';

const _dsInfo: IGFXDescriptorSetInfo = {
    layout: [],
};

export class SubModel {

    protected _device: GFXDevice | null = null;
    protected _passes: Pass[] | null = null;
    protected _subMesh: RenderingSubMesh | null = null;
    protected _patches: IMacroPatch[] | null = null;

    protected _handle: SubModelHandle = 0;
    protected _priority: RenderPriority = RenderPriority.DEFAULT;
    protected _inputAssembler: GFXInputAssembler | null = null;
    protected _descriptorSet: GFXDescriptorSet | null = null;

    set passes (passes) {
        this._passes = passes;
        this._flushPassInfo();
    }

    get passes () {
        return this._passes!;
    }

    set subMesh (subMesh) {
        this._subMesh = subMesh;
        this._inputAssembler!.destroy();
        this._inputAssembler!.initialize(subMesh);
    }

    get subMesh () {
        return this._subMesh!;
    }

    set priority (val) {
        this._priority = val;
        SubModelPool.set(this._handle, SubModelView.PRIORITY, val);
    }

    get priority () {
        return this._priority;
    }

    get handle () {
        return this._handle;
    }

    get inputAssembler () {
        return this._inputAssembler!;
    }

    get descriptorSet () {
        return this._descriptorSet!;
    }

    public initialize (subMesh: RenderingSubMesh, passes: Pass[], patches: IMacroPatch[] | null = null) {
        this._device = legacyCC.director.root.device;

        this._subMesh = subMesh;
        this._patches = patches;
        this._passes = passes;

        this._handle = SubModelPool.alloc();
        this._flushPassInfo();

        _dsInfo.layout = localDescriptorSetLayout.descriptors;
        const dsHandle = DSPool.alloc(this._device, _dsInfo);
        const iaHandle = IAPool.alloc(this._device, subMesh);
        SubModelPool.set(this._handle, SubModelView.PRIORITY, RenderPriority.DEFAULT);
        SubModelPool.set(this._handle, SubModelView.INPUT_ASSEMBLER, iaHandle);
        SubModelPool.set(this._handle, SubModelView.DESCRIPTOR_SET, dsHandle);

        this._inputAssembler = IAPool.get(iaHandle);
        this._descriptorSet = DSPool.get(dsHandle);
    }

    public destroy () {
        DSPool.free(SubModelPool.get(this._handle, SubModelView.DESCRIPTOR_SET));
        IAPool.free(SubModelPool.get(this._handle, SubModelView.INPUT_ASSEMBLER));
        SubModelPool.free(this._handle);

        this._descriptorSet = null;
        this._inputAssembler = null;
        this._priority = RenderPriority.DEFAULT;
        this._handle = 0;

        this._patches = null;
        this._subMesh = null;
        this._passes = null;
    }

    public update () {
        for (let i = 0; i < this._passes!.length; ++i) {
            const pass = this._passes![i];
            pass.update();
        }
        this._descriptorSet!.update();
    }

    public onPipelineStateChanged () {
        const passes = this._passes;
        if (!passes) { return; }

        for (let i = 0; i < passes.length; i++) {
            const pass = passes[i];
            pass.beginChangeStatesSilently();
            pass.tryCompile(); // force update shaders
            pass.endChangeStatesSilently();
        }

        this._flushPassInfo();
    }

    protected _flushPassInfo () {
        const passes = this._passes;
        if (!passes) { return; }

        SubModelPool.set(this._handle, SubModelView.PASS_COUNT, passes.length);
        for (let i = 0; i < passes.length; i++) {
            SubModelPool.set(this._handle, SubModelView.PASS_0 + i, passes[i].handle);
            SubModelPool.set(this._handle, SubModelView.SHADER_0 + i, passes[i].getShaderVariant(this._patches));
        }
    }
}
