import { sys } from '../core/platform/sys';
const __audioSupport = sys.__audioSupport;

export function createDomAudio (url): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
        const dom = document.createElement('audio');
        dom.src = url;
    
        const clearEvent = () => {
            clearTimeout(timer);
            dom.removeEventListener('canplaythrough', success, false);
            dom.removeEventListener('error', failure, false);
            if (__audioSupport.USE_LOADER_EVENT) {
                dom.removeEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
            }
        };
        const timer = setTimeout(() => {
            if (dom.readyState === 0) {
                failure();
            } else {
                success();
            }
        }, 8000);
        const success = () => {
            clearEvent();
            resolve(dom);
        };
        const failure = () => {
            clearEvent();
            const message = 'load audio failure - ' + url;
            reject(message);
        };
        dom.addEventListener('canplaythrough', success, false);
        dom.addEventListener('error', failure, false);
        if (__audioSupport.USE_LOADER_EVENT) {
            dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
        }
    });
}