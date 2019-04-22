
declare interface IWXEventManager<Event> {
    (listener: (event: Event) => void): void;
}

declare namespace wx {
    const onTouchStart: IWXEventManager<TouchEvent>;
    const onTouchMove: IWXEventManager<TouchEvent>;
    const onTouchEnd: IWXEventManager<TouchEvent>;
    const onTouchCancel: IWXEventManager<TouchEvent>;
    function getSystemInfoSync(): any;

    class FileSystemManager {

    }
    function getFileSystemManager(): FileSystemManager;
}
