
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

    function getSharedCanvas(): any;
    function getOpenDataContext(): any;

    function onShow(callback: Function): any;
    function onHide(callback: Function): any;
    function onAudioInterruptionEnd(callback: Function): any;
}

declare class InnerAudioContext {
	src: string;
	startTime: number;
	autoplay: boolean;
	loop: boolean;
	obeyMuteSwitch: boolean;
	volume: number;
	duration: number;
	currentTime: number;
	paused: boolean;
    buffered: number;

	destroy(): any;
	offCanplay(callback: Function): any;
	offEnded(callback: Function): any;
	offError(callback: Function): any;
	offPause(callback: Function): any;
	offPlay(callback: Function): any;
	offSeeked(callback: Function): any;
	offSeeking(callback: Function): any;
	offStop(callback: Function): any;
	offTimeUpdate(callback: Function): any;
	offWaiting(callback: Function): any;
	onCanplay(callback: Function): any;
	onEnded(callback: Function): any;
	onError(callback: Function): any;
	onPause(callback: Function): any;
	onPlay(callback: Function): any;
	onSeeked(callback: Function): any;
	onSeeking(callback: Function): any;
	onStop(callback: Function): any;
	onTimeUpdate(callback: Function): any;
	onWaiting(callback: Function): any;
	pause(): any;
	play(): any;
	seek(position:number): any;
	stop(): any;
}
