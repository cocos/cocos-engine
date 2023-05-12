import { EDITOR, JSB } from 'internal:constants';
import { Material, RenderingSubMesh, Texture2D } from '../../asset/assets';
import { legacyCC } from '../../core/global-exports';
import { ModelRenderer } from '../../misc/model-renderer';
import { Model } from '../../render-scene/scene';
import { ModelLocalBindings } from '../../rendering/define';
import { vfmtPosUvColor, getAttributeStride, vfmtPosUvColor4B } from '../../2d/renderer/vertex-format';
import { Root } from '../../root';
import { SpineSkeletonMesh } from './spine-skeleton-imply-wasm';
import { BufferInfo, BufferUsageBit, Device, MemoryUsageBit, PrimitiveMode, deviceManager } from '../../gfx';
import { builtinResMgr } from '../../asset/asset-manager';
import { ccclass, displayName, executeInEditMode, executionOrder, help, serializable, type } from '../../core/data/decorators';
import { CCClass, Enum, ccenum } from '../../core';

export enum SpineSkeletonAnimationSlotEnum {
    default = 0,
}
ccenum(SpineSkeletonAnimationSlotEnum);

function setEnumAttr (obj, propName, enumDef) {
    CCClass.Attr.setClassAttr(obj, propName, 'type', 'Enum');
    CCClass.Attr.setClassAttr(obj, propName, 'enumList', Enum.getList(enumDef));
}

@ccclass('sp.SpineSkeletonModelRenderer')
@help('i18n:sp.SpineSkeletonModelRenderer')
@executionOrder(100)
@executeInEditMode
export class SpineSkeletonModelRenderer extends ModelRenderer {
    @serializable
    public index = 0;
    @serializable
    private _slotStart = 0;

    private _texture: Texture2D | null = null;
    private _mesh: SpineSkeletonMesh = null!;
    public slotList: string[] = [];

    constructor () {
        super();
    }

    public resetProperties (tex: Texture2D | null, slotList: string[]) {
        this._texture = tex;
        this.slotList = slotList;
        this._updateSlotEnum();
    }

    set mesh (mesh: SpineSkeletonMesh) {
        this._mesh = mesh;
        this._assembleModel();
    }

    public onLoad () {
        const material = builtinResMgr.get<Material>('default-spine-material');
        this.setMaterial(material, 0);
        this._createModel();
    }

    public onEnable () {
        this._attachToScene();
        this._updateSlotEnum();
    }

    public update (dt: number) {
        this._assembleModel();
        this._onUpdateLocalDescriptorSet();
    }

    public onDisable () {
        if (this._models.length > 0) {
            this._detachFromScene();
        }
    }
    public onDestroy () {
        this._detachFromScene();
        this._destroyModel();
        console.log('Skeleton2DPartialRenderer destroy');
    }

    /**
     * @internal
     */
    @displayName('Slot Start')
    @type(SpineSkeletonAnimationSlotEnum)
    get slotStart () {
        return this._slotStart;
    }
    set slotStart (value: number) {
        this._slotStart = value;
        if (EDITOR) this._updateSlotEnum();
    }

    private _updateSlotEnum () {
        // reset enum type
        const enumSlots = Enum({});
        let slotEnum;
        //console.log(this.slotList.length);
        if (this.slotList.length < 1) {
            slotEnum = SpineSkeletonAnimationSlotEnum;
        } else {
            const enumDef: {[key: string]: number} = {};
            for (let i = 0; i < this.slotList.length; i++) {
                const name = this.slotList[i];
                enumDef[name] = i;
            }
            slotEnum = Enum(enumDef);
        }

        Object.assign(enumSlots, slotEnum);
        Enum.update(enumSlots);
        setEnumAttr(this, 'slotStart', enumSlots);
    }

    protected _createModel () {
        const model = (legacyCC.director.root as Root).createModel<Model>(Model);
        this._models[0] = model;
        model.visFlags = this.visibility;
        model.node = model.transform = this.node;
    }
    protected _destroyModel () {
        (legacyCC.director.root as Root).destroyModel(this._models[0]);
        this._models.length = 0;
    }

    protected _attachToScene () {
        if (!this.node.scene || this._models.length < 1) {
            return;
        }
        const renderScene = this._getRenderScene();
        if (this._models[0].scene !== null) {
            this._detachFromScene();
        }
        renderScene.addModel(this._models[0]);
    }

    public _detachFromScene () {
        if (this._models.length > 0 && this._models[0].scene) {
            this._models[0].scene.removeModel(this._models[0]);
        }
    }

    protected _onUpdateLocalDescriptorSet () {
        if (!this._texture) return;
        const subModels = this._models[0].subModels;
        const binding = ModelLocalBindings.SAMPLER_SPRITE;
        for (let i = 0; i < subModels.length; i++) {
            const { descriptorSet } = subModels[i];
            const texture = this._texture;
            descriptorSet.bindTexture(binding, texture.getGFXTexture()!);
            descriptorSet.bindSampler(binding, texture.getGFXSampler()!);
            descriptorSet.update();
        }
    }

    private _activeSubModel (idx: number) {
        if (this._models.length < 1) {
            return;
        }
        const attrs = vfmtPosUvColor4B;
        const stride = getAttributeStride(attrs);

        if (this._models[0].subModels.length <= idx) {
            const gfxDevice: Device = deviceManager.gfxDevice;
            const vertexBuffer = gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                65535 * stride,
                stride,
            ));
            const indexBuffer = gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                65535 * Uint16Array.BYTES_PER_ELEMENT * 2,
                Uint16Array.BYTES_PER_ELEMENT,
            ));

            const renderMesh = new RenderingSubMesh([vertexBuffer], attrs, PrimitiveMode.TRIANGLE_LIST, indexBuffer);
            renderMesh.subMeshIdx = 0;

            this._models[0].initSubModel(idx, renderMesh, this.material!);
            this._models[0].enabled = true;
        }
    }

    private _assembleModel () {
        const mesh = this._mesh;
        for (let idx = 0;  idx < 1; idx++) {
            this._activeSubModel(idx);
            const subModel = this._models[0].subModels[idx];
            const ia = subModel.inputAssembler;
            const vb = new Float32Array(mesh.vertices);
            ia.vertexBuffers[0].update(vb);
            ia.vertexCount = mesh.vCount;
            const ib = new Uint16Array(mesh.indices);
            ia.indexBuffer!.update(ib);
            ia.indexCount = ib.length;
        }
    }
}
