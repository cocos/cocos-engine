const parser = cc.assetManager.parser;
const downloader = cc.assetManager.downloader;
const debug = cc.debug;

function doNothing (url, options, onComplete) {
    onComplete(null, url);
}

// TODO: Image can't load from cached downloaded file on Taobao IDE
if (my.isIDE) {
    downloader.register({
        '.png': doNothing,
        '.jpg': doNothing,
        '.bmp': doNothing,
        '.jpeg': doNothing,
        '.gif': doNothing,
        '.ico': doNothing,
        '.tiff': doNothing,
        '.image': doNothing,
        '.webp': doNothing,
    });
}

// TODO: Audio can't load from cached downloaded file onTaoBao
downloader.register({
    '.mp3': doNothing,
    '.ogg': doNothing,
    '.wav': doNothing,
    '.m4a': doNothing,
});

function loadImage (url, options, onComplete) {
    const img = window.screencanvas.createImage();

    function loadCallback () {
        img.onload = null;
        img.onerror = null;

        if (onComplete) {
            onComplete(null, img);
        }
    }

    function errorCallback () {
        img.onload = null;
        img.onerror = null;

        if (onComplete) {
            onComplete(new Error(debug.getError(4930, url)));
        }
    }

    img.onload = loadCallback;
    img.onerror = errorCallback;
    img.src = url;
    return img;
}

downloader.downloadDomImage = loadImage;

parser.register({
    // Image
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
