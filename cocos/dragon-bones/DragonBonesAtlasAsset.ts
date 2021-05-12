/**
 * @packageDocumentation
 * @module dragonBones
 */
import { JSB } from 'internal:constants';
import { TextureAtlasData } from '@cocos/dragonbones-js';
import { Asset, Texture2D, Node } from '../core';
import { ccclass, serializable, type } from '../core/data/decorators';
import { ArmatureCache } from './ArmatureCache';
import { ArmatureDisplay } from './ArmatureDisplay';
import { CCFactory } from './CCFactory';
import { legacyCC } from '../core/global-exports';

/**
 * @en The skeleton atlas data of dragonBones.
 * @zh dragonBones 的骨骼纹理数据。
 * @class DragonBonesAtlasAsset
 * @extends Asset
 */
@ccclass('dragonBones.DragonBonesAtlasAsset')
export class DragonBonesAtlasAsset extends Asset {
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

    _factory: CCFactory| null = null;
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
    _textureAtlasData: TextureAtlasData | null = null;

    createNode (callback: (error: Error | null, node: Node) => void) {
        const node = new Node(this.name);
        const armatureDisplay = node.addComponent('dragonBones.ArmatureDisplay') as ArmatureDisplay;
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
            ArmatureCache.sharedCache.resetArmature(this._uuid);
            this._factory.removeTextureAtlasData(this._uuid, true);
            this._factory.removeDragonBonesDataByUUID(this._uuid, true);
        }
        this._textureAtlasData = null;
    }
}

legacyCC.internal.DragonBonesAtlasAsset = DragonBonesAtlasAsset;
