var Ipc = require('ipc');

describe('test cocos', function () {
    var win;

    // close window afterward
    after(function ( done ) {
        win.close();
        win.nativeWin.on('closed', function () {
            win.dispose();
            done();
        });
    });

    //
    it('running on page-level', function( done ) {
        this.timeout(0);
        Ipc.on('runner:end', function () {
            done();
        });

        win = new Editor.Window('main', {
            title: 'Test Cocos',
            width: 800,
            height: 800,
            show: true,
            resizable: false,
        });
        win.load('unpack://engine/test/page.html');
    });
});
