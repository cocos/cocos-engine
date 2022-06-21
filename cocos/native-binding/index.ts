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
     * @en Downloader class for task download
     * @zh Downloader 任务下载类
     */
    export class Downloader {
        /**
         * @en create a download task. The maximum size for a single download file is 4GB.
         * @zh 创建一个下载任务. 单个下载文件最大为4GB.
         * @param requestURL @en Request download resource URL  @zh 请求下载资源的URL
         * @param storagePath @en Storage path for downloaded file @zh 下载文件存储路径
         * @param identifier  @en identifier @zh 标识符
         * @return @en DownloaderTask @zh 下载任务对象
         * @example
         * ```ts
         * // create a download task
         * let downloader = new native.Downloader();
         * let task = downloader.createDownloadFileTask('https://example.com/exampleFile.zip', native.fileUtils.getWritablePath());
         */
        createDownloadFileTask (requestURL:string, storagePath:string, identifier?:string): DownloaderTask;

        /**
         * @en set callback function after download success
         * @zh 设置任务成功下载后的回调函数
         * @param onSucceed @en Download success callback @zh 下载成功后的回调函数
         * @example
         * ```ts
         *  // set a download success callback
         *  down.setOnFileTaskSuccess((task)=>{
         *  console.log('Success!'); // call when task download success
         * });
         */
        setOnFileTaskSuccess (onSucceed: (task: DownloaderTask) => void): void;

        /**
         * @en set callback function while download.
         * @zh 设置任务下载过程中的回调函数.
         * @param onProgress @en Download progress callback @zh 下载过程中的回调函数
         * @example
         * ```ts
         *  // set a callback for download progress prompt
         *  down.setOnTaskProgress((task, bytesReceived, totalBytesReceived, totalBytesExpected)=>{
         *  console.log(bytesReceived, totalBytesReceived); // download data info
         *  console.log(totalBytesReceived / totalBytesExpected * 100).toFixed(1) + '%'); // progress prompt
         * });
         */
        setOnTaskProgress (onProgress: (task: DownloaderTask, bytesReceived: number,
            totalBytesReceived: number, totalBytesExpected: number) => void): void;
        /**
         * @en set callback function when download error
         * @zh 设置任务下载发生错误时的回调函数
         * @param onError @en Download error callback @zh 下载发生错误时的回调函数
         * @example
         * ```ts
         * // set a download error callback
         *  down.setOnTaskError((task, errorCode, errorCodeInternal, errorStr)=>{
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
}
