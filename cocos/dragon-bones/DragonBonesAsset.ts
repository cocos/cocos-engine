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

import { EDITOR } from 'internal:constants';
import { Asset } from '../core/assets';
import { ccclass, serializable } from '../core/data/decorators';
import { ArmatureCache } from './ArmatureCache';
import { Enum, Node } from '../core';
import { CCFactory } from './CCFactory';
import { legacyCC } from '../core/global-exports';

/**
 * @en The skeleton data of dragonBones.
 * @zh dragonBones 的 骨骼数据。
 * @class DragonBonesAsset
 * @extends Asset
 */
@ccclass('dragonBones.DragonBonesAsset')
export class DragonBonesAsset extends Asset {
    /**
     * @en
     * See http://developer.egret.com/cn/github/egret-docs/DB/dbLibs/dataFormat/index.html
     * @zh
     * 可查看 DragonBones 官方文档 http://developer.egret.com/cn/github/egret-docs/DB/dbLibs/dataFormat/index.html
     * @property {string} dragonBonesJson
     */
    @serializable
    protected _dragonBonesJson = '';

    get dragonBonesJson () {
        return this._dragonBonesJson;
    }

    set dragonBonesJson (value) {
        this._dragonBonesJson = value;
        this._dragonBonesJsonData = JSON.parse(value);
        this.reset();
    }

    private _factory: CCFactory| null = null;
    protected _dragonBonesJsonData?: ArrayBuffer;

    private _armaturesEnum: any = null;

    constructctor () {
        this.reset();
    }

    createNode (callback: (err: Error | null, node: Node) => void) {
        const node = new Node(this.name);
        const armatureDisplay = node.addComponent('dragonBones.ArmatureDisplay') as any;
        armatureDisplay.dragonAsset = this;

        return callback(null, node);
    }

    reset () {
        this._clear();
        if (EDITOR) {
            this._armaturesEnum = null;
        }
    }

    init (factory?: CCFactory, atlasUUID?: string) {
        if (EDITOR) {
            this._factory = factory || new CCFactory();
        } else {
            this._factory = factory!;
        }

        if (!this._dragonBonesJsonData && this.dragonBonesJson) {
            this._dragonBonesJsonData = JSON.parse(this.dragonBonesJson);
        }

        let rawData:any = null;
        if (this._dragonBonesJsonData) {
            rawData = this._dragonBonesJsonData;
        } else {
            rawData = this._nativeAsset;
        }

        // If create by manual, uuid is empty.
        if (!this._uuid) {
            const dbData = this._factory.getDragonBonesDataByRawData(rawData);
            if (dbData) {
                this._uuid = dbData.name;
            } else {
                console.warn('dragonbones name is empty');
            }
        }

        const armatureKey = `${this._uuid}#${atlasUUID!}`;
        const dragonBonesData = this._factory.getDragonBonesData(armatureKey);
        if (dragonBonesData) return armatureKey;

        this._factory.parseDragonBonesData(rawData instanceof ArrayBuffer ? rawData : (rawData.buffer instanceof ArrayBuffer ? rawData.buffer : rawData), armatureKey);
        return armatureKey;
    }

    // EDITOR

    getArmatureEnum (): any {
        if (this._armaturesEnum) {
            return this._armaturesEnum as unknown as any;
        }
        this.init();
        const dragonBonesData = this._factory!.getDragonBonesDataByUUID(this._uuid);
        if (dragonBonesData) {
            const armatureNames = dragonBonesData.armatureNames;
            const enumDef = {};
            for (let i = 0; i < armatureNames.length; i++) {
                const name = armatureNames[i];
                enumDef[name] = i;
            }
            return this._armaturesEnum = Enum(enumDef);
        }
        return null;
    }

    public getAnimsEnum (armatureName: string) {
        this.init();
        const dragonBonesData = this._factory!.getDragonBonesDataByUUID(this._uuid);
        if (dragonBonesData) {
            const armature = dragonBonesData.getArmature(armatureName);
            if (!armature) {
                return null;
            }

            const enumDef = { '<None>': 0 };
            const anims = armature.animations;
            let i = 0;
            for (const animName in anims) {
                // eslint-disable-next-line no-prototype-builtins
                if (anims.hasOwnProperty(animName)) {
                    enumDef[animName] = i + 1;
                    i++;
                }
            }
            return Enum(enumDef);
        }
        return null;
    }

    public destroy () {
        this._clear();
        return super.destroy();
    }

    protected _clear () {
        if (this._factory) {
            ArmatureCache.sharedCache.resetArmature(this._uuid);
            this._factory.removeDragonBonesDataByUUID(this._uuid, true);
        }
    }
}

legacyCC.internal.DragonBonesAsset = DragonBonesAsset;
