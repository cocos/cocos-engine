let _subpackages;
let _remoteBundles;
let _server;

let _init = cc.assetManager.init;
cc.assetManager.init = function (options) {
    _subpackages = options.subpackages;
    _remoteBundles = options.remoteBundles;
    _server = options.server + "/remote/";
    _init.apply(this, arguments);
};

let _downloader = cc.assetManager.downloader;
_downloader.register("bundle", function (bundleName, options, onComplete) {
    let length = _subpackages.length;
    for (let index = 0; index < length; ++index) {
        if (bundleName === _subpackages[index]) {
            let task = jsb.loadSubpackage({
                name: bundleName,
                success() {
                    options.responseType = "json";
                    let bundleVersion = options.version || _downloader.bundleVers[bundleName];
                    let bundleConfig = `${bundleName}/config.${bundleVersion ? bundleVersion + '.' : ''}json`;
                    cc.assetManager.downloader.downloadFile(bundleConfig, options, options.onFileProgress, function (err, data) {
                        if (!err && typeof data === 'string') {
                            try {
                                data = JSON.parse(data);
                            } catch (e) {
                                err = e;
                            }
                        }
                        data && (data.base = `${bundleName}/`);
                        onComplete && onComplete(err, data);
                    });
                },
                fail(res) {
                    console.warn(`Load Subpackage failed: path: ${bundleName} message: ${res.errMsg}`);
                    onComplete && onComplete(new Error(`Failed to load subpackage ${bundleName}: ${res.errMsg}`));
                }
            });
            if (typeof options.onFileProgress === "function") {
                task.onProgressUpdate(options.onFileProgress);
            }
            return;
        }
    }

    let bundlePath = 'assets/' + bundleName;
    let bundleVersion = options.version || _downloader.bundleVers[bundleName];
    let bundleConfig = `${bundlePath}/config.${bundleVersion ? bundleVersion + '.' : ''}json`;
    let bundleJS = `${bundlePath}/index.${bundleVersion ? bundleVersion + '.' : ''}js`;

    let count = 0;
    let out = null;
    let error = null;

    // 远程包： 资源在远程，脚本在本地
    length = _remoteBundles.length;
    for (let index = 0; index < length; ++index) {
        if (bundleName === _remoteBundles[index]) {
            bundlePath = _server + bundleName;
            bundleConfig = `${bundlePath}/config.${bundleVersion ? bundleVersion + '.' : ''}json`;
            break;
        }
    }

    _downloader.downloadFile(bundleConfig, options, options.onFileProgress, function (err, response) {
        if (err) {
            error = err;
        }
        if (typeof response === 'string') {
            try {
                response = JSON.parse(response);
                out = response;
                out && (out.base = bundlePath + '/');
            } catch (e) {
                error = e;
            }
        }
        count++;
        if (count === 2) {
            onComplete(error, out);
        }
    });

    _downloader.downloadScript(bundleJS, options, function (err) {
        if (err) {
            error = err;
        }
        count++;
        if (count === 2) {
            onComplete(error, out);
        }
    });
});