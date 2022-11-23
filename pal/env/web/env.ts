export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement } {
    const frame = document.querySelector('#GameDiv') as HTMLDivElement;
    const container = document.querySelector('#Cocos3dGameContainer') as HTMLDivElement;
    const canvas = document.querySelector('#GameCanvas') as HTMLCanvasElement;

    return { frame, container, canvas };
}

export function loadJsFile (path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        let err;
        function windowErrorListener (evt) {
            if (evt.filename === path) {
                err = evt.error;
            }
        }
        window.addEventListener('error', windowErrorListener);
        const script = document.createElement('script');
        script.charset = 'utf-8';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.addEventListener('error', () => {
            window.removeEventListener('error', windowErrorListener);
            reject(Error(`Error loading ${path}`));
        });
        script.addEventListener('load', () => {
            window.removeEventListener('error', windowErrorListener);
            document.head.removeChild(script);
            // Note that if an error occurs that isn't caught by this if statement,
            // that getRegister will return null and a "did not instantiate" error will be thrown.
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        script.src = path.replace('#', '%23');
        document.head.appendChild(script);
    });
}
