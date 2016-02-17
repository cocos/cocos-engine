largeModule('Loader');

var downloader = new cc.Pipeline.Downloader();
var loader = new cc.Pipeline.Loader();

var loader = new cc.Pipeline([
    downloader,
    loader
]);

loader.load = function (resources, progressCallback, completeCallback) {
    if (completeCallback === undefined) {
        completeCallback = progressCallback;
        progressCallback = null;
    }

    this.onProgress = progressCallback;
    this.onComplete = completeCallback;

    this.flowIn(resources);
};

asyncTest('Load', function () {
    var image1 = assetDir + '/button.png';
    var json1 = assetDir + '/library/12/123200.json';
    var json2 = assetDir + '/library/deferred-loading/74/748321.json';
    var resources = [
        image1,
        json1,
        json2,
    ];

    loader.load(resources, function (completedCount, totalCount, item) {
        console.log((100 * completedCount / totalCount).toFixed(2) + '%');
        if (item.src === image1) {
            ok(item.content instanceof cc.Texture2D, 'image url\'s result should be Texture2D');
        }
        else if (item.src === json1) {
            console.log(JSON.stringify(item.content));
        }
        else if (item.src === json2) {
            console.log(JSON.stringify(item.content));
        }
        else {
            ok(false, 'should not load an unknown url');
        }
    }, function (items) {
        ok(items.isCompleted(), 'Able to load all resources');
        clearTimeout(timeoutId);
        start();
    });

    var timeoutId = setTimeout(function () {
        ok(false, 'time out!');
        start();
    }, 30);
});