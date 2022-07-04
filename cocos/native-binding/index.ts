/* eslint-disable @typescript-eslint/no-namespace */
// @ts-expect-error this is a virtual module
export * from 'internal:native';

/**
 * @zh 该对象提供由原生绑定出来的 JavaScript 接口。
 * 注意：全局作用域下的 `jsb` 对象已经废弃，我们更推荐使用由 `cc` 模块下导出的 `native` 对象。
 * 该对象是前者的子集，我们开放了一些开发者真正需要的原生接口，例如文件，反射等接口。
 * 使用之前需要先通过 `NATIVE` 宏判断该接口在平台上是否支持。
 *
 * @en This object provides the JavaScript interface bound from the native.
 * Note: `jsb` object in global scope is deprecated, we recommend using the exported `native` object from `cc` module.
 * This object is a subset of the former, we open some interfaces that the developer really needs, such as file, reflection, etc.
 * Before using, you need to check whether the interface is supported on the platform with the `NATIVE` constant.
 *
 * @example
 * ```ts
 * import { native } from 'cc';
 * import { NATIVE } from 'cc/env';
 *
 * if (NATIVE) {
 *    native.reflection.callStaticMethod( ...args );
 * }
 * ```
 */
export declare namespace native {
    /**
     * @en DownloaderTask @zh 下载任务对象
     * @param requestURL @en Request download resource URL  @zh 请求下载资源的URL
     * @param storagePath @en Storage path for downloaded file @zh 下载文件存储路径
     * @param identifier  @en identifier @zh 标识符
     */
    export type DownloaderTask = { requestURL: string, storagePath: string, identifier: string };

    /**
     * @en DownloaderHints @zh 下载任务的配置接口
     * @param countOfMaxProcessingTasks
     * @en Maximum number of download tasks processed at the same time, optional, default is 6
     * @zh 同时处理的最大下载任务数量, 可选, 默认值为6
     * @param timeoutInSeconds @en Download request timeout, optional, default is 45 seconds @zh 下载请求的超时时间, 可选, 默认值为45秒
     * @param tempFileNameSuffix  @en Temporary file suffix generated during download, optional, default is .tmp @zh 下载时产生的临时文件后缀, 可选, 默认值为.tmp
     */
    export interface DownloaderHints {
        countOfMaxProcessingTasks?: number;
        timeoutInSeconds?: number;
        tempFileNameSuffix?: string;
    }

    /**
     * @en Downloader class for task download
     * @zh Downloader 任务下载类
     */
    export class Downloader {
        /**
         * @en Downloader default constructor, constructed by the default value of DownloaderHints.
         * @zh Downloader的默认构造函数, 通过DownloaderHints的默认值构造.
         * @example
         * ```ts
         * let downloader = new native.Downloader(); // create a Downloader object by default constructor
         */
        constructor();

        /**
         * @en Downloader constructor with parameter, constructed by DownloaderHints.
         * @zh Downloader的有参构造函数, 通过传递的DownloaderHints去构造.
         * @example
         * ```ts
         * const hints: native.DownloaderHints = { // create a DownloaderHints interface
         *     countOfMaxProcessingTasks: 6,
         *     timeoutInSeconds: 100,
         *     tempFileNameSuffix: ".tmp"
         * };
         * let downloader = new native.Downloader(hints); // create a Downloader object with DownloaderHints
         */
        constructor (hints: DownloaderHints);

        /**
         * @en create a download task. The maximum size for a single download file is 4GB.
         * @zh 创建一个下载任务. 单个下载文件最大为4GB.
         * @param requestURL @en Request download resource URL  @zh 请求下载资源的URL
         * @param storagePath @en Storage path for downloaded file @zh 下载文件存储路径
         * @param identifier  @en identifier @zh 标识符
         * @return @en DownloaderTask @zh 下载任务对象
         * @example
         * ```ts
         * let task = downloader.createDownloadTask('https://example.com/exampleFile.zip', native.fileUtils.getWritablePath());
         */
        createDownloadTask (requestURL:string, storagePath:string, identifier?:string): DownloaderTask;

        /**
         * @en setter for the callback function after download success
         * @zh 任务成功下载后的回调函数的修改器
         * @param task @en download task @zh 下载的任务
         * @example
         * ```ts
         *  // set a download success callback
         *  downloader.onSuccess = (task) => {
         *      console.log('Success!'); // call when task download success
         * };
         */
        onSuccess: (task: DownloaderTask) => void | undefined;

        /**
         * @en setter for the callback function while download.
         * @zh 任务下载过程中的回调函数的修改器.
         * @param task @en download task @zh 下载任务
         * @param bytesReceived @en received bytes in current call @zh 此次接收到的字节
         * @param totalBytesReceived @en total bytes have been received @zh 已接收到的所有字节
         * @param totalBytesExpected @en total bytes expected to receive  @zh 预计接收的所有字节
         * @example
         * ```ts
         *  // setter for the callback for download progress prompt
         *  downloader.onProgress = (task, bytesReceived, totalBytesReceived, totalBytesExpected) => {
         *      console.log(bytesReceived, totalBytesReceived); // download data info
         *      console.log(totalBytesReceived / totalBytesExpected * 100).toFixed(1) + '%'); // progress prompt
         * };
         */
        onProgress: (task: DownloaderTask, bytesReceived: number, totalBytesReceived: number, totalBytesExpected: number) => void | undefined;

        /**
         * @en setter for the callback function when download error
         * @zh 任务下载发生错误时的回调函数的修改器
         * @param task @en download task @zh 下载任务
         * @param errorCode @en  error code  @zh 错误码
         * @param errorCodeInternal @en internal error code @zh 内部错误码
         * @param errorStr @en error info string @zh 错误信息
         * @example
         * ```ts
         * // set a download error callback
         *  downloader.onError = (task, errorCode, errorCodeInternal, errorStr) => {
         *  console.log('Error:', errorStr);
         * };
         */
        onError: (task: DownloaderTask, errorCode: number, errorCodeInternal: number, errorStr: string) => void | undefined;

        /**
         * @deprecated since v3.6.0, please use `createDownloadTask` to instead.
         * @en create a download task. The maximum size for a single download file is 4GB.
         * @zh 创建一个下载任务. 单个下载文件最大为4GB.
         * @param requestURL @en Request download resource URL  @zh 请求下载资源的URL
         * @param storagePath @en Storage path for downloaded file @zh 下载文件存储路径
         * @param identifier  @en identifier @zh 标识符
         * @return @en DownloaderTask @zh 下载任务对象
         * @example
         * ```ts
         * let task = downloader.createDownloadFileTask('https://example.com/exampleFile.zip', native.fileUtils.getWritablePath());
         */
        createDownloadFileTask (requestURL:string, storagePath:string, identifier?:string): DownloaderTask;

        /**
         * @deprecated since v3.6.0, please use setter `onSuccess` to instead.
         * @en set callback function after download success
         * @zh 设置任务成功下载后的回调函数
         * @param onSucceed @en Download success callback @zh 下载成功后的回调函数
         * @example
         * ```ts
         *  // set a download success callback
         *  downloader.setOnFileTaskSuccess((task)=>{
         *  console.log('Success!'); // call when task download success
         * });
         */
        setOnFileTaskSuccess (onSucceed: (task: DownloaderTask) => void): void;

        /**
         * @deprecated since v3.6.0, please use setter `onProgress` to instead.
         * @en set callback function while download.
         * @zh 设置任务下载过程中的回调函数.
         * @param onProgress @en Download progress callback @zh 下载过程中的回调函数
         * @example
         * ```ts
         *  // set a callback for download progress prompt
         *  downloader.setOnTaskProgress((task, bytesReceived, totalBytesReceived, totalBytesExpected)=>{
         *  console.log(bytesReceived, totalBytesReceived); // download data info
         *  console.log(totalBytesReceived / totalBytesExpected * 100).toFixed(1) + '%'); // progress prompt
         * });
         */
        setOnTaskProgress (onProgress: (task: DownloaderTask, bytesReceived: number,
            totalBytesReceived: number, totalBytesExpected: number) => void): void;
        /**
         * @deprecated since v3.6.0, please use setter `onError` to instead.
         * @en set callback function when download error
         * @zh 设置任务下载发生错误时的回调函数
         * @param onError @en Download error callback @zh 下载发生错误时的回调函数
         * @example
         * ```ts
         * // set a download error callback
         *  downloader.setOnTaskError((task, errorCode, errorCodeInternal, errorStr)=>{
         *  console.log('Error:', errorStr);
         * });
        */
        setOnTaskError (onError: (task: DownloaderTask, errorCode: number, errorCodeInternal: number, errorStr: string) => void): void;
    }

    /**
     * @en ZipUtils  Helper class to handle unzip related operations.
     * @zh ZipUtils  对解压操作的辅助类。
     */
    export namespace zipUtils{
        /**
         * @en
         * Inflates either zlib or gzip deflated memory. The inflated memory is expected to be freed by the caller.
         * It will allocate 256k for the destination buffer.
         * If it is not enough it will multiply the previous buffer size per 2, until there is enough memory.
         *
         * @zh
         * 对 zlib 或 gzip 压缩的内存进行解压缩。解压后的数据需要在调用方中进行内存释放。
         * 它会给目标内存分配 256k 大小的空间。如果不足以解压，它将会将目标空间扩大 2 倍直到足够大。
         *
         * @param input @en input data @zh 要解压的数据
         * @param outLengthHint @en It is assumed to be the needed room to allocate the inflated buffer, which is optional. @zh 预计解压后的数据长度，可选。
         *
         * @return @en The deflated buffer. @zh 解压后的数据缓存区
         */
        export function inflateMemory(input:string | ArrayBuffer | TypedArray, outLengthHint?: number): ArrayBuffer | null;

        /**
         * @en Inflates a GZip file into memory.
         * @zh 将 GZip 压缩文件解压缩到内存中。
         *
         * @param path @en The GZip file path. @zh GZip 文件的路径
         *
         * @return @en The deflated buffer. @zh 解压后的数据缓存区
         */
        export function inflateGZipFile(path:string): ArrayBuffer | null;

        /**
         * @en Test a file is a GZip format file or not.
         * @zh 判断一个文件是否是 GZip 格式。
         *
         * @param path @en The file path. @zh 文件的路径
         *
         * @return @en True is a GZip format file. false is not. @zh true GZip 格式文件，否则不是。
         */
        export function isGZipFile(path:string): boolean;

        /**
         * @en Test the buffer is GZip format or not.
         * @zh 判断一个缓存区的数据是否是 GZip 格式。
         *
         * @param buffer @en The buffer. @zh 数据缓存区
         *
         * @return @en True is GZip format. false is not. @zh 返回true表示是 GZip 格式，否则不是。
         */
        export function isGZipBuffer(buffer:string | ArrayBuffer | TypedArray): boolean;

        /**
         * @en Inflates a CCZ file into memory.
         * @zh 将 CCZ 格式压缩文件解压缩到内存中。
         *
         * @param path @en The CCZ file path. @zh CCZ 文件的路径
         * @return @en The deflated buffer. @zh 解压后的数据缓存区
         */
        export function inflateCCZFile(path:string): ArrayBuffer | null;

        /**
         * @en Inflates a buffer with CCZ format into memory.
         * @zh 将 CCZ 格式的内存块解压到内存中。
         *
         * @param buffer @en The buffer. @zh 数据缓存区
         *
         * @return @en The deflated buffer. @zh 解压后的数据缓存区
         */
        export function inflateCCZBuffer(buffer:string | ArrayBuffer | TypedArray): ArrayBuffer | null;

        /**
         * @en Test a file is a CCZ format file or not.
         * @zh 判断一个文件是否是 CCZ 格式。
         *
         * @return @en True is a CCZ format file. false is not. @zh 返回true表示是 CCZ 格式，否则不是。
         */
        export function isCCZFile(path:string): boolean;

        /**
         * @en Test the buffer is CCZ format or not.
         * @zh 判断一个缓存区的数据是否是 CCZ 格式。
         *
         * @ param @en The buffer. @zh 数据缓存区
         *
         * @return @en True is CCZ format. false is not. @zh 返回true表示是 CCZ 格式，否则不是。
         */
        export function isCCZBuffer(buffer:string | ArrayBuffer | TypedArray): boolean;

        /**
         * @en
         * Sets the pvr.ccz encryption key parts separately for added security.
         *
         * Example: If the key used to encrypt the pvr.ccz file is
         * 0xaaaaaaaabbbbbbbbccccccccdddddddd you will call this function 4
         * different times, preferably from 4 different source files, as follows
         *
         * setPvrEncryptionKeyPart(0, 0xaaaaaaaa);
         * setPvrEncryptionKeyPart(1, 0xbbbbbbbb);
         * setPvrEncryptionKeyPart(2, 0xcccccccc);
         * setPvrEncryptionKeyPart(3, 0xdddddddd);
         *
         * Splitting the key into 4 parts and calling the function from 4 different source
         * files increases the difficulty to reverse engineer the encryption key.
         * Be aware that encryption is *never* 100% secure and the key code
         * can be cracked by knowledgeable persons.
         *
         * IMPORTANT: Be sure to call setPvrEncryptionKey or
         * setPvrEncryptionKeyPart with all of the key parts *before* loading
         * the sprite sheet or decryption will fail and the sprite sheet
         * will fail to load.
         *
         * @zh
         * 设置 pvr.ccz 加密密钥的部分，以增加安全性。
         *
         * 例如：如果使用来加密 pvr.ccz 文件的密钥为 0xaaaaaaaabbbbbbbbccccccccdddddddd，
         * 则你可以调用此函数 4 次，至少来自 4 个不同的源文件，如下所示：
         *
         * setPvrEncryptionKeyPart(0, 0xaaaaaaaa);
         * setPvrEncryptionKeyPart(1, 0xbbbbbbbb);
         * setPvrEncryptionKeyPart(2, 0xcccccccc);
         * setPvrEncryptionKeyPart(3, 0xdddddddd);
         *
         * 将密钥分成 4 个部分并调用此函数来自 4 个不同的源文件增加解密密钥的难度。
         * 请注意，加密是从不完全安全的，密钥码可以被知道的人破解。
         *
         * 注意：调用 setPvrEncryptionKey 或 setPvrEncryptionKeyPart 函数之前，
         * 请确保已经调用了 setPvrEncryptionKeyPart 函数，否则解密将失败，并且加载精灵图集将失败。
         *
         * @param index @en Part of the key [0..3]. @zh 密钥[0..3]的部分。
         * @param value @en Value of the key part. @zh 密钥部分的值。
         */
        export function setPvrEncryptionKeyPart(index:number, value:number): void;

        /**
         * @en
         * Sets the pvr.ccz encryption key.
         * Example: If the key used to encrypt the pvr.ccz file is
         * 0xaaaaaaaabbbbbbbbccccccccdddddddd you will call this function with
         * the key split into 4 parts as follows
         *
         * setPvrEncryptionKey(0xaaaaaaaa, 0xbbbbbbbb, 0xcccccccc, 0xdddddddd);
         *
         * Note that using this function makes it easier to reverse engineer and discover
         * the complete key because the key parts are present in one function call.
         *
         * IMPORTANT: Be sure to call setPvrEncryptionKey or setPvrEncryptionKeyPart
         * with all of the key parts *before* loading the sprite sheet or decryption
         * will fail and the sprite sheet will fail to load.
         *
         * @zh
         * 设置 pvr.ccz 加密密钥。
         * 例如：如果使用来加密 pvr.ccz 文件的密钥为 0xaaaaaaaabbbbbbbbccccccccdddddddd，
         * 则你可以调用此函数，将密钥分成 4 个部分如下：
         *
         * setPvrEncryptionKey(0xaaaaaaaa, 0xbbbbbbbb, 0xcccccccc, 0xdddddddd);
         *
         * 注意：确保在加载精灵图集之前通过所有的密钥部分调用 setPvrEncryptionKey 或 setPvrEncryptionKeyPart，否则解密将失败，并且加载精灵图集将失败。
         *
         * @param keyPart1 @en The key value part 1. @zh 密钥部分 1 的值。
         * @param keyPart2 @en The key value part 2. @zh 密钥部分 2 的值。
         * @param keyPart3 @en The key value part 3. @zh 密钥部分 3 的值。
         * @param keyPart4 @en The key value part 4. @zh 密钥部分 4 的值。
         */
        export function setPvrEncryptionKey(keyPart1:number, keyPart2:number, keyPart3:number, keyPart4:number): void;
    }

    /**
     * FileUtils  Helper class to handle file operations.
     */
    export namespace fileUtils{
    /**
     *  Checks whether the path is an absolute path.
     *
     *  @note On Android, if the parameter passed in is relative to "@assets/", this method will treat it as an absolute path.
     *        Also on Blackberry, path starts with "app/native/Resources/" is treated as an absolute path.
     *
     *  @param path The path that needs to be checked.
     *  @return True if it's an absolute path, false if not.
     */
    export function isAbsolutePath (path:string):boolean;
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
    export function fullPathForFilename (filename:string):string;
    /**
     *  Gets string from a file.
    */
    export function getStringFromFile (filename:string):string;
    /**
     *  Removes a file.
     *
     *  @param filepath The full path of the file, it must be an absolute path.
     *  @return True if the file have been removed successfully, false if not.
     */
    export function removeFile (filepath:string):boolean;
    /**
     *  Checks whether the path is a directory.
     *
     *  @param dirPath The path of the directory, it could be a relative or an absolute path.
     *  @return True if the directory exists, false if not.
     */
    export function isDirectoryExist (dirPath:string):boolean;
    /**
     * Normalize: remove . and ..
     * @param filepath
     */
    export function normalizePath (filepath:string):string;
    /**
     * Get default resource root path.
     */
    export function getDefaultResourceRootPath ():string;

    // Converts the contents of a file to a ValueVector.
    // This method is used internally.
    export function getValueVectorFromFile (filepath:string):Array<any>;
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
    export function getSearchPaths ():Array<string>;
    /**
     *
     * @param filepath
     */
    export function getFileDir (filepath:string):string;
    /**
    * write a ValueMap into a plist file
    *
    *@param dict the ValueMap want to save (key,value)
    *@param fullPath The full path to the file you want to save a string
    *@return bool
    */
    export function writeToFile (valueMap:any):boolean;
    /**
     *  Gets the original search path array set by 'setSearchPaths' or 'addSearchPath'.
     *  @return The array of the original search paths
     */
    export function getOriginalSearchPaths ():Array<string>;
    /**
     *  List all files in a directory.
     *
     *  @param dirPath The path of the directory, it could be a relative or an absolute path.
     *  @return File paths in a string vector
     */
    export function listFiles (filepath:string):Array<string>;
    /**
     *  Converts the contents of a file to a ValueMap.
     *  @param filename The filename of the file to gets content.
     *  @return ValueMap of the file contents.
     *  @note This method is used internally.
     */
    export function getValueMapFromFile (filepath:string):any;
    /**
     *  Retrieve the file size.
     *
     *  @note If a relative path was passed in, it will be inserted a default root path at the beginning.
     *  @param filepath The path of the file, it could be a relative or absolute path.
     *  @return The file size.
     */
    export function getFileSize (filepath:string):number;

    /** Converts the contents of a file to a ValueMap.
     *  This method is used internally.
     */
    export function getValueMapFromData (filedata:string, filesize:number):any;
    /**
     *  Removes a directory.
     *
     *  @param dirPath  The full path of the directory, it must be an absolute path.
     *  @return True if the directory have been removed successfully, false if not.
     */
    export function removeDirectory (dirPath:string):boolean;
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
    export function setSearchPaths (searchPath:Array<string>):void;
    /**
     *  write a string into a file
     *
     * @param dataStr the string want to save
     * @param fullPath The full path to the file you want to save a string
     * @return bool True if write success
     */
    export function writeStringToFile (dataStr:string, fullPath:string):boolean;

    /**
     * Add search path.
     *
     * @since v2.1
     */
    export function addSearchPath (path:string, front:boolean):void;
    /**
    * write ValueVector into a plist file
    *
    *@param vecData the ValueVector want to save
    *@param fullPath The full path to the file you want to save a string
    *@return bool
    */
    export function writeValueVectorToFile (vecData:Array<any>, fullPath:string):boolean;
    /**
     *  Checks whether a file exists.
     *
     *  @note If a relative path was passed in, it will be inserted a default root path at the beginning.
     *  @param filename The path of the file, it could be a relative or absolute path.
     *  @return True if the file exists, false if not.
     */
    export function isFileExist (filename:string):boolean;
    /**
     *  Purges full path caches.
     */
    export function purgeCachedEntries ():void;
    /**
     *  Gets full path from a file name and the path of the relative file.
     *  @param filename The file name.
     *  @param relativeFile The path of the relative file.
     *  @return The full path.
     *          e.g. filename: hello.png, pszRelativeFile: /User/path1/path2/hello.plist
     *               Return: /User/path1/path2/hello.pvr (If there a a key(hello.png)-value(hello.pvr) in FilenameLookup dictionary. )
     *
     */
    export function fullPathFromRelativeFile (filename:string, relativeFile:string):string;
    /**
    * Windows fopen can't support UTF-8 filename
    * Need convert all parameters fopen and other 3rd-party libs
    *
    * @param filenameUtf8 std::string name file for conversion from utf-8
    * @return std::string ansi filename in current locale
    */
    export function getSuitableFOpen (filenameUtf8:string):string;
    /**
    * write ValueMap into a plist file
    *
    *@param dict the ValueMap want to save
    *@param fullPath The full path to the file you want to save a string
    *@return bool
    */
    export function writeValueMapToFile (dict:any, fullPath:string):string;
    /**
    *  Gets filename extension is a suffix (separated from the base filename by a dot) in lower case.
    *  Examples of filename extensions are .png, .jpeg, .exe, .dmg and .txt.
    *  @param filePath The path of the file, it could be a relative or absolute path.
    *  @return suffix for filename in lower case or empty if a dot not found.
    */
    export function getFileExtension (filePath:string):string;
    /**
     *  Sets writable path.
     */
    export function setWritablePath (writablePath:string):void;
    /**
     * Set default resource root path.
     */
    export function setDefaultResourceRootPath (filepath:string):void;

    /**
     *  Creates a directory.
     *
     *  @param dirPath The path of the directory, it must be an absolute path.
     *  @return True if the directory have been created successfully, false if not.
     */
    export function createDirectory (dirPath:string):string;
    /**
     *  List all files recursively in a directory.
     *
     *  @param dirPath The path of the directory, it could be a relative or an absolute path.
     *  @return File paths in a string vector
     */
    export function listFilesRecursively (dirPath:string, files:Array<string>):void;
    /**
     *  Gets the writable path.
     *  @return  The path that can be write/read a file in
     */
    export function getWritablePath():string;

    /**
     *  Renames a file under the given directory.
     *
     *  @param oldFullpath  The current fullpath of the file. Includes path and name.
     *  @param newFullPath  The new fullpath of the file. Includes path and name.
     *  @return True if the file have been renamed successfully, false if not.
     */
    export function renameFile(oldFullpath: string, newFullPath: string):boolean;

    /**
     *  Creates binary data from a file.
     *  @param fullpath The current fullpath of the file. Includes path and name.
     *  @return A data object.
     */
    export function getDataFromFile(fullpath: string):ArrayBuffer;

    /**
     * write Data into a file
     *
     *@param data the data want to save
        *@param fullpath The full path to the file you want to save a string
        *@return bool
        */
    export function writeDataToFile(buffer: ArrayBuffer, fullpath: string):boolean;
}
}
