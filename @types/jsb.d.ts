// some interfaces might be overridden
/* eslint-disable import/no-mutable-exports */

/**
 * API for jsb module
 * Author: haroel
 * Homepage: https://github.com/haroel/creatorexDTS
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

    type TouchEventCallback = (touchList: TouchList) => void;
    export let onTouchStart: TouchEventCallback | undefined;
    export let onTouchMove: TouchEventCallback | undefined;
    export let onTouchEnd: TouchEventCallback | undefined;
    export let onTouchCancel: TouchEventCallback | undefined;

    export interface KeyboardEvent {
        altKey: boolean;
        ctrlKey: boolean;
        metaKey: boolean;
        shiftKey: boolean;
        repeat: boolean;
        keyCode: number;
    }
    type KeyboardEventCallback = (keyboardEvent: KeyboardEvent) => void;
    export let onKeyDown: KeyboardEventCallback | undefined;
    export let onKeyUp: KeyboardEventCallback | undefined;

    export let onResize: (size: { width: number, height: number }) => void | undefined;
    export let onOrientationChanged: (event: { orientation: number }) => void | undefined;  // TODO: enum orientation type
    export let onResume: () => void | undefined;
    export let onPause: () => void | undefined;
    export let onClose: () => void | undefined;
    export function openURL(url: string): void;
    export function garbageCollect(): void;

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
    }

    export namespace reflection {
        /**
         * https://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html
         * call OBJC/Java static methods
         *
         * @param className
         * @param methodName
         * @param methodSignature
         * @param parameters
         */
        export function callStaticMethod(className: string, methodName: string, methodSignature: string, ...parameters: any): any;
        /**
         * inform application to apply specific method/function
         * @param {string} methodName: method name on java/oc layer
         * @param {string} arg: argument as input for app's function, json format suggest.
         */
        export function sendToNative(arg0: string, arg1?: string | null): void;
        /**
         * save your own callback controller with a js function
         * @param {Function} callback: method accepts 2 string args
         */
        export function setCallback(callback: Function): void;

    }
    /**
     * 下载任务对象
     */
    export type DownloaderTask = { requestURL: string, storagePath: string, identifier: string };

    /**
     * Http file downloader for jsb！
     */
    export class Downloader {
        /**
         * create a download task
         * @param requestURL
         * @param storagePath
         * @param identifier
         */
        createDownloadFileTask(requestURL: string, storagePath: string, identifier?: string): DownloaderTask;

        setOnFileTaskSuccess(onSucceed: (task: DownloaderTask) => void): void;

        setOnTaskProgress(onProgress: (task: DownloaderTask, bytesReceived: number,
            totalBytesReceived: number, totalBytesExpected: number) => void): void;

        setOnTaskError(onError: (task: DownloaderTask, errorCode: number, errorCodeInternal: number, errorStr: string) => void): void;
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

    /**
     * FileUtils  Helper class to handle file operations.
     */
    export namespace fileUtils {
        /**
         *  Checks whether the path is an absolute path.
         *
         *  @note On Android, if the parameter passed in is relative to "@assets/", this method will treat it as an absolute path.
         *        Also on Blackberry, path starts with "app/native/Resources/" is treated as an absolute path.
         *
         *  @param path The path that needs to be checked.
         *  @return True if it's an absolute path, false if not.
         */
        export function isAbsolutePath(path: string): boolean;
        /** Returns the fullpath for a given filename.

        First it will try to get a new filename from the "filenameLookup" dictionary.
        If a new filename can't be found on the dictionary, it will use the original filename.
        Then it will try to obtain the full path of the filename using the FileUtils search rules: resolutions, and search paths.
        The file search is based on the array element order of search paths and resolution directories.

        For instance:

            We set two elements("/mnt/sdcard/", "internal_dir/") to search paths vector by setSearchPaths,
            and set three elements("resources-ipadhd/", "resources-ipad/", "resources-iphonehd")
            to resolutions vector by setSearchResolutionsOrder. The "internal_dir" is relative to "Resources/".

            If we have a file named 'sprite.png', the mapping in fileLookup dictionary contains `key: sprite.png -> value: sprite.pvr.gz`.
            Firstly, it will replace 'sprite.png' with 'sprite.pvr.gz', then searching the file sprite.pvr.gz as follows:

                /mnt/sdcard/resources-ipadhd/sprite.pvr.gz      (if not found, search next)
                /mnt/sdcard/resources-ipad/sprite.pvr.gz        (if not found, search next)
                /mnt/sdcard/resources-iphonehd/sprite.pvr.gz    (if not found, search next)
                /mnt/sdcard/sprite.pvr.gz                       (if not found, search next)
                internal_dir/resources-ipadhd/sprite.pvr.gz     (if not found, search next)
                internal_dir/resources-ipad/sprite.pvr.gz       (if not found, search next)
                internal_dir/resources-iphonehd/sprite.pvr.gz   (if not found, search next)
                internal_dir/sprite.pvr.gz                      (if not found, return "sprite.png")

            If the filename contains relative path like "gamescene/uilayer/sprite.png",
            and the mapping in fileLookup dictionary contains `key: gamescene/uilayer/sprite.png -> value: gamescene/uilayer/sprite.pvr.gz`.
            The file search order will be:

                /mnt/sdcard/gamescene/uilayer/resources-ipadhd/sprite.pvr.gz      (if not found, search next)
                /mnt/sdcard/gamescene/uilayer/resources-ipad/sprite.pvr.gz        (if not found, search next)
                /mnt/sdcard/gamescene/uilayer/resources-iphonehd/sprite.pvr.gz    (if not found, search next)
                /mnt/sdcard/gamescene/uilayer/sprite.pvr.gz                       (if not found, search next)
                internal_dir/gamescene/uilayer/resources-ipadhd/sprite.pvr.gz     (if not found, search next)
                internal_dir/gamescene/uilayer/resources-ipad/sprite.pvr.gz       (if not found, search next)
                internal_dir/gamescene/uilayer/resources-iphonehd/sprite.pvr.gz   (if not found, search next)
                internal_dir/gamescene/uilayer/sprite.pvr.gz                      (if not found, return "gamescene/uilayer/sprite.png")

        If the new file can't be found on the file system, it will return the parameter filename directly.

        This method was added to simplify multiplatform support.
        Whether you are using cocos2d-js or any cross-compilation toolchain like StellaSDK or Apportable,
        you might need to load different resources for a given file in the different platforms.

        @since v2.1
        */
        export function fullPathForFilename(filename: string): string;
        /**
         *  Gets string from a file.
        */
        export function getStringFromFile(filename: string): string;
        /**
         *  Removes a file.
         *
         *  @param filepath The full path of the file, it must be an absolute path.
         *  @return True if the file have been removed successfully, false if not.
         */
        export function removeFile(filepath: string): boolean;
        /**
         *  Checks whether the path is a directory.
         *
         *  @param dirPath The path of the directory, it could be a relative or an absolute path.
         *  @return True if the directory exists, false if not.
         */
        export function isDirectoryExist(dirPath: string): boolean;
        /**
         * Normalize: remove . and ..
         * @param filepath
         */
        export function normalizePath(filepath: string): string;
        /**
         * Get default resource root path.
         */
        export function getDefaultResourceRootPath(): string;
        /**
         * Loads the filenameLookup dictionary from the contents of a filename.
         *
         * @note The plist file name should follow the format below:
         *
         * @code
         * <?xml version="1.0" encoding="UTF-8"?>
         * <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
         * <plist version="1.0">
         * <dict>
         *     <key>filenames</key>
         *     <dict>
         *         <key>sounds/click.wav</key>
         *         <string>sounds/click.caf</string>
         *         <key>sounds/endgame.wav</key>
         *         <string>sounds/endgame.caf</string>
         *         <key>sounds/gem-0.wav</key>
         *         <string>sounds/gem-0.caf</string>
         *     </dict>
         *     <key>metadata</key>
         *     <dict>
         *         <key>version</key>
         *         <integer>1</integer>
         *     </dict>
         * </dict>
         * </plist>
         * @endcode
         * @param filename The plist file name.
         *
         @since v2.1
        * @js loadFilenameLookup
        * @lua loadFilenameLookup
        */
        export function loadFilenameLookup(filepath: string): void;
        /** Checks whether to pop up a message box when failed to load an image.
         *  @return True if pop up a message box when failed to load an image, false if not.
         */
        export function isPopupNotify(): boolean;
        /**
         *  Sets whether to pop-up a message box when failed to load an image.
         */
        export function setPopupNotify(notify: boolean): void;

        // Converts the contents of a file to a ValueVector.
        // This method is used internally.
        export function getValueVectorFromFile(filepath: string): Array<any>;
        /**
         *  Gets the array of search paths.
         *
         *  @return The array of search paths which may contain the prefix of default resource root path.
         *  @note In best practise, getter function should return the value of setter function passes in.
         *        But since we should not break the compatibility, we keep using the old logic.
         *        Therefore, If you want to get the original search paths, please call 'getOriginalSearchPaths()' instead.
         *  @see fullPathForFilename(const char*).
         *  @lua NA
         */
        export function getSearchPaths(): Array<string>;
        /**
         *
         * @param filepath
         */
        export function getFileDir(filepath: string): string;
        /**
        * write a ValueMap into a plist file
        *
        *@param dict the ValueMap want to save (key,value)
        *@param fullPath The full path to the file you want to save a string
        *@return bool
        */
        export function writeToFile(valueMap: any): boolean;
        /**
         *  Gets the original search path array set by 'setSearchPaths' or 'addSearchPath'.
         *  @return The array of the original search paths
         */
        export function getOriginalSearchPaths(): Array<string>;
        /**
         *  List all files in a directory.
         *
         *  @param dirPath The path of the directory, it could be a relative or an absolute path.
         *  @return File paths in a string vector
         */
        export function listFiles(filepath: string): Array<string>;
        /**
         *  Converts the contents of a file to a ValueMap.
         *  @param filename The filename of the file to gets content.
         *  @return ValueMap of the file contents.
         *  @note This method is used internally.
         */
        export function getValueMapFromFile(filepath: string): any;
        /**
         *  Retrieve the file size.
         *
         *  @note If a relative path was passed in, it will be inserted a default root path at the beginning.
         *  @param filepath The path of the file, it could be a relative or absolute path.
         *  @return The file size.
         */
        export function getFileSize(filepath: string): number;

        /** Converts the contents of a file to a ValueMap.
         *  This method is used internally.
         */
        export function getValueMapFromData(filedata: string, filesize: number): any;
        /**
         *  Removes a directory.
         *
         *  @param dirPath  The full path of the directory, it must be an absolute path.
         *  @return True if the directory have been removed successfully, false if not.
         */
        export function removeDirectory(dirPath: string): boolean;
        /**
         *  Sets the array of search paths.
         *
         *  You can use this array to modify the search path of the resources.
         *  If you want to use "themes" or search resources in the "cache", you can do it easily by adding new entries in this array.
         *
         *  @note This method could access relative path and absolute path.
         *        If the relative path was passed to the vector, FileUtils will add the default resource directory before the relative path.
         *        For instance:
         *            On Android, the default resource root path is "@assets/".
         *            If "/mnt/sdcard/" and "resources-large" were set to the search paths vector,
         *            "resources-large" will be converted to "@assets/resources-large" since it was a relative path.
         *
         *  @param searchPaths The array contains search paths.
         *  @see fullPathForFilename(const char*)
         *  @since v2.1
         *  In js:var setSearchPaths(var jsval);
         *  @lua NA
         */
        export function setSearchPaths(searchPath: Array<string>): void;
        /**
         *  write a string into a file
         *
         * @param dataStr the string want to save
         * @param fullPath The full path to the file you want to save a string
         * @return bool True if write success
         */
        export function writeStringToFile(dataStr: string, fullPath: string): boolean;
        /**
         *  Sets the array that contains the search order of the resources.
         *
         *  @param searchResolutionsOrder The source array that contains the search order of the resources.
         *  @see getSearchResolutionsOrder(), fullPathForFilename(const char*).
         *  @since v2.1
         *  In js:var setSearchResolutionsOrder(var jsval)
         *  @lua NA
         */
        export function setSearchResolutionsOrder(searchResolutionsOrder: Array<string>): void;
        /**
         * Append search order of the resources.
         *
         * @see setSearchResolutionsOrder(), fullPathForFilename().
         * @since v2.1
         */
        export function addSearchResolutionsOrder(order: string, front: boolean): void;
        /**
         * Add search path.
         *
         * @since v2.1
         */
        export function addSearchPath(path: string, front: boolean): void;
        /**
        * write ValueVector into a plist file
        *
        *@param vecData the ValueVector want to save
        *@param fullPath The full path to the file you want to save a string
        *@return bool
        */
        export function writeValueVectorToFile(vecData: Array<any>, fullPath: string): boolean;
        /**
         *  Checks whether a file exists.
         *
         *  @note If a relative path was passed in, it will be inserted a default root path at the beginning.
         *  @param filename The path of the file, it could be a relative or absolute path.
         *  @return True if the file exists, false if not.
         */
        export function isFileExist(filename: string): boolean;
        /**
         *  Purges full path caches.
         */
        export function purgeCachedEntries(): void;
        /**
         *  Gets full path from a file name and the path of the relative file.
         *  @param filename The file name.
         *  @param relativeFile The path of the relative file.
         *  @return The full path.
         *          e.g. filename: hello.png, pszRelativeFile: /User/path1/path2/hello.plist
         *               Return: /User/path1/path2/hello.pvr (If there a a key(hello.png)-value(hello.pvr) in FilenameLookup dictionary. )
         *
         */
        export function fullPathFromRelativeFile(filename: string, relativeFile: string): string;
        /**
        * Windows fopen can't support UTF-8 filename
        * Need convert all parameters fopen and other 3rd-party libs
        *
        * @param filenameUtf8 std::string name file for conversion from utf-8
        * @return std::string ansi filename in current locale
        */
        export function getSuitableFOpen(filenameUtf8: string): string;
        /**
        * write ValueMap into a plist file
        *
        *@param dict the ValueMap want to save
        *@param fullPath The full path to the file you want to save a string
        *@return bool
        */
        export function writeValueMapToFile(dict: any, fullPath: string): string;
        /**
        *  Gets filename extension is a suffix (separated from the base filename by a dot) in lower case.
        *  Examples of filename extensions are .png, .jpeg, .exe, .dmg and .txt.
        *  @param filePath The path of the file, it could be a relative or absolute path.
        *  @return suffix for filename in lower case or empty if a dot not found.
        */
        export function getFileExtension(filePath: string): string;
        /**
         *  Sets writable path.
         */
        export function setWritablePath(writablePath: string): void;
        /**
         * Set default resource root path.
         */
        export function setDefaultResourceRootPath(filepath: string): void;

        /**
         *  Gets the array that contains the search order of the resources.
         *
         *  @see setSearchResolutionsOrder(const std::vector<std::string>&), fullPathForFilename(const char*).
         *  @since v2.1
         *  @lua NA
         */
        export function getSearchResolutionsOrder(): Array<string>;
        /**
         *  Creates a directory.
         *
         *  @param dirPath The path of the directory, it must be an absolute path.
         *  @return True if the directory have been created successfully, false if not.
         */
        export function createDirectory(dirPath: string): string;
        /**
         *  List all files recursively in a directory.
         *
         *  @param dirPath The path of the directory, it could be a relative or an absolute path.
         *  @return File paths in a string vector
         */
        export function listFilesRecursively(dirPath: string, files: Array<string>): void;
        /**
         *  Gets the writable path.
         *  @return  The path that can be write/read a file in
         */
        export function getWritablePath(): string;
    }
}
