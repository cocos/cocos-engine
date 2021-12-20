/**
 * @packageDocumentation
 * @module spine
 */

import { EDITOR } from 'internal:constants';
import { Asset, CCString, Enum, Node, Texture2D, errorID } from '../core';
import SkeletonCache from './skeleton-cache';
import { Skeleton } from './skeleton';
import { SkeletonTexture } from './skeleton-texture';
import spine from './lib/spine-core.js';
import { ccclass, serializable, type } from '../core/data/decorators';
import { legacyCC } from '../core/global-exports';

/**
 * @en The skeleton data of spine.
 * @zh Spine 的 骨骼数据。
 * @class SkeletonData
 * @extends Asset
 */
@ccclass('sp.SkeletonData')
export class SkeletonData extends Asset {
    /**
     * @marked_as_engine_private
     */
    @serializable
    public _skeletonJson: spine.SkeletonJson | null = null;

    // use by jsb
    get skeletonJsonStr (): string {
        if (this._skeletonJson) {
            return JSON.stringify(this._skeletonJson);
        }
        return '';
    }

    /**
     * @en See http://en.esotericsoftware.com/spine-json-format
     * @zh 可查看 Spine 官方文档 http://zh.esotericsoftware.com/spine-json-format
     * @property {Object} skeletonJson
     */
    get skeletonJson (): spine.SkeletonJson {
        return this._skeletonJson!;
    }
    set skeletonJson (value: spine.SkeletonJson) {
        this.reset();
        if (typeof (value) === 'string') {
            this._skeletonJson = JSON.parse(value);
        } else {
            this._skeletonJson = value;
        }
        // If create by manual, uuid is empty.
        if (!this._uuid && (value as any).skeleton) {
            this._uuid = (value as any).skeleton.hash;
        }
    }

    /**
     * @property {String} atlasText
     */
    get atlasText () {
        return this._atlasText;
    }
    set atlasText (value) {
        this._atlasText = value;
        this.reset();
    }

    /**
     * @property {Texture2D[]} textures
     */

    @serializable
    @type([Texture2D])
    public textures: Texture2D[] = [];

    /**
     * @property {String[]} textureNames
     * @private
     */
    @serializable
    @type([CCString])
    public textureNames: string[] = [];

    /**
     * @en
     * A scale can be specified on the JSON or binary loader which will scale the bone positions,
     * image sizes, and animation translations.
     * This can be useful when using different sized images than were used when design ing the skeleton
     * in Spine. For example, if using images that are half the size than were used in Spine,
     * a scale of 0.5 can be used. This is commonly used for games that can run with either low or high
     * resolution texture atlases.
     * see http://en.esotericsoftware.com/spine-using-runtimes#Scaling
     * @zh 可查看 Spine 官方文档： http://zh.esotericsoftware.com/spine-using-runtimes#Scaling
     * @property {Number} scale
     */
    @serializable
    public scale = 1;

    /**
     * @marked_as_engine_private
     */
    get _nativeAsset (): ArrayBuffer {
        return this._buffer!;
    }
    set _nativeAsset (bin: ArrayBuffer) {
        this._buffer = bin;
        this.reset();
    }

    @serializable
    protected _atlasText = '';

    private _buffer?: ArrayBuffer;
    /**
     * @property {sp.spine.SkeletonData} _skeletonData
     * @private
     */
    private _skeletonCache: spine.SkeletonData | null = null;

    private _atlasCache: spine.TextureAtlas | null = null;

    private _skinsEnum: { [key: string]: number } | null = null;
    private _animsEnum: { [key: string]: number } | null = null;

    constructor () {
        super();
        this.reset();
    }

    // PUBLIC

    public createNode (callback: (err: Error|null, node: Node) => void) {
        const node = new Node(this.name);
        const skeleton = node.addComponent('cc.Skeleton') as Skeleton;
        skeleton.skeletonData = this;

        return callback(null, node);
    }

    public reset () {
        this._skeletonCache = null;
        this._atlasCache = null;
        if (EDITOR) {
            this._skinsEnum = null;
            this._animsEnum = null;
        }
    }

    public resetEnums () {
        if (EDITOR) {
            this._skinsEnum = null;
            this._animsEnum = null;
        }
    }

    /**
     * @en Get the included SkeletonData used in spine runtime.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.SkeletonData object.
     * @zh 获取 Spine Runtime 使用的 SkeletonData。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.SkeletonData 对象。
     * @method getRuntimeData
     * @param {Boolean} [quiet=false]
     * @return {sp.spine.SkeletonData}
     */
    public getRuntimeData (quiet?: boolean) {
        if (this._skeletonCache) {
            return this._skeletonCache;
        }

        if (!(this.textures && this.textures.length > 0) && this.textureNames && this.textureNames.length > 0) {
            if (!quiet) {
                console.error(`${this.name} no textures found!`);
            }
            return null;
        }

        const atlas = this._getAtlas(quiet);
        if (!atlas) {
            return null;
        }
        const attachmentLoader = new spine.AtlasAttachmentLoader(atlas);

        let resData: spine.SkeletonJson | Uint8Array | null = null;
        let reader: spine.SkeletonJson | spine.SkeletonBinary | null = null;
        if (this.skeletonJson) {
            reader = new spine.SkeletonJson(attachmentLoader);
            resData = this.skeletonJson;
        } else {
            reader = new spine.SkeletonBinary(attachmentLoader);
            resData = new Uint8Array(this._nativeAsset);
        }

        reader.scale = this.scale;
        this._skeletonCache = reader.readSkeletonData(resData as any);
        atlas.dispose();

        return this._skeletonCache;
    }

    // EDITOR functions

    public getSkinsEnum () {
        if (this._skinsEnum /* && Object.keys(this._skinsEnum).length > 0 */) {
            return this._skinsEnum;
        }
        const sd = this.getRuntimeData(true);
        if (sd) {
            const skins = sd.skins;
            const enumDef: {[key: string]: number} = {};
            for (let i = 0; i < skins.length; i++) {
                const name = skins[i].name;
                enumDef[name] = i;
            }
            return this._skinsEnum = Enum(enumDef);
        }
        return null;
    }

    public getAnimsEnum () {
        if (this._animsEnum && Object.keys(this._animsEnum).length > 1) {
            return this._animsEnum;
        }
        const sd = this.getRuntimeData(true);
        if (sd) {
            const enumDef: {[key: string]: number} = { '<None>': 0 };
            const anims = sd.animations;
            for (let i = 0; i < anims.length; i++) {
                const name = anims[i].name;
                enumDef[name] = i + 1;
            }
            return this._animsEnum = Enum(enumDef);
        }
        return null;
    }

    public destroy () {
        SkeletonCache.sharedCache.removeSkeleton(this._uuid);
        return super.destroy();
    }
    // PRIVATE

    private _getTexture (line: string) {
        const names = this.textureNames;
        for (let i = 0; i < names.length; i++) {
            if (names[i] === line) {
                const texture = this.textures[i];
                const tex = new SkeletonTexture({ width: texture.width, height: texture.height } as ImageBitmap);
                tex.setRealTexture(texture);
                return tex;
            }
        }
        console.error(`${this.name} no textures found!`);
        return null;
    }

    /**
     * @method _getAtlas
     * @param {boolean} [quiet=false]
     * @return {sp.spine.Atlas}
     * @private
     */
    private _getAtlas (quiet?: boolean) {
        if (this._atlasCache) {
            return this._atlasCache;
        }

        if (!this.atlasText) {
            if (!quiet) {
                console.error(`${this.name} no atlas found!`);
            }
            return null;
        }

        return this._atlasCache = new spine.TextureAtlas(this.atlasText, this._getTexture.bind(this));
    }
}

legacyCC.internal.SpineSkeletonData = SkeletonData;
