/*
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
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
