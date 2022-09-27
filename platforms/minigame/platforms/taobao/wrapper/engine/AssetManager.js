const parser = cc.assetManager.parser;
const downloader = cc.assetManager.downloader;
const debug = cc.debug;

function downloadImage(url, options, onComplete) {
    onComplete(null, url);
}

if (my.isIDE) {
    // NOTE: image can't load from cached downloaded file on Taobao IDE
    downloader.register({
        // Image
        '.png': downloadImage,
        '.jpg': downloadImage,
        '.bmp': downloadImage,
        '.jpeg': downloadImage,
        '.gif': downloadImage,
        '.ico': downloadImage,
        '.tiff': downloadImage,
        '.image': downloadImage,
        '.webp': downloadImage,
        '.pvr': downloadImage,
        '.pkm': downloadImage,
        '.astc': downloadImage,
    });
}

function loadImage(url, options, onComplete) {
    const img = window.screencanvas.createImage();

    function loadCallback() {
        img.onload = null;
        img.onerror = null;

        if (onComplete) {
            onComplete(null, img);
        }
    }

    function errorCallback() {
        img.onload = null;
        img.onerror = null;

        if (onComplete) {
            onComplete(new Error(debug.getError(4930, url)));
        }
    }

    img.onload = loadCallback;
    img.onerror - errorCallback;
    img.src = url;
    return img;
}

downloader.downloadDomImage = loadImage;

parser.register({
    '.png': loadImage,
    '.jpg': loadImage,
    '.bmp': loadImage,
    '.jpeg': loadImage,
    '.gif': loadImage,
    '.ico': loadImage,
    '.tiff': loadImage,
    '.image': loadImage,
    '.webp': loadImage,
});
