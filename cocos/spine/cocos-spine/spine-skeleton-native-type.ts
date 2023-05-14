import { Material, Texture2D } from '../../asset/assets';
import { NativeRenderEntity } from '../../2d/renderer/native-2d';
import { Color } from '../../core';

export declare class NativeSpineSkeletonInstance {
    constructor();
    setSkin(name: string);
    setAnimation(trackIndex: number, name: string, loop: boolean): boolean;
    updateAnimation(dltTime: number);
    setTimeScale(timeScale: number);
    clearTrack(trackIndex: number);
    clearTracks();
    setToSetupPose();
    setMix(fromAnimation: string, toAnimation: string, duration: number);
    setColor(r: number, g: number, b: number, a: number);
    setSlotsToSetupPose();
    setBonesToSetupPose();
    setAttachment(slotName: string, attachmentName: string)

    initSkeletonData(jsonStr: string, atlasText: string);
    initSkeletonDataBinary(dataPath: string, atlasText: string);
    setDefaultScale(scale: number);
    updateRenderData(): any;
}

export declare class NativeSpineSkeletonUIRenderer {
    constructor();
    setTexture (tex: Texture2D);
    setRenderEntity(nativeEntity: NativeRenderEntity);
    setMaterial(mat: Material);

    onDestroy();
}

export declare class NativeSpineSkeletonUI {
    constructor();
    updateRenderData();
    setSkeletonInstance(obj: NativeSpineSkeletonInstance);
    setSkeletonRendererer(rendererUI: NativeSpineSkeletonUIRenderer);
}
