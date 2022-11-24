import { legacyCC } from '../../core/global-exports';
import { NativeInnerAudioPlayer } from '../native/basic/inner-player';

export const InnerAudioPlayer = NativeInnerAudioPlayer;
legacyCC.InnerAudioPlayer = NativeInnerAudioPlayer;
