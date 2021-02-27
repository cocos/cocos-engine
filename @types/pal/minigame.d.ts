declare module 'pal_minigame' {
	export let mg: IMiniGame;
	export interface IMiniGame {
		// system
		isSubContext: boolean;
		isDevTool: boolean;
		isLandscape: boolean;
		getSystemInfoSync(): SystemInfo;
		onShow(callback: Function): void;
		offShow(callback: Function): void;
		onHide(callback: Function): void;
		offHide(callback: Function): void;
		getSafeArea(): SafeArea;
	
		// render
		getSharedCanvas(): any;
		getOpenDataContext(): any;
	
		// file system
		getFileSystemManager(): FileSystemManager;
	
		// input
		onTouchStart: IEventManager<TouchEvent>;
		onTouchMove: IEventManager<TouchEvent>;
		onTouchEnd: IEventManager<TouchEvent>;
		onTouchCancel: IEventManager<TouchEvent>;
		
		// audio
		createInnerAudioContext(): InnerAudioContext;
		onAudioInterruptionBegin(callback: Function): any;
		offAudioInterruptionBegin(callback: Function): any;
		onAudioInterruptionEnd(callback: Function): any;
		offAudioInterruptionEnd(callback: Function): any;

		// font
		loadFont(url: string): string;

		// device
		onAccelerometerChange(cb: AccelerometerChangeCallback);
		offAccelerometerChange(cb?: AccelerometerChangeCallback);
		startAccelerometer(obj: AccelerometerParameter);
		stopAccelerometer(obj: AccelerometerParameter);
	}
}

type AccelerometerChangeCallback = (res: AccelerometerData) => void;
declare interface AccelerometerData {
	x: number,
	y: number,
	z: number,
}
declare interface AccelerometerParameter {
	success?: Function,
	fail?: Function,
	complete?: Function,
}

declare interface IEventManager<Event> {
    (listener: (event: Event) => void): void;
}

declare class FileSystemManager {
	access(obj: Object);
	accessSync(path: string): boolean;
	appendFile(obj: Object);
	appendFileSync(filePath: string, data: string|ArrayBuffer, encoding: string);
	copyFile(obj: Object);
	copyFileSync(srcPath: string, destPath: string);
	getFileInfo(obj: Object);
	getSavedFileList(obj: Object);
	mkdir(obj: Object);
	mkdirSync();
	readdir(obj: Object);
	readdirSync();
	readFile(obj: Object);
	readFileSync();
	removeSavedFile(obj: Object);
	rename(obj: Object);
	renameSync();
	rmdir(obj: Object);
	rmdirSync();
	saveFile(obj: Object);
	saveFileSync();
	stat(obj: Object);
	statSync();
	unlink(obj: Object);
	unlinkSync();
	unzip(obj: Object);
	writeFile(obj: Object);
	writeFileSync();
}

declare interface SystemInfo {
	brand: string;
	model: string;
	pixelRatio: number;
	screenWidth: number;
	screenHeight: number;
	windowWidth: number;
	windowHeight: number;
	statusBarHeight: number;
	language: string;
	version: string;
	system: string;
	platform: string;
	fontSizeSetting: number;
	SDKVersion: string;
	benchmarkLevel: number;
	albumAuthorized: boolean;
	cameraAuthorized: boolean;
	locationAuthorized: boolean;
	microphoneAuthorized: boolean;
	notificationAuthorized: boolean;
	notificationAlertAuthorized: boolean;
	notificationBadgeAuthorized: boolean;
	notificationSoundAuthorized: boolean;
	bluetoothEnabled: boolean;
	locationEnabled: boolean;
	wifiEnabled: boolean;
	safeArea: SafeArea;
	locationReducedAccuracy: boolean;
	theme: string;
}

declare interface SafeArea {
	left: number;
	right: number;
	top: number;
	bottom: number;
	width: number;
	height: number;
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
