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
import { EDITOR, JSB } from 'internal:constants';
import { ccclass, executeInEditMode, executionOrder, help, menu, serializable, type, displayName, range, tooltip, editable } from 'cc.decorator';
import { Texture2D } from '../../asset/assets';
import { errorID } from '../../core/platform/debug';
import { Enum } from '../../core/value-types/enum';
import { Component, Node } from '../../scene-graph';
import { CCBoolean, CCFloat, Mat4 } from '../../core';
import { SkeletonData } from '../skeleton-data';
import { SpineSkeletonModelRenderer } from './spine-skeleton-model-renderer';
import { SpineSkinEnum, SpineAnimationEnum, setEnumAttr } from './spine-define';
import { SpineSocket } from '../skeleton';
import { SpineSkeletonCache, SpineAnimationCache } from './spine-skeleton-cache';
import { SpineSkeletonInstance, SpineSkeletonMesh, SpineJitterVertexEffect, SpineSwirlVertexEffect } from './spine-skeleton-imply-wasm';
import { UITransform } from '../../2d';

const attachMat4 = new Mat4();
@ccclass('sp.SpineSkeletonAnimation')
@help('i18n:sp.SpineSkeletonAnimation')
@executionOrder(99)
@menu('Spine/SpineSkeletonAnimation')
@executeInEditMode
export class SpineSkeletonAnimation extends Component {
    @serializable
    protected _skeletonData: SkeletonData | null = null;
    @serializable
    private _defaultSkinName = 'default';
    @serializable
    private _defaultAnimationName = '<None>';
    @serializable
    private _texture: Texture2D | null = null;
    @serializable
    private _cacheMode = false;
    @serializable
    private _useTint = false;
    @serializable
    protected _premultipliedAlpha = true;
    @serializable
    private _timeScale = 1.0;
    @serializable
    protected _sockets: SpineSocket[] = [];
    @serializable
    protected _loop = true;

    private _skinName = '';
    private _animationName = '';
    private _renderer: SpineSkeletonModelRenderer | null = null;
    private _skeleton: SpineSkeletonInstance = null!;
    declare private _slotTable: Map<number, string | null>;
    protected _cachedSockets: Map<string, number> = new Map<string, number>();
    protected _socketNodes: Map<number, Node> = new Map();
    protected _effect: SpineJitterVertexEffect | SpineSwirlVertexEffect | null = null;

    constructor () {
        super();
        setEnumAttr(this, 'defaultSkinIndex', Enum({}));
        setEnumAttr(this, 'animationIndex', Enum({}));
        this._skeleton = new SpineSkeletonInstance();
        this._skeleton.setDefaultScale(0.01);
    }

    @type(SkeletonData)
    @displayName('SkeletonData')
    get skeletonData () {
        return this._skeletonData;
    }
    set skeletonData (value: SkeletonData | null) {
        if (this._skeletonData === value) return;
        this._skeletonData = value;
        if (this._skeletonData) {
            if (this._skeletonData.textures.length > 0) {
                this._texture = this._skeletonData.textures[0];
            }
        } else {
            this._texture = null;
        }
        this._updateSkinEnum();
        this._updateAnimEnum();
        this._updateSkeletonData();
    }

    /**
     * @internal
     */
    @displayName('Default Skin')
    @type(SpineSkinEnum)
    get defaultSkinIndex (): number {
        if (!this.skeletonData) return 0;
        const skinsEnum = this.skeletonData.getSkinsEnum();
        if (!skinsEnum) return 0;
        if (this._defaultSkinName === 'default') {
            // eslint-disable-next-line no-prototype-builtins
            if (skinsEnum.hasOwnProperty(0)) {
                this.defaultSkinIndex = 0;
                return 0;
            }
        } else {
            const skinIndex = skinsEnum[this._defaultSkinName];
            if (skinIndex !== undefined) return skinIndex;
        }
        return 0;
    }
    set defaultSkinIndex (value: number) {
        if (!this.skeletonData) return;
        const skinsEnum = this.skeletonData.getSkinsEnum();
        if (!skinsEnum) {
            console.error(`${this.name} skin enums are invalid`);
            return;
        }
        const skinName = skinsEnum[value];
        if (skinName !== undefined) {
            this._defaultSkinName = skinName.toString();
            this.setSkin(this._defaultSkinName);
            if (EDITOR) this._updateSkinEnum();
        } else {
            console.error(`${this.name} skin enums are invalid`);
        }
    }

    /**
     * @internal
     */
    @displayName('Animation')
    @type(SpineAnimationEnum)
    get animationIndex () {
        if (!this.skeletonData) return 0;
        const animsEnum = this.skeletonData.getAnimsEnum();
        if (!animsEnum) return 0;
        const animName = this._defaultAnimationName;
        const animIndex = animsEnum[animName];
        if (animIndex !== undefined) return animIndex;
        return 0;
    }
    set animationIndex (value: number) {
        if (!this.skeletonData) return;
        const animsEnum = this.skeletonData.getAnimsEnum();
        if (!animsEnum) {
            console.error(`${this.name} animation enums are invalid`);
            return;
        }
        const animName = animsEnum[value];
        if (animName !== undefined) {
            this._defaultAnimationName = animName.toString();
            this.setAnimation(0, this._defaultAnimationName);
            if (EDITOR) this._updateAnimEnum();
        } else {
            console.error(`${this.name} animation enums are invalid`);
        }
    }

    @type(Texture2D)
    @displayName('Texture2D')
    get texture () {
        return this._texture;
    }
    set texture (tex: Texture2D| null) {
        this._texture = tex;
    }

    // @type(CCBoolean)
    // @tooltip('i18n:COMPONENT.skeleton.cacheMode')
    // get cacheMode () {
    //     return this._cacheMode;
    // }
    // set cacheMode (val) {
    //     if (this._cacheMode !== val) {
    //         this._cacheMode = val;
    //     }
    // }

    @type(CCBoolean)
    @tooltip('i18n:COMPONENT.skeleton.useTint')
    get useTint () {
        return this._useTint;
    }
    set useTint (val) {
        if (this._useTint !== val) {
            this._useTint = val;
        }
        this._updateUseTint();
    }

    /**
     * @en Whether play animations in loop mode.
     * @zh 是否循环播放当前骨骼动画。
     */
    @type(CCBoolean)
    @tooltip('i18n:COMPONENT.skeleton.loop')
    get loop () {
        return this._loop;
    }
    set loop (val) {
        this._loop = val;
    }

    /**
     * @en Whether premultipliedAlpha enabled.
     * @zh 是否启用 alpha 预乘。
     */
    @editable
    @tooltip('i18n:COMPONENT.skeleton.premultipliedAlpha')
    get premultipliedAlpha (): boolean { return this._premultipliedAlpha; }
    set premultipliedAlpha (v: boolean) {
        if (v !== this._premultipliedAlpha) {
            this._premultipliedAlpha = v;
            this._skeleton.setPremultipliedAlpha(this._premultipliedAlpha);
            //if (this._renderer) this._renderer.premultipliedAlpha = v;
        }
    }

    @editable
    @range([0, 10.0])
    @type(CCFloat)
    @tooltip('i18n:Animation Speed')
    @displayName('Time Scale')
    get timeScale (): number {
        return this._timeScale;
    }
    set timeScale (val: number) {
        this._timeScale = val;
        this.updateTimeScale(val);
    }

    @type([SpineSocket])
    @tooltip('i18n:SpineBone.sockets')
    get sockets (): SpineSocket[] {
        return this._sockets;
    }
    set sockets (val: SpineSocket[]) {
        this._sockets = val;
        this._updateSocketBindings();
        this._syncAttachedNode();
    }

    get skinName () {
        return this._skinName;
    }
    public setSkin (skinName: string) {
        if (this._skinName === skinName) return;

        this._skinName = skinName;
        this._skeleton.setSkin(skinName);
        this._updateRenderData();
    }

    // update skin list for editor
    protected _updateSkinEnum () {
        if (!EDITOR) return;
        let skinEnum;
        if (this.skeletonData) {
            skinEnum = this.skeletonData.getSkinsEnum();
        } else {
            skinEnum = SpineSkinEnum;
        }

        const enumSkins = Enum({});
        Object.assign(enumSkins, skinEnum);
        Enum.update(enumSkins);
        setEnumAttr(this, 'defaultSkinIndex', enumSkins);
    }

    // update animation list for editor
    protected _updateAnimEnum () {
        let animEnum;
        if (this.skeletonData) {
            animEnum = this.skeletonData.getAnimsEnum();
        } else {
            animEnum = SpineAnimationEnum;
        }
        // reset enum type
        const enumAnimations = Enum({});
        Object.assign(enumAnimations, animEnum);
        Enum.update(enumAnimations);
        setEnumAttr(this, 'animationIndex', enumAnimations);
    }

    public __preload () {
        if (EDITOR) {
            this._updateSkinEnum();
            this._updateAnimEnum();
        }
        this._skinName = this._defaultSkinName;
        this._animationName = this._defaultAnimationName;
        this._updateSkeletonData();
        this._initRenderer();
    }

    public onRestore () {

    }

    public update (dt: number) {
        this._updateAnimation(dt);
        this._syncAttachedNode();
        this._updateRenderData();
    }

    public onEnable () {

    }

    public onDisable () {
        this._updateRenderData();
    }

    public onDestroy () {
        if (this._skeleton) {
            this._skeleton.onDestroy();
            this._skeleton = null!;
        }
    }

    protected _updateSkeletonData () {
        if (this._skeletonData === null || this._skeleton === null) return;
        this._skeleton.setSkeletonData(this._skeletonData);
        this.setSkin(this._skinName);
        this.setAnimation(0, this._animationName);
        this._slotTable = this._skeleton.getSlotsTable();
        this._indexBoneSockets();
        this._updateSocketBindings();

        if (this._renderer) {
            this._renderer.resetProperties(this._texture, []);
        }

        this._updateRenderData();
    }

    public setAnimation (trackIndex: number, name: string, loop?: boolean) {
        if (loop !== undefined) this._loop = loop;
        if (trackIndex === 0) this._animationName = name;
        this._skeleton.setAnimation(trackIndex, name, this._loop);
        this._skeleton.setTimeScale(this._timeScale);
        this._updateRenderData();
    }

    public clearTrack (trackIndex: number) {
        if (this._cacheMode) return;
        this._skeleton.clearTrack(trackIndex);
    }

    public clearTracks () {
        this._animationName = '<None>';
        this._skeleton.clearTracks();
    }

    public setToSetupPose () {
        this._skeleton.setToSetupPose();
    }

    public setVertexEffectDelegate (effect: SpineJitterVertexEffect | SpineSwirlVertexEffect | null) {
        this._effect = effect;
        this._skeleton.setVertexEffect(this._effect);
    }

    public updateTimeScale (val: number) {
        this._skeleton.setTimeScale(val);
    }

    private _updateRenderData () {
        if (!this._renderer) return;
        const mesh = this._skeleton.updateRenderData();
        this._renderer.mesh = mesh!;
    }

    private _initRenderer () {
        let render = this.node.getComponent(SpineSkeletonModelRenderer);
        if (!render) {
            render = this.node.addComponent(SpineSkeletonModelRenderer);
        }

        render.resetProperties(this._texture, []);
        this._renderer = render;
    }

    private _updateSocketBindings () {
        if (!this._skeletonData) return;
        this._socketNodes.clear();
        for (let i = 0, l = this._sockets.length; i < l; i++) {
            const socket = this._sockets[i];
            if (socket.path && socket.target) {
                const boneIdx = this._cachedSockets.get(socket.path);
                if (!boneIdx) {
                    console.error(`Skeleton data does not contain path ${socket.path}`);
                    continue;
                }
                this._socketNodes.set(boneIdx, socket.target);
            }
        }
    }

    private _indexBoneSockets () {
        if (!this._skeletonData) return;
        this._cachedSockets.clear();
        const sd = this._skeletonData.getRuntimeData();
        const bones = sd!.bones;

        const getBoneName = (bone: any): any => {
            if (bone.parent == null) return bone.name || '<Unamed>';
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return `${getBoneName(bones[bone.parent.index])}/${bone.name}`;
        };

        for (let i = 0, l = bones.length; i < l; i++) {
            const bd = bones[i];
            const boneName = getBoneName(bd);
            this._cachedSockets.set(boneName, bd.index);
        }
    }
    public querySockets () {
        this._indexBoneSockets();
        return Array.from(this._cachedSockets.keys());
    }

    private _syncAttachedNode () {
        const socketNodes = this._socketNodes;
        for (const boneIdx of socketNodes.keys()) {
            const boneNode = socketNodes.get(boneIdx);
            if (!boneNode) continue;
            this._skeleton.getBoneMatrix(boneIdx, attachMat4);
            boneNode.matrix = attachMat4;
        }
    }

    private _updateUseTint () {

    }

    public setMix (fromAnimation: string, toAnimation: string, duration: number): void {
        if (!this._skeletonData) return;
        this._skeleton.setMix(fromAnimation, toAnimation,  duration);
    }

    private _updateAnimation (dt: number) {
        this._skeleton.updateAnimation(dt);
    }

    /**
     * @en Sets the slots to the setup pose,
     * using the values from the `SlotData` list in the `SkeletonData`.
     * @zh 设置 slot 到起始动作。
     * 使用 SkeletonData 中的 SlotData 列表中的值。
     */
    public setSlotsToSetupPose () {
        this._skeleton.setSlotsToSetupPose();
    }
    /**
     * @en Sets the bones to the setup pose,
     * using the values from the `BoneData` list in the `SkeletonData`.
     * @zh 设置 bone 到起始动作。
     * 使用 SkeletonData 中的 BoneData 列表中的值。
     */
    public setBonesToSetupPose () {
        if (this._skeleton) {
            this._skeleton.setBonesToSetupPose();
        }
    }
    /**
     * @en Sets the attachment for the slot and attachment name.
     * The skeleton looks first in its skin, then in the skeleton data’s default skin.
     * @zh 通过 slot 和 attachment 的名字来设置 attachment。
     * Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
     */
    public setAttachment (slotName: string, attachmentName: string) {
        if (this._skeletonData) {
            this._skeleton.setAttachment(slotName, attachmentName);
        }
    }
}
