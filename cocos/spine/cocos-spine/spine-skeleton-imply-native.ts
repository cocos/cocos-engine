import { SkeletonData } from '../skeleton-data';
import { NativeSpineSkeletonInstance } from './spine-skeleton-native-type';
import { SpineSkeletonInstanceInterface } from './spine-skeleton-instance-interface';
import { Color } from '../../core';

export class SpineSkeletonInstance implements SpineSkeletonInstanceInterface {
    constructor () {
        this._nativeObj = new NativeSpineSkeletonInstance();
    }
    clearTrack(trackIndex: number): void {
        this._nativeObj.clearTrack(trackIndex);
    }
    clearTracks(): void {
        this._nativeObj.clearTracks();
    }
    setToSetupPose(): void {
        this._nativeObj.setToSetupPose();
    }
    setMix(fromAnimation: string, toAnimation: string, duration: number): void {
        this._nativeObj.setMix(fromAnimation, toAnimation, duration);
    }
    setDefaultScale(scale: number): void {
        this._nativeObj.setDefaultScale(scale);
    }
    setColor(color: Color): void {
        const r = color.r / 255.0;
        const g = color.g / 255.0;
        const b = color.b / 255.0;
        const a = color.a / 255.0;
        this._nativeObj.setColor(r, g, b, a);
    }
    setSlotsToSetupPose(): void {
        this._nativeObj.setSlotsToSetupPose();
    }
    setBonesToSetupPose(): void {
        this._nativeObj.setBonesToSetupPose();
    }
    setAttachment(slotName: string, attachmentName: string) {
        this._nativeObj.setAttachment(slotName, attachmentName);
    }

    public getNativeObject() {
        return this._nativeObj;
    }

    public onDestroy () {
    }

    public updateRenderData() {
        const mesh = this._nativeObj.updateRenderData();
        return mesh;
    }

    public setSkeletonData (data: SkeletonData) {
        if (!data.atlasText) return;
        if (data.skeletonJsonStr) {
            this._nativeObj.initSkeletonData(data.skeletonJsonStr, data.atlasText);
        } else if (data.nativeUrl.length > 0) {
            this._nativeObj.initSkeletonDataBinary(data.nativeUrl, data.atlasText);
        }
    }

    public setSkin (name: string): boolean {
        return this._nativeObj.setSkin(name);
    }

    public setAnimation (trackIdex: number, name: string, loop: boolean): boolean {
        let ret = this._nativeObj.setAnimation(trackIdex, name, loop);
        return ret;
    }

    public setTimeScale (timeScale: number) {
        this._nativeObj.setTimeScale(timeScale);
    }

    public updateAnimation (dltTime: number) {
        this._nativeObj.updateAnimation(dltTime);
    }

    public setPremultipliedAlpha (premultipliedAlpha: boolean) {

    }

    public getSlotsTable (): Map<number, string | null> {
        return new Map<number, string | null>();
    }

    private declare _nativeObj: NativeSpineSkeletonInstance;
}
