
import { ccclass, editable, serializable, type, range, help } from 'cc.decorator';
import { Material } from '../../asset/assets';
import { CCBoolean, CCInteger, formerlySerializedAs, Enum, CCFloat } from '../../core';
import { disallowAnimation, displayName, displayOrder, executeInEditMode, executionOrder, group, menu, tooltip, visible } from '../../core/data/decorators';
import { legacyCC } from '../../core/global-exports';
import { Vec4 } from '../../core/math/vec4';
import { IDGenerator } from '../../core/utils/id-generator';
import { Component } from '../../scene-graph/component';
import { Mesh } from '../assets';

declare let jsb: any;

/**
 * @en Shadow projection mode.
 * @zh 阴影投射方式。
 */
const ModelShadowCastingMode = Enum({
    /**
     * @en Disable shadow projection.
     * @zh 不投射阴影。
     */
    OFF: 0,
    /**
     * @en Enable shadow projection.
     * @zh 开启阴影投射。
     */
    ON: 1,
});

/**
 * @en Shadow receive mode.
 * @zh 阴影接收方式。
 */
const ModelShadowReceivingMode = Enum({
    /**
     * @en Disable shadow receiving.
     * @zh 不接收阴影。
     */
    OFF: 0,
    /**
     * @en Enable shadow receiving.
     * @zh 开启阴影投射。
     */
    ON: 1,
});

/**
 * @en Reflection probe type
 * @zh 反射探针类型。
 */
export enum ReflectionProbeType {
    /**
     * @en Use the default skybox.
     * @zh 使用默认天空盒
     */
    NONE = 0,
    /**
     * @en Cubemap generate by probe
     * @zh Probe烘焙的cubemap
     */
    BAKED_CUBEMAP = 1,
    /**
     * @en Realtime planar reflection
     * @zh 实时平面反射
     */
    PLANAR_REFLECTION = 2,
}


export const MeshRenderer = jsb.MeshRenderer;
const ModelBakeSettings = jsb.ModelBakeSettings;

const MeshRendererProto = MeshRenderer.prototype;
const ModelBakeSettingsProto = ModelBakeSettings.prototype;

serializable(ModelBakeSettingsProto, 'texture', () => null);
serializable(ModelBakeSettingsProto, 'uvParam', () => new Vec4);
serializable(ModelBakeSettingsProto, '_bakeable', () => false);
serializable(ModelBakeSettingsProto, '_castShadow', () => false);
formerlySerializedAs('_recieveShadow')(ModelBakeSettingsProto, '_receiveShadow', () => false);
serializable(ModelBakeSettingsProto, '_lightmapSize', () => 64);
serializable(ModelBakeSettingsProto, '_useLightProbe', () => false);
serializable(ModelBakeSettingsProto, '_bakeToLightProbe', () => true);
serializable(ModelBakeSettingsProto, '_reflectionProbeType', () => ReflectionProbeType.NONE);
serializable(ModelBakeSettingsProto, '_bakeToReflectionProbe', () => true);
serializable(ModelBakeSettingsProto, '_probeCubemap', () => null);
{
    const Key = 'bakeable';
    const desc = Object.getOwnPropertyDescriptor(ModelBakeSettingsProto, Key);
    editable(ModelBakeSettingsProto, Key, desc);
    group({ id: 'LightMap', name: 'LightMapSettings', displayOrder: 0 })(ModelBakeSettingsProto, Key, desc);
}
{
    const Key = 'castShadow';
    const desc = Object.getOwnPropertyDescriptor(ModelBakeSettingsProto, Key);
    editable(ModelBakeSettingsProto, Key, desc);
    group({ id: 'LightMap', name: 'LightMapSettings' })(ModelBakeSettingsProto, Key, desc);
}
{
    const Key = 'receiveShadow';
    const desc = Object.getOwnPropertyDescriptor(ModelBakeSettingsProto, Key);
    editable(ModelBakeSettingsProto, Key, desc);
    group({ id: 'LightMap', name: 'LightMapSettings' })(ModelBakeSettingsProto, Key, desc);
}
{
    const Key = 'lightmapSize';
    const desc = Object.getOwnPropertyDescriptor(ModelBakeSettingsProto, Key);
    range([0, 1024])(ModelBakeSettingsProto, Key, desc);
    type(CCInteger)(ModelBakeSettingsProto, Key, desc);
    editable(ModelBakeSettingsProto, Key, desc);
    group({ id: 'LightMap', name: 'LightMapSettings' })(ModelBakeSettingsProto, Key, desc);
}
{
    const Key = 'useLightProbe';
    const desc = Object.getOwnPropertyDescriptor(ModelBakeSettingsProto, Key);
    type(CCBoolean)(ModelBakeSettingsProto, Key, desc);
    editable(ModelBakeSettingsProto, Key, desc);
    group({ id: 'LightMap', name: 'LightMapSettings' })(ModelBakeSettingsProto, Key, desc);
}
{
    const Key = 'bakeToLightProbe';
    const desc = Object.getOwnPropertyDescriptor(ModelBakeSettingsProto, Key);
    type(CCBoolean)(ModelBakeSettingsProto, Key, desc);
    editable(ModelBakeSettingsProto, Key, desc);
    group({ id: 'LightMap', name: 'LightMapSettings' })(ModelBakeSettingsProto, Key, desc);
}
{
    const Key = 'reflectionProbe';
    const desc = Object.getOwnPropertyDescriptor(ModelBakeSettingsProto, Key);
    type(Enum(ReflectionProbeType))(ModelBakeSettingsProto, Key, desc);
    group({ id: 'LightMap', name: 'LightMapSettings' })(ModelBakeSettingsProto, Key, desc);
}
{
    const Key = 'bakeToReflectionProbe';
    const desc = Object.getOwnPropertyDescriptor(ModelBakeSettingsProto, Key);
    type(Enum(ModelBakeSettings))(ModelBakeSettingsProto, Key, desc);
    group({ id: 'LightMap', name: 'LightMapSettings' })(ModelBakeSettingsProto, Key, desc);
}

function defineAsProp(proto, attr, dft) {
    Object.defineProperty(proto, attr, {
        get() { return this[`$${attr}`] === undefined ? dft : this[`$${attr}`] },
        set(v) { this[`$${attr}`] = v; },
        configurable: true,
        enumerable: true
    });
}

defineAsProp(MeshRendererProto, 'node', null);
defineAsProp(MeshRendererProto, '_enabled', true);
defineAsProp(MeshRendererProto, '__prefab', null);

const idGenerator = new IDGenerator('CompNative');


MeshRendererProto._ctor = function () {
    this._id = idGenerator.getNewId();
    this._materialsTmp  = [];
}
{
    const oldOnEnable = MeshRendererProto.onEnable;
    MeshRendererProto.onEnable = function () {
        this._materialsJS = this._materials;
        oldOnEnable.call(this);
    };
    const oldOnLoad = MeshRendererProto.onLoad;
    MeshRendererProto.onLoad = function () {
        this._materialsJS = this._materials;
        oldOnLoad.call(this);
    };

    Object.defineProperty(MeshRendererProto, '_materials', {
        get() {
            return this._materialsTmp;
        },
        set(arr) {
            this._materialsTmp = arr;
            this._materialsJS = arr;
        }
    })
}

{
    const Key = 'bakeSettings';
    const desc = Object.getOwnPropertyDescriptor(MeshRendererProto, Key);
    displayOrder(3)(MeshRendererProto, Key, desc);
    disallowAnimation(MeshRendererProto, Key, desc);
    editable(MeshRendererProto, Key, desc);
    serializable(MeshRendererProto, Key, desc);
}
serializable(MeshRendererProto, '_mesh', () => null);
serializable(MeshRendererProto, '_shadowCastingMode', () => ModelShadowCastingMode.OFF);
serializable(MeshRendererProto, '_shadowReceivingMode', () => ModelShadowReceivingMode.ON);
serializable(MeshRendererProto, '_shadowBias', () => 0);
serializable(MeshRendererProto, '_shadowNormalBias', () => 0);

{
    const Key = 'shadowBias';
    const desc = Object.getOwnPropertyDescriptor(MeshRendererProto, Key);
    disallowAnimation(MeshRendererProto, Key, desc);
    group({ id: 'DynamicShadow', name: 'DynamicShadowSettings', displayOrder: 2 })(MeshRendererProto, Key, desc);
    tooltip('i18n:model.shadow_bias')(MeshRendererProto, Key, desc);
    type(CCFloat)(MeshRendererProto, Key, desc);
}
{
    const Key = 'shadowNormalBias';
    const desc = Object.getOwnPropertyDescriptor(MeshRendererProto, Key);
    disallowAnimation(MeshRendererProto, Key, desc);
    group({ id: 'DynamicShadow', name: 'DynamicShadowSettings' })(MeshRendererProto, Key, desc);
    tooltip('i18n:model.shadow_normal_bias')(MeshRendererProto, Key, desc);
    type(CCFloat)(MeshRendererProto, Key, desc);
}
{
    const Key = 'shadowCastingMode';
    const desc = Object.getOwnPropertyDescriptor(MeshRendererProto, Key);
    disallowAnimation(MeshRendererProto, Key, desc);
    group({ id: 'DynamicShadow', name: 'DynamicShadowSettings' })(MeshRendererProto, Key, desc);
    tooltip('i18n:model.shadow_casting_model')(MeshRendererProto, Key, desc);
    type(ModelShadowCastingMode)(MeshRendererProto, Key, desc);
}
{
    const Key = 'receiveShadow';
    const desc = Object.getOwnPropertyDescriptor(MeshRendererProto, Key);
    disallowAnimation(MeshRendererProto, Key, desc);
    group({ id: 'DynamicShadow', name: 'DynamicShadowSettings' })(MeshRendererProto, Key, desc);
    tooltip('i18n:model.shadow_receiving_model')(MeshRendererProto, Key, desc);
    type(ModelShadowReceivingMode)(MeshRendererProto, Key, desc);
}
{
    const Key = 'mesh';
    const desc = Object.getOwnPropertyDescriptor(MeshRendererProto, Key);
    tooltip('i18n:model.mesh')(MeshRendererProto, Key, desc);
    displayOrder(1)(MeshRendererProto, Key, desc);
    type(Mesh)(MeshRendererProto, Key, desc);
}
{
    const Key = 'enableMorph';
    const desc = Object.getOwnPropertyDescriptor(MeshRendererProto, Key);
    disallowAnimation(MeshRendererProto, Key, desc);
    visible(function () {
        return !!(
            this.mesh
            && this.mesh.struct.morph
            && this.mesh.struct.morph.subMeshMorphs.some((subMeshMorph) => !!subMeshMorph)
        );
    })(MeshRendererProto, Key, desc);
}
serializable(MeshRendererProto, '_enableMorph', () => true);

serializable(MeshRendererProto, '_visFlags', () => 0); // inherited from cc.ModelRenderer
{
    // inherited from cc.Renderer
    const Key = 'sharedMaterials';
    const desc = Object.getOwnPropertyDescriptor(MeshRendererProto, Key);
    displayName('Materials')(MeshRendererProto, Key, desc);
    displayOrder(0)(MeshRendererProto, Key, desc);
    type(Material)(MeshRendererProto, Key, desc);
}
// inherited from cc.Renderer
function fixMaterials(proto: any) {
    const oldMaterial = Object.getOwnPropertyDescriptor(proto, 'material')!;
    Object.defineProperty(proto, 'materialUnderlying',  oldMaterial);
    Object.defineProperty(proto, 'material', {
        get() {return this.materialUnderlying;},
        set(mat) {
            this._materialsTmp[0] = mat;
            this.materialUnderlying = mat;
        }
    });
}
fixMaterials(jsb.Renderer.prototype);
type([Material])(MeshRendererProto, '_materials', () => []);
// inherited from cc.Component
serializable(MeshRendererProto, 'node', () => null);
serializable(MeshRendererProto, '_enabled', () => true);
serializable(MeshRendererProto, '__prefab', () => null);



ccclass("cc.ModelBakeSettings")(ModelBakeSettings);
executeInEditMode(true)(MeshRenderer);
menu('Mesh/MeshRenderer')(MeshRenderer);
executionOrder(100)(MeshRenderer);
help('i18n:cc.MeshRenderer')(MeshRenderer);
ccclass("cc.MeshRenderer")(MeshRenderer);


// hack prototype chain
Object.setPrototypeOf(jsb.ComponentProxy.prototype, Component.prototype);