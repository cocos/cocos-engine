import { Color } from '../../core';
import { SkeletonData } from '../skeleton-data';
/**
 * @engineInternal
 */
export interface SpineSkeletonInstanceInterface {
    setSkeletonData (data: SkeletonData);
    setSkin (name: string): void;
    setAnimation (trackIndex: number, name: string, loop: boolean): void;
    clearTrack (trackIndex: number): void;
    clearTracks (): void;
    setToSetupPose (): void;
    setTimeScale (timeScale: number): void;
    updateAnimation (dltTime: number): void;
    setMix (fromAnimation: string, toAnimation: string, duration: number): void;
    setDefaultScale (scale: number): void;
    setPremultipliedAlpha(premultipliedAlpha: boolean): void;
    setColor (color: Color): void;
    onDestroy (): void;
    setSlotsToSetupPose (): void;
    setBonesToSetupPose (): void;
    setAttachment (slotName: string, attachmentName: string): void;
}
