/**
 * @module dragonBones
 */
import { JSB } from '../../editor/exports/populate-internal-constants';
import { Asset, Texture2D, Node } from '../core/assets';
import { serializable, type } from '../core/data/decorators';
import { sharedCache as ArmatureCache } from './ArmatureCache';

/**
 * !#en The skeleton atlas data of dragonBones.
 * !#zh dragonBones 的骨骼纹理数据。
 * @class DragonBonesAtlasAsset
 * @extends Asset
 */
export class DragonBonesAtlasAsset extends Asset {
    static preventDeferredLoadDependents: true

    constructor () {
        super();
        this._clear();
    }

    @serializable
    _atlasJson = '';

    get atlasJson () {
        return this._atlasJson;
    }
    set atlasJson (value) {
        this._atlasJson = value;
        this._atlasJsonData = JSON.parse(this.atlasJson);
        this._clear();
    }
    @serializable
    @type(Texture2D)
    _texture: Texture2D | null = null;

    @serializable
    _atlasJsonData: any = {};

    _factory: CCFactory;
    /**
     * @property {Texture2D} texture
     */
    get texture () {
        return this._texture;
    }
    set texture (value) {
        this._texture = value;
        this._clear();
    }

    @serializable
    _textureAtlasData: string | null = null;

    createNode (callback: (error: Error | null, node: Node) => void) {
        const node = new Node(this.name);
        const armatureDisplay = node.addComponent('dragonBones.ArmatureDisplay');
        armatureDisplay.dragonAtlasAsset = this;

        return callback(null, node);
    }

    init (factory: CCFactory) {
        this._factory = factory;

        if (!this._atlasJsonData) {
            this._atlasJsonData = JSON.parse(this.atlasJson);
        }
        const atlasJsonObj = this._atlasJsonData;

        // If create by manual, uuid is empty.
        this._uuid = this._uuid || atlasJsonObj.name;

        if (this._textureAtlasData) {
            factory.addTextureAtlasData(this._textureAtlasData, this._uuid);
        } else {
            this._textureAtlasData = factory.parseTextureAtlasData(atlasJsonObj, this.texture, this._uuid);
        }
    }

    destroy () {
        this._clear();
        return super.destroy();
    }

    protected _clear () {
        if (JSB) return;
        if (this._factory) {
            ArmatureCache.resetArmature(this._uuid);
            this._factory.removeTextureAtlasData(this._uuid, true);
            this._factory.removeDragonBonesDataByUUID(this._uuid, true);
        }
        this._textureAtlasData = null;
    }
}
