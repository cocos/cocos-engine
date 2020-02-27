if (typeof ImageBitmap === 'undefined') {
    class ImageBitmap {

        public height: Number = 0;

        public width: Number = 0;

        constructor () {
            throw new Error('not implement')
        }

        public close () {
            throw new Error('not implement')
        }
    }

    let _global = typeof window === 'undefined' ? global : window;
    Object.defineProperty(_global, 'ImageBitmap', { value: ImageBitmap });
}