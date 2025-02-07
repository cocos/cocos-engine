import { ContextType } from '../../../ets/common/Constants';
import resourceManager from '@ohos.resourceManager';

export interface context {
  onPageShow: () => void;
  onPageHide: () => void;
  workerInit: () => void;
  postMessage: (msgType: string, msgData: string) => void;
  postSyncMessage: (msgType: string, msgData: string) => Promise<boolean | string | number>;
  setPostMessageFunction: (postMessage: (msgType: string, msgData: string) => void) => void;
  setPostSyncMessageFunction: (postSyncMessage: (msgType: string, msgData: string) => void) => void;
  nativeEngineInit: () => void;
  nativeEngineStart: () => void;
  onTextChange: (param: string) => void;
  onComplete: (param: string) => void;
  onConfirm: (param: string) => void;
  shouldStartLoading: (viewTag: number, url: string) => void;
  finishLoading: (viewTag: number, url: string) => void;
  failLoading: (viewTag: number, url: string) => void;
  onBackPress: () => void;
  onCreate: () => void;
  onDestroy: () => void;
  onShow: () => void;
  onHide: () => void;
  resourceManagerInit: (resourceManager: resourceManager.ResourceManager) => void;
  writablePathInit: (cacheDir: string) => void;
  onVideoEvent: (param: string) => void;
  registerFunction: (name:string ,fun:Function) => void;
}

export const getContext: (type: ContextType) => context;
export const evalString: (value: string) => any;
