// some interfaces might be overridden
/* eslint-disable import/no-mutable-exports */

/**
 * API for jsb module
 * Author: haroel
 * Homepage: https://github.com/haroel/creatorexDTS
 *
 * @deprecated since v3.6.0, please import `native` from 'cc' module instead like `import { native } from 'cc';`.
 */
declare namespace jsb {

    type AccelerationXYZ = number;
    type AccelerationIncludingGravityXYZ = number;
    type RotationRateAlpha = number;
    type RotationRateBeta = number;
    type RotationRateGamma = number;
    type DeviceMotionValue = [AccelerationXYZ, AccelerationXYZ, AccelerationXYZ,
        AccelerationIncludingGravityXYZ, AccelerationIncludingGravityXYZ, AccelerationIncludingGravityXYZ,
        RotationRateAlpha, RotationRateBeta, RotationRateGamma];
    export namespace device {
        export function getBatteryLevel(): number;
        export function getDevicePixelRatio(): number;
        export function getDeviceOrientation(): number;
        export function getNetworkType(): number; // TODO: enum type
        export function getSafeAreaEdge(): NativeSafeAreaEdge;

        export function setAccelerometerEnabled(isEnabled: boolean);
        export function setAccelerometerInterval(intervalInSeconds: number);
        export function getDeviceMotionValue(): DeviceMotionValue;
    }

    export interface NativeSafeAreaEdge {
        /**
         * top
         */
        x: number;
        /**
         * left
         */
        y: number;
        /**
         * bottom
         */
        z: number;
        /**
         * right
         */
        w: number;
    }

    export interface MouseEvent {
        x: number,
        y: number,
        button: number,
        windowId: number,
    }
    type MouseEventCallback = (mouseEvent: MouseEvent) => void;
    export interface MouseWheelEvent extends MouseEvent {
        wheelDeltaX: number,
        wheelDeltaY: number,
    }
    type  MouseWheelEventCallback = (mouseEvent: MouseWheelEvent) => void;
    export let onMouseDown: MouseEventCallback | undefined;
    export let onMouseMove: MouseEventCallback | undefined;
    export let onMouseUp: MouseEventCallback | undefined;
    export let onMouseWheel: MouseWheelEventCallback | undefined;

    type TouchEventCallback = (touchList: TouchList, windowId?: number) =>  void;
    export let onTouchStart: TouchEventCallback | undefined;
    export let onTouchMove: TouchEventCallback | undefined;
    export let onTouchEnd: TouchEventCallback | undefined;
    export let onTouchCancel: TouchEventCallback | undefined;

    export interface ControllerInfo {
        id: number;
        axisInfoList: AxisInfo[],
        buttonInfoList: ButtonInfo[],
    }

    export interface AxisInfo {
        code: number,
        value: number,
    }

    export interface ButtonInfo {
        code: number,
        isPressed: boolean,
    }

    export let onControllerInput: (infoList: ControllerInfo[]) => void | undefined;
    export let onHandleInput: (infoList: ControllerInfo[]) => void | undefined;
    export let onControllerChange: (controllerIds: number[]) => void | undefined;

    export interface PoseInfo {
        code: number,
        x: number,
        y: number,
        z: number,
        quaternionX: number,
        quaternionY: number,
        quaternionZ: number,
        quaternionW: number,
    }

    export let onHandlePoseInput: (infoList: PoseInfo[]) => void | undefined;
    export let onHMDPoseInput: (infoList: PoseInfo[]) => void | undefined;
    export let onHandsetPoseInput: (infoList: PoseInfo[]) => void | undefined;

    export interface KeyboardEvent {
        altKey: boolean;
        ctrlKey: boolean;
        metaKey: boolean;
        shiftKey: boolean;
        repeat: boolean;
        keyCode: number;
        windowId: number;
    }
    type KeyboardEventCallback = (keyboardEvent: KeyboardEvent) => void;
    export let onKeyDown: KeyboardEventCallback | undefined;
    export let onKeyUp: KeyboardEventCallback| undefined;

    export interface WindowEvent {
        windowId: number;
        width: number;
        height: number;
    }

    /**
     * @en WindowEvent.width and WindowEvent.height have both been multiplied by DPR
     * @zh WindowEvent.width 和 WindowEvent.height 都已乘以 DPR
     */
    export let onResize: (event: WindowEvent) => void | undefined;
    export let onOrientationChanged: (event: {orientation: number}) => void | undefined;  // TODO: enum orientation type
    export let onResume: () => void | undefined;
    export let onPause: () => void | undefined;
    export let onClose: () => void | undefined;
    export function openURL(url: string): void;
    export function garbageCollect(): void;
    class NativePOD {
        underlyingData(): ArrayBuffer;
        _data(): TypedArray;
        __data: TypedArray;
    }

    export class Color extends NativePOD {
    }
    export class Quat extends NativePOD {
    }
    export class Vec2 extends NativePOD {
    }
    export class Vec3 extends NativePOD {
    }
    export class Vec4 extends NativePOD {
    }

    export class Mat3 extends NativePOD {
    }
    export class Mat4 extends NativePOD {
    }
    export interface ManifestAsset {
        md5: string;
        path: string;
        compressed: boolean;
        size: number;
        downloadState: number;
    }

    export class Manifest {
        constructor (manifestUrl: string);
        constructor (content: string, manifestRoot: string);
        parseFile (manifestUrl: string): void;
        parseJSONString (content: string, manifestRoot: string): void;

        getManifestRoot (): string;
        getManifestFileUrl (): string;
        getVersionFileUrl (): string;
        getSearchPaths (): [string];
        getVersion (): string;
        getPackageUrl (): boolean;

        setUpdating (isUpdating: boolean): void;
        isUpdating (): boolean;
        isVersionLoaded (): boolean;
        isLoaded (): boolean;
    }

    export class EventAssetsManager {
        // EventCode
        static ERROR_NO_LOCAL_MANIFEST: number;
        static ERROR_DOWNLOAD_MANIFEST: number;
        static ERROR_PARSE_MANIFEST: number;
        static NEW_VERSION_FOUND: number;
        static ALREADY_UP_TO_DATE: number;
        static UPDATE_PROGRESSION: number;
        static ASSET_UPDATED: number;
        static ERROR_UPDATING: number;
        static UPDATE_FINISHED: number;
        static UPDATE_FAILED: number;
        static ERROR_DECOMPRESS: number;

        constructor (eventName: string, manager: AssetsManager, eventCode: number,
            assetId?: string, message?: string, curleCode?: number, curlmCode?: number);
        getAssetsManagerEx (): AssetsManager;
        isResuming (): boolean;

        getDownloadedFiles (): number;
        getDownloadedBytes (): number;
        getTotalFiles (): number;
        getTotalBytes (): number;
        getPercent (): number;
        getPercentByFile (): number;

        getEventCode (): number;
        getMessage (): string;
        getAssetId (): string;
        getCURLECode (): number;
        getCURLMCode (): number;
    }

    export namespace AssetsManager {
        export enum State {
            UNINITED,
            UNCHECKED,
            PREDOWNLOAD_VERSION,
            DOWNLOADING_VERSION,
            VERSION_LOADED,
            PREDOWNLOAD_MANIFEST,
            DOWNLOADING_MANIFEST,
            MANIFEST_LOADED,
            NEED_UPDATE,
            READY_TO_UPDATE,
            UPDATING,
            UNZIPPING,
            UP_TO_DATE,
            FAIL_TO_UPDATE,
        }
    }

    export class AssetsManager {
        constructor (manifestUrl: string, storagePath: string, versionCompareHandle?: (versionA: string, versionB: string) => number);
        static create (manifestUrl: string, storagePath: string): AssetsManager;

        getState (): AssetsManager.State;
        getStoragePath (): string
        getMaxConcurrentTask (): number;
        // setMaxConcurrentTask (max: number): void;  // actually not supported

        checkUpdate (): void;
        prepareUpdate (): void;
        update (): void;
        isResuming (): boolean;

        getDownloadedFiles (): number;
        getDownloadedBytes (): number;
        getTotalFiles (): number;
        getTotalBytes (): number;
        downloadFailedAssets (): void;

        getLocalManifest (): Manifest;
        loadLocalManifest (manifestUrl: string): boolean;
        loadLocalManifest (localManifest: Manifest, storagePath: string): boolean;
        getRemoteManifest (): Manifest;
        loadRemoteManifest (remoteManifest: Manifest): boolean;

        /**
         * Setup your own version compare handler, versionA and B is versions in string.
         * if the return value greater than 0, versionA is greater than B,
         * if the return value equals 0, versionA equals to B,
         * if the return value smaller than 0, versionA is smaller than B.
         */
        setVersionCompareHandle (versionCompareHandle?: (versionA: string, versionB: string) => number): void;
        /**
         * Setup the verification callback, Return true if the verification passed, otherwise return false
         */
        setVerifyCallback (verifyCallback: (path: string, asset: ManifestAsset) => boolean): void;
        setEventCallback (eventCallback: (event: EventAssetsManager) => void): void;
    }
}
