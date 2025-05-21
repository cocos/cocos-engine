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

    let window: any;

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
        xDelta: number | undefined,
        yDelta: number | undefined,
        button: number,
        windowId: number,
    }
    type MouseEventCallback = (mouseEvent: MouseEvent) => void;
    export interface MouseWheelEvent extends MouseEvent {
        wheelDeltaX: number,
        wheelDeltaY: number,
    }
    type MouseWheelEventCallback = (mouseEvent: MouseWheelEvent) => void;
    export let onMouseDown: MouseEventCallback | undefined;
    export let onMouseMove: MouseEventCallback | undefined;
    export let onMouseUp: MouseEventCallback | undefined;
    export let onMouseWheel: MouseWheelEventCallback | undefined;

    type TouchEventCallback = (touchList: TouchList, windowId?: number) => void;
    export let onTouchStart: TouchEventCallback | undefined;
    export let onTouchMove: TouchEventCallback | undefined;
    export let onTouchEnd: TouchEventCallback | undefined;
    export let onTouchCancel: TouchEventCallback | undefined;

    export interface ControllerInfo {
        id: number;
        axisInfoList: AxisInfo[],
        buttonInfoList: ButtonInfo[],
        touchInfoList: TouchInfo[],
    }

    export interface AxisInfo {
        code: number,
        value: number,
    }

    export interface ButtonInfo {
        code: number,
        isPressed: boolean,
    }

    export interface TouchInfo {
        code: number,
        value: number,
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
    export let onHandheldPoseInput: (infoList: PoseInfo[]) => void | undefined;

    export interface KeyboardEvent {
        altKey: boolean;
        ctrlKey: boolean;
        metaKey: boolean;
        shiftKey: boolean;
        repeat: boolean;
        keyCode: number;
        windowId: number;
        code: string;
    }
    type KeyboardEventCallback = (keyboardEvent: KeyboardEvent) => void;
    export let onKeyDown: KeyboardEventCallback | undefined;
    export let onKeyUp: KeyboardEventCallback | undefined;

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
    export let onOrientationChanged: (event: { orientation: number }) => void | undefined;  // TODO: enum orientation type
    export let onResume: () => void | undefined;
    export let onPause: () => void | undefined;
    export let onClose: () => void | undefined;
    export let onWindowLeave: () => void | undefined;
    export let onWindowEnter: () => void | undefined;
    export function openURL(url: string): void;
    export function garbageCollect(): void;
    enum AudioFormat {
        UNKNOWN,
        SIGNED_8,
        UNSIGNED_8,
        SIGNED_16,
        UNSIGNED_16,
        SIGNED_32,
        UNSIGNED_32,
        FLOAT_32,
        FLOAT_64
    }
    interface PCMHeader {
        totalFrames: number;
        sampleRate: number;
        bytesPerFrame: number;
        audioFormat: AudioFormat;
        channelCount: number;
    }
    export namespace AudioEngine {
        export function preload(url: string, cb: (isSuccess: boolean) => void);

        export function play2d(url: string, loop: boolean, volume: number): number;
        export function pause(id: number);
        export function pauseAll();
        export function resume(id: number);
        export function resumeAll();
        export function stop(id: number);
        export function stopAll();

        export function getPlayingAudioCount(): number;
        export function getMaxAudioInstance(): number;
        export function getState(id: number): any;
        export function getDuration(id: number): number;
        export function getVolume(id: number): number;
        export function isLoop(id: number): boolean;
        export function getCurrentTime(id: number): number;

        export function setVolume(id: number, val: number);
        export function setLoop(id: number, val: boolean);
        export function setCurrentTime(id: number, val: number);

        export function uncache(url: string);
        export function uncacheAll();
        export function setErrorCallback(id: number, cb: (err: any) => void);
        export function setFinishCallback(id: number, cb: () => void);

        /**
         * Get PCM header without pcm data. if you want to get pcm data, use getOriginalPCMBuffer instead
         */
        export function getPCMHeader(url: string): PCMHeader;
        /**
         * Get PCM Data in decode format for example Int16Array, the format information is written in PCMHeader.
         * @param url: file relative path, for example player._path
         * @param channelID: ChannelID which should smaller than channel count, start from 0
         */
        export function getOriginalPCMBuffer(url: string, channelID: number): ArrayBuffer | undefined;
    }

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
        constructor(manifestUrl: string);
        constructor(content: string, manifestRoot: string);
        parseFile(manifestUrl: string): void;
        parseJSONString(content: string, manifestRoot: string): void;

        getManifestRoot(): string;
        getManifestFileUrl(): string;
        getVersionFileUrl(): string;
        getSearchPaths(): [string];
        getVersion(): string;
        getPackageUrl(): boolean;

        setUpdating(isUpdating: boolean): void;
        isUpdating(): boolean;
        isVersionLoaded(): boolean;
        isLoaded(): boolean;
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

        constructor(eventName: string, manager: AssetsManager, eventCode: number,
            assetId?: string, message?: string, curleCode?: number, curlmCode?: number);
        getAssetsManagerEx(): AssetsManager;
        isResuming(): boolean;

        getDownloadedFiles(): number;
        getDownloadedBytes(): number;
        getTotalFiles(): number;
        getTotalBytes(): number;
        getPercent(): number;
        getPercentByFile(): number;

        getEventCode(): number;
        getMessage(): string;
        getAssetId(): string;
        getCURLECode(): number;
        getCURLMCode(): number;
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
        constructor(manifestUrl: string, storagePath: string, versionCompareHandle?: (versionA: string, versionB: string) => number);
        static create(manifestUrl: string, storagePath: string): AssetsManager;

        getState(): AssetsManager.State;
        getStoragePath(): string
        getMaxConcurrentTask(): number;
        // setMaxConcurrentTask (max: number): void;  // actually not supported

        checkUpdate(): void;
        prepareUpdate(): void;
        update(): void;
        isResuming(): boolean;
        cancelUpdate(): void;

        getDownloadedFiles(): number;
        getDownloadedBytes(): number;
        getTotalFiles(): number;
        getTotalBytes(): number;
        downloadFailedAssets(): void;

        getLocalManifest(): Manifest;
        loadLocalManifest(manifestUrl: string): boolean;
        loadLocalManifest(localManifest: Manifest, storagePath: string): boolean;
        getRemoteManifest(): Manifest;
        loadRemoteManifest(remoteManifest: Manifest): boolean;

        /**
         * Setup your own version compare handler, versionA and B is versions in string.
         * if the return value greater than 0, versionA is greater than B,
         * if the return value equals 0, versionA equals to B,
         * if the return value smaller than 0, versionA is smaller than B.
         */
        setVersionCompareHandle(versionCompareHandle?: (versionA: string, versionB: string) => number): void;
        /**
         * Setup the verification callback, Return true if the verification passed, otherwise return false
         */
        setVerifyCallback(verifyCallback: (path: string, asset: ManifestAsset) => boolean): void;
        setEventCallback(eventCallback: (event: EventAssetsManager) => void): void;
    }

    // Android ADPF module
    const adpf: {
        readonly thermalHeadroom: number;
        readonly thermalStatus: number;
        readonly thermalStatusMin: number;
        readonly thermalStatusMax: number;
        readonly thermalStatusNormalized: number;
        onThermalStatusChanged?: (previousStatus: number, newStatus: number, statusMin: number, statusMax: number) => void;
    } | undefined;

    export class PlayException {
        /**
         * @en Getting Exception message.
         * @zh 获取异常信息。
         */
        getMessage(): string;
        /**
         * @en Returns the name of the exception in the local language of the user (Chinese etc.).
         * @zh 用户的本地语言（中文等）返回异常名称。
         */
        getLocalizedMessage(): string;
        /**
         * @en Print the exception stack.
         * @zh 打印异常堆栈。
         */
        printStackTrace(): void;
        /**
         * @en To string.
         * @zh 转换成字符串。
         */
        toString(): string;
    }

    export interface OnCanceledListener {
        /**
         * @en Called when the Task is canceled successfully.
         * @zh 当任务成功取消时调用。
         */
        onCanceled(): void;
    }

    export interface OnCompleteListener {
        /**
         * @en Called when the Task completes.
         * @zh 任务完成时调用。
         */
        onComplete(task: any): void;
    }

    export interface OnFailureListener {
        /**
         * @en Called when the Task fails with an exception.
         * @zh 当任务因异常而失败时调用。
         */
        onFailure(e: PlayException): void;
    }

    export interface OnSuccessListener {
        /**
         * @en Called when the Task completes successfully.
         * @zh 成功完成时调用 Task 。
         */
        onSuccess(result: any): void;
    }

    export interface OnContinueWithListener {
        /**
         * @en Returns the result of applying this Continuation to task.
         * @zh 返回将此 Continuation 应用到 的结果 task 。
         */
        then(result: any): void;
    }

    export class PlayTask {
        /**
         * @en Adds a listener that is called if the Task is canceled.
         * @zh 添加一个侦听器，当任务被取消时调用该侦听器。
         */
        public addOnCanceledListener(listener: OnCanceledListener): PlayTask;
        /**
         * @en Adds a listener that is called when the Task completes.
         * @zh 添加在任务完成时调用的监听器。
         */
        public addOnCompleteListener(listener: OnCompleteListener): PlayTask;
        /**
         * @en Adds a listener that is called if the Task fails.
         * @zh 添加一个在任务失败时调用的监听器。
         */
        public addOnFailureListener(listener: OnFailureListener): PlayTask;
        /**
         * @en Adds a listener that is called if the Task completes successfully.
         * @zh 添加一个侦听器，当任务成功完成时调用该侦听器。
         */
        public addOnSuccessListener(listener: OnSuccessListener): PlayTask;
        /**
         * @en Returns a new Task that will be completed with the result of applying the specified Continuation to this Task.
         * @zh 返回一个新任务，该任务将通过将指定的延续应用于此任务的结果来完成。
         */
        public continueWith(listener: OnContinueWithListener): PlayTask;
        /**
         * @en Gets the result of the Task, if it has already completed.
         * @zh 如果任务已经完成，则获取任务的结果。
         */
        public getResult(listener: OnSuccessListener): any;
        /**
         * @en Returns true if the Task is canceled; false otherwise.
         * @zh true 如果任务被取消则返回；false 否则返回。
         */
        public isCanceled(): boolean;
        /**
         * @en Returns true if the Task is complete; false otherwise.
         * @zh true 如果任务完成则返回；false 否则返回。
         */
        public isComplete(): boolean;
        /**
         * @en Returns true if the Task has completed successfully; false otherwise.
         * @zh true 如果任务已成功完成则返回；false 否则返回。
         */
        public isSuccessful(): boolean;
    }
    /**
     * @en Represents the current authentication status with Play Games Services.
     * @zh 代表 Play Games Services 的当前身份验证状态。
     */
    export class AuthenticationResult {
        private constructor();
        /**
         * @en Returns true if your game is authenticated to Play Games Services.
         * @zh 返回true表示您的游戏已通过 Play Games Services 的身份验证。
         */
        public isAuthenticated(): boolean;
    }
    /**
     * @en Contains the result of RecallClient.requestRecallAccess().
     * @zh 包含 RecallClient.requestRecallAccess() 的返回结果
     */
    export class RecallAccess {
        private constructor();
        /**
         * @en Hash code
         * @zh hash值
         */
        public hashCode(): number;
        /**
         * @en Returns the session id to be passed into PGS server API.
         * @zh 返回要传递到 PGS server API 的会话 ID。
         */
        public getSessionId(): string;
        /**
         * @en Is it equal to another RecallAccess.
         * @zh 判断与另一个 RecallAccess 是否相等。
         */
        public equals(other: RecallAccess): boolean;
    }
    /**
     * @en A client for performing sign-in with Play Games Services.
     * @zh 用于使用 Play Games Services 执行登录的客户端。
     */
    export class GamesSignInClient {
        /**
         * @en Returns the current authentication status via an AuthenticationResult.
         * @zh 通过 返回当前身份验证状态 AuthenticationResult 。
         */
        public isAuthenticated(): PlayTask;
        /**
         * @en Requests server-side access to Play Games Services for the currently signed-in player.
         * @zh 向当前登录的玩家请求服务器端访问 Play Games Services。
         */
        public requestServerSideAccess(serverClientId: string, forceRefreshToken: boolean): PlayTask;
        /**
         * @en Manually requests that your game sign in with Play Games Services.
         * @zh 手动请求您的游戏通过 Play Games Services 登录。
         */
        public signIn(): PlayTask;
    }
    /**
     * @en Data interface for retrieving achievement information.
     * @zh 用于检索成就信息的数据接口。
     */
    export class Achievement {
        /**
         * @en Constant returned by getState() indicating an unlocked achievement.
         * @zh getState 返回的常量表示未解锁的成就。
         */
        public static STATE_UNLOCKED: number;
        /**
         * @en Constant returned by getState() indicating a revealed achievement.
         * @zh getState 返回的常量表示已显示的成就。
         */
        public static STATE_REVEALED: number;
        /**
         * @en Constant returned by getState() indicating a hidden achievement.
         * @zh getState 返回的常量表示隐藏的成就。
         */
        public static STATE_HIDDEN: number;
        /**
         * @en Constant returned by getType() indicating a standard achievement.
         * @zh getState 返回的常量表示标准的成就。
         */
        public static TYPE_STANDARD: number;
        /**
         * @en Constant returned by getType() indicating an incremental achievement.
         * @zh getState 返回的常量表示增量的成就。
         */
        public static TYPE_INCREMENTAL: number;
        /**
         * @en Retrieves the number of steps this user has gone toward unlocking this achievement;
         *     only applicable for TYPE_INCREMENTAL achievement types.
         * @zh 检索该用户为解锁该成就所走的步数；仅适用于 TYPE_INCREMENTAL 成就类型。
         */
        public getCurrentSteps(): number;
        /**
         * @en Returns the Achievement.AchievementState of the achievement.
         * @zh 返回 Achievement.AchievementState 成就。
         */
        public getState(): number;
        /**
         * @en Retrieves the total number of steps necessary to unlock this achievement; only applicable for TYPE_INCREMENTAL achievement types
         * @zh 检索解锁此成就所需的总步数；仅适用于 TYPE_INCREMENTAL 成就类型。
         */
        public getTotalSteps(): number;
        /**
         * @en Returns the Achievement.AchievementType of this achievement.
         * @zh 返回 Achievement.AchievementType 此成就。
         */
        public getType(): number;
        /**
         * @en Retrieves the timestamp (in millseconds since epoch) at which this achievement was last updated.
         * @zh 检索此成就最后更新的时间戳（以纪元以来的毫秒数为单位）。
         */
        public getLastUpdatedTimestamp(): number;
        /**
         * @en Retrieves the XP value of this achievement.
         * @zh 检索此成就的 XP 值。
         */
        public getXpValue(): number;
        /**
         * @en Retrieves the ID of this achievement.
         * @zh 检索此成就的 ID。
         */
        public getAchievementId(): string;
        /**
         * @en Retrieves the description for this achievement.
         * @zh 检索此成就的描述。
         */
        public getDescription(): string;
        /**
         * @enRetrieves the number of steps this user has gone toward unlocking this achievement
         *              (formatted for the user's locale); only applicable for TYPE_INCREMENTAL achievement types.
         * @zh 检索该用户为解锁此成就所经过的步数（根据用户的语言环境格式化）；仅适用于 TYPE_INCREMENTAL成就类型。
         */
        public getFormattedCurrentSteps(): string;
        /**
         * @en Loads the total number of steps necessary to unlock this achievement
         *     (formatted for the user's locale) into the given CharArrayBuffer; only applicable for TYPE_INCREMENTAL achievement types.
         * @zh 检索解锁此成就所需的总步数；仅适用于 TYPE_INCREMENTAL 成就类型。
         */
        public getFormattedTotalSteps(): string;
        /**
         * @en Retrieves the name of this achievement.
         * @zh 检索此成就的名称。
         */
        public getName(): string;
        /**
         * @en Retrieves a URI that can be used to load the achievement's revealed image icon.
         * @zh 检索可用于加载成就显示图像图标的 URI。
         */
        public getRevealedImageUrl(): string;
        /**
         * @en Retrieves a URI that can be used to load the achievement's unlocked image icon.
         * @zh 检索可用于加载成就的解锁图像图标的 URI。
         */
        public getUnlockedImageUrl(): string;
    }
    /**
     * @en Data structure providing access to a list of achievements.
     * @zh 提供访问成就列表的数据结构。
     */
    export class AchievementBuffer {
        /**
         * @en Get the count of achievement.
         * @zh 获取 achievement 的数量 。
         */
        public getCount(): number;
        /**
         * @en Get the item at the specified position.
         * @zh 获取指定位置的物品。
         */
        public get(i: number): Achievement;
        /**
         * @en Releases the data buffer, for use in try-with-resources.
         * @zh 释放数据缓冲区，以供在 try-with-resources 中使用。
         */
        public close(): void;
        /**
         * @en Releases resources used by the buffer.
         * @zh 释放缓冲区使用的资源。
         */
        public release(): void;
    }
    /**
     * @en Class to return annotated data. Currently, the only annotation is whether the data is stale or not.
     * @zh 用于返回带 annotated 数据的类。目前，唯一的 annotated 是数据是否过时。
     */
    export class AnnotatedData {
        /**
         * @en Returns true if the data returned by get() is stale.
         * @zh true如果返回的数据已过时，则返回 get() 。
         */
        public isStale(): boolean;
        /**
         * @en Returns the data that is annotated by this class.
         * @zh 返回由此类 annotated 的数据。
         */
        public get(): AchievementBuffer;
    }
    /**
     * @en A client to interact with achievements functionality.
     * @zh 与 Achievements 功能交互的客户端。
     */
    export class AchievementsClient {
        /**
         * @en Show default achievement page.
         * @zh 显示默认的成就页面。
         */
        public showAchievements(): void;
        /**
         * @en Returns a Task which asynchronously increments an achievement by the given number of steps.
         * @zh 返回一个 Task 以给定步数异步增加成就的方法。
         */
        public incrementImmediate(id: string, numSteps: number): PlayTask;
        /**
         * @en Returns a Task which asynchronously loads an annotated AchievementBuffer that represents the achievement data.
         *     for the currently signed-in player.
         * @zh 返回一个 Task 异步加载的task， AchievementBuffer该注释代表当前登录玩家的成就数据。
         */
        public load(forceReload: boolean): PlayTask;
        /**
         * @en Returns a Task which asynchronously reveals a hidden achievement to the currently signed in player.
         * @zh 返回一个 Task 异步向当前登录的玩家显示隐藏成就的对象。
         */
        public revealImmediate(id: string): PlayTask;
        /**
         * @en Returns a Task which asynchronously sets an achievement to have at least the given number of steps completed.
         * @zh 返回一个 Task 异步设置成就以至少完成给定数量的步骤。
         */
        public setStepsImmediate(id: string, numSteps: number): PlayTask;
        /**
         * @en Returns a Task which asynchronously unlocks an achievement for the currently signed in player.
         * @zh 返回一个 Task 异步解锁当前登录玩家的成就。
         */
        public unlockImmediate(id: string): PlayTask;
        /**
        * @en Increments an achievement by the given number of steps.
        * @zh 按给定的步数增加成就。
        */
        public increment(id: string, numSteps: number): void;
        /**
         * @en Reveals a hidden achievement to the currently signed-in player.
         * @zh 向当前登录的玩家揭示隐藏的成就。
         */
        public reveal(id: string): void;
        /**
         * @en Sets an achievement to have at least the given number of steps completed.
         * @zh 设置一项成就，至少完成给定数量的步骤。
         */
        public setSteps(id: string, numSteps: number): void;
        /**
         * @en Unlocks an achievement for the currently signed in player.
         * @zh 为当前登录的玩家解锁一项成就。
         */
        public unlock(id: string): void;
    }
    /**
     * @en A client for the recall functionality.
     * @zh Recall 功能客户端。
     */
    export class RecallClient {
        /**
         * @en Returns a RecallAccess to use for server-to-server communication between the 3p game server and Play Games Services server.
         * @zh 返回 RecallAccess 用于第三方游戏服务器和 Play 游戏服务服务器之间的服务器到服务器通信。
         */
        public requestRecallAccess(): PlayTask;
    }

    /**
     * @en Main entry point for the Games APIs. This class provides APIs and interfaces to access the Google Play Games Services functionality.
     * @zh 游戏 API 的主要入口点。此类提供用于访问 Google Play Games Services 功能的 API 和接口。
     */
    export class PlayGames {
        /**
         * @en Returns a new instance of AchievementsClient.
         * @zh 返回一个新的 AchievementsClient 实例。
         */
        public static getAchievementsClient(): AchievementsClient;
        /**
         * @en Returns a new instance of GamesSignInClient.
         * @zh 返回一个新的 GamesSignInClient 实例。
         */
        public static getGamesSignInClient(): GamesSignInClient;
        /**
         * @en Returns a new instance of RecallClient.
         * @zh 返回一个新的 RecallClient 实例。
         */
        public static getRecallClient(): RecallClient;
    }
   /**
    * @en Entry point for the Play Games SDK.
    * @zh Play Games SDK 的入口点。
    */
   export class PlayGamesSdk {
       /**
        * @en Initializes the Play Games SDK using the Game services application id defined in the application's manifest.
        * @zh 使用应用程序清单中定义的游戏服务应用程序 ID 初始化 Play 游戏 SDK。
        */
       public static initialize(): void;
   }
}

declare namespace ns {

    class NativePOD {
        underlyingData(): ArrayBuffer;
        _arraybuffer(): ArrayBuffer;
    }
    export class Line extends jsb.NativePOD {
    }
    export class Plane extends jsb.NativePOD {
    }
    export class Ray extends jsb.NativePOD {
    }
    export class Triangle extends jsb.NativePOD {
    }
    export class Sphere extends jsb.NativePOD {
    }
    export class AABB extends jsb.NativePOD {
    }
    export class Capsule extends jsb.NativePOD {
    }
    export class Frustum extends jsb.NativePOD {
    }
}

/**
 * Only defined on native platforms.
 * Now we only support 'V8'
 */
declare const scriptEngineType: 'V8';
