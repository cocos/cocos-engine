import { legacyCC } from '../../../core/global-exports';
import { NativeInnerAudioPlayer } from './basic/inner-player';

export * from './graph/native-audio-context';
export { audioBufferManager, CCAudioBufferManager } from './graph/audio-buffer-manager';
export const InnerAudioPlayer = NativeInnerAudioPlayer;
legacyCC.InnerAudioPlayer = NativeInnerAudioPlayer;
