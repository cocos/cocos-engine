import downloader from '../../cocos/core/asset-manager/downloader';
import * as fs from 'fs';
import { PNG } from 'pngjs';

function downloadArrayBuffer (url, option, cb) {
    fs.readFile(url, null, (err, data) => {
        if (err) {
            cb(err);
        } else {
            cb(null, data.buffer);
        }
    });
}

function downloadText (url, options, cb) {
    fs.readFile(url, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
}

function downloadJson (url, options, cb) {
    fs.readFile(url, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            cb(err);
        } else {
            cb(null, JSON.parse(data));
        }
    });
}

function downloadImage (url: string, options: any, cb) {
    const index = url.indexOf('?');
    if (index !== -1) {
        url = url.substring(0, index);
    }
    fs.readFile(url, null, (err, data) => {
        if (err) {
            cb(err);
        } else {
            var image = new Image();
            var png = new PNG();
            png.on('metadata', (meta) => {
                image.width = meta.width;
                image.height = meta.height;
                cb(err, image);
            });
            png.parse(data);
        }
    });
}

function getFontFamily (fontHandle: string): string {
    const ttfIndex = fontHandle.lastIndexOf('.ttf');
    if (ttfIndex === -1) { return fontHandle; }

    const slashPos = fontHandle.lastIndexOf('/');
    let fontFamilyName: string;
    if (slashPos === -1) {
        fontFamilyName = `${fontHandle.substring(0, ttfIndex)}_LABEL`;
    } else {
        fontFamilyName = `${fontHandle.substring(slashPos + 1, ttfIndex)}_LABEL`;
    }
    if (fontFamilyName.indexOf(' ') !== -1) {
        fontFamilyName = `"${fontFamilyName}"`;
    }
    return fontFamilyName;
}

function loadFont (url, options, cb) {
    const fontFamilyName = getFontFamily(url);
    cb(null, fontFamilyName);
}

downloader.register({
    // Images
    '.png': downloadImage,
    '.jpg': downloadImage,
    '.bmp': downloadImage,
    '.jpeg': downloadImage,
    '.gif': downloadImage,
    '.ico': downloadImage,
    '.tiff': downloadImage,
    '.webp': downloadImage,
    '.image': downloadImage,
    '.pvr': downloadArrayBuffer,
    '.pkm': downloadArrayBuffer,
    '.astc': downloadArrayBuffer,

    // Txt
    '.txt': downloadText,
    '.xml': downloadText,
    '.vsh': downloadText,
    '.fsh': downloadText,
    '.atlas': downloadText,

    '.tmx': downloadText,
    '.tsx': downloadText,

    '.json': downloadJson,
    '.ExportJson': downloadJson,
    '.plist': downloadText,

    '.fnt': downloadText,

    // Binary
    '.binary': downloadArrayBuffer,
    '.bin': downloadArrayBuffer,
    '.dbbin': downloadArrayBuffer,
    '.skel': downloadArrayBuffer,

    '.font': loadFont,
    '.eot': loadFont,
    '.ttf': loadFont,
    '.woff': loadFont,
    '.svg': loadFont,
    '.ttc': loadFont,

    default: downloadText,
});