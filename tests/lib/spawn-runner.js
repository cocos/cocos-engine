// so as to run tests in page-level

if (cc.sys.platform === cc.sys.Platform.EDITOR_CORE) {
    var Ipc = require('ipc');
    var Path = require('path');
    var Url = require('url');
    var Electron = require('electron');

    var spawnWorker = function (title, scriptUrl, debug) {
        describe(title, function () {
            if (debug) {
                this.timeout(0);
            }

            var win;

            // close window afterward
            after(function ( done ) {
                win.once('closed', function () {
                    win = null;
                    done();
                });
                if (!debug) {
                    win.close();
                }
            });

            //
            it('should running on page-level', function( done ) {
                this.timeout(0);
                Ipc.on('runner:end', function () {
                    done();
                });

                win = new Electron.BrowserWindow({
                    title: title,
                    width: 400,
                    height: 400,
                    show: !!debug,
                });
                if (debug) {
                    win.openDevTools();
                }
                var query = {scriptUrl: scriptUrl};
                var url = Url.format({
                    protocol: 'file',
                    pathname: Path.resolve(__dirname, 'runner.html'),
                    slashes: true,
                    hash: encodeURIComponent(JSON.stringify(query))
                });
                win.loadUrl(url);
            });
        });
    };

    module.exports = (function (descCtx, scriptUrl, debug, testInPage, testInCore) {
        if (testInPage) {
            var title = descCtx.title;
            spawnWorker(title, scriptUrl, debug);
        }
        var shouldStopCore = testInCore;
        return shouldStopCore;
    });
}
else {
    module.exports = function () {
        return true;
    };
}
